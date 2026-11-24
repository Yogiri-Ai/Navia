// ==================================================
// GOLDEN GEO CURSOR TRAIL, CLICK CRYSTALLIZE RIPPLE
// & 5-STAR GOLDEN METEOR WISH SUMMON ANIMATION
// ==================================================
import { ALL_PHOTOS, VOICE_QUOTES } from "./catalog.js?v=7";

export function initCursorTrail() {
  const canvas = document.getElementById("cursorFx");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);
  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const trail = [];
  const ripples = [];
  let lastX = w / 2;
  let lastY = h / 2;

  window.addEventListener("pointermove", (e) => {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (dx * dx + dy * dy > 36) {
      lastX = e.clientX;
      lastY = e.clientY;
      trail.push({
        x: e.clientX + (Math.random() - 0.5) * 8,
        y: e.clientY + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.4 - Math.random() * 0.9,
        size: 3 + Math.random() * 4.5,
        life: 1.0,
        gold: Math.random() > 0.25
      });
      if (trail.length > 55) trail.shift();
    }
  }, { passive: true });

  window.addEventListener("pointerdown", (e) => {
    ripples.push({
      x: e.clientX,
      y: e.clientY,
      life: 1.0
    });
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const spd = 1.6 + Math.random() * 1.4;
      trail.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 4.5 + Math.random() * 3,
        life: 1.0,
        gold: i % 2 === 0
      });
    }
  }, { passive: true });

  function render() {
    requestAnimationFrame(render);
    ctx.clearRect(0, 0, w, h);

    // Draw trailing Geo diamond sparkles
    for (let i = trail.length - 1; i >= 0; i--) {
      const p = trail[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.026;
      if (p.life <= 0) {
        trail.splice(i, 1);
        continue;
      }
      const s = p.size * p.life;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((1 - p.life) * 2.2);
      ctx.fillStyle = p.gold
        ? `rgba(255, 218, 120, ${p.life * 0.85})`
        : `rgba(115, 185, 255, ${p.life * 0.85})`;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.65, 0);
      ctx.lineTo(0, s);
      ctx.lineTo(-s * 0.65, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Draw expanding Spina compass rose click ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.life -= 0.038;
      if (r.life <= 0) {
        ripples.splice(i, 1);
        continue;
      }
      const rad = (1 - r.life) * 44 + 6;
      ctx.save();
      ctx.strokeStyle = `rgba(247, 198, 84, ${r.life * 0.75})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(r.x, r.y, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  render();
}

// ==================================================
// 5-STAR GOLDEN METEOR WISH SUMMON CONTROLLER
// ==================================================
export function initWishSummonSystem(callbacks = {}) {
  const overlay = document.getElementById("wishOverlay");
  const wishCan = document.getElementById("wishMeteorCanvas");
  const resultWrap = document.getElementById("wishResultWrap");
  const singleView = document.getElementById("wishSingleView");
  const multiGrid = document.getElementById("wishMultiGrid");
  const singleImg = document.getElementById("wishSingleImg");
  const singleTitle = document.getElementById("wishSingleTitle");
  const singleQuote = document.getElementById("wishSingleQuote");

  if (!overlay || !wishCan) return {};

  const ctx = wishCan.getContext("2d");
  let animId = null;
  let lastPulledPhoto = ALL_PHOTOS[8];

  function playMeteorCutscene(onImpactDone) {
    wishCan.width = window.innerWidth;
    wishCan.height = window.innerHeight;
    wishCan.style.opacity = "1";
    resultWrap.classList.remove("is-revealed");

    const startTime = performance.now();
    const sparks = [];
    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random() * wishCan.width,
      y: Math.random() * wishCan.height,
      r: 0.8 + Math.random() * 1.8,
      a: 0.3 + Math.random() * 0.7
    }));

    cancelAnimationFrame(animId);

    function step(now) {
      const elapsed = (now - startTime) / 1000;
      const w = wishCan.width;
      const h = wishCan.height;

      // Deep Fontaine cosmos backdrop
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 40, w * 0.5, h * 0.5, w * 0.85);
      bg.addColorStop(0, "#1c1326");
      bg.addColorStop(0.5, "#0d0b18");
      bg.addColorStop(1, "#05040a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      stars.forEach((st) => {
        ctx.fillStyle = `rgba(255, 240, 200, ${st.a})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (elapsed < 1.05) {
        // Golden 5-Star Meteor streaking diagonally to center
        const p = elapsed / 1.05;
        const ease = 1 - Math.pow(1 - p, 2.2);
        const mx = w * 0.08 + (w * 0.5 - w * 0.08) * ease;
        const my = h * 0.1 + (h * 0.5 - h * 0.1) * ease;

        // Spawn golden tail sparks
        for (let k = 0; k < 4; k++) {
          sparks.push({
            x: mx + (Math.random() - 0.5) * 18,
            y: my + (Math.random() - 0.5) * 18,
            vx: -2 - Math.random() * 3.5,
            vy: -1.5 - Math.random() * 2.5,
            r: 2 + Math.random() * 5,
            life: 1.0,
            gold: Math.random() > 0.2
          });
        }

        // Draw glowing golden meteor trail
        const tailGrad = ctx.createLinearGradient(w * 0.05, h * 0.08, mx, my);
        tailGrad.addColorStop(0, "rgba(120, 80, 255, 0)");
        tailGrad.addColorStop(0.55, "rgba(232, 135, 42, 0.45)");
        tailGrad.addColorStop(1, "rgba(255, 245, 195, 0.98)");
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = 14;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(Math.max(w * 0.06, mx - 340), Math.max(h * 0.08, my - 210));
        ctx.lineTo(mx, my);
        ctx.stroke();

        // Meteor core 4-point golden star flare
        const coreGrad = ctx.createRadialGradient(mx, my, 2, mx, my, 75);
        coreGrad.addColorStop(0, "#ffffff");
        coreGrad.addColorStop(0.3, "#ffe484");
        coreGrad.addColorStop(0.7, "rgba(232, 116, 42, 0.4)");
        coreGrad.addColorStop(1, "rgba(232, 116, 42, 0)");
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(mx, my, 75, 0, Math.PI * 2);
        ctx.fill();
      } else if (elapsed < 1.55) {
        // Supernova 5-Star Golden Impact Flash
        const fp = (elapsed - 1.05) / 0.5;
        const radius = fp * Math.max(w, h) * 0.9;
        const alpha = 1 - fp;
        const flashGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 10, w * 0.5, h * 0.5, radius);
        flashGrad.addColorStop(0, `rgba(255, 252, 235, ${alpha})`);
        flashGrad.addColorStop(0.4, `rgba(247, 198, 84, ${alpha * 0.85})`);
        flashGrad.addColorStop(1, "rgba(232, 116, 42, 0)");
        ctx.fillStyle = flashGrad;
        ctx.fillRect(0, 0, w, h);
      } else {
        wishCan.style.opacity = "0.28";
        onImpactDone();
        return;
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life -= 0.035;
        if (sp.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.fillStyle = sp.gold
          ? `rgba(255, 218, 110, ${sp.life})`
          : `rgba(165, 140, 255, ${sp.life})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r * sp.life, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(step);
    }

    animId = requestAnimationFrame(step);
  }

  function openWish(count = 1) {
    overlay.classList.add("is-open");
    if (callbacks.onWishSound) callbacks.onWishSound();

    playMeteorCutscene(() => {
      if (count === 1) {
        singleView.style.display = "flex";
        multiGrid.style.display = "none";
        const pick = ALL_PHOTOS[Math.floor(Math.random() * ALL_PHOTOS.length)];
        lastPulledPhoto = pick;
        singleImg.src = "./Navia/" + pick.file;
        singleImg.style.objectPosition = `${Math.round((pick.fx ?? 0.5) * 100)}% ${Math.round((pick.fy ?? 0.38) * 100)}%`;
        singleTitle.textContent = pick.title;
        singleQuote.textContent =
          VOICE_QUOTES[Math.floor(Math.random() * VOICE_QUOTES.length)];
      } else {
        singleView.style.display = "none";
        multiGrid.style.display = "grid";
        multiGrid.innerHTML = "";
        const shuffled = [...ALL_PHOTOS].sort(() => Math.random() - 0.5).slice(0, 10);
        lastPulledPhoto = shuffled[0];
        shuffled.forEach((item, idx) => {
          const card = document.createElement("div");
          card.className = "wish-multi-card";
          card.style.animationDelay = `${idx * 0.06}s`;
          const focalStyle = `object-position:${Math.round((item.fx ?? 0.5) * 100)}% ${Math.round((item.fy ?? 0.38) * 100)}%`;
          card.innerHTML = `
            <img src="./Navia/${item.file}" alt="${item.title}" style="${focalStyle}">
            <div class="wish-multi-card__stars">★ ★ ★ ★ ★</div>
            <div class="wish-multi-card__name">${item.title}</div>
          `;
          card.addEventListener("click", () => {
            lastPulledPhoto = item;
            if (callbacks.onEquipCard) callbacks.onEquipCard(item);
            overlay.classList.remove("is-open");
          });
          multiGrid.appendChild(card);
        });
      }
      resultWrap.classList.add("is-revealed");
    });
  }

  document.getElementById("btnWishPull1")?.addEventListener("click", () => openWish(1));
  document.getElementById("btnWishPull10")?.addEventListener("click", () => openWish(10));
  document.getElementById("btnWishEquip")?.addEventListener("click", () => {
    if (callbacks.onEquipCard) callbacks.onEquipCard(lastPulledPhoto);
    overlay.classList.remove("is-open");
  });
  document.getElementById("btnWishClose")?.addEventListener("click", () => {
    cancelAnimationFrame(animId);
    overlay.classList.remove("is-open");
  });

  return {
    openWish,
    closeWish: () => {
      cancelAnimationFrame(animId);
      overlay.classList.remove("is-open");
    }
  };
}
