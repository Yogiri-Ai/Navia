// ==================================================
// HIGH-DPI SOVEREIGN CARD COMPOSITOR & HD PNG EXPORTER
// Clean Art Deco Filigree Frame (Zero Checkerboard Obstruction)
// ==================================================
import { FOIL_THEMES } from "./catalog.js?v=5";

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
  ctx.lineWidth = 10;
  ctx.strokeRect(36, 36, c.width - 72, c.height - 72);

  ctx.fillStyle = "#fff5dc";
  ctx.font = "400 74px Questrial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("N A V I A", 512, 1255);
}

export function paintSovereignCard(targetCanvas, img, options = {}) {
  const theme = FOIL_THEMES[options.foilTheme] || FOIL_THEMES.geo;
  const title = (options.title || "N A V I A").toUpperCase();
  const subtitle = (options.subtitle || "SPINA DI ROSULA").toUpperCase();
  const badgeText = (options.badge || theme.badge).toUpperCase();

  const ctx = targetCanvas.getContext("2d");
  const cw = targetCanvas.width;
  const ch = targetCanvas.height;
  ctx.clearRect(0, 0, cw, ch);

  // 1. Pure, unobstructed high-resolution portrait draw
  if (img && img.width > 0 && img.height > 0) {
    const imgAspect = img.width / img.height;
    const canAspect = cw / ch;
    let sx = 0, sy = 0, sw = img.width, sh = img.height;
    if (imgAspect > canAspect) {
      sw = img.height * canAspect;
      sx = (img.width - sw) * 0.5;
    } else {
      sh = img.width / canAspect;
      sy = (img.height - sh) * 0.18;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  } else {
    drawProceduralFallbackCard(targetCanvas, options.foilTheme);
  }

  // 2. Subtle bottom editorial gradient for typography legibility
  const grad = ctx.createLinearGradient(0, ch * 0.68, 0, ch);
  grad.addColorStop(0, "rgba(10,6,3,0)");
  grad.addColorStop(0.55, "rgba(12,8,4,0.62)");
  grad.addColorStop(1, "rgba(10,6,3,0.92)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, ch * 0.68, cw, ch * 0.32);

  // 3. Delicate Art Deco double hairline frame around perimeter
  ctx.save();
  ctx.strokeStyle = theme.primary;
  ctx.globalAlpha = 0.88;
  ctx.lineWidth = 8;
  ctx.strokeRect(28, 28, cw - 56, ch - 56);
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(46, 46, cw - 92, ch - 92);

  // Corner Art Deco diamond nodes
  ctx.globalAlpha = 0.95;
  [
    [46, 46],
    [cw - 46, 46],
    [46, ch - 46],
    [cw - 46, ch - 46]
  ].forEach(([cx, cy]) => {
    ctx.fillStyle = theme.primary;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 16);
    ctx.lineTo(cx + 16, cy);
    ctx.lineTo(cx, cy + 16);
    ctx.lineTo(cx - 16, cy);
    ctx.closePath();
    ctx.fill();
  });
  ctx.restore();

  // 4. Refined Top-Left Element Crest
  ctx.save();
  ctx.fillStyle = "rgba(14, 10, 7, 0.78)";
  ctx.beginPath();
  ctx.arc(114, 114, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = theme.primary;
  ctx.stroke();

  ctx.fillStyle = theme.primary;
  ctx.font = "600 28px Questrial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(badgeText, 114, 124);
  ctx.restore();

  // 5. Bottom Editorial Typography
  ctx.save();
  ctx.textAlign = "center";

  ctx.strokeStyle = theme.primary;
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(cw * 0.28, ch - 196);
  ctx.lineTo(cw * 0.72, ch - 196);
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.fillStyle = "#fffaf0";
  ctx.font = "400 68px 'Cormorant Garamond', Questrial, serif";
  ctx.fillText(title, cw / 2, ch - 120);

  ctx.fillStyle = theme.primary;
  ctx.font = "500 23px Urbanist, sans-serif";
  ctx.fillText(subtitle, cw / 2, ch - 72);
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
