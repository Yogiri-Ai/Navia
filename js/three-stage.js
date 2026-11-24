// ==================================================
// THREE.JS r160 3-MODE INTERACTIVE 3D NAVIA STAGE
// Crystal-Clear Silk Sheen Card Shader, Hollow Astrolabe Halo
// (Always Behind Card), Volumetric Bloom & Salute Shockwave
// ==================================================
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { CARD_DECK, FOIL_THEMES } from "./catalog.js?v=8";
import { createBaseCardCanvas, loadPhotoIntoCardCanvas } from "./card-renderer.js?v=8";

export function initThreeStage(callbacks = {}) {
  const canvas = document.getElementById("fox");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new THREE.Scene();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 6);

  // Spec Warm Lights + Sapphire Accent + Dynamic Crystal Salute Flash Light
  const hemiLight = new THREE.HemisphereLight(0xffe2c0, 0x6b3a12, 1.15);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffc98a, 2.25);
  keyLight.position.set(-3, 4, 3);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xffa24d, 1.7);
  rimLight.position.set(3, 2, -3);
  scene.add(rimLight);

  const sapphireLight = new THREE.PointLight(0x4ea8ff, 2.0, 9);
  sapphireLight.position.set(1.6, -1.1, 2.2);
  scene.add(sapphireLight);

  const saluteFlashLight = new THREE.PointLight(0xffdf7a, 0, 12);
  saluteFlashLight.position.set(0, 0.2, 1.8);
  scene.add(saluteFlashLight);

  const gltfLoader = new GLTFLoader();
  void gltfLoader;

  // Root Pivot & Holder
  const pivot = new THREE.Group();
  scene.add(pivot);

  const holder = new THREE.Group();
  pivot.add(holder);

  // ==================================================
  // VOLUMETRIC BLOOM HALO TEXTURE GENERATOR
  // ==================================================
  function createBloomTexture(innerRgba, midRgba, outerRgba) {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext("2d");
    const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
    grad.addColorStop(0.0, innerRgba);
    grad.addColorStop(0.32, midRgba);
    grad.addColorStop(0.7, outerRgba);
    grad.addColorStop(1.0, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const goldBloomTex = createBloomTexture(
    "rgba(255, 250, 220, 1.0)",
    "rgba(255, 196, 75, 0.62)",
    "rgba(232, 116, 42, 0.16)"
  );

  const sapphireBloomTex = createBloomTexture(
    "rgba(225, 242, 255, 1.0)",
    "rgba(78, 168, 255, 0.62)",
    "rgba(37, 99, 235, 0.16)"
  );

  function createBloomSprite(isSapphire, scaleVal) {
    const mat = new THREE.SpriteMaterial({
      map: isSapphire ? sapphireBloomTex : goldBloomTex,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const sp = new THREE.Sprite(mat);
    sp.scale.setScalar(scaleVal);
    return sp;
  }

  // Shared PBR Materials
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf7c654,
    emissive: 0x5c3606,
    emissiveIntensity: 0.22,
    metalness: 0.92,
    roughness: 0.15,
    envMapIntensity: 1.35
  });

  const obsidianMat = new THREE.MeshStandardMaterial({
    color: 0x18120e,
    metalness: 0.65,
    roughness: 0.24,
    envMapIntensity: 0.85
  });

  const sapphireMat = new THREE.MeshPhysicalMaterial({
    color: 0x3b8aff,
    emissive: 0x1648b8,
    emissiveIntensity: 0.72,
    metalness: 0.15,
    roughness: 0.08,
    transmission: 0.72,
    thickness: 0.6,
    envMapIntensity: 1.5
  });

  const geoCrystalMat = new THREE.MeshPhysicalMaterial({
    color: 0xffc238,
    emissive: 0xe87418,
    emissiveIntensity: 0.7,
    metalness: 0.22,
    roughness: 0.08,
    transmission: 0.65,
    thickness: 0.5,
    envMapIntensity: 1.45
  });

  function makeRoundedRect(w, h, r) {
    const s = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }

  // ==================================================
  // VOLUMETRIC GLSL GODRAY & BLOOM CORONA BACKLIGHT
  // ==================================================
  const godrayUniforms = {
    uTime: { value: 0 },
    uBurst: { value: 0 },
    uNight: { value: 0 }
  };

  const godrayMat = new THREE.ShaderMaterial({
    uniforms: godrayUniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uBurst;
      uniform float uNight;
      varying vec2 vUv;

      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float r = length(p);
        if (r > 1.0) discard;

        float angle = atan(p.y, p.x);
        float rays1 = pow(0.5 + 0.5 * cos(angle * 12.0 - uTime * 0.4), 3.2);
        float rays2 = pow(0.5 + 0.5 * cos(angle * 6.0 + uTime * 0.25), 2.2);
        float radialFalloff = smoothstep(1.0, 0.1, r);
        float coreGlow = exp(-r * r * 4.5);

        vec3 dayCol = mix(vec3(0.95, 0.52, 0.15), vec3(1.0, 0.88, 0.48), coreGlow);
        vec3 nightCol = mix(vec3(0.18, 0.48, 0.96), vec3(0.65, 0.88, 1.0), coreGlow);
        vec3 col = mix(dayCol, nightCol, uNight);

        float alpha = (coreGlow * 0.36 + (rays1 * 0.16 + rays2 * 0.1) * radialFalloff) * (1.0 + uBurst * 1.4);
        alpha *= smoothstep(1.0, 0.62, r);

        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.88));
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const godrayBacklight = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), godrayMat);
  godrayBacklight.position.set(0, 0.04, -0.38);
  holder.add(godrayBacklight);

  // ==================================================
  // 3D CRYSTAL SALUTE SHOCKWAVE & 11-PELLET ROSULA BARRAGE
  // ==================================================
  const shockwaveGroup = new THREE.Group();
  holder.add(shockwaveGroup);

  const shockwaveUniforms = {
    uProgress: { value: 1.0 },
    uNight: { value: 0.0 }
  };

  const shockwaveShaderMat = new THREE.ShaderMaterial({
    uniforms: shockwaveUniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uProgress;
      uniform float uNight;
      varying vec2 vUv;

      void main() {
        if (uProgress >= 0.99) discard;
        vec2 p = vUv * 2.0 - 1.0;
        float r = length(p);
        if (r > 1.0) discard;

        float angle = atan(p.y, p.x);
        float ringRadius = uProgress * 0.92;
        float distToRing = abs(r - ringRadius);
        float mainRing = exp(-distToRing * distToRing * 280.0);

        float innerDist = abs(r - ringRadius * 0.68);
        float innerRing = exp(-innerDist * innerDist * 440.0) * 0.6;

        float rosePattern = 0.68 + 0.32 * cos(angle * 12.0);
        float fade = pow(1.0 - uProgress, 1.4);

        vec3 goldWave = mix(vec3(1.0, 0.72, 0.22), vec3(1.0, 0.96, 0.78), mainRing);
        vec3 blueWave = mix(vec3(0.25, 0.62, 1.0), vec3(0.82, 0.94, 1.0), mainRing);
        vec3 col = mix(goldWave, blueWave, uNight);

        float alpha = (mainRing * rosePattern + innerRing) * fade * 1.3;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });

  const shockPlaneGeo = new THREE.PlaneGeometry(4.6, 4.6);
  const shockwaveMain = new THREE.Mesh(shockPlaneGeo, shockwaveShaderMat);
  shockwaveMain.position.z = 0.08;
  shockwaveGroup.add(shockwaveMain);

  const shockwaveOrbital = new THREE.Mesh(shockPlaneGeo, shockwaveShaderMat);
  shockwaveOrbital.rotation.x = Math.PI * 0.36;
  shockwaveOrbital.rotation.y = Math.PI * 0.12;
  shockwaveGroup.add(shockwaveOrbital);

  const shardBeams = [];
  const beamGeo = new THREE.CylinderGeometry(0.004, 0.022, 0.62, 8);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xffe494,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  for (let i = 0; i < 11; i++) {
    const angle = (i / 11) * Math.PI * 2 + 0.15;
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.z = angle - Math.PI / 2;
    shockwaveGroup.add(beam);
    shardBeams.push({
      mesh: beam,
      angle,
      speed: 2.4 + (i % 3) * 0.45,
      zOffset: ((i % 3) - 1) * 0.18
    });
  }

  const sparkCount = 36;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPositions = new Float32Array(sparkCount * 3);
  const sparkVelocities = [];
  for (let i = 0; i < sparkCount; i++) {
    sparkPositions[i * 3] = 0;
    sparkPositions[i * 3 + 1] = 0;
    sparkPositions[i * 3 + 2] = 0;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI;
    const spd = 1.4 + Math.random() * 2.2;
    sparkVelocities.push({
      vx: Math.cos(theta) * Math.cos(phi) * spd,
      vy: Math.sin(theta) * Math.cos(phi) * spd,
      vz: Math.sin(phi) * spd
    });
  }
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
  const sparkMat = new THREE.PointsMaterial({
    size: 0.2,
    map: goldBloomTex,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  shockwaveGroup.add(new THREE.Points(sparkGeo, sparkMat));

  // ==================================================
  // MODE 1 GROUP: SOVEREIGN HOLOGRAPHIC CARD + HOLLOW ASTROLABE HALO
  // ==================================================
  const sovereignGroup = new THREE.Group();
  holder.add(sovereignGroup);

  const cardGroup = new THREE.Group();
  sovereignGroup.add(cardGroup);

  const cardW = 1.46;
  const cardH = 2.02;
  const outerShape = makeRoundedRect(cardW, cardH, 0.13);
  const outerGeo = new THREE.ExtrudeGeometry(outerShape, {
    depth: 0.055,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.025,
    bevelThickness: 0.025
  });
  outerGeo.center();
  cardGroup.add(new THREE.Mesh(outerGeo, goldMat));

  const innerShape = makeRoundedRect(cardW - 0.07, cardH - 0.07, 0.1);
  const innerGeo = new THREE.ExtrudeGeometry(innerShape, {
    depth: 0.092,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.01,
    bevelThickness: 0.01
  });
  innerGeo.center();
  cardGroup.add(new THREE.Mesh(innerGeo, obsidianMat));

  // Front & Back High-DPI Canvases
  const frontCanvas = createBaseCardCanvas("geo");
  const backCanvas = createBaseCardCanvas("sapphire");

  const frontTex = new THREE.CanvasTexture(frontCanvas);
  frontTex.colorSpace = THREE.SRGBColorSpace;
  frontTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const backTex = new THREE.CanvasTexture(backCanvas);
  backTex.colorSpace = THREE.SRGBColorSpace;
  backTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const holoVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Crystal-Clear Portrait Shader: Pure artwork in center, soft silk sheen on tilt, golden rim border
  const holoFragmentShader = `
    uniform sampler2D uMap;
    uniform float uTime;
    uniform vec2 uTilt;
    uniform float uNight;
    uniform float uFoilMode;
    uniform float uBurst;
    varying vec2 vUv;

    vec3 palette(float t, float mode) {
      if (mode < 0.5) {
        return 0.55 + 0.45 * cos(6.28318 * (t + vec3(0.0, 0.15, 0.45)));
      } else if (mode < 1.5) {
        return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.55, 0.65, 0.85)));
      } else if (mode < 2.5) {
        return 0.55 + 0.45 * cos(6.28318 * (t + vec3(0.9, 0.1, 0.3)));
      }
      return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
    }

    void main() {
      vec2 p = vUv * 2.0 - 1.0;
      vec2 d = abs(p) - vec2(0.88, 0.90);
      float dist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - 0.09;
      if (dist > 0.0) discard;

      vec4 texColor = texture2D(uMap, vUv);

      // Soft physical silk-finish light reflection (never obscures the portrait)
      float sweepPos = (vUv.x * 0.85 + vUv.y * 0.65) - (uTilt.x * 0.65 + uTilt.y * 0.55) - 0.75;
      float glare = exp(-sweepPos * sweepPos * 16.0) * 0.22 + uBurst * 0.2;

      // Subtle iridescent foil restricted strictly to the outer perimeter rim
      float edgeMask = smoothstep(-0.22, 0.0, dist);
      float holoPhase = vUv.x * 1.2 + vUv.y * 1.5 + uTilt.x * 1.4 - uTilt.y * 1.1 + uTime * 0.14;
      vec3 edgeFoil = palette(holoPhase, uFoilMode) * edgeMask * (0.18 + length(uTilt) * 0.25);

      float border = smoothstep(-0.024, -0.005, dist) - smoothstep(-0.005, 0.0, dist);
      vec3 goldFrame = mix(vec3(0.98, 0.79, 0.34), vec3(0.45, 0.72, 1.0), uNight);

      vec3 finalRgb = texColor.rgb + edgeFoil + vec3(1.0, 0.95, 0.84) * glare;
      finalRgb = mix(finalRgb, goldFrame * (1.0 + uBurst * 0.5), border * 0.92);

      gl_FragColor = vec4(finalRgb, 1.0);
    }
  `;

  const holoUniforms = {
    uMap: { value: frontTex },
    uTime: { value: 0 },
    uTilt: { value: new THREE.Vector2(0, 0) },
    uNight: { value: 0 },
    uFoilMode: { value: 0 },
    uBurst: { value: 0 }
  };

  const backUniforms = {
    uMap: { value: backTex },
    uTime: { value: 0 },
    uTilt: { value: new THREE.Vector2(0, 0) },
    uNight: { value: 0 },
    uFoilMode: { value: 1 },
    uBurst: { value: 0 }
  };

  const facePlaneGeo = new THREE.PlaneGeometry(cardW - 0.11, cardH - 0.11);
  const frontFaceMesh = new THREE.Mesh(
    facePlaneGeo,
    new THREE.ShaderMaterial({
      uniforms: holoUniforms,
      vertexShader: holoVertexShader,
      fragmentShader: holoFragmentShader,
      transparent: true
    })
  );
  frontFaceMesh.position.z = 0.062;
  cardGroup.add(frontFaceMesh);

  const backFaceMesh = new THREE.Mesh(
    facePlaneGeo,
    new THREE.ShaderMaterial({
      uniforms: backUniforms,
      vertexShader: holoVertexShader,
      fragmentShader: holoFragmentShader,
      transparent: true
    })
  );
  backFaceMesh.rotation.y = Math.PI;
  backFaceMesh.position.z = -0.062;
  cardGroup.add(backFaceMesh);

  // Corner Sapphire Gems with Volumetric Bloom Auras
  const cornerGemGeo = new THREE.OctahedronGeometry(0.072, 0);
  const bloomSprites = [];
  [
    [-cardW / 2 + 0.05, cardH / 2 - 0.05],
    [cardW / 2 - 0.05, cardH / 2 - 0.05],
    [-cardW / 2 + 0.05, -cardH / 2 + 0.05],
    [cardW / 2 - 0.05, -cardH / 2 + 0.05]
  ].forEach(([cx, cy]) => {
    const gem = new THREE.Mesh(cornerGemGeo, sapphireMat);
    gem.position.set(cx, cy, 0);
    gem.scale.set(0.92, 1.38, 1.32);
    const halo = createBloomSprite(true, 0.34);
    gem.add(halo);
    bloomSprites.push({ sprite: halo, baseScale: 0.34 });
    cardGroup.add(gem);
  });

  const crestGroup = new THREE.Group();
  crestGroup.position.set(0, cardH / 2 + 0.08, 0);
  crestGroup.add(new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.02, 16, 32), goldMat));
  const crestGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.078, 0), sapphireMat);
  const crestHalo = createBloomSprite(true, 0.4);
  crestGem.add(crestHalo);
  bloomSprites.push({ sprite: crestHalo, baseScale: 0.4 });
  crestGroup.add(crestGem);

  for (let i = 0; i < 8; i++) {
    const spoke = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.12, 6), goldMat);
    const angle = (i / 8) * Math.PI * 2;
    spoke.position.set(Math.cos(angle) * 0.17, Math.sin(angle) * 0.17, 0);
    spoke.rotation.z = angle - Math.PI / 2;
    crestGroup.add(spoke);
  }
  cardGroup.add(crestGroup);

  // Hollow Art Deco Astrolabe Halo behind the Card (Zero center spokes, never blocks face!)
  const parasolHalo = new THREE.Group();
  parasolHalo.position.set(0, 0.02, -0.28);
  sovereignGroup.add(parasolHalo);

  parasolHalo.add(new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.015, 16, 64), goldMat));
  parasolHalo.add(new THREE.Mesh(new THREE.TorusGeometry(1.04, 0.009, 12, 64), goldMat));

  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    // Short outer rim ticks (between r=1.04 and r=1.22 only!)
    const rimTick = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.012, 0.18, 8), goldMat);
    rimTick.position.set(Math.cos(angle) * 1.11, Math.sin(angle) * 1.11, 0);
    rimTick.rotation.z = angle - Math.PI / 2;
    parasolHalo.add(rimTick);

    const isSapph = i % 2 !== 0;
    const tipGem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.052, 0),
      isSapph ? sapphireMat : geoCrystalMat
    );
    tipGem.position.set(Math.cos(angle) * 1.25, Math.sin(angle) * 1.25, 0);
    tipGem.rotation.z = angle;
    const tipHalo = createBloomSprite(isSapph, 0.26);
    tipGem.add(tipHalo);
    bloomSprites.push({ sprite: tipHalo, baseScale: 0.26 });
    parasolHalo.add(tipGem);
  }

  // Orbiting 3D Geo & Sapphire Crystals
  const orbitGroup = new THREE.Group();
  holder.add(orbitGroup);

  const crystals = [];
  const crystalGeo = new THREE.OctahedronGeometry(0.115, 0);
  for (let i = 0; i < 8; i++) {
    const isSapphire = i % 3 === 0;
    const mesh = new THREE.Mesh(crystalGeo, isSapphire ? sapphireMat : geoCrystalMat);
    mesh.scale.set(0.75, 1.65, 0.75);

    const aura = createBloomSprite(isSapphire, 0.48);
    mesh.add(aura);
    bloomSprites.push({ sprite: aura, baseScale: 0.48 });

    if (i % 2 === 0) {
      const miniRing = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.008, 8, 24), goldMat);
      miniRing.rotation.x = Math.PI / 3;
      mesh.add(miniRing);
    }
    crystals.push({
      mesh,
      baseAngle: (i / 8) * Math.PI * 2,
      radius: 1.36 + (i % 2) * 0.22,
      baseY: (i - 3.5) * 0.28,
      speed: 0.42 + (i % 3) * 0.14,
      phase: i * 0.9
    });
    orbitGroup.add(mesh);
  }

  // ==================================================
  // MODE 2 & 3 GROUP: 12-CARD 3D CAROUSEL RING & CONSTELLATION
  // ==================================================
  const multiCardsGroup = new THREE.Group();
  multiCardsGroup.visible = false;
  holder.add(multiCardsGroup);

  const multiNodes = [];
  const pickableMeshes = [];
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  let hoveredNodeIdx = -1;
  const NODE_COUNT = 12;
  const miniW = 0.74;
  const miniH = 1.02;
  const miniPlaneGeo = new THREE.PlaneGeometry(miniW, miniH);
  const miniFrameGeo = new THREE.PlaneGeometry(miniW + 0.06, miniH + 0.06);

  const CONSTELLATION_POS = [
    new THREE.Vector3(0.0, 0.88, 0.25),
    new THREE.Vector3(0.85, 0.65, -0.15),
    new THREE.Vector3(1.45, 0.1, 0.35),
    new THREE.Vector3(1.1, -0.68, -0.2),
    new THREE.Vector3(0.38, -0.95, 0.3),
    new THREE.Vector3(-0.38, -0.95, -0.15),
    new THREE.Vector3(-1.1, -0.68, 0.25),
    new THREE.Vector3(-1.45, 0.1, -0.25),
    new THREE.Vector3(-0.85, 0.65, 0.2),
    new THREE.Vector3(0.0, 0.18, 0.55),
    new THREE.Vector3(0.55, -0.18, 0.4),
    new THREE.Vector3(-0.55, -0.18, 0.4)
  ];

  for (let i = 0; i < NODE_COUNT; i++) {
    const item = CARD_DECK[i % CARD_DECK.length];
    const nodeGroup = new THREE.Group();

    const frameBack = new THREE.Mesh(miniFrameGeo, goldMat);
    frameBack.position.z = -0.01;
    nodeGroup.add(frameBack);

    const can = createBaseCardCanvas(i % 2 === 0 ? "geo" : "sapphire");
    const tex = new THREE.CanvasTexture(can);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
    const face = new THREE.Mesh(miniPlaneGeo, mat);
    face.userData = { nodeIndex: i, cardItem: item };
    pickableMeshes.push(face);
    nodeGroup.add(face);

    const starGlow = createBloomSprite(i % 2 !== 0, 0.42);
    starGlow.position.set(0, 0, -0.03);
    nodeGroup.add(starGlow);

    loadPhotoIntoCardCanvas(
      "./Navia/" + item.file,
      can,
      { title: "NAVIA", subtitle: item.title, foilTheme: i % 2 === 0 ? "geo" : "sapphire" },
      () => { tex.needsUpdate = true; }
    );

    multiCardsGroup.add(nodeGroup);
    multiNodes.push({
      group: nodeGroup,
      index: i,
      carouselAngle: (i / NODE_COUNT) * Math.PI * 2,
      constPos: CONSTELLATION_POS[i]
    });
  }

  const linePairs = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
    [6, 7], [7, 8], [8, 0], [0, 9], [9, 10], [9, 11],
    [10, 3], [11, 6], [1, 9], [8, 9]
  ];
  const linePositions = new Float32Array(linePairs.length * 6);
  linePairs.forEach(([a, b], idx) => {
    const pa = CONSTELLATION_POS[a];
    const pb = CONSTELLATION_POS[b];
    linePositions[idx * 6 + 0] = pa.x;
    linePositions[idx * 6 + 1] = pa.y;
    linePositions[idx * 6 + 2] = pa.z - 0.05;
    linePositions[idx * 6 + 3] = pb.x;
    linePositions[idx * 6 + 4] = pb.y;
    linePositions[idx * 6 + 5] = pb.z - 0.05;
  });
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  const constellationLines = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({ color: 0xf7c654, transparent: true, opacity: 0.65 })
  );
  constellationLines.visible = false;
  multiCardsGroup.add(constellationLines);

  // ==================================================
  // FLOATING GOLDEN ROSE PETAL & STARLIGHT PARTICLES
  // ==================================================
  const particleCount = 110;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 5.4;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 3.6;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.8;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));

  scene.add(
    new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        size: 0.1,
        map: goldBloomTex,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    )
  );

  // Normalize holder scale per spec (3.15 / maxDim)
  const box = new THREE.Box3().setFromObject(cardGroup);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  holder.scale.setScalar((3.15 / maxDim) * 0.68);

  let currentCardIdx = 0;
  let currentFoilTheme = "geo";

  function applyCardArt(url, options = {}, intoBack = false) {
    const targetCan = intoBack ? backCanvas : frontCanvas;
    const targetTex = intoBack ? backTex : frontTex;
    const themeKey = options.foilTheme || currentFoilTheme;
    const theme = FOIL_THEMES[themeKey] || FOIL_THEMES.geo;
    if (!intoBack) {
      holoUniforms.uFoilMode.value = theme.shaderMode;
    } else {
      backUniforms.uFoilMode.value = theme.shaderMode;
    }
    loadPhotoIntoCardCanvas(url, targetCan, options, () => {
      targetTex.needsUpdate = true;
    });
  }

  applyCardArt("./Navia/" + CARD_DECK[0].file, {
    title: "N A V I A",
    subtitle: CARD_DECK[0].title,
    foilTheme: "geo"
  }, false);

  applyCardArt("./Navia/" + CARD_DECK[1].file, {
    title: "N A V I A",
    subtitle: CARD_DECK[1].title,
    foilTheme: "sapphire"
  }, true);

  // ==================================================
  // STAGE CONTROLS & CRYSTAL SALUTE SHOCKWAVE TRIGGER
  // ==================================================
  let stageMode = "sovereign";
  let targetFlipY = 0;
  let currentFlipY = 0;
  let carouselSpinTarget = 0;
  let carouselSpinCurrent = 0;
  let saluteBurst = 0;
  let shockwaveProgress = 1.0;

  function launchShockwave() {
    shockwaveProgress = 0.0;
    const arr = sparkGeo.attributes.position.array;
    for (let i = 0; i < sparkCount; i++) {
      arr[i * 3] = 0;
      arr[i * 3 + 1] = 0;
      arr[i * 3 + 2] = 0;
    }
    sparkGeo.attributes.position.needsUpdate = true;
  }

  function setStageMode(mode) {
    stageMode = mode;
    sovereignGroup.visible = mode === "sovereign";
    multiCardsGroup.visible = mode !== "sovereign";
    constellationLines.visible = mode === "constellation";
    saluteBurst = 0.9;
    launchShockwave();
  }

  function flipCard() {
    if (stageMode === "carousel") {
      carouselSpinTarget += (Math.PI * 2) / NODE_COUNT;
    } else {
      targetFlipY += Math.PI;
    }
    saluteBurst = Math.max(saluteBurst, 0.65);
  }

  function cycleCard() {
    currentCardIdx = (currentCardIdx + 1) % CARD_DECK.length;
    const frontItem = CARD_DECK[currentCardIdx];
    const backItem = CARD_DECK[(currentCardIdx + 1) % CARD_DECK.length];
    applyCardArt("./Navia/" + frontItem.file, {
      title: "N A V I A",
      subtitle: frontItem.title,
      foilTheme: currentFoilTheme
    }, false);
    applyCardArt("./Navia/" + backItem.file, {
      title: "N A V I A",
      subtitle: backItem.title,
      foilTheme: currentFoilTheme
    }, true);
    targetFlipY += Math.PI * 2;
    carouselSpinTarget += (Math.PI * 2) / NODE_COUNT;
    saluteBurst = 0.95;
    launchShockwave();
    return { index: currentCardIdx, total: CARD_DECK.length, item: frontItem };
  }

  function applyCustomCardFromStudio(url, options) {
    currentFoilTheme = options.foilTheme || "geo";
    applyCardArt(url, options, false);
    setStageMode("sovereign");
    targetFlipY = Math.round(targetFlipY / (Math.PI * 2)) * (Math.PI * 2) + Math.PI * 2;
    saluteBurst = 1.3;
    launchShockwave();
  }

  function triggerCrystalSalute() {
    saluteBurst = 1.65;
    targetFlipY += Math.PI * 2;
    carouselSpinTarget += (Math.PI * 2) / 3;
    launchShockwave();
  }

  function setNightMode(isNight) {
    const nVal = isNight ? 1.0 : 0.0;
    holoUniforms.uNight.value = nVal;
    backUniforms.uNight.value = nVal;
    godrayUniforms.uNight.value = nVal;
    shockwaveUniforms.uNight.value = nVal;
    keyLight.color.setHex(isNight ? 0x9ec5ff : 0xffc98a);
    rimLight.color.setHex(isNight ? 0x4ea8ff : 0xffa24d);
    saluteFlashLight.color.setHex(isNight ? 0x70b5ff : 0xffdf7a);
  }

  let pointerDownX = 0;
  let pointerDownY = 0;
  let isDragging = false;
  canvas.addEventListener("pointerdown", (e) => {
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
    isDragging = true;
  });
  window.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.clientX - pointerDownX;
    const dy = e.clientY - pointerDownY;
    if (Math.hypot(dx, dy) < 10) {
      if (stageMode !== "sovereign") {
        pointerNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointerNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointerNdc, camera);
        const hits = raycaster.intersectObjects(pickableMeshes, false);
        if (hits.length > 0 && hits[0].object.userData?.cardItem) {
          const picked = hits[0].object.userData.cardItem;
          applyCustomCardFromStudio("./Navia/" + picked.file, {
            title: "N A V I A",
            subtitle: picked.title,
            foilTheme: currentFoilTheme
          });
          if (callbacks.onPick3DCard) callbacks.onPick3DCard(picked);
          return;
        }
      }
      // Clicking the 3D Card flips 180° + launches the full 3D Elemental Burst Shockwave & Rosula Barrage!
      flipCard();
      saluteBurst = 1.65;
      launchShockwave();
      if (callbacks.onCardInteract) callbacks.onCardInteract();
    } else if (stageMode === "carousel") {
      carouselSpinTarget += dx * 0.008;
    } else {
      targetFlipY += Math.sign(dx) * Math.PI;
    }
  });

  const target = { x: 0, y: 0 };
  const look = { x: 0, y: 0 };
  let baseX = 0.05;
  let baseY = 0.05;

  window.addEventListener("pointermove", (e) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
    if (isDragging && stageMode === "carousel") {
      carouselSpinTarget += e.movementX * 0.006;
    }
    if (stageMode !== "sovereign" && !isDragging) {
      pointerNdc.x = target.x;
      pointerNdc.y = -target.y;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(pickableMeshes, false);
      hoveredNodeIdx = hits.length > 0 ? hits[0].object.userData.nodeIndex : -1;
      canvas.style.cursor = hoveredNodeIdx >= 0 ? "pointer" : "grab";
    } else if (!isDragging) {
      hoveredNodeIdx = -1;
      canvas.style.cursor = "grab";
    }
  });

  function layout() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    const visibleH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const visibleW = visibleH * aspect;
    const mobile = width < 720;

    if (mobile) {
      baseX = 0;
      baseY = 0.14;
      const fitW = (visibleW * 0.9) / 2.65;
      pivot.scale.setScalar(Math.min(0.68, Math.max(0.46, fitW)));
    } else {
      baseX = width < 1160 ? 0.16 : 0.06;
      baseY = 0.04;
      const fitW = (visibleW * 0.65) / 2.65;
      pivot.scale.setScalar(Math.min(1.0, Math.max(0.68, Math.min(aspect / 1.72, fitW))));
    }
  }

  layout();
  window.addEventListener("resize", layout);
  canvas.classList.add("is-ready");

  setTimeout(() => {
    saluteBurst = 0.85;
    launchShockwave();
  }, 450);

  // ==================================================
  // ANIMATION LOOP
  // ==================================================
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clock = new THREE.Clock();
  let prevTime = 0;

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const dt = Math.min(0.05, t - prevTime || 0.016);
    prevTime = t;
    const reduced = reducedMotionQuery.matches;

    look.x += (target.x - look.x) * 0.04;
    look.y += (target.y - look.y) * 0.04;

    currentFlipY += (targetFlipY - currentFlipY) * 0.08;
    carouselSpinCurrent += (carouselSpinTarget - carouselSpinCurrent) * 0.07;
    saluteBurst *= 0.935;

    // Only rotate cardGroup on flip so parasolHalo always stays behind the card!
    cardGroup.rotation.y = currentFlipY;

    holoUniforms.uTime.value = t;
    holoUniforms.uTilt.value.set(look.x, look.y);
    holoUniforms.uBurst.value = saluteBurst;
    backUniforms.uTime.value = t;
    backUniforms.uTilt.value.set(-look.x, look.y);
    backUniforms.uBurst.value = saluteBurst;

    godrayUniforms.uTime.value = t;
    godrayUniforms.uBurst.value = saluteBurst;

    geoCrystalMat.emissiveIntensity = 0.7 + Math.sin(t * 3.0) * 0.14 + saluteBurst * 1.4;
    sapphireMat.emissiveIntensity = 0.72 + Math.cos(t * 2.6) * 0.14 + saluteBurst * 1.4;
    goldMat.emissiveIntensity = 0.22 + saluteBurst * 0.6;
    saluteFlashLight.intensity = saluteBurst * 9.0;

    bloomSprites.forEach((b, idx) => {
      const pulse = 1.0 + Math.sin(t * 3.2 + idx) * 0.12 + saluteBurst * 0.6;
      b.sprite.scale.setScalar(b.baseScale * pulse);
    });

    if (shockwaveProgress < 1.0) {
      shockwaveProgress = Math.min(1.0, shockwaveProgress + dt * 1.15);
      shockwaveUniforms.uProgress.value = shockwaveProgress;
      shockwaveMain.rotation.z = shockwaveProgress * 1.2;
      shockwaveOrbital.rotation.z = -shockwaveProgress * 1.5;

      const beamAlpha = Math.sin(shockwaveProgress * Math.PI) * 0.92;
      beamMat.opacity = beamAlpha;
      shardBeams.forEach((b) => {
        const dist = 0.35 + shockwaveProgress * b.speed;
        b.mesh.position.set(
          Math.cos(b.angle) * dist,
          Math.sin(b.angle) * dist,
          b.zOffset * shockwaveProgress
        );
        b.mesh.scale.set(1, 0.6 + shockwaveProgress * 1.6, 1);
      });

      sparkMat.opacity = (1.0 - shockwaveProgress) * 0.96;
      const sArr = sparkGeo.attributes.position.array;
      for (let i = 0; i < sparkCount; i++) {
        const v = sparkVelocities[i];
        sArr[i * 3] += v.vx * dt * (1.2 - shockwaveProgress * 0.7);
        sArr[i * 3 + 1] += v.vy * dt * (1.2 - shockwaveProgress * 0.7);
        sArr[i * 3 + 2] += v.vz * dt * (1.2 - shockwaveProgress * 0.7);
      }
      sparkGeo.attributes.position.needsUpdate = true;
    } else {
      beamMat.opacity = 0;
      sparkMat.opacity = 0;
    }

    if (callbacks.onFrame) callbacks.onFrame(t);

    if (reduced) {
      pivot.position.set(baseX + look.x * 0.06, baseY, 0);
      pivot.rotation.set(look.y * 0.1, look.x * 0.22, 0);
    } else {
      const bob = Math.sin(t * 2.2) * 0.09;
      pivot.position.set(baseX + look.x * 0.06, baseY + bob, 0);
      pivot.rotation.z = Math.sin(t * 2.2 + 0.6) * 0.025;
      pivot.rotation.y = look.x * 0.22 + Math.sin(t * 0.9) * 0.05;
      pivot.rotation.x = look.y * 0.1 + Math.cos(t * 2.2) * 0.02;

      crestGroup.rotation.z = t * 0.55;
      parasolHalo.rotation.z = -t * 0.26 - saluteBurst * 0.75;
      const haloScale = 1 + saluteBurst * 0.22 + Math.sin(t * 2.0) * 0.025;
      parasolHalo.scale.setScalar(haloScale);

      if (stageMode !== "sovereign") {
        const ringRadius = 1.85;
        multiNodes.forEach((node, idx) => {
          const isHovered = idx === hoveredNodeIdx;
          const hoverBoost = isHovered ? 1.18 : 1.0;
          if (stageMode === "carousel") {
            const angle = node.carouselAngle + carouselSpinCurrent + t * 0.18;
            const tx = Math.sin(angle) * ringRadius;
            const tz = Math.cos(angle) * ringRadius * 0.65;
            const ty = Math.sin(angle * 2 + t) * 0.12 + (isHovered ? 0.08 : 0);
            node.group.position.lerp(new THREE.Vector3(tx, ty, tz), 0.12);
            node.group.rotation.y = angle;
            node.group.scale.setScalar((0.82 + (tz + ringRadius * 0.65) * 0.14) * hoverBoost);
          } else {
            const cp = node.constPos;
            const floatY = cp.y + Math.sin(t * 1.8 + idx) * 0.05 + (isHovered ? 0.08 : 0);
            node.group.position.lerp(new THREE.Vector3(cp.x, floatY, cp.z + (isHovered ? 0.2 : 0)), 0.12);
            node.group.rotation.y = look.x * 0.25 + Math.sin(t + idx) * 0.08;
            node.group.scale.setScalar(0.68 * hoverBoost);
          }
        });
      }

      crystals.forEach((c, idx) => {
        const a = c.baseAngle + t * c.speed * (1 + saluteBurst * 2.5);
        const r = c.radius + Math.sin(t * 1.8 + c.phase) * 0.08 + saluteBurst * 0.48;
        c.mesh.position.set(
          Math.cos(a) * r,
          c.baseY + Math.sin(t * 2.4 + c.phase) * 0.14,
          Math.sin(a) * r * 0.55
        );
        c.mesh.rotation.y = t * 1.4 + idx;
        c.mesh.rotation.x = Math.sin(t + idx) * 0.35;
      });

      const posArr = pGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += (0.003 + saluteBurst * 0.022) * (0.5 + (i % 3) * 0.3);
        if (posArr[i * 3 + 1] > 1.8) posArr[i * 3 + 1] = -1.8;
      }
      pGeo.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  animate();

  return {
    setStageMode,
    flipCard,
    cycleCard,
    applyCustomCardFromStudio,
    triggerCrystalSalute,
    setNightMode
  };
}
