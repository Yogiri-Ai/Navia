// ==================================================
// HIGH-DPI SOVEREIGN CARD COMPOSITOR & HD PNG EXPORTER
// ==================================================
import { FOIL_THEMES } from "./catalog.js";

export function createBaseCardCanvas(themeKey = "geo") {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 1420;
  drawProceduralFallbackCard(c, themeKey);
  return c;
}

export function drawProceduralFallbackCard(c, themeKey = "geo") {
  const theme = FOIL_THEMES[themeKey] || FOIL_THEMES.geo;
  const ctx = c.getContext("2d");
  const grad = ctx.createRadialGradient(512, 650, 60, 512, 710, 820);
  grad.addColorStop(0, theme.primary);
  grad.addColorStop(0.55, theme.secondary);
  grad.addColorStop(1, theme.dark);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 14;
  ctx.strokeRect(36, 36, c.width - 72, c.height - 72);

  ctx.fillStyle = "#fff5dc";
  ctx.font = "400 78px Questrial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("N A V I A", 512, 1255);
}

export function paintSovereignCard(targetCanvas, img, options = {}) {
  const theme = FOIL_THEMES[options.foilTheme] || FOIL_THEMES.geo;
  const title = (options.title || "N A V I A").toUpperCase();
  const subtitle = (options.subtitle || "SPINA DI ROSULA • SOVEREIGN").toUpperCase();
  const badgeText = (options.badge || theme.badge).toUpperCase();

  const ctx = targetCanvas.getContext("2d");
  const cw = targetCanvas.width;
  const ch = targetCanvas.height;
  ctx.clearRect(0, 0, cw, ch);

  // 1. Center-crop cover draw
  if (img && img.width > 0 && img.height > 0) {
    const imgAspect = img.width / img.height;
    const canAspect = cw / ch;
    let sx = 0, sy = 0, sw = img.width, sh = img.height;
    if (imgAspect > canAspect) {
      sw = img.height * canAspect;
      sx = (img.width - sw) * 0.5;
    } else {
      sh = img.width / canAspect;
      sy = (img.height - sh) * 0.22;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  } else {
    drawProceduralFallbackCard(targetCanvas, options.foilTheme);
  }

  // 2. Subtle holographic diamond foil watermark overlay
  ctx.save();
  ctx.strokeStyle = theme.primary;
  ctx.globalAlpha = 0.12;
  ctx.lineWidth = 2;
  const step = 86;
  for (let x = -ch; x < cw + ch; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + ch, ch);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + ch, 0);
    ctx.lineTo(x, ch);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Bottom royal nameplate vignette
  const grad = ctx.createLinearGradient(0, ch * 0.62, 0, ch);
  grad.addColorStop(0, "rgba(14,8,4,0)");
  grad.addColorStop(0.58, "rgba(14,8,4,0.68)");
  grad.addColorStop(1, theme.dark);
  ctx.fillStyle = grad;
  ctx.fillRect(0, ch * 0.62, cw, ch * 0.38);

  // 4. Ornate outer & inner royal filigree frame
  ctx.save();
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 14;
  ctx.strokeRect(26, 26, cw - 52, ch - 52);
  ctx.lineWidth = 4;
  ctx.strokeRect(46, 46, cw - 92, ch - 92);

  // Corner Geo diamond accents
  const corners = [
    [46, 46],
    [cw - 46, 46],
    [46, ch - 46],
    [cw - 46, ch - 46]
  ];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = theme.primary;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 22);
    ctx.lineTo(cx + 22, cy);
    ctx.lineTo(cx, cy + 22);
    ctx.lineTo(cx - 22, cy);
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();

  // 5. Top-left Element / Cost Emblem Badge
  ctx.save();
  ctx.fillStyle = "rgba(18, 12, 8, 0.85)";
  ctx.beginPath();
  ctx.arc(124, 124, 58, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = theme.primary;
  ctx.stroke();

  ctx.fillStyle = theme.primary;
  ctx.font = "600 34px Questrial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(badgeText, 124, 136);
  ctx.restore();

  // 6. Top-right 5-Star Sovereign Rarity Emblem
  ctx.save();
  ctx.fillStyle = theme.primary;
  ctx.font = "400 32px Questrial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("✦ ✦ ✦ ✦ ✦", cw - 74, 118);
  ctx.font = "500 20px Urbanist, sans-serif";
  ctx.fillStyle = "rgba(255, 245, 220, 0.82)";
  ctx.fillText("FONTAINE • SPINA DI ROSULA", cw - 74, 148);
  ctx.restore();

  // 7. Bottom Royal Nameplate Typography
  ctx.save();
  ctx.textAlign = "center";

  // Decorative divider line above name
  ctx.strokeStyle = theme.primary;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cw * 0.22, ch - 210);
  ctx.lineTo(cw * 0.78, ch - 210);
  ctx.stroke();

  ctx.fillStyle = "#fff8e8";
  ctx.font = "400 72px Questrial, sans-serif";
  ctx.fillText(title, cw / 2, ch - 126);

  ctx.fillStyle = theme.primary;
  ctx.font = "600 27px Urbanist, sans-serif";
  ctx.fillText(subtitle, cw / 2, ch - 76);
  ctx.restore();
}

export function loadPhotoIntoCardCanvas(url, targetCanvas, options = {}, onComplete) {
  const fileKey = url.split("/Navia/").pop();
  const inlineMap = window.NAVIA_WEBGL_TEX || {};
  const safeSrc = (window.location.protocol === "file:" && inlineMap[fileKey])
    ? inlineMap[fileKey]
    : (inlineMap[fileKey] || url);

  const img = new Image();
  img.onload = () => {
    try {
      const testCan = document.createElement("canvas");
      testCan.width = 2;
      testCan.height = 2;
      const tCtx = testCan.getContext("2d");
      tCtx.drawImage(img, 0, 0, 2, 2);
      tCtx.getImageData(0, 0, 1, 1);
      paintSovereignCard(targetCanvas, img, options);
      if (onComplete) onComplete(targetCanvas);
    } catch (e) {
      if (inlineMap[fileKey] && img.src !== inlineMap[fileKey]) {
        img.src = inlineMap[fileKey];
      } else {
        paintSovereignCard(targetCanvas, null, options);
        if (onComplete) onComplete(targetCanvas);
      }
    }
  };
  img.onerror = () => {
    paintSovereignCard(targetCanvas, null, options);
    if (onComplete) onComplete(targetCanvas);
  };
  img.src = safeSrc;
}

export function exportCanvasAsPng(canvasEl, filename = "Navia-Sovereign-Card.png") {
  try {
    const dataUrl = canvasEl.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (e) {
    return false;
  }
}
