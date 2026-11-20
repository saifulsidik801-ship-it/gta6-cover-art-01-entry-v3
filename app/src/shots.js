// shots.js — deterministic screenshot recipes for the entry's screenshots/.
// ?shot=cover renders the cover full-bleed (the window size is the shot size);
// ?shot=editor renders the normal editor with a photo loaded. The other query
// params pick layout / grade / caption / aspect so every shot is reproducible.

import { LAYOUTS, GRADES, CAPTIONS, ASPECTS, applyCaptionPreset, defaultPanels } from './cover.js';

export const SHOTS = [
  { name: '1-cover.jpg', query: '?shot=cover&aspect=wide&layout=0&grade=0&caption=0', w: 1280, h: 720 },
  { name: '2-editor.jpg', query: '?shot=editor&aspect=square&layout=0&grade=0&caption=0', w: 1280, h: 720 },
  { name: '3-cover.jpg', query: '?shot=cover&aspect=square&layout=2&grade=1&caption=2', w: 1080, h: 1080 },
  { name: '4-cover.jpg', query: '?shot=cover&aspect=portrait&layout=4&grade=4&caption=4', w: 1024, h: 1280 },
];

export function applyShotParams(state, params, hooks) {
  const layout = Number(params.get('layout') ?? state.layout);
  if (Number.isInteger(layout) && layout >= 0 && layout < LAYOUTS.length && layout !== state.layout) {
    state.layout = layout;
    state.panels = defaultPanels(layout);
    state.selected = LAYOUTS[layout].hero;
  }
  const grade = Number(params.get('grade') ?? state.grade);
  if (Number.isInteger(grade) && grade >= 0 && grade < GRADES.length) state.grade = grade;
  const caption = Number(params.get('caption') ?? state.caption);
  if (Number.isInteger(caption) && caption >= 0 && caption < CAPTIONS.length) {
    applyCaptionPreset(state, caption);
  }
  const title = params.get('title');
  if (title) state.title = title.toUpperCase();
  const aspect = params.get('aspect');
  if (aspect && ASPECTS[aspect]) state.aspect = aspect;
  const photo = params.get('photo');
  if (photo) {
    const heroIdx = LAYOUTS[state.layout].hero;
    state.panels[heroIdx].photo = photo;
  }
  if (hooks?.syncCaptionFields) hooks.syncCaptionFields();
  if (hooks?.renderPreview) hooks.renderPreview();
}
