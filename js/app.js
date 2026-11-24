// ==================================================
// MAIN UI CONTROLLER (Default Multi-Track Music Box,
// 3-Mode 3D Stage with Raycaster, 5-Star Wish Summon,
// Golden Cursor Trail, Auto-Cinema & 22-Photo Archive)
// ==================================================
import { ALL_PHOTOS, CARD_DECK, HEADLINES, FOIL_THEMES, VOICE_QUOTES } from "./catalog.js?v=3";
import { audioEngine } from "./audio-engine.js?v=3";
import { loadPhotoIntoCardCanvas, exportCanvasAsPng } from "./card-renderer.js?v=3";
import { initThreeStage } from "./three-stage.js?v=3";
import { initCursorTrail, initWishSummonSystem } from "./cursor-fx.js?v=3";

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.getElementById("hero");
  const menu = document.getElementById("menu");
  const brand = document.getElementById("brandPill");
  const burger = document.getElementById("burgerBtn");
  const backdrop = document.querySelector(".menu-backdrop");
  const menuLinks = Array.from(menu.querySelectorAll("a"));
  const toastEl = document.getElementById("toast");
  const musicVizCanvas = document.getElementById("musicViz");
  const musicBtn = document.getElementById("btnMusicBox");
  const musicLabel = document.getElementById("musicBoxLabel");
  let toastTimer = null;

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("is-visible");
    }, 2600);
  }

  // Initialize Golden Geo Cursor Sparkle Trail & Click Ripples
  initCursorTrail();

  // Start Default Multi-Track Fontaine Symphonic Music Box ON by default!
  // Plus handle Japanese Voice Line Subtitle Banner (pauses BGM -> shows JP sub -> resumes BGM)
  const jpVoiceBanner = document.getElementById("jpVoiceBanner");
  const jpVoiceLabel = document.getElementById("jpVoiceLabel");
  const jpVoiceText = document.getElementById("jpVoiceText");
  const jpVoiceRomaji = document.getElementById("jpVoiceRomaji");
  const jpVoiceEn = document.getElementById("jpVoiceEn");

  audioEngine.startDefaultBgm(
    (isPlaying, trackTitle, isVoiceSpeaking) => {
      musicBtn.classList.toggle("is-playing", isPlaying || isVoiceSpeaking);
      musicLabel.textContent = isVoiceSpeaking
        ? trackTitle
        : isPlaying
        ? trackTitle
        : "Music Paused";
    },
    (clip, isSpeaking) => {
      if (!jpVoiceBanner || !clip) return;
      if (isSpeaking) {
        jpVoiceLabel.textContent = `JP VA • Toyosaki Aki (豊崎愛生) • ${clip.label}`;
        jpVoiceText.textContent = clip.jp;
        jpVoiceRomaji.textContent = clip.romaji;
        jpVoiceEn.textContent = `“${clip.en}”`;
        document.getElementById("heroQuote").textContent = `${clip.jp} (${clip.romaji}) — “${clip.en}”`;
        jpVoiceBanner.classList.add("is-speaking");
      } else {
        jpVoiceBanner.classList.remove("is-speaking");
      }
    }
  );

  // Initialize Three.js 3-Mode Stage with Raycaster Picking
  // Clicking the 3D Card mutes BGM, plays Navia's JP Elemental Skill voice, then resumes BGM!
  const stage = initThreeStage({
    onCardInteract: () => {
      audioEngine.playJpVoice("skill");
    },
    onPick3DCard: (pickedItem) => {
      audioEngine.playJpVoice("skill");
      setStageModeUI("sovereign", true);
      showToast("3D Card Focused: " + pickedItem.title);
    },
    onFrame: () => {
      audioEngine.drawVisualizer(musicVizCanvas);
    }
  });

  // ==================================================
  // 1. CLIP-PATH MORPHING HAMBURGER MENU (Exact Spec)
  // ==================================================
  function updatePillWidth() {
    if (brand && menu) {
      menu.style.setProperty("--pill-w", brand.offsetWidth + "px");
    }
  }
  updatePillWidth();
  window.addEventListener("load", updatePillWidth);
  window.addEventListener("resize", updatePillWidth);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updatePillWidth);
  }

  menuLinks.forEach((link) => {
    link.tabIndex = -1;
  });

  function toggleMenu(open) {
    const isOpen = typeof open === "boolean" ? open : !hero.classList.contains("is-menu-open");
    hero.classList.toggle("is-menu-open", isOpen);
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    burger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    menuLinks.forEach((link) => {
      link.tabIndex = isOpen ? 0 : -1;
    });
  }

  burger.addEventListener("click", () => {
    audioEngine.playChime(523.25);
    toggleMenu();
  });

  backdrop.addEventListener("click", () => {
    toggleMenu(false);
  });

  // ==================================================
  // 2. 3D STAGE MODE SWITCHER & FONTAINE MULTI-TRACK MUSIC BOX
  // ==================================================
  const modeButtons = Array.from(document.querySelectorAll("[data-stage-mode]"));
  function setStageModeUI(mode, skipStageCall = false) {
    modeButtons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-stage-mode") === mode);
    });
    if (!skipStageCall) stage.setStageMode(mode);
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-stage-mode");
      audioEngine.playChime(659.25);
      setStageModeUI(mode);
      const labelMap = {
        sovereign: "3D Stage: Sovereign Card & Golden Parasol Halo",
        carousel: "3D Stage: 360° Carousel Ring (Click Any Card to Focus)",
        constellation: "3D Stage: Rosa Multiflora Constellation (Click Any Star Card)"
      };
      showToast(labelMap[mode] || "3D Stage Updated");
    });
  });

  musicBtn.addEventListener("click", () => {
    const playing = audioEngine.toggleMusicBox();
    const title = audioEngine.getCurrentTrackTitle();
    musicBtn.classList.toggle("is-playing", playing);
    musicLabel.textContent = playing ? title : "Music Paused";
    showToast(playing ? `♫ Playing: ${title}` : "Fontaine Music Box Paused");
  });

  document.getElementById("btnNextTrack").addEventListener("click", () => {
    const title = audioEngine.nextTrack();
    musicBtn.classList.add("is-playing");
    musicLabel.textContent = title;
    audioEngine.playChime(783.99);
    showToast(`♫ Switched Track: ${title}`);
  });

  // ==================================================
  // 3. 4K WALLPAPER CROSSFADER, AUTO-CINEMA & THEME TOGGLE
  // ==================================================
  const bgLayers = Array.from(document.querySelectorAll(".hero__bg-layer"));
  const wpThumbsContainer = document.getElementById("wpThumbs");
  const btnNextCard = document.getElementById("btnNextCard");
  let currentWpIdx = 0;

  function setWallpaper(idx) {
    currentWpIdx = ((idx % bgLayers.length) + bgLayers.length) % bgLayers.length;
    bgLayers.forEach((img, i) => {
      img.classList.toggle("is-active", i === currentWpIdx);
    });
    const src = bgLayers[currentWpIdx].getAttribute("src");
    hero.style.backgroundImage = `url("${src}")`;
    Array.from(wpThumbsContainer.children).forEach((btn, i) => {
      btn.classList.toggle("is-active", i === currentWpIdx);
    });
    const spans = document.querySelectorAll("#headline span");
    const words = HEADLINES[currentWpIdx] || HEADLINES[0];
    spans.forEach((sp, i) => {
      sp.textContent = words[i];
    });
  }

  bgLayers.forEach((layer, idx) => {
    const btn = document.createElement("button");
    btn.className = "wp-thumb" + (idx === 0 ? " is-active" : "");
    btn.title = ALL_PHOTOS[idx].title;
    btn.innerHTML = `<img src="${layer.getAttribute("src")}" alt="${ALL_PHOTOS[idx].title}">`;
    btn.addEventListener("click", () => {
      audioEngine.playChime(659.25);
      setWallpaper(idx);
      showToast("4K Scene: " + ALL_PHOTOS[idx].title);
    });
    wpThumbsContainer.appendChild(btn);
  });

  document.getElementById("btnNextWp").addEventListener("click", () => {
    audioEngine.playChime(659.25);
    setWallpaper(currentWpIdx + 1);
    showToast("4K Scene: " + ALL_PHOTOS[currentWpIdx].title);
  });

  // Auto-Cinema Exhibition Mode
  const btnAutoCinema = document.getElementById("btnAutoCinema");
  let cinemaTimer = null;
  let cinemaStep = 0;

  function toggleAutoCinema() {
    if (cinemaTimer) {
      clearInterval(cinemaTimer);
      cinemaTimer = null;
      btnAutoCinema.classList.remove("is-cinema-on");
      btnAutoCinema.innerHTML = "Auto-Cinema &#9654;";
      showToast("Auto-Cinema Exhibition Paused");
    } else {
      btnAutoCinema.classList.add("is-cinema-on");
      btnAutoCinema.innerHTML = "Cinema Active &#9632;";
      audioEngine.playSaluteCannon();
      stage.triggerCrystalSalute();
      showToast("✦ Auto-Cinema 4K Exhibition Mode Active");
      cinemaTimer = setInterval(() => {
        cinemaStep++;
        setWallpaper(currentWpIdx + 1);
        const info = stage.cycleCard();
        btnNextCard.innerHTML = `Card Art (${info.index + 1}/${info.total}) &rarr;`;
        if (cinemaStep % 3 === 0) {
          const modes = ["sovereign", "carousel", "constellation"];
          setStageModeUI(modes[(cinemaStep / 3) % modes.length]);
        }
      }, 4200);
    }
  }

  btnAutoCinema.addEventListener("click", toggleAutoCinema);

  document.getElementById("themeToggle").addEventListener("click", () => {
    const isNight = hero.classList.toggle("is-night");
    audioEngine.playChime(isNight ? 440 : 740);
    stage.setNightMode(isNight);
    showToast(isNight ? "Poisson Midnight Sapphire Mode" : "Fontaine Radiant Geo Mode");
  });

  // Bottom HUD 3D Controls
  document.getElementById("btnSalute").addEventListener("click", () => {
    audioEngine.playJpVoice("burst");
    stage.triggerCrystalSalute();
    showToast("Golden Rose Cannon: Crystal Salute! (JP Voice)");
  });

  document.getElementById("btnFlipCard").addEventListener("click", () => {
    audioEngine.playJpVoice("skill");
    stage.flipCard();
    showToast("3D Hologram Card Flipped (JP Voice)");
  });

  btnNextCard.addEventListener("click", () => {
    audioEngine.playJpVoice("skill");
    const info = stage.cycleCard();
    btnNextCard.innerHTML = `Card Art (${info.index + 1}/${info.total}) &rarr;`;
    showToast("3D Card: " + info.item.title);
  });

  // ==================================================
  // 4. INTERACTIVE 3D CARD STUDIO & HD PNG EXPORTER
  // ==================================================
  const studioDrawer = document.getElementById("studioDrawer");
  const studioCanvas = document.getElementById("studioPreviewCanvas");
  const inputTitle = document.getElementById("studioTitleInput");
  const inputSubtitle = document.getElementById("studioSubInput");
  const inputBadge = document.getElementById("studioBadgeInput");
  const studioPhotoStrip = document.getElementById("studioPhotoStrip");
  const foilOptionsEl = document.getElementById("foilOptions");

  let studioState = {
    photoFile: CARD_DECK[0].file,
    title: "N A V I A",
    subtitle: "DEMOISELLE OF SPINA DI ROSULA",
    badge: "GEO",
    foilTheme: "geo"
  };

  function updateStudioPreview() {
    loadPhotoIntoCardCanvas(
      "./Navia/" + studioState.photoFile,
      studioCanvas,
      {
        title: studioState.title,
        subtitle: studioState.subtitle,
        badge: studioState.badge,
        foilTheme: studioState.foilTheme
      }
    );
  }

  ALL_PHOTOS.forEach((item, idx) => {
    const btn = document.createElement("button");
    btn.className = "studio-photo-pick" + (item.file === studioState.photoFile ? " is-active" : "");
    btn.title = item.title;
    btn.innerHTML = `<img src="./Navia/${item.file}" alt="${item.title}" loading="lazy">`;
    btn.addEventListener("click", () => {
      audioEngine.playChime(680 + idx * 10);
      studioState.photoFile = item.file;
      Array.from(studioPhotoStrip.children).forEach((c) => c.classList.toggle("is-active", c === btn));
      updateStudioPreview();
    });
    studioPhotoStrip.appendChild(btn);
  });

  foilOptionsEl.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-foil]");
    if (!chip) return;
    const foilKey = chip.getAttribute("data-foil");
    studioState.foilTheme = foilKey;
    studioState.badge = (FOIL_THEMES[foilKey] || FOIL_THEMES.geo).badge;
    inputBadge.value = studioState.badge;
    Array.from(foilOptionsEl.querySelectorAll(".foil-chip")).forEach((c) => {
      c.classList.toggle("is-active", c === chip);
    });
    audioEngine.playChime(740);
    updateStudioPreview();
  });

  [inputTitle, inputSubtitle, inputBadge].forEach((inp) => {
    inp.addEventListener("input", () => {
      studioState.title = inputTitle.value || "N A V I A";
      studioState.subtitle = inputSubtitle.value || "SPINA DI ROSULA";
      studioState.badge = inputBadge.value || "GEO";
      updateStudioPreview();
    });
  });

  document.getElementById("btnApplyTo3D").addEventListener("click", () => {
    audioEngine.playSaluteCannon();
    setStageModeUI("sovereign");
    stage.applyCustomCardFromStudio("./Navia/" + studioState.photoFile, studioState);
    studioDrawer.classList.remove("is-open");
    showToast("Applied Custom Hologram Card to Live 3D Stage!");
  });

  document.getElementById("btnExportPng").addEventListener("click", () => {
    audioEngine.playChime(880);
    const ok = exportCanvasAsPng(studioCanvas, "Navia-Sovereign-Card-HD.png");
    showToast(ok ? "Downloaded Navia-Sovereign-Card-HD.png (1024×1420)" : "Export Ready");
  });

  updateStudioPreview();

  // ==================================================
  // 5. 5-STAR GOLDEN METEOR WISH SUMMON SYSTEM
  // ==================================================
  const wishSystem = initWishSummonSystem({
    onWishSound: () => {
      audioEngine.playWishFanfare();
    },
    onEquipCard: (photoItem) => {
      audioEngine.playSaluteCannon();
      setStageModeUI("sovereign");
      stage.applyCustomCardFromStudio("./Navia/" + photoItem.file, {
        title: "N A V I A",
        subtitle: photoItem.title,
        foilTheme: "prismatic"
      });
      showToast("5★ Sovereign Equipped: " + photoItem.title);
    }
  });

  document.getElementById("btnOpenWish").addEventListener("click", () => {
    wishSystem.openWish(1);
  });

  // ==================================================
  // 6. 22-PHOTO ROYAL ARCHIVE, DOSSIER & LIGHTBOX
  // ==================================================
  const galleryDrawer = document.getElementById("galleryDrawer");
  const dossierDrawer = document.getElementById("dossierDrawer");
  const galleryGrid = document.getElementById("galleryGrid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  let activeLightboxPhoto = ALL_PHOTOS[0];

  function closeAllDrawers() {
    galleryDrawer.classList.remove("is-open");
    dossierDrawer.classList.remove("is-open");
    studioDrawer.classList.remove("is-open");
    lightbox.classList.remove("is-open");
    if (wishSystem.closeWish) wishSystem.closeWish();
  }

  function renderGallery(filter) {
    galleryGrid.innerHTML = "";
    ALL_PHOTOS.forEach((item) => {
      if (filter && filter !== "all" && item.cat !== filter) return;
      const card = document.createElement("div");
      card.className = "g-card" + (item.wide ? " is-wide" : "");
      const url = "./Navia/" + item.file;
      card.innerHTML = `
        <img src="${url}" alt="${item.title}" loading="lazy">
        <div class="g-card__overlay">
          <div class="g-card__title">${item.title}</div>
          <div class="g-card__actions">
            <button class="g-card__btn" data-act="card">3D Card</button>
            <button class="g-card__btn" data-act="studio">Customize</button>
            <button class="g-card__btn" data-act="bg">Set BG</button>
            <button class="g-card__btn" data-act="zoom">Zoom</button>
          </div>
        </div>
      `;

      card.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-act]");
        const act = btn ? btn.getAttribute("data-act") : "zoom";
        audioEngine.playChime(698.46);
        if (act === "card") {
          setStageModeUI("sovereign");
          stage.applyCustomCardFromStudio(url, {
            title: "N A V I A",
            subtitle: item.title,
            foilTheme: studioState.foilTheme
          });
          closeAllDrawers();
          showToast("3D Hologram Card: " + item.title);
        } else if (act === "studio") {
          studioState.photoFile = item.file;
          studioState.subtitle = item.title.toUpperCase();
          inputSubtitle.value = studioState.subtitle;
          updateStudioPreview();
          galleryDrawer.classList.remove("is-open");
          studioDrawer.classList.add("is-open");
        } else if (act === "bg") {
          hero.style.backgroundImage = `url("${url}")`;
          bgLayers.forEach((l) => l.classList.remove("is-active"));
          bgLayers[0].src = url;
          bgLayers[0].classList.add("is-active");
          closeAllDrawers();
          showToast("Hero Background: " + item.title);
        } else {
          activeLightboxPhoto = item;
          lightboxImg.src = url;
          lightbox.classList.add("is-open");
        }
      });

      galleryGrid.appendChild(card);
    });
  }
  renderGallery("all");

  document.getElementById("galleryFilters").addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-tab");
    if (!btn) return;
    Array.from(document.querySelectorAll(".filter-tab")).forEach((b) => {
      b.classList.toggle("is-active", b === btn);
    });
    renderGallery(btn.getAttribute("data-filter"));
  });

  function runAction(action) {
    closeAllDrawers();
    if (action === "gallery") {
      galleryDrawer.classList.add("is-open");
      audioEngine.playChime(659.25);
    } else if (action === "dossier") {
      dossierDrawer.classList.add("is-open");
      audioEngine.playChime(587.33);
    } else if (action === "studio") {
      updateStudioPreview();
      studioDrawer.classList.add("is-open");
      audioEngine.playChime(740);
    } else if (action === "wish") {
      wishSystem.openWish(1);
    } else if (action === "salute") {
      audioEngine.playSaluteCannon();
      stage.triggerCrystalSalute();
      showToast("Rosula Shardshot & Crystal Salute!");
    } else if (action === "carousel") {
      setStageModeUI("carousel");
      audioEngine.playChime(698.46);
      showToast("3D Stage: 360° Carousel Ring");
    }
  }

  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      toggleMenu(false);
      runAction(link.getAttribute("data-menu-action"));
    });
  });

  document.querySelectorAll("[data-nav-action]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      runAction(el.getAttribute("data-nav-action"));
    });
  });

  document.getElementById("btnOpenGallery").addEventListener("click", () => runAction("gallery"));
  document.getElementById("btnOpenStudio").addEventListener("click", () => runAction("studio"));
  document.getElementById("closeGallery").addEventListener("click", closeAllDrawers);
  document.getElementById("closeDossier").addEventListener("click", closeAllDrawers);
  document.getElementById("closeStudio").addEventListener("click", closeAllDrawers);

  document.querySelectorAll(".voice-card").forEach((vc) => {
    vc.addEventListener("click", () => {
      const idx = Number(vc.getAttribute("data-voice")) || 0;
      audioEngine.playJpVoice(idx);
      stage.triggerCrystalSalute();
      showToast("Playing Navia JP Voice Line #" + (idx + 1));
    });
  });

  // Lightbox buttons
  document.getElementById("lbClose").addEventListener("click", () => {
    lightbox.classList.remove("is-open");
  });
  document.getElementById("lbSetBg").addEventListener("click", () => {
    const url = "./Navia/" + activeLightboxPhoto.file;
    hero.style.backgroundImage = `url("${url}")`;
    bgLayers.forEach((l) => l.classList.remove("is-active"));
    bgLayers[0].src = url;
    bgLayers[0].classList.add("is-active");
    closeAllDrawers();
    showToast("Hero Background: " + activeLightboxPhoto.title);
  });
  document.getElementById("lbSetCard").addEventListener("click", () => {
    const url = "./Navia/" + activeLightboxPhoto.file;
    setStageModeUI("sovereign");
    stage.applyCustomCardFromStudio(url, {
      title: "N A V I A",
      subtitle: activeLightboxPhoto.title,
      foilTheme: studioState.foilTheme
    });
    closeAllDrawers();
    showToast("3D Hologram Card: " + activeLightboxPhoto.title);
  });

  // ==================================================
  // 7. GLOBAL KEYBOARD SHORTCUTS
  // ==================================================
  window.addEventListener("keydown", (e) => {
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) {
      if (e.key === "Escape") e.target.blur();
      return;
    }
    if (e.key === "Escape") {
      toggleMenu(false);
      closeAllDrawers();
    } else if (e.code === "Space") {
      e.preventDefault();
      document.getElementById("btnSalute").click();
    } else if (e.key === "f" || e.key === "F") {
      document.getElementById("btnFlipCard").click();
    } else if (e.key === "m" || e.key === "M") {
      musicBtn.click();
    } else if (e.key === "n" || e.key === "N") {
      document.getElementById("btnNextTrack").click();
    } else if (e.key === "w" || e.key === "W") {
      wishSystem.openWish(1);
    } else if (e.key === "c" || e.key === "C") {
      toggleAutoCinema();
    } else if (e.key === "1") {
      setStageModeUI("sovereign");
      showToast("3D Stage: Sovereign Card");
    } else if (e.key === "2") {
      setStageModeUI("carousel");
      showToast("3D Stage: 360° Carousel Ring");
    } else if (e.key === "3") {
      setStageModeUI("constellation");
      showToast("3D Stage: Rosa Constellation");
    } else if (e.key === "ArrowRight") {
      setWallpaper(currentWpIdx + 1);
      showToast("4K Scene: " + ALL_PHOTOS[currentWpIdx].title);
    } else if (e.key === "ArrowLeft") {
      setWallpaper(currentWpIdx - 1);
      showToast("4K Scene: " + ALL_PHOTOS[currentWpIdx].title);
    }
  });
});
