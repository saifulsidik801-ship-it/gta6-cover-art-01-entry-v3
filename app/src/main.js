// main.js — Vice Cover Studio editor: photo → cover → PNG in a few clicks.
// Loads the 8 bundled sample photos, lets the user drop in their own photos,
// drag to pan and scroll to zoom each panel, pick from 8 layouts x 6 grades x
// 6 caption presets, shuffle everything with one click, and export PNGs at
// 1080x1080 / 1080x1350 / 1920x1080 / 1080x1920. Photos never leave the machine.

import {
  SAMPLE_PHOTOS, ROLES, LAYOUTS, GRADES, CAPTIONS, ASPECTS,
  defaultState, defaultPanels, applyCaptionPreset, drawCover,
} from './cover.js';
import { SHOTS, applyShotParams } from './shots.js';

const state = defaultState();
const images = {}; // photo name -> HTMLImageElement
let previewCanvas = null;
let previewCtx = null;
let dragging = null;
let lastPointer = null;

const $ = (id) => document.getElementById(id);

async function loadFonts() {
  const faces = [
    new FontFace('Anton', 'url(fonts/Anton-Regular.ttf)', { weight: '400' }),
    new FontFace('Pacifico', 'url(fonts/Pacifico-Regular.ttf)', { weight: '400' }),
  ];
  for (const face of faces) {
    try {
      const loaded = await face.load();
      document.fonts.add(loaded);
    } catch (err) {
      console.warn('font failed to load:', face.family, err);
    }
  }
  await document.fonts.ready;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function loadSamples() {
  await Promise.all(SAMPLE_PHOTOS.map(async (name) => {
    try { images[name] = await loadImage(`samples/${name}`); } catch (e) { console.warn('sample missing:', name); }
  }));
}

function aspectSize() {
  return ASPECTS[state.aspect];
}

function renderPreview() {
  if (!previewCanvas) return;
  const { w, h } = aspectSize();
  const scale = Math.min(1, 1080 / Math.max(w, h));
  previewCanvas.width = Math.round(w * scale);
  previewCanvas.height = Math.round(h * scale);
  drawCover(previewCtx, previewCanvas.width, previewCanvas.height, state, images);
  updatePanelInspector();
}

function currentLayout() {
  return LAYOUTS[state.layout];
}

function panelRects() {
  const { w, h } = aspectSize();
  const scale = Math.min(1, 1080 / Math.max(w, h));
  return currentLayout().panels.map((r) => ({
    x: r.x * previewCanvas.width,
    y: r.y * previewCanvas.height,
    w: r.w * previewCanvas.width,
    h: r.h * previewCanvas.height,
  }));
}

function pickPanel(clientX, clientY) {
  const rect = previewCanvas.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * previewCanvas.width;
  const y = ((clientY - rect.top) / rect.height) * previewCanvas.height;
  const rects = panelRects();
  for (let i = rects.length - 1; i >= 0; i--) {
    const r = rects[i];
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return i;
  }
  return -1;
}

function updatePanelInspector() {
  const i = state.selected;
  const layout = currentLayout();
  if (i < 0 || i >= layout.panels.length) return;
  const panel = state.panels[i];
  $('panel-name').textContent = `Panel ${i + 1} — ${panel.role}`;
  $('panel-photo').value = panel.photo;
  $('panel-zoom').value = panel.zoom;
  $('panel-zoom-val').textContent = `${Math.round(panel.zoom * 100)}%`;
  document.querySelectorAll('.panel-chip').forEach((chip) => {
    chip.classList.toggle('active', Number(chip.dataset.panel) === i);
  });
}

function buildPickers() {
  // Layout picker: 8 named buttons.
  const layoutBox = $('layout-picker');
  LAYOUTS.forEach((layout, i) => {
    const b = document.createElement('button');
    b.className = 'pick' + (i === state.layout ? ' active' : '');
    b.textContent = layout.name;
    b.onclick = () => {
      state.layout = i;
      state.panels = defaultPanels(i);
      state.selected = layout.hero;
      document.querySelectorAll('#layout-picker .pick').forEach((el, j) => el.classList.toggle('active', j === i));
      renderPreview();
    };
    layoutBox.appendChild(b);
  });
  // Grade picker: 6 swatches.
  const gradeBox = $('grade-picker');
  GRADES.forEach((grade, i) => {
    const b = document.createElement('button');
    b.className = 'pick grade' + (i === state.grade ? ' active' : '');
    b.innerHTML = `<span class="swatch" style="background:linear-gradient(135deg,${grade.tint},#7b2ff7)"></span>${grade.name}`;
    b.onclick = () => {
      state.grade = i;
      document.querySelectorAll('#grade-picker .pick').forEach((el, j) => el.classList.toggle('active', j === i));
      renderPreview();
    };
    gradeBox.appendChild(b);
  });
  // Caption picker: 6 presets.
  const capBox = $('caption-picker');
  CAPTIONS.forEach((cap, i) => {
    const b = document.createElement('button');
    b.className = 'pick' + (i === state.caption ? ' active' : '');
    b.innerHTML = `<strong>${cap.title}</strong><span>${cap.script}</span>`;
    b.onclick = () => {
      applyCaptionPreset(state, i);
      syncCaptionFields();
      document.querySelectorAll('#caption-picker .pick').forEach((el, j) => el.classList.toggle('active', j === i));
      renderPreview();
    };
    capBox.appendChild(b);
  });
  // Aspect picker.
  const aspectBox = $('aspect-picker');
  Object.entries(ASPECTS).forEach(([key, a]) => {
    const b = document.createElement('button');
    b.className = 'pick' + (key === state.aspect ? ' active' : '');
    b.textContent = a.name;
    b.onclick = () => {
      state.aspect = key;
      document.querySelectorAll('#aspect-picker .pick').forEach((el) => el.classList.remove('active'));
      b.classList.add('active');
      renderPreview();
    };
    aspectBox.appendChild(b);
  });
  // Sample photo strip.
  const strip = $('sample-strip');
  SAMPLE_PHOTOS.forEach((name) => {
    const img = document.createElement('img');
    img.src = `samples/${name}`;
    img.alt = name;
    img.title = name;
    img.onclick = () => {
      const panel = state.panels[state.selected];
      panel.photo = name;
      panel.zoom = 1; panel.dx = 0; panel.dy = 0;
      renderPreview();
    };
    strip.appendChild(img);
  });
  // Panel chips (one per panel in the current layout).
  const chips = $('panel-chips');
  const rebuildChips = () => {
    chips.innerHTML = '';
    currentLayout().panels.forEach((_, i) => {
      const c = document.createElement('button');
      c.className = 'panel-chip' + (i === state.selected ? ' active' : '');
      c.dataset.panel = i;
      c.textContent = state.panels[i].role;
      c.onclick = () => { state.selected = i; renderPreview(); };
      chips.appendChild(c);
    });
  };
  state._rebuildChips = rebuildChips;
  rebuildChips();
}

function syncCaptionFields() {
  $('field-title').value = state.title;
  $('field-script').value = state.script;
  $('field-tagline').value = state.tagline;
  $('field-quote').value = state.quote;
}

function bindControls() {
  $('field-title').addEventListener('input', (e) => { state.title = e.target.value.toUpperCase(); renderPreview(); });
  $('field-script').addEventListener('input', (e) => { state.script = e.target.value; renderPreview(); });
  $('field-tagline').addEventListener('input', (e) => { state.tagline = e.target.value.toUpperCase(); renderPreview(); });
  $('field-quote').addEventListener('input', (e) => { state.quote = e.target.value; renderPreview(); });

  $('panel-photo').addEventListener('change', (e) => {
    const panel = state.panels[state.selected];
    panel.photo = e.target.value;
    panel.zoom = 1; panel.dx = 0; panel.dy = 0;
    renderPreview();
  });
  $('panel-zoom').addEventListener('input', (e) => {
    state.panels[state.selected].zoom = Number(e.target.value);
    renderPreview();
  });
  $('panel-centre').onclick = () => {
    const p = state.panels[state.selected];
    p.zoom = 1; p.dx = 0; p.dy = 0;
    renderPreview();
  };
  $('panel-role').addEventListener('change', (e) => {
    const p = state.panels[state.selected];
    const r = ROLES[Number(e.target.value)];
    p.role = r.role; p.sub = r.sub;
    renderPreview();
  });

  $('btn-shuffle').onclick = () => {
    state.layout = Math.floor(Math.random() * LAYOUTS.length);
    state.grade = Math.floor(Math.random() * GRADES.length);
    applyCaptionPreset(state, Math.floor(Math.random() * CAPTIONS.length));
    state.panels = defaultPanels(state.layout);
    // Shuffle photo assignment too.
    const pool = [...SAMPLE_PHOTOS];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const heroIdx = currentLayout().hero;
    state.panels.forEach((p, i) => { p.photo = i === heroIdx ? 'hero.jpg' : pool[i % pool.length]; });
    state.selected = heroIdx;
    syncCaptionFields();
    document.querySelectorAll('#layout-picker .pick').forEach((el, j) => el.classList.toggle('active', j === state.layout));
    document.querySelectorAll('#grade-picker .pick').forEach((el, j) => el.classList.toggle('active', j === state.grade));
    document.querySelectorAll('#caption-picker .pick').forEach((el, j) => el.classList.toggle('active', j === state.caption));
    state._rebuildChips();
    renderPreview();
  };

  document.querySelectorAll('[data-export]').forEach((btn) => {
    btn.onclick = () => exportPng(btn.dataset.export);
  });

  // Upload: photos stay on the machine, read as data URLs into memory only.
  const fileInput = $('file-upload');
  $('btn-upload').onclick = () => fileInput.click();
  fileInput.addEventListener('change', async () => {
    for (const file of fileInput.files) {
      if (!file.type.startsWith('image/')) continue;
      const name = `upload:${file.name}`;
      images[name] = await loadImage(URL.createObjectURL(file));
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = `Your photo — ${file.name}`;
      $('panel-photo').appendChild(opt);
      const panel = state.panels[state.selected];
      panel.photo = name;
      panel.zoom = 1; panel.dx = 0; panel.dy = 0;
    }
    fileInput.value = '';
    renderPreview();
  });

  // Drag to pan the selected panel, wheel to zoom it, click to select a panel.
  previewCanvas.addEventListener('pointerdown', (e) => {
    const i = pickPanel(e.clientX, e.clientY);
    if (i >= 0) {
      state.selected = i;
      dragging = i;
      lastPointer = { x: e.clientX, y: e.clientY };
      previewCanvas.setPointerCapture(e.pointerId);
      renderPreview();
    }
  });
  previewCanvas.addEventListener('pointermove', (e) => {
    if (dragging === null || !lastPointer) return;
    const rect = previewCanvas.getBoundingClientRect();
    const p = state.panels[dragging];
    p.dx += (e.clientX - lastPointer.x) / rect.width;
    p.dy += (e.clientY - lastPointer.y) / rect.height;
    lastPointer = { x: e.clientX, y: e.clientY };
    renderPreview();
  });
  previewCanvas.addEventListener('pointerup', () => { dragging = null; lastPointer = null; });
  previewCanvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const i = pickPanel(e.clientX, e.clientY);
    const idx = i >= 0 ? i : state.selected;
    const p = state.panels[idx];
    p.zoom = Math.min(3, Math.max(0.6, p.zoom * (e.deltaY < 0 ? 1.08 : 0.92)));
    renderPreview();
  }, { passive: false });
}

function exportPng(aspectKey) {
  const a = ASPECTS[aspectKey];
  const canvas = document.createElement('canvas');
  canvas.width = a.w;
  canvas.height = a.h;
  drawCover(canvas.getContext('2d'), a.w, a.h, state, images);
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vice-cover-${state.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${a.w}x${a.h}.png`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }, 'image/png');
}

function fillPhotoSelect() {
  const sel = $('panel-photo');
  SAMPLE_PHOTOS.forEach((name) => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name.replace('.jpg', '');
    sel.appendChild(opt);
  });
  const roleSel = $('panel-role');
  ROLES.forEach((r, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = r.role;
    roleSel.appendChild(opt);
  });
}

async function init() {
  previewCanvas = $('preview');
  previewCtx = previewCanvas.getContext('2d');
  const params = new URLSearchParams(location.search);
  const shot = params.get('shot');
  if (shot) {
    document.body.classList.add('shot-mode');
    document.body.dataset.shot = shot;
  }
  await loadFonts();
  await loadSamples();
  fillPhotoSelect();
  buildPickers();
  bindControls();
  syncCaptionFields();
  if (shot) applyShotParams(state, params, { renderPreview, syncCaptionFields });
  renderPreview();
  if (shot === 'cover') {
    // Full-bleed cover canvas for the screenshot: the window size IS the shot.
    const c = document.createElement('canvas');
    c.id = 'shot-canvas';
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    c.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;display:block;';
    document.body.appendChild(c);
    drawCover(c.getContext('2d'), c.width, c.height, state, images);
    document.title = 'ready';
  } else if (shot) {
    // Deterministic screenshots: render once more after fonts settle, then
    // signal readiness for the headless screenshot run.
    requestAnimationFrame(() => {
      renderPreview();
      document.title = 'ready';
    });
  }
}

init();
