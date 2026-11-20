// cover.js — Vice Cover Studio: GTA 6-style multi-panel cover renderer.
// Pure Canvas 2D, no dependencies. Every cover is drawn by drawCover(ctx, W, H,
// state, images) so the editor preview and the exported PNG are the same code.
// Design follows the study of the live top 10 (PALM FEVER / HEATWAVE /
// HIGH TIDE HUSTLE): 7 panels, a huge striped gradient title overlapping the
// panels, neon script subtitle, role labels with sub-lines, location chip,
// starburst seal, palm-silhouette strip, tagline band, catalogue footer.
// All artwork is original: no Rockstar logo, artwork or font.

export const SAMPLE_PHOTOS = [
  'hero.jpg', 'insider.jpg', 'boss.jpg', 'driver.jpg',
  'rider.jpg', 'courier.jpg', 'boat.jpg', 'bike.jpg',
];

export const ROLES = [
  { role: 'THE CLOSER', sub: 'CORAL CAUSEWAY \u00b7 7:15 PM \u00b7 OWNS THE NIGHT' },
  { role: 'THE INSIDER', sub: 'NEON ALLEY \u00b7 11:40 PM \u00b7 KNOWS EVERYONE' },
  { role: 'THE BOSS', sub: 'ROOFTOP BAR \u00b7 8:05 PM \u00b7 OWNS THE SKYLINE' },
  { role: 'THE DRIVER', sub: 'OCEAN AVENUE \u00b7 6:30 PM \u00b7 NEVER BRAKES' },
  { role: 'THE RIDER', sub: 'BOARDWALK \u00b7 9:12 PM \u00b7 CLOSES LATE' },
  { role: 'THE COURIER', sub: 'PALM COURT MOTEL \u00b7 10:02 PM \u00b7 NO QUESTIONS' },
  { role: 'THE FIXER', sub: 'THE DOCKS \u00b7 1:15 AM \u00b7 MAKES IT VANISH' },
];

export const LAYOUTS = [
  {
    name: 'Sunset Seven', hero: 1, slant: 0,
    panels: [
      { x: 0.012, y: 0.088, w: 0.296, h: 0.342 },
      { x: 0.312, y: 0.088, w: 0.376, h: 0.342 },
      { x: 0.692, y: 0.088, w: 0.296, h: 0.342 },
      { x: 0.012, y: 0.434, w: 0.242, h: 0.356 },
      { x: 0.258, y: 0.434, w: 0.242, h: 0.356 },
      { x: 0.504, y: 0.434, w: 0.242, h: 0.356 },
      { x: 0.750, y: 0.434, w: 0.238, h: 0.356 },
    ],
  },
  {
    name: 'Hero Left', hero: 0, slant: 0,
    panels: [
      { x: 0.012, y: 0.088, w: 0.336, h: 0.702 },
      { x: 0.352, y: 0.088, w: 0.316, h: 0.231 },
      { x: 0.672, y: 0.088, w: 0.316, h: 0.231 },
      { x: 0.352, y: 0.323, w: 0.316, h: 0.231 },
      { x: 0.672, y: 0.323, w: 0.316, h: 0.231 },
      { x: 0.352, y: 0.558, w: 0.316, h: 0.232 },
      { x: 0.672, y: 0.558, w: 0.316, h: 0.232 },
    ],
  },
  {
    name: 'Hero Centre', hero: 3, slant: 0,
    panels: [
      { x: 0.012, y: 0.088, w: 0.316, h: 0.231 },
      { x: 0.012, y: 0.323, w: 0.316, h: 0.231 },
      { x: 0.012, y: 0.558, w: 0.316, h: 0.232 },
      { x: 0.332, y: 0.088, w: 0.336, h: 0.702 },
      { x: 0.672, y: 0.088, w: 0.316, h: 0.231 },
      { x: 0.672, y: 0.323, w: 0.316, h: 0.231 },
      { x: 0.672, y: 0.558, w: 0.316, h: 0.232 },
    ],
  },
  {
    name: 'Six Sunset', hero: 1, slant: 0,
    panels: [
      { x: 0.012, y: 0.088, w: 0.32, h: 0.342 },
      { x: 0.336, y: 0.088, w: 0.328, h: 0.342 },
      { x: 0.668, y: 0.088, w: 0.32, h: 0.342 },
      { x: 0.012, y: 0.434, w: 0.32, h: 0.356 },
      { x: 0.336, y: 0.434, w: 0.328, h: 0.356 },
      { x: 0.668, y: 0.434, w: 0.32, h: 0.356 },
    ],
  },
  {
    name: 'Slanted Seven', hero: 1, slant: 0.024,
    panels: [
      { x: 0.012, y: 0.088, w: 0.296, h: 0.342 },
      { x: 0.312, y: 0.088, w: 0.376, h: 0.342 },
      { x: 0.692, y: 0.088, w: 0.296, h: 0.342 },
      { x: 0.012, y: 0.434, w: 0.242, h: 0.356 },
      { x: 0.258, y: 0.434, w: 0.242, h: 0.356 },
      { x: 0.504, y: 0.434, w: 0.242, h: 0.356 },
      { x: 0.750, y: 0.434, w: 0.238, h: 0.356 },
    ],
  },
  {
    name: 'Spotlight Five', hero: 0, slant: 0,
    panels: [
      { x: 0.012, y: 0.088, w: 0.452, h: 0.702 },
      { x: 0.468, y: 0.088, w: 0.258, h: 0.347 },
      { x: 0.730, y: 0.088, w: 0.258, h: 0.347 },
      { x: 0.468, y: 0.439, w: 0.258, h: 0.351 },
      { x: 0.730, y: 0.439, w: 0.258, h: 0.351 },
    ],
  },
  {
    name: 'Seven Strip', hero: 5, slant: 0,
    panels: [
      { x: 0.012, y: 0.088, w: 0.242, h: 0.298 },
      { x: 0.258, y: 0.088, w: 0.242, h: 0.298 },
      { x: 0.504, y: 0.088, w: 0.242, h: 0.298 },
      { x: 0.750, y: 0.088, w: 0.238, h: 0.298 },
      { x: 0.012, y: 0.390, w: 0.296, h: 0.400 },
      { x: 0.312, y: 0.390, w: 0.376, h: 0.400 },
      { x: 0.692, y: 0.088 + 0.302, w: 0.296, h: 0.400 },
    ],
  },
  {
    name: 'Neon Six', hero: 0, slant: 0,
    panels: [
      { x: 0.200, y: 0.088, w: 0.600, h: 0.398 },
      { x: 0.012, y: 0.490, w: 0.192, h: 0.300 },
      { x: 0.208, y: 0.490, w: 0.192, h: 0.300 },
      { x: 0.404, y: 0.490, w: 0.192, h: 0.300 },
      { x: 0.600, y: 0.490, w: 0.192, h: 0.300 },
      { x: 0.796, y: 0.490, w: 0.192, h: 0.300 },
    ],
  },
];

export const GRADES = [
  { name: 'Golden Hour', filter: 'saturate(1.28) contrast(1.08) sepia(0.18)', tint: '#ff8c42', alpha: 0.10 },
  { name: 'Neon Nights', filter: 'saturate(1.42) contrast(1.12) hue-rotate(-12deg)', tint: '#ff2e88', alpha: 0.12 },
  { name: 'Vice Purple', filter: 'saturate(1.30) contrast(1.05) hue-rotate(18deg)', tint: '#7b2ff7', alpha: 0.14 },
  { name: 'Teal Heat', filter: 'saturate(1.20) contrast(1.10) sepia(0.10)', tint: '#00c2a8', alpha: 0.08 },
  { name: 'Sunset Strip', filter: 'saturate(1.50) contrast(1.15) sepia(0.28)', tint: '#ff6a00', alpha: 0.12 },
  { name: 'Noir Pink', filter: 'saturate(0.90) contrast(1.20) brightness(0.95)', tint: '#1a0b2e', alpha: 0.18 },
];

export const CAPTIONS = [
  {
    title: 'PALM FEVER', script: 'one last summer',
    tagline: 'FIVE FRIENDS \u00b7 ONE COAST \u00b7 NO WAY BACK',
    quote: '\u201cPURE GOLDEN-HOUR MAYHEM\u201d', source: 'THE HARBOR GAZETTE',
  },
  {
    title: 'HEATWAVE', script: 'Coastline Nights',
    tagline: 'ONE COASTLINE \u00b7 SIX STORIES \u00b7 NO CURFEW',
    quote: '\u201cHOTTER THAN THE ASPHALT\u201d', source: 'THE PALM GAZETTE',
  },
  {
    title: 'HIGH TIDE HUSTLE', script: 'After the Tide',
    tagline: 'THE COAST IS NEVER CLEAR',
    quote: '\u201cA SUN-SOAKED THRILL RIDE.\u201d', source: 'THE BAYSIDE BUGLE',
  },
  {
    title: 'NEON HARBOR', script: 'Salt & Sirens',
    tagline: 'SEVEN LIVES \u00b7 ONE HARBOR \u00b7 NO WAY BACK',
    quote: '\u201cNEON SOAKED AND DANGEROUS\u201d', source: 'THE VICE LEDGER',
  },
  {
    title: 'SUNSET HEIST', script: 'Ocean Avenue',
    tagline: 'ONE LAST SUMMER JOB',
    quote: '\u201cTHE GETAWAY OF THE YEAR\u201d', source: 'THE COAST POST',
  },
  {
    title: 'CORAL HEAT', script: 'salt, sun & sirens',
    tagline: 'SIX LIVES \u00b7 ONE SUNSET \u00b7 NO TOMORROW',
    quote: '\u201cA FEVER DREAM IN NEON\u201d', source: 'THE SUNSET TIMES',
  },
];

export const LOCATION_CHIP = 'CORAL CAUSEWAY \u00b7 7:15 PM';
export const CATALOG = 'HW-0826';
export const STARBURST_TEXT = 'HOT SUMMER \u201925';

export function defaultState() {
  return {
    layout: 0,
    grade: 0,
    caption: 0,
    title: CAPTIONS[0].title,
    script: CAPTIONS[0].script,
    tagline: CAPTIONS[0].tagline,
    quote: CAPTIONS[0].quote,
    quoteSource: CAPTIONS[0].source,
    aspect: 'square', // square | portrait | wide | story
    panels: defaultPanels(0),
    selected: 1,
  };
}

// Photo assignment: the hero panel always gets hero.jpg, the rest cycle the
// remaining samples in order, so every layout shows a full cast.
export function defaultPanels(layoutIndex) {
  const layout = LAYOUTS[layoutIndex];
  const rest = ['insider.jpg', 'boss.jpg', 'driver.jpg', 'rider.jpg', 'courier.jpg', 'boat.jpg', 'bike.jpg'];
  const restRoles = ROLES.slice(1);
  let k = 0, r = 0;
  return layout.panels.map((_, i) => {
    let photo, role;
    if (i === layout.hero) { photo = 'hero.jpg'; role = ROLES[0]; }
    else { photo = rest[k++ % rest.length]; role = restRoles[r++ % restRoles.length]; }
    return { photo, zoom: 1, dx: 0, dy: 0, role: role.role, sub: role.sub };
  });
}

export function applyCaptionPreset(state, index) {
  const c = CAPTIONS[index];
  state.caption = index;
  state.title = c.title;
  state.script = c.script;
  state.tagline = c.tagline;
  state.quote = c.quote;
  state.quoteSource = c.source;
}

function panelPath(ctx, W, H, r, slant) {
  const x = r.x * W, y = r.y * H, w = r.w * W, h = r.h * H;
  const s = slant * W;
  ctx.beginPath();
  ctx.moveTo(x + s, y);
  ctx.lineTo(x + w + s, y);
  ctx.lineTo(x + w - s, y + h);
  ctx.lineTo(x - s, y + h);
  ctx.closePath();
}

function drawPanelImage(ctx, W, H, r, img, panel, grade, slant) {
  const x = r.x * W, y = r.y * H, w = r.w * W, h = r.h * H;
  ctx.save();
  panelPath(ctx, W, H, r, slant);
  ctx.clip();
  if (img) {
    const base = Math.max(w / img.width, h / img.height);
    const scale = base * (panel.zoom || 1);
    const dw = img.width * scale, dh = img.height * scale;
    const dx = x + (w - dw) / 2 + (panel.dx || 0) * w;
    const dy = y + (h - dh) / 2 + (panel.dy || 0) * h;
    ctx.filter = grade.filter;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.filter = 'none';
  } else {
    ctx.fillStyle = '#2a1245';
    ctx.fillRect(x, y, w, h);
  }
  // Warm grade tint + vignette so every photo sits in the same sunset world.
  ctx.globalAlpha = grade.alpha;
  ctx.fillStyle = grade.tint;
  ctx.fillRect(x, y, w, h);
  ctx.globalAlpha = 1;
  const vg = ctx.createRadialGradient(x + w / 2, y + h / 2, Math.min(w, h) * 0.35, x + w / 2, y + h / 2, Math.max(w, h) * 0.75);
  vg.addColorStop(0, 'rgba(26,11,46,0)');
  vg.addColorStop(1, 'rgba(26,11,46,0.38)');
  ctx.fillStyle = vg;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

function drawRoleLabel(ctx, W, H, r, panel, slant) {
  const x = r.x * W, y = r.y * H, w = r.w * W, h = r.h * H;
  const s = slant * W;
  const u = H / 1080; // unit scale
  const fs = Math.max(13 * u, H * 0.020);
  ctx.save();
  ctx.font = `700 ${fs}px Anton, sans-serif`;
  const tw = ctx.measureText(panel.role).width;
  const pad = 10 * u;
  const bw = tw + pad * 2 + 6 * u;
  const bh = fs * 1.55;
  const bx = x + 8 * u - s * 0.4;
  const by = y + h - bh - 8 * u;
  ctx.fillStyle = 'rgba(10,4,20,0.92)';
  ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = '#ff2e88';
  ctx.fillRect(bx, by, 6 * u, bh);
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(panel.role, bx + 6 * u + pad, by + bh / 2 + 1 * u);
  // Second line: location + time + quip, top-4 style.
  const fs2 = Math.max(10 * u, H * 0.0125);
  ctx.font = `700 ${fs2}px Anton, sans-serif`;
  const sw = ctx.measureText(panel.sub).width;
  const maxW = w - 16 * u;
  const shown = sw > maxW ? panel.sub.slice(0, Math.max(8, Math.floor(panel.sub.length * maxW / sw) - 1)) + '\u2026' : panel.sub;
  const sw2 = ctx.measureText(shown).width;
  ctx.fillStyle = 'rgba(10,4,20,0.78)';
  ctx.fillRect(bx, by - fs2 * 1.7 - 2 * u, sw2 + pad * 2, fs2 * 1.7);
  ctx.fillStyle = '#ffd166';
  ctx.fillText(shown, bx + pad, by - fs2 * 0.85 - 2 * u);
  ctx.restore();
}

function drawStarburst(ctx, cx, cy, r, points, fill, stroke) {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? r : r * 0.62;
    const a = (Math.PI * i) / points - Math.PI / 2;
    const px = cx + Math.cos(a) * rad;
    const py = cy + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = Math.max(2, r * 0.05);
  ctx.strokeStyle = stroke;
  ctx.stroke();
  ctx.restore();
}

function drawPalm(ctx, x, y, s, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(1.5, s * 0.07);
  ctx.lineCap = 'round';
  // Trunk, leaning slightly.
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + s * 0.08, y - s * 0.55, x + s * 0.16, y - s * 0.95);
  ctx.stroke();
  const tx = x + s * 0.16, ty = y - s * 0.95;
  // Fronds: five drooping arcs.
  for (let i = 0; i < 5; i++) {
    const a = (-Math.PI * (0.15 + i * 0.175));
    const ex = tx + Math.cos(a) * s * 0.62;
    const ey = ty + Math.sin(a) * s * 0.62 + s * 0.30;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx + Math.cos(a) * s * 0.34, ty + Math.sin(a) * s * 0.30 - s * 0.08, ex, ey);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(tx - s * 0.03, ty + s * 0.03, s * 0.045, 0, Math.PI * 2);
  ctx.arc(tx + s * 0.05, ty + s * 0.05, s * 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBarcode(ctx, x, y, w, h, seedText) {
  let seed = 0;
  for (const ch of seedText) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const next = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  ctx.fillStyle = '#111111';
  let px = x;
  while (px < x + w - 2) {
    const bw = 1 + Math.floor(next() * 4);
    if (next() > 0.42) ctx.fillRect(px, y, bw, h);
    px += bw + 1 + Math.floor(next() * 3);
  }
  ctx.restore();
}

// The huge striped title: gradient fill + retro stripes + dark outline.
// Drawn on an offscreen canvas so the stripes clip to the letters exactly.
// Narrow frames get a two-line title so the letters stay poster-tall.
function drawTitle(ctx, W, H, title) {
  const u = H / 1080;
  const targetW = W * 0.88;
  const measure = (text, px) => {
    const t = document.createElement('canvas').getContext('2d');
    t.font = `${px}px Anton, sans-serif`;
    return t.measureText(text).width;
  };
  const fitPx = (text, cap) => {
    let px = cap;
    const w = measure(text, px);
    if (w > targetW) px *= targetW / w;
    return px;
  };
  let lines = [{ text: title, px: fitPx(title, H * 0.335) }];
  // Single-line glyphs shorter than 13% of frame height look polite, not
  // poster-like: split into two balanced lines instead.
  if (0.72 * lines[0].px < H * 0.13) {
    const words = title.split(' ');
    if (words.length >= 2) {
      let best = null;
      for (let i = 1; i < words.length; i++) {
        const a = words.slice(0, i).join(' ');
        const b = words.slice(i).join(' ');
        const pxA = fitPx(a, H * 0.19), pxB = fitPx(b, H * 0.19);
        const px = Math.min(pxA, pxB);
        const score = Math.abs(measure(a, px) - measure(b, px));
        if (!best || score < best.score) best = { a, b, px, score };
      }
      if (best) lines = [{ text: best.a, px: best.px }, { text: best.b, px: best.px }];
    }
  }
  const gap = lines.length > 1 ? lines[0].px * 0.06 : 0;
  const offH = lines.reduce((s, l) => s + l.px * 1.08, 0) + gap;
  const off = document.createElement('canvas');
  off.width = Math.ceil(W);
  off.height = Math.ceil(offH);
  const o = off.getContext('2d');
  o.textAlign = 'center';
  o.textBaseline = 'middle';
  o.lineJoin = 'round';
  let y = 0;
  for (const line of lines) {
    const cy = y + line.px * 0.54;
    o.font = `${line.px}px Anton, sans-serif`;
    const grad = o.createLinearGradient(0, cy - line.px * 0.5, 0, cy + line.px * 0.5);
    grad.addColorStop(0.0, '#fff7cc');
    grad.addColorStop(0.35, '#ffd166');
    grad.addColorStop(0.55, '#ff8c42');
    grad.addColorStop(0.78, '#ff2e88');
    grad.addColorStop(1.0, '#7b2ff7');
    o.lineWidth = line.px * 0.075;
    o.strokeStyle = '#1a0b2e';
    o.strokeText(line.text, W / 2, cy);
    o.fillStyle = grad;
    o.fillText(line.text, W / 2, cy);
    // Retro horizontal stripes cut through the letters.
    o.globalCompositeOperation = 'source-atop';
    const stripeH = line.px * 0.07;
    for (let i = 0; i < 4; i++) {
      const sy = cy - line.px * 0.34 + i * line.px * 0.19;
      o.fillStyle = i % 2 === 0 ? 'rgba(123,47,247,0.42)' : 'rgba(255,46,136,0.32)';
      o.fillRect(0, sy, W, stripeH);
    }
    o.globalCompositeOperation = 'source-over';
    y += line.px * 1.08 + gap;
  }
  // White sparkle glints on the title.
  const px0 = lines[0].px;
  o.fillStyle = 'rgba(255,255,255,0.9)';
  const glints = [[0.16, 0.30], [0.42, 0.72], [0.78, 0.24]];
  for (const [gx, gy] of glints) {
    const g = px0 * 0.05;
    o.beginPath();
    o.moveTo(W * gx, off.height * gy - g);
    o.lineTo(W * gx + g * 0.28, off.height * gy - g * 0.28);
    o.lineTo(W * gx + g, off.height * gy);
    o.lineTo(W * gx + g * 0.28, off.height * gy + g * 0.28);
    o.lineTo(W * gx, off.height * gy + g);
    o.lineTo(W * gx - g * 0.28, off.height * gy + g * 0.28);
    o.lineTo(W * gx - g, off.height * gy);
    o.lineTo(W * gx - g * 0.28, off.height * gy - g * 0.28);
    o.closePath();
    o.fill();
  }
  ctx.save();
  ctx.shadowColor = 'rgba(10,2,24,0.75)';
  ctx.shadowBlur = 18 * u;
  ctx.shadowOffsetY = 10 * u;
  const titleBottom = H * 0.79;
  const titleTop = titleBottom - offH;
  ctx.drawImage(off, 0, titleTop, W, offH);
  ctx.restore();
  return { px: px0, titleTop, titleBottom, scriptY: titleBottom - H * 0.015 };
}

export function drawCover(ctx, W, H, state, images) {
  const layout = LAYOUTS[state.layout];
  const grade = GRADES[state.grade];
  const u = H / 1080;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#1a0b2e';
  ctx.fillRect(0, 0, W, H);

  // ---- Panels (hero drawn last so its pop-out overlaps neighbours) ----
  const order = layout.panels.map((_, i) => i).filter((i) => i !== layout.hero);
  order.push(layout.hero);
  for (const i of order) {
    const r = layout.panels[i];
    const panel = state.panels[i];
    const img = images[panel.photo];
    const isHero = i === layout.hero;
    if (isHero) {
      // Pop-out: the hero frame breaks upward out of its grid cell, with a
      // thick white halo and a drop shadow — stronger than top 10's version.
      const hr = { x: r.x, y: r.y - 0.022, w: r.w, h: r.h + 0.022 };
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 22 * u;
      ctx.shadowOffsetY = 8 * u;
      panelPath(ctx, W, H, hr, layout.slant);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
      drawPanelImage(ctx, W, H, { x: hr.x + 0.004, y: hr.y + 0.004, w: hr.w - 0.008, h: hr.h - 0.008 }, img, panel, grade, layout.slant);
      ctx.save();
      panelPath(ctx, W, H, hr, layout.slant);
      ctx.lineWidth = 5 * u;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.restore();
      drawRoleLabel(ctx, W, H, hr, panel, layout.slant);
    } else {
      drawPanelImage(ctx, W, H, r, img, panel, grade, layout.slant);
      ctx.save();
      panelPath(ctx, W, H, r, layout.slant);
      ctx.lineWidth = 3 * u;
      ctx.strokeStyle = '#ffd166';
      ctx.stroke();
      ctx.restore();
      drawRoleLabel(ctx, W, H, r, panel, layout.slant);
    }
  }

  // ---- Top bar: stars + press quote + VOL. 1 badge ----
  const barH = H * 0.075;
  ctx.fillStyle = '#160826';
  ctx.fillRect(0, 0, W, barH);
  ctx.fillStyle = '#ffd166';
  const starY = barH * 0.52;
  let sx = W * 0.02;
  for (let i = 0; i < 5; i++) {
    drawStar(ctx, sx, starY, barH * 0.26);
    sx += barH * 0.62;
  }
  ctx.font = `700 ${Math.max(13 * u, H * 0.018)}px Anton, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffe9a8';
  ctx.fillText(`${state.quote}  \u2014  ${state.quoteSource}`, W * 0.5, starY);
  // VOL. 1 badge.
  const badge = 'VOL. 1';
  ctx.font = `700 ${Math.max(13 * u, H * 0.02)}px Anton, sans-serif`;
  const bw = ctx.measureText(badge).width + 22 * u;
  ctx.fillStyle = '#ffd166';
  ctx.fillRect(W - bw - W * 0.012, barH * 0.16, bw, barH * 0.68);
  ctx.fillStyle = '#1a0b2e';
  ctx.fillText(badge, W - bw / 2 - W * 0.012, starY);

  // ---- Location chip pinned over the top-right panel ----
  ctx.save();
  ctx.translate(W * 0.615, H * 0.105);
  ctx.rotate(-0.03);
  ctx.font = `700 ${Math.max(12 * u, H * 0.017)}px Anton, sans-serif`;
  const cw = ctx.measureText(LOCATION_CHIP).width + 26 * u;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-cw / 2, -H * 0.016, cw, H * 0.032);
  ctx.fillStyle = '#1a0b2e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(LOCATION_CHIP, 0, H * 0.001);
  ctx.restore();

  // ---- Starburst seal bursting out of a panel junction ----
  // Pinned to the hero panel's left edge, high in the panel area, so the
  // huge title (drawn later) never swallows it.
  const heroRect = layout.panels[layout.hero];
  const sbR = H * 0.060;
  const sbX = Math.min(Math.max(heroRect.x * W, sbR * 0.95), W - sbR), sbY = H * 0.16;
  ctx.save();
  ctx.translate(sbX, sbY);
  ctx.rotate(-0.21);
  drawStarburst(ctx, 0, 0, sbR, 14, '#ffd166', '#1a0b2e');
  ctx.fillStyle = '#1a0b2e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fitBurst = (text, startPx, maxW) => {
    let px = startPx;
    ctx.font = `700 ${px}px Anton, sans-serif`;
    const w = ctx.measureText(text).width;
    if (w > maxW) px *= maxW / w;
    return px;
  };
  ctx.font = `700 ${fitBurst('HOT', sbR * 0.42, sbR * 1.1)}px Anton, sans-serif`;
  ctx.fillText('HOT', 0, -sbR * 0.22);
  ctx.font = `700 ${fitBurst("SUMMER '25", sbR * 0.30, sbR * 1.15)}px Anton, sans-serif`;
  ctx.fillText("SUMMER '25", 0, sbR * 0.22);
  ctx.restore();

  // ---- Huge striped title overlapping the panels ----
  const titleBox = drawTitle(ctx, W, H, state.title);

  // ---- Neon script subtitle overlapping the title's bottom edge ----
  ctx.save();
  ctx.translate(W * 0.62, titleBox.scriptY);
  ctx.rotate(-0.06);
  ctx.font = `${H * 0.068}px Pacifico, cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#ff2e88';
  ctx.shadowBlur = 16 * u;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(state.script, 0, 0);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ff5fa2';
  ctx.fillText(state.script, 0, 0);
  ctx.restore();

  // ---- Palm-silhouette strip + tagline band ----
  const stripY = H * 0.800, stripH = H * 0.062;
  const sg = ctx.createLinearGradient(0, stripY, 0, stripY + stripH);
  sg.addColorStop(0, '#ff8c42');
  sg.addColorStop(0.55, '#ff2e88');
  sg.addColorStop(1, '#7b2ff7');
  ctx.fillStyle = sg;
  ctx.fillRect(0, stripY, W, stripH);
  // Palm silhouettes along the strip.
  const palmColor = 'rgba(26,11,46,0.85)';
  for (let i = 0; i < 7; i++) {
    const pxp = W * (0.03 + i * 0.155);
    drawPalm(ctx, pxp, stripY + stripH * 0.92, stripH * 0.85, palmColor);
  }
  // Sun disc behind the tagline centre.
  ctx.save();
  ctx.fillStyle = '#ffd166';
  ctx.beginPath();
  ctx.arc(W * 0.5, stripY + stripH / 2, stripH * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.font = `700 ${Math.max(14 * u, H * 0.021)}px Anton, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(26,11,46,0.8)';
  ctx.shadowBlur = 6 * u;
  ctx.fillText(state.tagline, W * 0.5, stripY + stripH / 2);
  ctx.shadowBlur = 0;

  // ---- Footer: COMING SOON + credits + catalogue + barcode ----
  const footY = H * 0.862;
  ctx.fillStyle = '#12081f';
  ctx.fillRect(0, footY, W, H - footY);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ff5fa2';
  ctx.font = `700 ${Math.max(14 * u, H * 0.022)}px Anton, sans-serif`;
  ctx.fillText('COMING SOON', W * 0.02, footY + (H - footY) * 0.42);
  ctx.fillStyle = '#ffe9a8';
  ctx.font = `400 ${Math.max(11 * u, H * 0.0145)}px Anton, sans-serif`;
  ctx.textAlign = 'center';
  const credits = W / H < 0.9
    ? 'A SUNSET PICTURES PRODUCTION  \u00b7  STARRING YOU'
    : 'A SUNSET PICTURES PRODUCTION  \u00b7  STARRING YOU  \u00b7  SHOT ON YOUR OWN CAMERA  \u00b7  GRADED BY HAND';
  ctx.fillText(credits, W * 0.5, footY + (H - footY) * 0.42);
  // Catalogue number + barcode, bottom-right.
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffd166';
  ctx.font = `700 ${Math.max(11 * u, H * 0.015)}px Anton, sans-serif`;
  ctx.fillText(`CAT. ${CATALOG}`, W * 0.985, footY + (H - footY) * 0.22);
  drawBarcode(ctx, W * 0.915, footY + (H - footY) * 0.42, W * 0.07, (H - footY) * 0.42, CATALOG);
  // HW corner mark, bottom-left of the frame edge.
  ctx.fillStyle = 'rgba(255,209,102,0.9)';
  ctx.font = `700 ${Math.max(11 * u, H * 0.015)}px Anton, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText('HW', W * 0.008, footY + (H - footY) * 0.82);
}

function drawStar(ctx, cx, cy, r) {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI * i) / 5 - Math.PI / 2;
    const px = cx + Math.cos(a) * rad;
    const py = cy + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Render a cover at any pixel size; returns the canvas.
export function renderCover(W, H, state, images) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  drawCover(canvas.getContext('2d'), W, H, state, images);
  return canvas;
}

export const ASPECTS = {
  square: { name: 'Square 1080 \u00d7 1080', w: 1080, h: 1080 },
  portrait: { name: 'Portrait 1080 \u00d7 1350', w: 1080, h: 1350 },
  wide: { name: 'Wide 1920 \u00d7 1080', w: 1920, h: 1080 },
  story: { name: 'Story 1080 \u00d7 1920', w: 1080, h: 1920 },
};
