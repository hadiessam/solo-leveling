/* =====================================================================
   SOLO LEVELING — ICON LIBRARY
   Hand-built SVG line icons. No emoji, no external requests.
   Every icon inherits currentColor so it takes the colour of its context.
   ===================================================================== */

const ICO_PATHS = {
  /* ---------- core shapes ---------- */
  dot:        '<circle cx="12" cy="12" r="3"/>',

  /* ---------- shadow stages (egg -> monarch) ---------- */
  egg:        '<path d="M12 3c3.3 0 6 5.4 6 9.5A6 6 0 0 1 6 12.5C6 8.4 8.7 3 12 3Z"/>',
  hatchling:  '<path d="M12 3c3.3 0 6 5.4 6 9.5a6 6 0 0 1-12 0C6 8.4 8.7 3 12 3Z"/><path d="M9.5 12h.01M14.5 12h.01M10 15.5c1.3.8 2.7.8 4 0"/>',
  young:      '<path d="M12 3c3.3 0 6 5.4 6 9.5a6 6 0 0 1-12 0C6 8.4 8.7 3 12 3Z"/><path d="M9.5 11.5h.01M14.5 11.5h.01"/><path d="M9 15c1.8 1.4 4.2 1.4 6 0"/><path d="M8 5.5 5 3M16 5.5 19 3"/>',
  warrior:    '<circle cx="12" cy="8" r="3.4"/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/><path d="M17.5 3.5 21 7l-4 1-1 4-3.5-3.5"/>',
  knight:     '<path d="M12 2.5 20 6v6c0 5-3.4 8.3-8 9.5-4.6-1.2-8-4.5-8-9.5V6l8-3.5Z"/><path d="M12 8v6M9 11h6"/>',
  monarch:    '<path d="M3 18h18l-1.5-9-4.5 4-3-6-3 6-4.5-4L3 18Z"/><path d="M4 20.5h16"/>',

  /* ---------- classes ---------- */
  sword:      '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/><path d="m19 21 2-2"/>',
  orb:        '<circle cx="12" cy="12" r="6.5"/><path d="M12 5.5v13M5.5 12h13"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>',
  heal:       '<path d="M12 20.5S4 15.8 4 10.3A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 8 2.3c0 5.5-8 10.2-8 10.2Z"/><path d="M12 11v4M10 13h4"/>',
  dagger:     '<path d="M12 2.5 14 9l-2 9-2-9 2-6.5Z"/><path d="M9 13h6M10.5 20.5h3"/>',
  shield:     '<path d="M12 2.5 20 6v6c0 5-3.4 8.3-8 9.5-4.6-1.2-8-4.5-8-9.5V6l8-3.5Z"/>',
  crown:      '<path d="M3 18h18l-1.5-9-4.5 4-3-6-3 6-4.5-4L3 18Z"/>',

  /* ---------- characters ---------- */
  ant:        '<ellipse cx="12" cy="16" rx="4" ry="5"/><circle cx="12" cy="8" r="3"/><path d="M9.5 5 7 2.5M14.5 5 17 2.5M8 16H4M16 16h4M9 12 5.5 9.5M15 12l3.5-2.5"/>',
  bear:       '<circle cx="12" cy="13" r="6.5"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="6.5" r="2.5"/><path d="M9.5 12h.01M14.5 12h.01M10 15.5c1.3.9 2.7.9 4 0"/>',
  wolf:       '<path d="M5 8 3 3l5 2h8l5-2-2 5v6c0 3.5-3.1 6.5-7 6.5S5 17.5 5 14V8Z"/><path d="M9.5 11h.01M14.5 11h.01M10 15l2 1.5 2-1.5"/>',
  dragon:     '<path d="M3 15c3-1 5-4 5-7l3 2 3-2c0 3 2 6 5 7"/><path d="M6 19c2-1.5 4-2 6-2s4 .5 6 2"/><path d="M12 6V2M10.5 9h.01M13.5 9h.01"/>',
  archer:     '<path d="M5 19 19 5"/><path d="M15 5h4v4"/><path d="M5 5v4h4"/><path d="M7 12a5 5 0 0 0 5 5"/>',
  beast:      '<path d="M6 9 4 4l4 1.5h8L20 4l-2 5v5c0 4-2.7 7-6 7s-6-3-6-7V9Z"/><path d="M9.5 12h.01M14.5 12h.01"/>',
  soldier:    '<circle cx="12" cy="7.5" r="3.2"/><path d="M5.5 21c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"/>',
  shaman:     '<circle cx="12" cy="7" r="3"/><path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M17 3v5M15 5.5h4"/>',
  king:       '<path d="M12 2.5 20 6v6c0 5-3.4 8.3-8 9.5-4.6-1.2-8-4.5-8-9.5V6l8-3.5Z"/><path d="M12 8v6M9 11h6"/>',
  marshal:    '<path d="M12 2.5 20 6v6c0 5-3.4 8.3-8 9.5-4.6-1.2-8-4.5-8-9.5V6l8-3.5Z"/><path d="m9 12 2 2 4-4"/>',

  /* ---------- loot ---------- */
  gold:       '<circle cx="8.5" cy="14.5" r="4.5"/><circle cx="15.5" cy="14.5" r="4.5"/><circle cx="12" cy="9.5" r="4.5"/>',
  potionHp:   '<path d="M10 3h4v5l4 6.5a4.5 4.5 0 0 1-3.8 6.8h-4.4A4.5 4.5 0 0 1 6 14.5L10 8V3Z"/><path d="M9 14h6"/>',
  potionMana: '<path d="M10 3h4v5l4 6.5a4.5 4.5 0 0 1-3.8 6.8h-4.4A4.5 4.5 0 0 1 6 14.5L10 8V3Z"/><circle cx="12" cy="15" r="1.8"/>',
  scroll:     '<path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 0 2 2H8a2 2 0 0 1-2-2V4Z"/><path d="M9 8h7M9 12h7M9 16h4"/>',
  gem:        '<path d="m12 2.5 7 6-7 13-7-13 7-6Z"/><path d="M5 8.5h14M12 2.5v19"/>',
  chest:      '<path d="M4 10h16v10H4z"/><path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4"/><path d="M12 10v4M10 12h4"/>',

  /* ---------- stats / domains ---------- */
  career:     '<path d="M3 8h18v11H3z"/><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
  skills:     '<path d="M14.5 4.5a4.5 4.5 0 0 0-5.6 6.3L3.5 16.2a1.8 1.8 0 0 0 2.5 2.5l5.4-5.4a4.5 4.5 0 0 0 6.3-5.6l-3 3-2.5-2.5 3-3Z"/>',
  money:      '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v10M14.5 9.5c0-1.4-1.1-2.5-2.5-2.5s-2.5 1.1-2.5 2.5S10.6 12 12 12s2.5 1.1 2.5 2.5S13.4 17 12 17s-2.5-1.1-2.5-2.5"/>',
  selfdev:    '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5Z"/>',
  health:     '<path d="M12 20.5S4 15.8 4 10.3A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 8 2.3c0 5.5-8 10.2-8 10.2Z"/>',
  relations:  '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.5a3.2 3.2 0 0 1 0 6M17.5 14.5A5.5 5.5 0 0 1 21 20"/>',
  discipline: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',

  /* ---------- vision board ---------- */
  flag:       '<path d="M6 21V3"/><path d="M6 4h11l-2 4 2 4H6"/>',
  building:   '<path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"/><path d="M15 10h3a2 2 0 0 1 2 2v9"/><path d="M3 21h18"/><path d="M9 7h2M9 11h2M9 15h2"/>',
  graduation: '<path d="M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z"/><path d="M6.5 11v5c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-5"/>',
  muscle:     '<path d="M4 14c0-3 2-5 4.5-5.5L11 6h4.5c2 0 3.5 1.6 3.5 3.5S17.5 13 15.5 13H13l-1.5 2.5"/><path d="M4 14v3.5A2.5 2.5 0 0 0 6.5 20h6"/>',
  globe:      '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.3-3.3-8.5S9.8 5.9 12 3.5Z"/>',

  /* ---------- badges & achievements ---------- */
  star:       '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/>',
  bolt:       '<path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z"/>',
  flame:      '<path d="M12 21c3.9 0 6.5-2.5 6.5-6 0-4.5-4-6-4-9.5 0 0-2.5 1-2.5 4 0 1.5-1 2-2 2s-1.5-.8-1.5-2C7 11 5.5 12.6 5.5 15c0 3.5 2.6 6 6.5 6Z"/>',
  medal:      '<circle cx="12" cy="14.5" r="5.5"/><path d="M8 3h8l-2.5 6M8 3l2.5 6"/><path d="m12 12.5 1 2 2 .3-1.5 1.4.4 2-1.9-1-1.9 1 .4-2L9 14.8l2-.3 1-2Z"/>',
  trophy:     '<path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 5.5H4.5v1.8A3 3 0 0 0 7 10M17 5.5h2.5v1.8A3 3 0 0 1 17 10"/><path d="M12 14v3M8.5 20.5h7l-.8-3.5h-5.4l-.8 3.5Z"/>',
  target:     '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
  clock:      '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.3l3.4 2"/>',
  calendar:   '<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  book:       '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5v-16Z"/><path d="M20 18v4H6.5A2.5 2.5 0 0 1 4 19.5"/>',
  chart:      '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 17V11M12.5 17V7M17 17v-4"/>',
  compass:    '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  map:        '<path d="m3 6.5 6-3 6 3 6-3v14l-6 3-6-3-6 3v-14Z"/><path d="M9 3.5v14M15 6.5v14"/>',
  layers:     '<path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/>',
  key:        '<circle cx="8" cy="14" r="4"/><path d="m11 11 8-8M16.5 5.5 19 8M14 8l2 2"/>',
  eye:        '<path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
  lock:       '<rect x="4.5" y="10" width="15" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  check:      '<path d="m4.5 12.5 5 5 10-11"/>',
  x:          '<path d="M6 6l12 12M18 6 6 18"/>',
  plus:       '<path d="M12 5v14M5 12h14"/>',
  arrowUp:    '<path d="M12 19V5M6 11l6-6 6 6"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  refresh:    '<path d="M20 11a8 8 0 0 0-13.7-5.3L3 9"/><path d="M4 13a8 8 0 0 0 13.7 5.3L21 15"/><path d="M3 4v5h5M21 20v-5h-5"/>',
  pause:      '<rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/>',
  play:       '<path d="M7 4.5 19 12 7 19.5v-15Z"/>',
  sparkle:    '<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6.5 6.5 9 9M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5"/>',
  gift:       '<rect x="3.5" y="8" width="17" height="12.5" rx="1.5"/><path d="M3.5 12.5h17M12 8v12.5"/><path d="M12 8S10.5 3.5 8 3.5a2.2 2.2 0 0 0 0 4.5h4ZM12 8s1.5-4.5 4-4.5a2.2 2.2 0 0 1 0 4.5h-4Z"/>',
  bug:        '<rect x="7" y="8" width="10" height="12" rx="5"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M3 12h4M17 12h4M3.5 17h3.5M17 17h3.5M4.5 7.5 8 10M19.5 7.5 16 10"/>',
  brain:      '<path d="M9.5 3.5A3 3 0 0 0 6.6 7 3 3 0 0 0 5 12a3 3 0 0 0 1.6 5 3 3 0 0 0 5.9 1V4.5a3 3 0 0 0-3-1Z"/><path d="M14.5 3.5A3 3 0 0 1 17.4 7 3 3 0 0 1 19 12a3 3 0 0 1-1.6 5 3 3 0 0 1-5.9 1"/>',
  shieldCheck:'<path d="M12 2.5 20 6v6c0 5-3.4 8.3-8 9.5-4.6-1.2-8-4.5-8-9.5V6l8-3.5Z"/><path d="m9 12 2 2 4-4"/>',
  users:      '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.5a3.2 3.2 0 0 1 0 6M17.5 14.5A5.5 5.5 0 0 1 21 20"/>',
  phone:      '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  drop:       '<path d="M12 3s6 6.3 6 10.5A6 6 0 0 1 6 13.5C6 9.3 12 3 12 3Z"/>',
  bed:        '<path d="M3 19v-9M3 13h18v6M21 19v-4"/><path d="M6.5 10.5h4a2 2 0 0 1 2 2v.5H4.5v-.5a2 2 0 0 1 2-2Z"/>',
  tooth:      '<path d="M12 3.5c-3 0-5 2-5 5 0 2.5.8 3.5 1.2 6 .3 2 .8 6 2.3 6s1-3 1.5-4.5 1.5-1.5 2 0S15 20.5 16.5 20.5s2-4 2.3-6c.4-2.5 1.2-3.5 1.2-6 0-3-2-5-5-5a3 3 0 0 0-1.5.4A3 3 0 0 0 12 3.5Z"/>',
  pen:        '<path d="M4 20h4L20 8l-4-4L4 16v4Z"/><path d="m14 6 4 4"/>',
  headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2.5" y="14" width="4.5" height="6.5" rx="2"/><rect x="17" y="14" width="4.5" height="6.5" rx="2"/>',
  cloud:      '<path d="M7 18a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 18 10.5a3.8 3.8 0 0 1 .3 7.5H7Z"/>',
  scale:      '<path d="M12 3v18M7 21h10"/><path d="M12 6 5 9l2.5 4.5a3.5 3.5 0 0 1-5 0L5 9M12 6l7 3-2.5 4.5a3.5 3.5 0 0 0 5 0L19 9"/>',
  list:       '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.3" fill="currentColor" stroke="none"/>',
  filter:     '<path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/>',
  bell:       '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10.5 20a2 2 0 0 0 3 0"/>',
  heart:      '<path d="M12 20.5S4 15.8 4 10.3A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 8 2.3c0 5.5-8 10.2-8 10.2Z"/>',
  sleep:      '<path d="M20 13.5A8.5 8.5 0 0 1 10.5 4a8.5 8.5 0 1 0 9.5 9.5Z"/>',
  smile:      '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14c1.8 2 5.2 2 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/>',
  meh:        '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 15h7"/><path d="M9 9.5h.01M15 9.5h.01"/>',
  frown:      '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 15.5c1.8-2 5.2-2 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/>'
};

/* ---- the renderer: one function, any size, any colour ---- */
function ico(name, size){
  const s = size || 18;
  const p = ICO_PATHS[name] || ICO_PATHS.dot;
  return '<svg class="ico" viewBox="0 0 24 24" width="' + s + '" height="' + s + '" '
    + 'fill="none" stroke="currentColor" stroke-width="1.7" '
    + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
}

/* filled variant for stars and medals */
function icoFill(name, size){
  const s = size || 18;
  const p = ICO_PATHS[name] || ICO_PATHS.dot;
  return '<svg class="ico" viewBox="0 0 24 24" width="' + s + '" height="' + s + '" '
    + 'fill="currentColor" stroke="currentColor" stroke-width="1.2" '
    + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
}

/* star row, e.g. ★★★☆☆ rendered as real SVGs */
function starRow(n, max, size){
  max = max || 5; size = size || 13;
  let out = '<span class="starRow">';
  for(let i = 1; i <= max; i++){
    out += '<span class="' + (i <= n ? 'on' : 'off') + '">'
        + (i <= n ? icoFill('star', size) : ico('star', size)) + '</span>';
  }
  return out + '</span>';
}
