/* =====================================================================
   SOLO LEVELING — RENDER LAYER
   ===================================================================== */

const $ = id => document.getElementById(id);
const esc = s => (s === null || s === undefined ? '' : String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])));

/* an icon name (from data.js) becomes an inline SVG of the requested size */
const ic = (name, size) => ico(name, size || 18);
const icF = (name, size) => icoFill(name, size || 18);

/* ---------------------------------------------------------------------
   FEEDBACK
   --------------------------------------------------------------------- */
function log(hdr, txt, bad){
  S.hist.unshift({h:hdr, t:txt, d:new Date().toLocaleString()});
  if(S.hist.length > 30) S.hist.pop();

  const el = document.createElement('div');
  el.className = 'msg' + (bad ? ' bad' : '');
  el.innerHTML = '<div class="hd">'+esc(hdr)+'</div>'+txt;
  $('log').appendChild(el);
  setTimeout(()=>{ el.style.transition='opacity .5s'; el.style.opacity='0';
    setTimeout(()=>{ if(el.parentNode) el.parentNode.removeChild(el); else if(el.remove) el.remove(); },500); }, 4500);
}

function beep(f, d, type){
  if(sfxMuted()) return;
  try{
    const C = window.AudioContext || window.webkitAudioContext;
    if(!C) return;
    window._ac = window._ac || new C();
    const ac = window._ac;
    if(ac.state === 'suspended') ac.resume();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'sine';
    o.frequency.value = f;
    g.gain.setValueAtTime(.05 * SFX_VOLUME, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + d);
    o.connect(g); g.connect(ac.destination);
    o.start(); o.stop(ac.currentTime + d);
  }catch(e){}
}

/* ---------------------------------------------------------------------
   SOUND LIBRARY — a distinct sound for every action in the System
   Volume is scaled by one global factor so the whole app can be tuned
   (or muted) from a single place.
   --------------------------------------------------------------------- */
const SFX_VOLUME = 0.35;   /* master gain — lower this to quieten everything */

function sfxMuted(){
  try{ return localStorage.getItem('soloMute') === '1'; }catch(e){ return false; }
}
function toggleMute(){
  const now = !sfxMuted();
  try{ localStorage.setItem('soloMute', now ? '1' : '0'); }catch(e){}
  const b = document.getElementById('muteBtn');
  if(b){
    b.textContent = now ? 'Sound Off' : 'Sound On';
    b.classList.toggle('off', now);
  }
  if(!now) sfx('success');
  return now;
}

function sfx(name){
  if(sfxMuted()) return;
  try{
    const C = window.AudioContext || window.webkitAudioContext;
    if(!C) return;
    window._ac = window._ac || new C();
    const ac = window._ac;
    if(ac.state === 'suspended') ac.resume();

    const note = (freq, start, dur, type, vol) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(freq, ac.currentTime + start);
      g.gain.setValueAtTime(0, ac.currentTime + start);
      /* every call is scaled by the master volume */
      g.gain.linearRampToValueAtTime((vol || .06) * SFX_VOLUME, ac.currentTime + start + .01);
      g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + start + dur);
      o.connect(g); g.connect(ac.destination);
      o.start(ac.currentTime + start);
      o.stop(ac.currentTime + start + dur + .02);
    };

    switch(name){
      /* --- HOLOGRAPHIC SYSTEM SFX --- */
      case 'system_beep':
        note(1200, 0, 0.05, 'sine', 0.06); note(1600, 0.06, 0.07, 'sine', 0.05); break;
      case 'quest_chime':
        [587, 740, 880, 1174].forEach((f, i) => note(f, i * 0.07, 0.25, 'triangle', 0.06)); break;
      case 'arise_fanfare':
        [220, 293, 370, 440, 587, 740, 880].forEach((f, i) => note(f, i * 0.09, 0.5, 'triangle', 0.075)); break;
      case 'alarm':
        note(880, 0, 0.15, 'sawtooth', 0.08); note(440, 0.15, 0.2, 'sawtooth', 0.07);
        note(880, 0.35, 0.15, 'sawtooth', 0.08); note(440, 0.5, 0.2, 'sawtooth', 0.07); break;
      /* --- SYSTEM BOOT --- */
      case 'boot':
        note(330,0,.12,'sine',.05); note(440,.1,.12,'sine',.05);
        note(660,.2,.3,'triangle',.06); note(880,.32,.4,'triangle',.05);
        break;
      /* --- MISSION --- */
      case 'mission':
        note(880,0,.07,'triangle',.05); note(1180,.05,.1,'triangle',.045); break;
      case 'uncheck':
        note(420,0,.1,'sawtooth',.035); note(300,.07,.12,'sawtooth',.03); break;
      case 'perfect':
        [523,659,784,1046,1318].forEach((f,i)=>note(f,i*.09,.35,'triangle',.055)); break;
      /* --- LEVEL / RANK --- */
      case 'levelup':
        [523,659,784,1046].forEach((f,i)=>note(f,i*.08,.3,'triangle',.06)); break;
      case 'rankup':
        [392,523,659,784,1046,1318,1568].forEach((f,i)=>note(f,i*.11,.42,'triangle',.07)); break;
      case 'milestone':
        [523,523,784,1046,1318].forEach((f,i)=>note(f,i*.13,.45,'sine',.07)); break;
      /* --- BADGES / LOOT --- */
      case 'badge':
        note(784,0,.15,'sine',.05); note(988,.1,.2,'sine',.05); note(1318,.2,.4,'sine',.055); break;
      case 'loot':
        note(1046,0,.08,'square',.04); note(1318,.06,.14,'square',.035); break;
      case 'gem':
        [1318,1568,2093].forEach((f,i)=>note(f,i*.06,.3,'sine',.05)); break;
      case 'egg':
        note(220,0,.25,'sine',.05); note(330,.18,.25,'sine',.045);
        note(440,.36,.35,'triangle',.05); break;
      case 'mythic':
        [261,392,523,659,784,1046,1318,1568,2093].forEach((f,i)=>note(f,i*.12,.6,'triangle',.075)); break;
      case 'merge':
        note(660,0,.1,'sine',.05); note(880,.08,.1,'sine',.05);
        note(1100,.16,.25,'sine',.055); break;
      /* --- BOSS --- */
      case 'bossstep':
        note(160,0,.18,'sawtooth',.05); note(240,.1,.25,'sawtooth',.045); break;
      case 'bossclear':
        note(110,0,.5,'sawtooth',.06); note(220,.3,.5,'sawtooth',.05);
        [523,659,784,1046].forEach((f,i)=>note(f,.6+i*.1,.5,'triangle',.07)); break;
      /* --- ECONOMY --- */
      case 'spend':
        note(660,0,.1,'square',.04); note(440,.07,.15,'square',.035); break;
      case 'reward':
        note(880,0,.12,'sine',.05); note(1174,.1,.18,'sine',.05);
        note(1568,.22,.4,'sine',.055); break;
      /* --- PENALTY / DAMAGE --- */
      case 'penalty':
        note(220,0,.2,'sawtooth',.05); note(165,.15,.3,'sawtooth',.045); break;
      case 'damage':
        note(140,0,.25,'square',.05); break;
      case 'heal':
        note(660,0,.15,'sine',.05); note(880,.12,.25,'sine',.05); break;
      /* --- FOCUS TIMER --- */
      case 'focusStart':
        note(440,0,.15,'sine',.05); note(660,.12,.25,'sine',.05); break;
      case 'focusEnd':
        [880,880,880,1174].forEach((f,i)=>note(f,i*.18,.3,'sine',.06)); break;
      case 'tick':
        note(1200,0,.03,'sine',.02); break;
      /* --- UI --- */
      case 'tab':
        note(520,0,.05,'triangle',.03); break;
      case 'open':
        note(700,0,.06,'sine',.035); note(900,.05,.08,'sine',.03); break;
      case 'close':
        note(500,0,.06,'sine',.03); break;
      case 'guide':
        note(600,0,.07,'triangle',.04); note(800,.06,.1,'triangle',.035); break;
      case 'vocab':
        note(740,0,.1,'sine',.04); note(988,.08,.15,'sine',.04); break;
      case 'mood':
        note(880,0,.12,'sine',.045); note(1046,.1,.2,'sine',.045); break;
      case 'streak':
        note(660,0,.1,'triangle',.05); note(880,.08,.15,'triangle',.05);
        note(1100,.16,.25,'triangle',.05); break;
      /* --- FEEDBACK --- */
      case 'error':
        note(200,0,.15,'square',.045); note(160,.1,.2,'square',.04); break;
      case 'success':
        note(660,0,.1,'sine',.05); note(990,.08,.2,'sine',.05); break;
      default:
        note(880,0,.07,'triangle',.04);
    }
  }catch(e){}
}

function floatXP(x, y, n, bad){
  const el = document.createElement('div');
  el.className = 'fxp' + (bad ? ' bad' : '');
  el.textContent = (bad ? '' : '+') + n + ' XP';
  el.style.left = (x-30)+'px';
  el.style.top  = (y-16)+'px';
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 1000);
}

function confetti(){
  const cols = ['#3fa9ff','#7b5cff','#ffcc4d','#25e07a','#ffffff'];
  for(let i=0;i<70;i++){
    const c = document.createElement('div');
    c.className = 'cf';
    c.style.left = Math.random()*100 + 'vw';
    c.style.top = '-12px';
    c.style.background = cols[Math.floor(Math.random()*cols.length)];
    c.style.animationDuration = (1.6 + Math.random()*1.6) + 's';
    c.style.animationDelay = (Math.random()*.35) + 's';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(), 3600);
  }
}

function overlay(title, big, sub, bad){
  $('ovT').textContent = title;
  /* the big line may carry an inline SVG icon — anything else is escaped */
  $('ovN').innerHTML = /<svg[\s>]/i.test(String(big)) ? big : esc(big);
  $('ovS').textContent = sub || '';
  $('ovb').className = 'ovb' + (bad ? ' bad' : '');
  $('ov').classList.add('show');
  if(!bad){
    confetti();
    sfx('levelup');
  } else {
    sfx('penalty');
  }
  setTimeout(()=>$('ov').classList.remove('show'), 2400);
}

function closeModal(){ $('modal').classList.remove('show'); }
function openModal(title, sub, text){
  $('mT').textContent = title;
  $('mS').textContent = sub;
  $('mX').textContent = text;
  $('modal').classList.add('show');
}

/* ---------------------------------------------------------------------
   CEREMONY CARD — the moment you level up
   --------------------------------------------------------------------- */
let ceremonyQueue = 0;
function ceremonyCard(o){
  const el = document.createElement('div');
  el.className = 'ceremony' + (o.rare ? ' rare' : '');
  el.innerHTML =
      '<div class="cRays"></div>'
    + '<div class="cInner">'
    +   '<div class="cKicker">'+esc(o.kicker)+'</div>'
    +   '<div class="cBig">'+(/<svg[\s>]/i.test(String(o.big)) ? o.big : esc(o.big))+'</div>'
    +   '<div class="cSub">'+esc(o.sub)+'</div>'
    +   (o.stat ? '<div class="cStat">'+o.stat+'</div>' : '')
    +   '<div class="cClose">tap to dismiss</div>'
    + '</div>';
  el.onclick = () => closeCeremony(el);
  document.body.appendChild(el);

  requestAnimationFrame(()=> el.classList.add('in'));

  /* rare moments get fireworks behind the card */
  if(o.rare){ fireworks(140); fanfare(); }
  else { chime(); }

  /* auto-dismiss */
  const life = o.rare ? 6500 : 4200;
  const timer = setTimeout(()=> closeCeremony(el), life);
  el._timer = timer;
}

function closeCeremony(el){
  if(!el || el._closing) return;
  el._closing = true;
  clearTimeout(el._timer);
  el.classList.remove('in');
  el.classList.add('out');
  setTimeout(()=> el.remove(), 500);
}

/* ---------------------------------------------------------------------
   RANK SCREEN — full screen, the biggest moment in the system
   --------------------------------------------------------------------- */
function rankScreen(rank, from, to){
  const el = document.createElement('div');
  el.className = 'rankScreen';
  el.innerHTML =
      '<div class="rBg"></div>'
    + '<div class="rInner">'
    +   '<div class="rTop">RANK UP</div>'
    +   '<div class="rName">'+esc(rank.name)+'</div>'
    +   '<div class="rRule"></div>'
    +   '<div class="rNote">'+esc(rank.note)+'</div>'
    +   '<div class="rStats">'
    +     '<span>LEVEL <b>'+S.level+'</b></span>'
    +     '<span>XP <b>'+S.xp.toLocaleString()+'</b></span>'
    +     '<span>STREAK <b>'+S.streak+'</b></span>'
    +   '</div>'
    +   '<div class="rClose">tap anywhere to continue</div>'
    + '</div>';
  el.onclick = () => {
    el.classList.add('out');
    setTimeout(()=> el.remove(), 600);
  };
  document.body.appendChild(el);
  requestAnimationFrame(()=> el.classList.add('in'));

  rankFireworks();
  rankFanfare();
  log('RANK UP','Promoted to <b>'+rank.name+'</b>.');
}

/* ---------------------------------------------------------------------
   FIREWORKS + FANFARE
   --------------------------------------------------------------------- */
function fireworks(count){
  const cols = ['#3fa9ff','#7b5cff','#ffcc4d','#25e07a','#ffffff','#ff4d5e'];
  const bursts = 5;
  for(let b=0;b<bursts;b++){
    setTimeout(()=>{
      const cx = 15 + Math.random()*70;
      const cy = 15 + Math.random()*45;
      for(let i=0;i<count/bursts;i++){
        const p = document.createElement('div');
        p.className = 'spark';
        const ang = Math.random()*Math.PI*2;
        const dist = 60 + Math.random()*180;
        p.style.left = cx + 'vw';
        p.style.top  = cy + 'vh';
        p.style.background = cols[Math.floor(Math.random()*cols.length)];
        p.style.setProperty('--dx', Math.cos(ang)*dist + 'px');
        p.style.setProperty('--dy', Math.sin(ang)*dist + 'px');
        p.style.animationDelay = (Math.random()*.25) + 's';
        document.body.appendChild(p);
        setTimeout(()=>p.remove(), 2200);
      }
    }, b*320);
  }
}

function rankFireworks(){
  const cols = ['#3fa9ff','#7b5cff','#ffcc4d','#ffffff'];
  for(let i=0;i<220;i++){
    const p = document.createElement('div');
    p.className = 'spark';
    const ang = Math.random()*Math.PI*2;
    const dist = 120 + Math.random()*420;
    p.style.left = (30 + Math.random()*40) + 'vw';
    p.style.top  = (25 + Math.random()*35) + 'vh';
    p.style.background = cols[Math.floor(Math.random()*cols.length)];
    p.style.setProperty('--dx', Math.cos(ang)*dist + 'px');
    p.style.setProperty('--dy', Math.sin(ang)*dist + 'px');
    p.style.animationDuration = (1.3 + Math.random()*1.1) + 's';
    p.style.animationDelay = (Math.random()*.7) + 's';
    document.body.appendChild(p);
    setTimeout(()=>p.remove(), 3200);
  }
}

function chime(){
  try{ beep(660,.1); setTimeout(()=>beep(990,.16),90); }catch(e){}
}
function fanfare(){
  try{
    [[523,0],[659,110],[784,220],[1046,340],[1318,470]].forEach(([f,d])=>{
      setTimeout(()=>beep(f,.22,'triangle'), d);
    });
  }catch(e){}
}
function rankFanfare(){
  try{
    [[392,0],[523,140],[659,280],[784,420],[1046,560],[1318,700],[1568,860]]
      .forEach(([f,d])=> setTimeout(()=>beep(f,.3,'triangle'), d));
  }catch(e){}
}

/* ---------------------------------------------------------------------
   JIN-WOO FLOATING GUIDE  (side pop-up, not a dashboard block)
   --------------------------------------------------------------------- */
let phraseIdx = 0;
let guideTimer = null;
let dayTimer = null;
let currentEvent = null;

/* React to what just happened on the site */
function reactTo(event){
  currentEvent = event;
  showPhrase();
  popGuide();
  currentEvent = null;
}

function nextPhrase(silent){
  showPhrase();
  if(!silent){
    beep(600,.06,'triangle');
    popGuide();
  }
}

function showPhrase(){
  const t = $('gBubbleText');
  if(!t) return;
  const line = smartPhrase();
  t.style.opacity = '0';
  setTimeout(()=>{
    t.textContent = line;
    t.style.opacity = '1';
  }, 220);
}

function popGuide(){
  const g = $('guidePop');
  if(!g) return;
  g.classList.add('speak');
  setTimeout(()=>g.classList.remove('speak'), 2600);
}

function toggleGuide(){
  const g = $('guidePop');
  if(!g) return;
  const isHidden = g.classList.toggle('hidden');
  const btn = $('guideReopenBtn');
  if(btn) btn.style.display = isHidden ? 'flex' : 'none';
  S.guideHidden = isHidden;
  save();
}

/* Let the player set their own Jin-Woo line */
function setCustomPhrase(){
  const input = document.getElementById('customPhraseInput');
  if(!input) return;
  const val = input.value.trim();
  if(!val){ alert('Write something first.'); return; }
  S.customPhrase = val;
  save();
  input.value = '';
  showPhrase();
  popGuide();
  log('CUSTOM','Jin-Woo now says: <b>"'+esc(val)+'"</b>');
}

/* Clear the custom line and return to the system */
function clearCustomPhrase(){
  S.customPhrase = '';
  save();
  showPhrase();
  log('CUSTOM','Custom phrase cleared. The System speaks again.');
}

/* ---------------------------------------------------------------------
   HUD
   --------------------------------------------------------------------- */
function drawHUD(){
  const ri = typeof rankIdx === 'function' ? rankIdx(S.xp || 0) : 0;
  const cur = RANKS[ri] || RANKS[0], nxt = RANKS[ri+1];
  const analytics = (typeof XpEngine !== 'undefined' && XpEngine.getAnalytics) ? XpEngine.getAnalytics() : { today: 0, thisWeek: 0 };

  if($('bLevel'))  $('bLevel').textContent  = S.level || 1;
  if($('bXP'))     $('bXP').textContent     = (S.xp || 0).toLocaleString();
  if($('bStreak')) $('bStreak').textContent = S.streak || 0;
  if($('bQuests')) $('bQuests').textContent = S.qDone || 0;
  if($('rankName')) $('rankName').textContent = cur.name;
  if($('bFreeze')) $('bFreeze').textContent = S.freezes || 0;

  const inLv = (S.xp || 0) % LEVEL_XP;
  if($('xpNow')) $('xpNow').textContent = inLv;
  if($('xpNeed')) $('xpNeed').textContent = LEVEL_XP;
  if($('xpBar')) $('xpBar').style.width = (inLv / LEVEL_XP * 100) + '%';

  if(nxt){
    const span = nxt.xp - cur.xp, done = Math.max(0, (S.xp || 0) - cur.xp);
    if($('nextRank')) $('nextRank').textContent = nxt.name;
    if($('rankNow'))  $('rankNow').textContent  = done;
    if($('rankNeed')) $('rankNeed').textContent = span;
    if($('rankBar'))  $('rankBar').style.width  = Math.min(100, done / span * 100) + '%';
  } else {
    if($('nextRank')) $('nextRank').textContent = 'MAX RANK';
    if($('rankNow'))  $('rankNow').textContent  = S.xp || 0;
    if($('rankNeed')) $('rankNeed').textContent = S.xp || 0;
    if($('rankBar'))  $('rankBar').style.width  = '100%';
  }

  /* Hunter Progress Panel (replaces removed HP/Mana Vitals) */
  if($('hpLevelVal'))  $('hpLevelVal').textContent = 'LEVEL ' + (S.level || 1);
  if($('hpXpVal'))     $('hpXpVal').textContent = (S.xp || 0).toLocaleString() + ' XP';
  if($('hpNextLvVal')) $('hpNextLvVal').textContent = (LEVEL_XP - inLv) + ' XP remaining';
  if($('hpRankVal'))   $('hpRankVal').textContent = cur.name;
  if($('hpDailyVal'))  $('hpDailyVal').textContent = '+' + (analytics.today || 0).toLocaleString() + ' XP';
  if($('hpWeeklyVal')) $('hpWeeklyVal').textContent = '+' + (analytics.thisWeek || 0).toLocaleString() + ' XP';
  if($('hpStreakVal')) $('hpStreakVal').textContent = (S.streak || 0) + ' Days';

  /* Daily Mission Meter strictly based on today's Daily Missions */
  const missions = (typeof TaskEngine !== 'undefined' && TaskEngine.getDailyMissions) ? TaskEngine.getDailyMissions() : [];
  const doneCount = missions.filter(m => S.daily && S.daily[m.id]).length;
  const pct = missions.length ? Math.round((doneCount / missions.length) * 100) : 0;
  if($('penBar'))   $('penBar').style.width = pct + '%';
  if($('penLabel')) {
    $('penLabel').textContent = doneCount + ' / ' + missions.length;
    $('penLabel').style.color = pct === 100 ? 'var(--green)' : (pct < 50 ? 'var(--red)' : 'var(--glow)');
  }
  if($('bStatPts')) $('bStatPts').textContent = S.statPoints || 0;

  if($('rankBadgeMini')) $('rankBadgeMini').textContent = (cur.name || 'E')[0];
  const avatarFrame = document.querySelector('.avatar-frame');
  if(avatarFrame){
    avatarFrame.classList.remove('aura-e', 'aura-d', 'aura-c', 'aura-b', 'aura-a', 'aura-s', 'aura-monarch');
    const rChar = (cur.name || 'E')[0].toLowerCase();
    if(ri >= 5 || (S.level || 0) >= 20) avatarFrame.classList.add('aura-monarch');
    else if(rChar === 's') avatarFrame.classList.add('aura-s');
    else avatarFrame.classList.add('aura-' + rChar);
  }

  if(typeof drawStatsHUD === 'function') drawStatsHUD();
  if(typeof drawPrestigeHUD === 'function') drawPrestigeHUD();
  if(typeof drawPauseHUD === 'function') drawPauseHUD();

  const mult = typeof streakMult === 'function' ? streakMult() : 1;
  const mb = $('multBadge');
  if(mb){
    mb.textContent = 'x' + mult.toFixed(2);
    mb.style.color = mult > 1.25 ? 'var(--green)' : (mult > 1.05 ? 'var(--gold)' : 'var(--muted)');
  }

  if($('startBanner')) $('startBanner').style.display = S.started ? 'none' : 'block';
  const rb = $('reviewBanner');
  if(rb && typeof reviewDue === 'function') rb.style.display = reviewDue() ? 'block' : 'none';

  const sd = $('streakDanger');
  if(sd){
    const h = (typeof getCairoHour === 'function') ? getCairoHour() : new Date().getHours();
    const atRisk = S.started && (S.streak || 0) > 0 && doneCount === 0 && h >= 20;
    sd.style.display = atRisk ? 'block' : 'none';
    if(atRisk){
      if($('sdHours'))  $('sdHours').textContent = (24 - h) + ' hour' + ((24 - h) !== 1 ? 's' : '');
      if($('sdStreak')) $('sdStreak').textContent = S.streak || 0;
    }
  }

  const nt = $('rankTease');
  if(nt){
    nt.textContent = nxt
      ? Math.max(0, nxt.xp - (S.xp || 0)).toLocaleString() + ' XP to ' + nxt.name
      : 'Maximum rank reached';
  }
}

function goTab(name){
  const mapped = (name === 'tasks') ? 'daily' : name;
  if(mapped === 'career' || mapped === 'brain' || mapped === 'hunter'){
    switchTab('dash');
    return;
  }
  switchTab(mapped);
}

const GUIDE_TEXT = {};
function buildGuideIndex(){
  if(typeof DAILY !== 'undefined') DAILY.concat(typeof WEEKLY !== 'undefined' ? WEEKLY : []).forEach(m => { if(m.guide) GUIDE_TEXT[m.id] = m.guide; });
}

function missionRow(m, kind){
  const isDaily = kind === 'daily';
  const store = isDaily ? (S.daily || {}) : (S.weekly || {});
  const on = !!store[m.id];
  const nm = esc(m.name).replace(/'/g, "\\'");
  const canReroll = isDaily && !on && ((S.questRerollsRemaining || 0) > 0);
  const penaltyAmt = (m.xp || 20) * 2;
  const stepsHtml = (m.steps && m.steps.length) ? esc(m.steps.join('\n')) : (GUIDE_TEXT[m.id] || '');
  return '<div class="q '+(on?'done':'')+'">'
    + '<div class="box" onclick="toggleMission(\''+kind+'\',\''+m.id+'\',event)"></div>'
    + '<div class="qmain" onclick="toggleMission(\''+kind+'\',\''+m.id+'\',event)">'
    +   '<div class="qnm">'+esc(m.name)+'</div>'
    +   '<div class="qsb">'+esc(m.sub || '')+(m.duration ? ' &middot; '+esc(m.duration) : '')+(isDaily && !on ? ' &middot; <span style="color:var(--red);font-size:11px;">Miss: -'+penaltyAmt+' XP</span>' : '')+'</div>'
    + '</div>'
    + '<div class="xp" onclick="toggleMission(\''+kind+'\',\''+m.id+'\',event)">+'+m.xp+' XP</div>'
    + (canReroll ? '<button class="xbtn reroll-btn" title="Swap this mission (1 free/day)" onclick="event.stopPropagation(); if(window.TaskEngine) TaskEngine.rerollTask(\''+m.id+'\');">🎲</button>' : '')
    + (stepsHtml ? '<button class="xbtn" onclick="event.stopPropagation();openModal(\''+nm+'\',\'Mission Steps\',\''+stepsHtml.replace(/'/g,"\\'")+'\')">?</button>' : '')
    + '</div>';
}

function lockRow(m){
  return '<div class="lockrow">' + ic('lock',16) + ' <b style="color:var(--text)">'+esc(m.name)+'</b> &mdash; unlocks at level '+(m.unlock.level)+'</div>';
}

function drawDaily(){
  const missions = (typeof TaskEngine !== 'undefined' && TaskEngine.getDailyMissions) ? TaskEngine.getDailyMissions() : [];
  const doneCount = missions.filter(m => S.daily && S.daily[m.id]).length;
  const pct = missions.length ? Math.round((doneCount / missions.length) * 100) : 0;

  const listEl = $('dailyList');
  if(listEl){
    let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">'
      + '<div style="font-size:12.5px;color:var(--muted);"><b>'+doneCount+' / '+missions.length+'</b> Missions Completed Today &bull; Rotates daily at 00:00 Cairo &bull; Unchecked at midnight: <span style="color:var(--red)">-2&times; Base XP</span></div>'
      + '<button class="btn" style="padding:6px 12px;font-size:12px;" onclick="openTaskModal()">+ Add Custom Mission</button>'
      + '</div>';
    html += '<div class="bar thin" style="margin-bottom:14px;"><i style="width:'+pct+'%;"></i></div>';
    html += missions.map(m => missionRow(m, 'daily')).join('');
    listEl.innerHTML = html;
  }

  if($('dailyTag')) $('dailyTag').textContent = doneCount + ' / ' + missions.length + ' COMPLETE';
}

function drawWeekly(){
  const av = available(WEEKLY), lk = lockedOf(WEEKLY);
  const weekIdx = typeof getWeeklyCycleIndex === 'function' ? getWeeklyCycleIndex() : 0;
  const cycleIdx = weekIdx % 4;
  const currentTheme = (typeof WEEKLY_THEMES !== 'undefined' && WEEKLY_THEMES[cycleIdx]) ? WEEKLY_THEMES[cycleIdx] : null;

  const doneCount = av.filter(m => S.weekly[m.id]).length;
  const totalCount = av.length;
  const allWeeklyDone = totalCount > 0 && doneCount === totalCount;

  let html = '';

  /* Active Weekly Evolution Banner */
  html += '<div class="weekly-cycle-banner">'
        + '<div class="wcb-top">'
        +   '<div class="wcb-badge">WEEK ' + (weekIdx + 1) + ' &middot; EVOLUTION CYCLE ' + (cycleIdx + 1) + '/4</div>'
        +   '<div class="wcb-status' + (allWeeklyDone ? ' done' : '') + '">'
        +     (allWeeklyDone ? '🏆 WEEKLY DOMINANCE (+150 XP)' : doneCount + ' / ' + totalCount + ' COMPLETED')
        +   '</div>'
        + '</div>'
        + '<div class="wcb-title">' + (currentTheme ? esc(currentTheme.name) : 'Dynamic Weekly Evolution') + '</div>'
        + '<div class="wcb-ar">' + (currentTheme ? esc(currentTheme.nameAr) : '') + '</div>'
        + '<div class="bar thin" style="margin-top:10px"><i style="width:' + (totalCount ? (doneCount/totalCount*100) : 0) + '%;background:var(--gold)"></i></div>'
        + '</div>';

  /* Split into Core Anchors and Cycle Missions */
  const coreMissions = av.filter(m => !m.cycle && m.cycle !== 0);
  const cycleMissions = av.filter(m => m.cycle !== null && m.cycle !== undefined);

  if(coreMissions.length){
    html += '<div class="st" style="margin-top:18px"><h2>Core Strategic Anchors</h2><span class="tag">EVERY WEEK</span></div>';
    html += coreMissions.map(m => missionRow(m,'weekly')).join('');
  }

  if(cycleMissions.length){
    html += '<div class="st" style="margin-top:22px"><h2>' + (currentTheme ? esc(currentTheme.name) : 'Active Weekly Cycle') + '</h2><span class="tag">DYNAMIC ROTATION</span></div>';
    html += cycleMissions.map(m => missionRow(m,'weekly')).join('');
  }

  if(lk.length){
    html += '<div class="st" style="margin-top:22px"><h2>Locked Weekly Missions</h2></div>';
    html += lk.map(lockRow).join('');
  }

  /* ---- consequence warning for the weekly missions ---- */
  const undone = av.filter(m => !S.weekly[m.id]);
  if(undone.length){
    const w = consequenceWarning(undone, av);
    if(w){
      const col = w.sev === 'high' ? 'var(--danger,#ef4444)'
                : w.sev === 'mid'  ? 'var(--warn,#f59e0b)'
                : 'var(--muted,#94a3b8)';
      html += '<div class="st" style="margin-top:26px"><h2>Weekly Warning</h2>'
            + '<span class="tag" style="color:' + col + '">' + (w.sev === 'high' ? 'HIGH' : w.sev === 'mid' ? 'WARNING' : 'LOW') + '</span></div>'
            + '<div class="warnBox" style="border-left:3px solid ' + col + '">'
            + '<b style="color:var(--text)">' + esc(w.title) + '</b>'
            + '<div class="hint" style="margin:8px 0 0">' + esc(w.body) + '</div>'
            + (w.cost ? '<div class="hint" style="margin:6px 0 0;color:' + col + '">' + w.cost + ' XP still on the table this week.</div>' : '')
            + '</div>';
    }
  }

  $('weeklyList').innerHTML = html;
}

/* ---- PODCASTS ---- */
function drawPodcasts(){
  const cats = $('podcastCats');
  if(!cats) return;

  const sel = (S.podcastCat || 'all');
  const keys = ['all'].concat(Object.keys(PODCAST_CATS));

  cats.innerHTML = '<div class="catRow">'
    + keys.map(k => {
        const active = (k === sel);
        if(k === 'all'){
          return '<button class="catBtn' + (active ? ' on' : '') + '" onclick="setPodcastCat(\'all\')">All</button>';
        }
        const c = PODCAST_CATS[k];
        return '<button class="catBtn' + (active ? ' on' : '') + '" '
             + 'style="' + (active ? 'background:' + c.color + ';border-color:' + c.color : '') + '" '
             + 'onclick="setPodcastCat(\'' + k + '\')">' + c.name + '</button>';
      }).join('')
    + '</div>';

  const list = PODCASTS.filter(p => sel === 'all' || p.cat === sel);
  $('podcastList').innerHTML = list.length
    ? list.map(p => {
        const c = PODCAST_CATS[p.cat] || {name:p.cat, icon:'brain', color:'#94a3b8'};
        const done = (S.podcastsListened || []).includes(p.id);
        return '<div class="podRow">'
          + '<div class="podIcon" style="background:' + c.color + '22;color:' + c.color + '">'
          +   ic(c.icon || 'brain', 20) + '</div>'
          + '<div class="podBody">'
          +   '<div class="podName">' + esc(p.name) + (p.lang === 'ar' ? ' <span class="tag" style="font-size:10px">ARABIC</span>' : '') + '</div>'
          +   '<div class="podHost">' + esc(p.host || '') + '</div>'
          +   '<div class="podWhy">' + esc(p.why) + '</div>'
          +   (p.when ? '<div class="podWhen">▶ ' + esc(p.when) + '</div>' : '')
          + '</div>'
          + '<div class="podAct">'
          +   (p.url ? '<a class="xbtn" href="' + esc(p.url) + '" target="_blank" rel="noopener">OPEN</a>' : '')
          +   '<button class="xbtn' + (done ? ' done' : '') + '" onclick="togglePodcastListened(\'' + p.id + '\')">'
          +     (done ? 'LISTENED' : 'MARK') + '</button>'
          + '</div>'
          + '</div>';
      }).join('')
    : '<div class="hint">Nothing in this category yet.</div>';

  /* ---- Why / Goal / Dream panel ---- */
  const wp = $('whyPanel');
  if(wp){
    wp.innerHTML = '<div class="whyRow"><div class="whyTag" style="background:#a78bfa">WHY</div>'
      + '<div class="whyText">' + esc(WHY_LINES[new Date().getDate() % WHY_LINES.length]) + '</div></div>'
      + '<div class="whyRow"><div class="whyTag" style="background:#4ade80">GOAL</div>'
      + '<div class="whyText">' + esc(GOAL_LINES[new Date().getDate() % GOAL_LINES.length]) + '</div></div>'
      + '<div class="whyRow"><div class="whyTag" style="background:#fbbf24">DREAM</div>'
      + '<div class="whyText">' + esc(DREAM_LINES[new Date().getDate() % DREAM_LINES.length]) + '</div></div>'
      + '<div class="hint" style="margin-top:14px">Jin-Woo rotates these on a schedule — morning, midday and night. Every refresh can bring a new one.</div>';
  }
}

function setPodcastCat(k){
  S.podcastCat = k;
  save();
  drawPodcasts();
}

function togglePodcastListened(id){
  S.podcastsListened = S.podcastsListened || [];
  const i = S.podcastsListened.indexOf(id);
  if(i >= 0){
    S.podcastsListened.splice(i, 1);
    log('PODCAST','Removed from your listened list.');
  } else {
    S.podcastsListened.push(id);
    addXP(4, 'selfdev', true, 'bonus');
    log('PODCAST','Marked as listened. <b>+4 XP</b> — input is progress too.');
  }
  save();
  drawPodcasts();
}

/* ---------------------------------------------------------------------
   BOSSES
   --------------------------------------------------------------------- */
function drawBosses(){
  const wb = typeof getActiveWeeklyBoss === 'function' ? getActiveWeeklyBoss() : null;
  let html = '';

  /* ===== ACTIVE WEEKLY RAID BOSS SECTION ===== */
  if(wb){
    const wbState = (S.weeklyBoss && S.weeklyBoss[wb.id]) || [false, false, false, false];
    let damageDealt = 0;
    wb.phases.forEach((p, idx) => {
      if(wbState[idx]) damageDealt += p.dmg;
    });
    const currentHp = Math.max(0, wb.hp - damageDealt);
    const hpPct = Math.round((currentHp / wb.hp) * 100);
    const isDefeated = currentHp === 0 || wbState.every(Boolean);

    html += '<div class="st"><h2>Active Weekly Raid Boss</h2><span class="tag gate-rank">' + esc(wb.rank) + '</span></div>';
    html += '<div class="hint">The dungeon gate resets every Friday with a new rotating dungeon master. Deal tactical phase damage to claim weekly victory loot.</div>';

    html += '<div class="weekly-boss-card' + (isDefeated ? ' defeated' : '') + '">'
          + '<div class="wb-header">'
          +   '<div class="wb-avatar-wrap">'
          +     '<img class="wb-avatar" src="' + esc(wb.avatar) + '" alt="' + esc(wb.name) + '" onerror="this.src=\'assets/jinwoo.png\'">'
          +   '</div>'
          +   '<div class="wb-info">'
          +     '<div class="wb-rank-tag">' + esc(wb.rank) + ' &middot; WEEKLY GATE</div>'
          +     '<h3 class="wb-name">' + esc(wb.name) + '</h3>'
          +     '<div class="wb-title-ar">' + esc(wb.titleAr) + '</div>'
          +     '<div class="wb-lore">' + esc(wb.lore) + '</div>'
          +   '</div>'
          + '</div>'

          + '<div class="wb-hp-section">'
          +   '<div class="wb-hp-label-row">'
          +     '<span>BOSS HP</span>'
          +     '<b style="color:' + (isDefeated ? 'var(--green)' : 'var(--red)') + '">'
          +       (isDefeated ? 'GATE CLEARED 0 / ' + wb.hp + ' HP' : currentHp.toLocaleString() + ' / ' + wb.hp.toLocaleString() + ' HP (' + hpPct + '%)')
          +     '</b>'
          +   '</div>'
          +   '<div class="bar thin wb-hp-bar"><i style="width:' + hpPct + '%;background:' + (isDefeated ? 'var(--green)' : 'linear-gradient(90deg, #ef4444, #a855f7)') + '"></i></div>'
          + '</div>'

          + '<div class="wb-loot-row">'
          +   '<div class="wb-loot-item"><span class="wb-lk">Phase Damage:</span><span class="wb-lv">+250-375 DMG &middot; +75 XP</span></div>'
          +   '<div class="wb-loot-item"><span class="wb-lk">Clear Bonus:</span><span class="wb-lv gold">+' + wb.reward + ' XP LOOT</span></div>'
          + '</div>'

          + '<div class="wb-phases-list">'
          +   wb.phases.map((phase, pIdx) => {
                const checked = !!wbState[pIdx];
                return '<div class="wb-phase-row' + (checked ? ' done' : '') + '" onclick="toggleWeeklyBossPhase(\'' + wb.id + '\', ' + pIdx + ')">'
                     + '<div class="sb">' + (checked ? ic('check', 13) : '') + '</div>'
                     + '<div class="wb-phase-text">' + esc(phase.text) + '</div>'
                     + '<div class="wb-phase-payout">' + (checked ? '<span style="color:var(--green)">CRITICAL HIT</span>' : '+' + phase.dmg + ' DMG &middot; +' + phase.xp + ' XP') + '</div>'
                     + '</div>';
              }).join('')
          + '</div>'

          + (isDefeated ? '<div class="wb-victory-banner">🏆 <b>GATE PURGED!</b> Weekly Raid Boss Defeated &middot; +' + wb.reward + ' XP Victory Loot Awarded!</div>' : '')
          + '</div>';
  }

  /* ===== PARALLEL S-RANK MASTERY RAID: BASSEM SCHOOL ===== */
  if(typeof renderBassemRaidBossDetailedView === 'function'){
    html += renderBassemRaidBossDetailedView();
  }

  /* ===== GRAND CAMPAIGN RAIDS SECTION ===== */
  html += '<div class="st" style="margin-top:34px"><h2>The 4 Sovereign Master Boss Raids</h2><span class="tag">STRATEGIC MILESTONES</span></div>';
  html += '<div class="hint">The 4 primary developmental campaigns guiding your progression. Complete milestones to trigger systemic unlocks and advance your real-world trajectory.</div>';

  html += BOSSES.map(b => {
    const st = S.boss[b.id] || b.steps.map(()=>false);
    const pct = bossPct(b.id);
    const fin = bossDone(b.id);
    const doneCount = st.filter(Boolean).length;
    const remaining = b.steps.length - doneCount;
    const earned = doneCount * b.xp;
    const left = remaining * b.xp;
    const total = b.steps.length * b.xp + (b.reward || 0);

    return '<div class="boss '+(fin?'done':'')+'">'
      + '<h3>'+(fin?ic('check',16) + ' ':'')+esc(b.name)+'</h3>'
      + '<div class="ds">'+esc(b.desc)+'</div>'

      + '<div class="bossPayout">'
      +   '<div class="bpItem"><span class="bpK">Per step</span><span class="bpV">+'+b.xp.toLocaleString()+' XP</span></div>'
      +   '<div class="bpItem"><span class="bpK">Completion bonus</span><span class="bpV gold">+'+((b.reward||0)).toLocaleString()+' XP</span></div>'
      +   '<div class="bpItem"><span class="bpK">Total for this raid</span><span class="bpV big">'+total.toLocaleString()+' XP</span></div>'
      + '</div>'

      + '<div class="pc">'+pct+'% COMPLETE &middot; '+doneCount+' / '+b.steps.length+' STEPS'
      +   (fin ? ' &middot; <span style="color:var(--green)">ALL XP COLLECTED</span>'
            : ' &middot; <span style="color:var(--gold)">'+left.toLocaleString()+' XP STILL AVAILABLE</span>')
      + '</div>'
      + '<div class="bar thin"><i style="width:'+pct+'%"></i></div>'

      + '<div class="steps">'
      + b.steps.map((s, i) => {
          const isDone = !!st[i];
          const isGated = b.id === 'b2' && i >= 9 && (!S.lifeStatus || !S.lifeStatus.saudiPhone);
          let stageLabel = '';
          if (b.stages) {
            const foundStage = b.stages.find(stg => i === stg.stepsRange[0]);
            if (foundStage) {
              const isLockedStage = foundStage.gated && (!S.lifeStatus || !S.lifeStatus.saudiPhone);
              stageLabel = '<div class="boss-stage-divider ' + (isLockedStage ? 'locked' : '') + '">'
                + '<span class="bsd-name">' + esc(foundStage.name) + '</span>'
                + (isLockedStage ? '<span class="bsd-lock-badge">&#128274; LOCKED (REQUIRES SAUDI PHONE)</span>' : '<span class="bsd-status-badge">&#9889; ACTIVE PHASE</span>')
                + '</div>';
            }
          }
          return stageLabel
            + '<div class="step '+(isDone?'done':'')+' '+(isGated?'gated-step':'')+'" onclick="toggleStep(\''+b.id+'\','+i+')">'
            + '<div class="sb">' + (isDone ? ic('check',13) : (isGated ? '&#128274;' : '')) + '</div>'
            + '<span style="' + (isGated ? 'opacity:0.6;' : '') + '">'+esc(s)+'</span>'
            + '<b class="stepXp">'+(isDone ? ic('check',13)+' +'+b.xp : (isGated ? 'LOCKED' : '+'+b.xp))+'</b></div>';
        }).join('')
      + '</div>'

      + (fin && b.reward ? '<div class="bossDone">Completion bonus earned: <b>+'+b.reward.toLocaleString()+' XP</b></div>' : '')
      + '</div>';
  }).join('');

  $('bossList').innerHTML = html;
}

/* ---------------------------------------------------------------------
   COURSE TRACK
   --------------------------------------------------------------------- */
function drawCourses(){
  const done = Object.keys(S.courses).length;
  const cTag = $('courseTag');
  if(cTag) cTag.textContent = done + ' / ' + COURSES.length + ' DONE';

  const cList = $('courseList');
  if(!cList) return;
  cList.innerHTML = COURSES.map(c => {
    const open = courseOpen(c);
    const fin = !!S.courses[c.id];
    return '<div class="course '+(fin?'done':'')+'" style="'+(open?'':'opacity:.5')+'">'
      + '<div class="sb2" onclick="toggleCourse(\''+c.id+'\')">'+(fin?ic('check',16):'')+'</div>'
      + '<div class="cin">'
      +   '<div class="cn">'+esc(c.name)+'</div>'
      +   '<div class="cp">'+esc(c.provider || c.platform)+' &middot; '+esc(c.hours)+' &middot; '+(open?'UNLOCKED':'UNLOCKS AT LEVEL '+STAGE_LEVELS[c.stage])+'</div>'
      +   '<div class="cw">'+esc(c.why)+'</div>'
      +   (c.objective ? '<div class="c-obj" style="margin-top:6px;font-size:12px;color:var(--text);"><b style="color:var(--sys-blue);">Objective:</b> '+esc(c.objective)+'</div>' : '')
      +   (c.nextLesson ? '<div class="c-next" style="margin-top:4px;font-size:12px;color:var(--gold);"><b style="color:var(--gold);">Next Lesson:</b> '+esc(c.nextLesson)+'</div>' : '')
      +   (c.practicalExercise ? '<div class="c-ex" style="margin-top:4px;font-size:12px;color:var(--green);"><b style="color:var(--green);">Hands-On Exercise:</b> '+esc(c.practicalExercise)+'</div>' : '')
      +   '<div class="cf2">'+esc(c.proof)+'</div>'
      + '</div>'
      + (open ? '<a class="xbtn" href="'+c.url+'" target="_blank" rel="noopener" onclick="event.stopPropagation()">OPEN &#8599;</a>' : '')
      + '</div>';
  }).join('');
}

/* ---------------------------------------------------------------------
   ROADMAP
   --------------------------------------------------------------------- */
const CHAPTERS = [
  {id:'c1', lvl:1,  name:'Chapter 1 \u2014 The Awakening',
   req:'Where you are now. Build the foundation: faith, health, English, reading, phone discipline.',
   missions:['Fajr on time','15-minute home workout','30 minutes of English','30 minutes of reading','No phone in the morning'],
   paths:[
     {n:'EGYPT', w:'Stay and build. Land the first paid local job \u2014 salary in EGP, stability first. This is the primary path right now.'},
     {n:'UAE', w:'The Gulf option that is NOT Saudi. Dubai media buyer roles pay AED 8,000\u201315,000 and the employer sponsors the visa.'},
     {n:'REMOTE', w:'Dollar income from home. Upwork + Mostaql + Khamsat. No visa, no flight, no risk.'},
     {n:'SAUDI', w:'ON HOLD. Travel advisory Level 3, Level 4 near Yemen, airport incident 10 Oct 2026. Revisit when safe.'}]},

  {id:'c2', lvl:5,  name:'Chapter 2 \u2014 The Hunt',
   req:'Money starts moving. The Egypt job search begins and the freelance income grows alongside it.',
   missions:['Log daily expenses','Save into the EGYPT FUND','Egypt market study','Practise interview answers'],
   paths:[
     {n:'EGYPT', w:'Apply to 50 Egypt media buyer roles on Wuzzuf, LinkedIn and Bayt. Target EGP 12,000\u201320,000.'},
     {n:'UAE', w:'Build a Gulf-ready CV now. Gulf recruiters value Arabic + English + Meta certifications.'},
     {n:'REMOTE', w:'First three Upwork proposals sent. Build the profile while the local job search runs.'},
     {n:'SAUDI', w:'Track the advisory monthly. Build the savings so you can move in weeks if it clears.'}]},

  {id:'c3', lvl:15, name:'Chapter 3 \u2014 Awakened',
   req:'Speaking, courses, publishing. The market starts to notice you exist.',
   missions:['English speaking practice','Study one course module','Post on LinkedIn daily','Weekly review every Sunday'],
   paths:[
     {n:'EGYPT', w:'English speaking practice is what makes the Egypt interviews land. Egyptian agencies serve Gulf clients \u2014 they need English.'},
     {n:'UAE', w:'The certification stack (Google Ads, GA4, Meta Blueprint) is what Gulf recruiters filter on.'},
     {n:'REMOTE', w:'Your LinkedIn is your Upwork profile is your CV. One strong profile serves all three.'},
     {n:'SAUDI', w:'Keep the SAUDI FUND growing. It buys the option, not the ticket.'}]},

  {id:'c4', lvl:25, name:'Chapter 4 \u2014 The Income',
   req:'The income is now real and stable. Whether that is a salary or freelance, the floor is set.',
   missions:['Land the first paid job or client','Reach a stable monthly income','Build the savings cushion','Grow the client list'],
   paths:[
     {n:'EGYPT', w:'You have the salary. Now build savings and reputation inside the company.'},
     {n:'UAE', w:'Apply to 50 UAE roles. AED 8,000+ is life-changing money from Egypt.'},
     {n:'REMOTE', w:'Reach $1,000/month. That is more than most Egyptian salaries and it is in dollars.'},
     {n:'SAUDI', w:'Re-evaluate. If the advisory is Level 1\u20132 and airports are stable, the offer becomes possible.'}]},

  {id:'c5', lvl:40, name:'Chapter 5 \u2014 The Craft',
   req:'Content creation becomes the priority. Phone-first, professional standard.',
   missions:['Master manual control on the phone camera','Learn one-light and window-light setups','Learn phone-first audio','Shoot 10 practice projects','Build a 20-piece portfolio'],
   paths:[
     {n:'EGYPT', w:'Content skills make you the person who can both buy media AND make the ads. Rare combination.'},
     {n:'UAE', w:'Dubai agencies want people who can do performance AND content. This is the differentiator.'},
     {n:'REMOTE', w:'Content is what sells your freelance services. Show the work, not the claims.'},
     {n:'SAUDI', w:'Saudi brands need Arabic content most of all. This is the highest-leverage skill for that market.'}]},

  {id:'c6', lvl:55, name:'Chapter 6 \u2014 The Agency',
   req:'Your own advertising agency. From freelancer to founder.',
   missions:['Define services and pricing','Build the brand identity','Register the business','Land the first paying client'],
   paths:[
     {n:'EGYPT', w:'Register in Egypt. Egyptian agencies serving Gulf clients earn in dollars while paying local costs.'},
     {n:'UAE', w:'Set up in Dubai Media City or DIFC. Free zone, no local sponsor, 100% foreign ownership.'},
     {n:'REMOTE', w:'No registration needed at all. Just a brand, a site, and clients.'},
     {n:'SAUDI', w:'A Saudi entity requires a local sponsor. Do this only once you have Saudi clients already.'}]},

  {id:'c7', lvl:70, name:'Chapter 7 \u2014 Ten Clients',
   req:'A real book of business. Ten clients. The agency is no longer a gamble.',
   missions:['Grow to 3 clients','Grow to 5 clients','Grow to 10 clients','Build a team'],
   paths:[
     {n:'EGYPT', w:'Egyptian clients, dollar pricing where possible. Build the team locally.'},
     {n:'UAE', w:'Gulf clients, AED pricing. Hire Egyptian talent to deliver \u2014 that is the arbitrage.'},
     {n:'REMOTE', w:'Global clients, USD pricing, zero overhead. This is the purest form of the business.'},
     {n:'SAUDI', w:'Saudi clients are the most lucrative in the region. One retainer can equal five elsewhere.'}]},

  {id:'c8', lvl:85, name:'Chapter 8 \u2014 Germany',
   req:'The MBA. The final raid. Everything before this was preparation.',
   missions:['Shortlist 8 universities','Prepare for the GMAT','Reach the required IELTS score','Save the full cost','Submit the applications'],
   paths:[
     {n:'EGYPT', w:'The MBA works from anywhere. Your portfolio and income are what get you in.'},
     {n:'UAE', w:'Dubai has German university branches \u2014 a lower-cost path to the same degree.'},
     {n:'REMOTE', w:'Some German MBAs are part-time and remote-friendly. You do not have to stop earning.'},
     {n:'SAUDI', w:'By now you will know if the Gulf is home. Germany becomes the second option, not the escape.'}]}
];

function drawRoadmap(){
  $('roadList').innerHTML = CHAPTERS.map(c => {
    const on = S.level >= c.lvl;
    const paths = (c.paths || []).map(p =>
      '<div class="altPath"><span class="altPathTag">'+esc(p.n)+'</span><span class="altPathTxt">'+esc(p.w)+'</span></div>'
    ).join('');
    return '<div class="boss '+(on?'done':'')+'" style="'+(on?'':'opacity:.55')+'">'
      + '<h3>'+(on ? ic('check',18)+' ' : ic('lock',18)+' ')+c.name+'</h3>'
      + '<div class="ds">'+c.req+'</div>'
      + '<div class="pc">'+(on ? 'UNLOCKED' : 'UNLOCKS AT LEVEL '+c.lvl)+'</div>'
      + '<div class="steps">'+c.missions.map(m =>
          '<div class="step '+(on?'done':'')+'"><div class="sb"></div><span>'+esc(m)+'</span></div>').join('')
      + '</div>'
      + (paths ? '<div class="altPathsWrap"><div class="altPathsHead">'+ic('layers',16)+' ALTERNATIVE PATHS &mdash; pick the one that fits your situation</div>'+paths+'</div>' : '')
      + '</div>';
  }).join('');
}

/* ---------------------------------------------------------------------
   REWARD VAULT
   --------------------------------------------------------------------- */




/* ---------------------------------------------------------------------
   LIBRARY + ENGLISH
   --------------------------------------------------------------------- */
function drawLibrary(){
  const read = booksRead();
  const total = allBooks().length;
  const tag = $('libTag');
  if(tag) tag.textContent = read + ' / ' + total + ' READ';

  $('libList').innerHTML = BOOKS.map(c =>
    '<div class="cat"><h4>'+esc(c.cat)+'</h4>'
    + c.items.map(b => {
        const k = bookKey(c.cat, b.t);
        const done = S.books && S.books[k];
        return '<div class="bk bookCard '+(done?'bookDone':'')+'">'
        + '<div class="bkTop">'
        +   '<div><div class="t">'+(done?ic('check',16) + ' ':'')+esc(b.t)+'</div>'
        +   '<div class="a">'+esc(b.a)+(b.yr ? ' &middot; '+esc(String(b.yr)) : '')+'</div></div>'
        +   (b.mins ? '<div class="bkTime">'+esc(String(b.mins))+' min</div>' : '')
        + '</div>'
        + '<div class="w">'+esc(b.why)+'</div>'
        + '<div class="bkFoot">'
        +   '<span class="bkSrc">'+(b.src ? esc(b.src) : '')+'</span>'
        +   '<span class="bkXp">+'+b.xp+' XP</span>'
        +   (b.read ? '<a class="btn readBtn" href="'+b.read+'" target="_blank" rel="noopener">READ FREE &#8599;</a>' : '')
        +   '<button class="btn doneBtn '+(done?'on':'')+'" onclick="toggleBook(\''+k+'\')">'
        +     (done ? ic('check',14) + ' READ' : 'MARK AS READ')+'</button>'
        + '</div>'
        + '</div>';
      }).join('')
    + '</div>').join('');

  drawSkills();

  $('engList').innerHTML = ENGLISH_TOOLS.map(e =>
    '<div class="bk"><div class="t">'+esc(e.n)+'</div>'
    + '<div class="w">'+esc(e.w)+'</div>'
    + '<a class="xbtn" style="margin-top:7px;display:inline-block" href="'+e.u+'" target="_blank" rel="noopener">OPEN &#8599;</a></div>').join('');
}

/* ---------------------------------------------------------------------
   TYPING
   --------------------------------------------------------------------- */
function saveTyping(){
  const now = parseInt($('typeNow').value, 10);
  const tgt = parseInt($('typeTarget').value, 10);
  if(!now || now < 5){ alert('Enter your current typing speed in words per minute. Test it on monkeytype.com first.'); return; }
  if(!tgt || tgt < 10) { alert('Enter a target speed.'); return; }
  if(!S.typing) S.typing = {};
  if(!S.typing.hist) S.typing.hist = [];
  S.typing.now = now;
  S.typing.target = tgt;
  S.typing.hist.unshift({wpm:now, d:dayKey()});
  if(S.typing.hist.length > 40) S.typing.hist.pop();
  save();
  log('TYPING','Logged <b>'+now+' WPM</b>. Target: '+tgt+'.');
  addXP(40, 'skills', true);
  renderAll();
}



/* ---------------------------------------------------------------------
   EXTRA SKILLS
   --------------------------------------------------------------------- */
function drawExtras(){
  const el = $('extraList');
  if(!el) return;
  el.innerHTML = EXTRAS.map((x, i) =>
    '<div class="bk extraRow">'
    + '<div class="exTop">'
    +   '<span class="t">'+esc(x.n)+'</span>'
    +   '<span class="exTag">'+esc(x.tag)+'</span>'
    + '</div>'
    + (x.target ? '<div class="exTarget">TARGET: '+esc(x.target)+'</div>' : '')
    + '<div class="w">'+esc(x.why)+'</div>'
    + '<div class="exLearn">'
    +   '<div class="exLearnHead">WHERE TO LEARN IT</div>'
    +   (x.learn || []).map(l =>
          '<div class="exItem">'
          + '<a class="exLink" href="'+l.u+'" target="_blank" rel="noopener">'+esc(l.n)+' &#8599;</a>'
          + '<div class="exWhy">'+esc(l.w)+'</div>'
          + '</div>').join('')
    + '</div>'
    + '</div>').join('');
}

/* ---- SKILL TREE — ordered by importance, with prerequisites ---- */
function drawSkillTree(){
  const el = $('skillTree');
  if(!el) return;
  const done = S.skillTree || {};
  const next = getNextSkill();

  el.innerHTML = SKILL_TREE.map(s => {
    const unlocked = isSkillUnlocked(s.id);
    const completed = !!done[s.id];
    const isNext = next && next.id === s.id;
    const reqNames = (s.requires||[]).map(r => {
      const rs = SKILL_TREE.find(x => x.id === r);
      return rs ? rs.n : r;
    });

    let status, statusColor;
    if(completed){ status = 'COMPLETED'; statusColor = 'var(--green)'; }
    else if(isNext){ status = 'NEXT UP'; statusColor = 'var(--gold)'; }
    else if(unlocked){ status = 'AVAILABLE'; statusColor = 'var(--glow)'; }
    else { status = 'LOCKED'; statusColor = 'var(--muted)'; }

    return '<div class="skillTreeRow ' + (completed?'stDone':unlocked?'stOpen':'stLocked') + '">'
      + '<div class="stHead">'
      +   '<span class="stPriority">#' + s.priority + '</span>'
      +   '<span class="stName">' + esc(s.n) + '</span>'
      +   '<span class="stType">' + esc(s.type) + '</span>'
      +   '<span class="stStatus" style="color:' + statusColor + '">' + status + '</span>'
      + '</div>'
      + '<div class="stTarget">TARGET: ' + esc(s.target) + '</div>'
      + '<div class="stWhy">' + esc(s.why) + '</div>'
      + (reqNames.length ? '<div class="stReq">REQUIRES: ' + reqNames.map(esc).join(' + ') + '</div>' : '')
      + '<div class="stLearn">'
      +   '<div class="stLearnHead">WHERE TO LEARN</div>'
      +   (s.learn||[]).map(l =>
        '<div class="stItem">'
        + '<a class="stLink" href="' + l.u + '" target="_blank" rel="noopener">' + esc(l.n) + ' &#8599;</a>'
        + '<div class="stWhy">' + esc(l.w) + '</div>'
        + '</div>').join('')
      + '</div>'
      + (unlocked && !completed
          ? '<button class="btn small" style="margin-top:10px" onclick="completeSkill(\'' + s.id + '\')">Mark Complete</button>'
          : '')
      + '</div>';
  }).join('');
}

/* ---- COURSE TREE — same lock/unlock system as skills ---- */
function drawCourseTree(){
  const el = $('courseTree');
  if(!el) return;
  const next = getNextCourse();

  el.innerHTML = COURSES.map(c => {
    const unlocked = isCourseUnlocked(c.id);
    const completed = !!S.courses[c.id];
    const isNext = next && next.id === c.id;

    let status, statusColor;
    if(completed){ status = 'COMPLETED'; statusColor = 'var(--green)'; }
    else if(isNext){ status = 'NEXT UP'; statusColor = 'var(--gold)'; }
    else if(unlocked){ status = 'AVAILABLE'; statusColor = 'var(--glow)'; }
    else { status = 'LOCKED'; statusColor = 'var(--muted)'; }

    return '<div class="skillTreeRow ' + (completed?'stDone':unlocked?'stOpen':'stLocked') + '">'
      + '<div class="stHead">'
      +   '<span class="stPriority">S' + c.stage + '</span>'
      +   '<span class="stName">' + esc(c.name) + '</span>'
      +   '<span class="stType">' + esc(c.platform) + '</span>'
      +   '<span class="stStatus" style="color:' + statusColor + '">' + status + '</span>'
      + '</div>'
      + '<div class="stTarget">' + esc(c.hours || '') + '</div>'
      + '<div class="stWhy">' + esc(c.why) + '</div>'
      + '<div class="stLearn">'
      +   '<a class="stLink" href="' + c.url + '" target="_blank" rel="noopener">Start Course &#8599;</a>'
      + '</div>'
      + (unlocked && !completed
          ? '<button class="btn small" style="margin-top:10px" onclick="completeCourseById(\'' + c.id + '\')">Mark Complete (+60 XP)</button>'
          : '')
      + '</div>';
  }).join('');
}

/* ---- the four skills, side by side, with the B2 line ---- */
function drawSkills(){
  const max = 70;
  $('skillGrid').innerHTML = SKILLS.map(s => {
    const w = Math.min(100, s.v/max*100);
    const linePos = B2_LINE/max*100;
    const ok = s.v >= B2_LINE;
    return '<div class="skillrow">'
      + '<div class="skhead">'
      +   '<span class="skname">'+esc(s.k)+'</span>'
      +   '<span class="skval" style="color:'+(ok?'var(--green)':'var(--red)')+'">'+s.v+'</span>'
      + '</div>'
      + '<div class="sktrack">'
      +   '<i class="skfill" style="width:'+w+'%;background:'+(ok?'linear-gradient(90deg,var(--green),#7bffb0)':'linear-gradient(90deg,var(--red),var(--gold))')+'"></i>'
      +   '<span class="skline" style="left:'+linePos+'%" title="B2 threshold"></span>'
      + '</div>'
      + '<div class="skmeta"><span>'+esc(s.lvl)+'</span><span>'+esc(s.note)+'</span></div>'
      + '</div>';
  }).join('') + '<div class="sklegend"><span class="skdot"></span> The vertical line marks the B2 threshold (51). Anything left of it is below B2.</div>';

  const wr = SKILLS.find(s=>s.k==='Writing');
  const need = 51*4 - (63+50+48+wr.v);
  $('skillMath').innerHTML =
    '<b style="color:var(--glow)">THE MATH:</b> Your average is <b>'+SKILL_AVG+'</b>. B2 needs <b>'+B2_LINE+'</b>. '
    + 'If writing goes from <b>33</b> to <b>43</b>, your average hits 51 and you are B2. '
    + 'One skill. Ten points. Everything else is already close or above.';
}

/* Hunter Vitals & Class Resource system removed cleanly (XP is core currency) */

/* ---------------------------------------------------------------------
   SHADOW SOLDIER
   --------------------------------------------------------------------- */
function drawShadow(){
  const disp = $('shadowDisplay');
  if(disp){
    const stage = shadowStage();
    const mood = shadowMood();
    const moodData = SHADOW_SOLDIER.moods[mood];

    /* progress toward the next evolution */
    const xp = S.shadowXp || 0;
    const nextLvl = ((S.shadowLevel || 0) + 1) * 8;
    const inLvl = xp % 8;
    const pct = Math.round(inLvl / 8 * 100);
    const nextStage = SHADOW_SOLDIER.stages.find(s => s.level > (S.shadowLevel || 0));

    if($('shadowTag')) $('shadowTag').textContent = 'LEVEL ' + (S.shadowLevel || 0);

    disp.innerHTML =
        '<div class="shadowGlyph">' + ic(stage.icon,96) + '</div>'
      + '<div class="shadowName">' + esc(stage.name) + '</div>'
      + '<div class="shadowDesc">' + esc(stage.desc) + '</div>'
      + '<div class="shadowMood">' + ic(moodData.icon,18) + ' ' + esc(moodData.desc) + '</div>'
      + '<div class="shadowProgress">'
      +   '<div class="skhead"><span class="skname">Progress to level ' + ((S.shadowLevel||0) + 1) + '</span>'
      +   '<span class="skval">' + inLvl + ' / 8 missions</span></div>'
      +   '<div class="sktrack"><i class="skfill" style="width:' + pct + '%;background:linear-gradient(90deg,var(--glow),var(--glow2))"></i></div>'
      +   '<div class="skmeta"><span>' + (nextStage
            ? 'Next evolution: ' + nextStage.name + ' at level ' + nextStage.level
            : 'Final form reached') + '</span></div>'
      + '</div>';
  }

  /* characters */
  drawCharacters();
}

/* ---------------------------------------------------------------------
   EGG SYSTEM — passive. Eggs pile up as you play, open them in one tap.
   --------------------------------------------------------------------- */
function drawEggs(){
  const el = $('eggList');
  if(!el) return;

  const total = eggCount();
  const tag = $('eggTag');
  if(tag){
    tag.textContent = total + ' READY';
    tag.style.color = total ? 'var(--gold)' : 'var(--muted)';
  }

  let html = '';

  /* the big open button, only when there is something to open */
  if(total > 0){
    html += '<div class="eggOpenBar">'
      + '<div class="eobLeft">' + ic('egg',30) + '<div>'
      +   '<div class="eobBig">' + total + ' EGG' + (total>1?'S':'') + ' READY</div>'
      +   '<div class="eobSub">Earned while you played. No cost to open.</div>'
      + '</div></div>'
      + '<button class="btn eggOpenBtn" onclick="openAllEggs()">'
      +   ic('sparkle',16) + ' OPEN ALL</button>'
      + '</div>';
  } else {
    html += '<div class="eggEmpty">'
      + ic('egg',30)
      + '<div><div class="eobBig">No eggs yet</div>'
      + '<div class="eobSub">You earn eggs just by playing. Keep clearing missions.</div></div>'
      + '</div>';
  }

  /* how eggs arrive */
  html += '<div class="eggRules">'
    + '<div class="eggRule">' + ic('list',16) + '<span>Every <b>' + EGG_DROPS.missionsPerEgg + ' missions</b> cleared in a day &rarr; 1 Basic egg</span></div>'
    + '<div class="eggRule">' + ic('target',16) + '<span>A <b>Perfect Day</b> &rarr; 1 Premium egg</span></div>'
    + '<div class="eggRule">' + ic('flame',16) + '<span>Every <b>' + EGG_DROPS.streakEvery + '-day streak</b> &rarr; 1 Premium egg</span></div>'
    + '<div class="eggRule">' + ic('trophy',16) + '<span>Clearing a <b>Boss Raid</b> &rarr; 1 Legendary egg</span></div>'
    + '<div class="eggRule">' + ic('crown',16) + '<span>Every <b>' + EGG_DROPS.levelEvery + ' levels</b> &rarr; 1 Monarch egg</span></div>'
    + '</div>';

  /* your current eggs, by type */
  if(total > 0){
    html += '<div class="eggStock">';
    EGG_TYPES.forEach(egg => {
      const n = (S.eggs && S.eggs[egg.id]) || 0;
      if(!n) return;
      const best = Object.entries(egg.chances).filter(([r,c]) => c > 0)
        .sort((a,b) => RARITY_ORDER[b[0]] - RARITY_ORDER[a[0]])[0];
      html += '<div class="eggStockItem" onclick="openEgg(\'' + egg.id + '\')">'
        + '<div class="esiIcon">' + ic(egg.icon,26) + '</div>'
        + '<div class="esiName">' + esc(egg.name) + '</div>'
        + '<div class="esiCount">&times;' + n + '</div>'
        + '<div class="esiBest" style="color:' + RARITY_COLOR[best[0]] + '">'
        +   'best: ' + RARITY_LABEL[best[0]] + '</div>'
        + '</div>';
    });
    html += '</div>';
  }

  el.innerHTML = html;
}

/* ---------------------------------------------------------------------
   SHADOW CHARACTERS
   --------------------------------------------------------------------- */
function drawCharacters(){
  const el = $('charList');
  if(!el) return;

  const ct = $('charTag');
  const owned = S.shadowChars.length;
  if(ct) ct.textContent = owned + ' / ' + SHADOW_CHARACTERS.length + ' UNLOCKED';

  if(!owned){
    el.innerHTML = '<div class="hint">No characters yet. Open an egg to summon your first shadow.</div>';
    return;
  }

  /* sort: best rarity first, then by star, then power */
  const list = S.shadowChars.slice().sort((a,b) => {
    const ca = SHADOW_CHARACTERS.find(c => c.id === a.id) || {};
    const cb = SHADOW_CHARACTERS.find(c => c.id === b.id) || {};
    return (RARITY_ORDER[cb.rarity]||0) - (RARITY_ORDER[ca.rarity]||0)
        || b.star - a.star || b.power - a.power;
  });

  el.innerHTML = list.map(o => {
    const char = SHADOW_CHARACTERS.find(c => c.id === o.id);
    if(!char) return '';
    const col = RARITY_COLOR[char.rarity];
    const isMythic = char.rarity === 'mythic';
    const imgHtml = char.img
      ? '<img src="' + char.img + '" alt="' + esc(char.name) + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" loading="lazy">'
      : '';
    const fallbackHtml = '<div class="charFallback icoWrap"' + (char.img ? ' style="display:none"' : '') + '>' + ic(char.icon || 'soldier', 64) + '</div>';

    return '<div class="charCard' + (isMythic ? ' mythicCard' : '') + '" style="border-left-color:' + col + '">'
      + '<div class="charTop">'
      +   '<div class="charPic r-' + char.rarity + '">'
      +     imgHtml
      +     fallbackHtml
      +     (isMythic ? '<div class="charGlow"></div>' : '') + '</div>'
      +   '<div class="charBody">'
      +     '<div class="charHead">'
      +       '<span class="charName">' + ic(char.icon,20) + ' ' + esc(char.name) + '</span>'
      +       '<span class="charRar" style="color:' + col + ';border-color:' + col + '">' + RARITY_LABEL[char.rarity] + '</span>'
      +     '</div>'
      +     '<div class="charTitle">' + esc(char.title) + '</div>'
      +     '<div class="charStars">' + starRow(o.star, MAX_STARS, 14)
      +       '<span class="charPower">PWR ' + o.power + '</span></div>'
      +   '</div>'
      + '</div>'
      + '<div class="charAbility">' + esc(char.ability) + '</div>'
      + '<div class="charFoot">'
      +   '<span class="charDesc">' + esc(char.desc) + '</span>'
      +   (o.star < MAX_STARS
          ? '<button class="btn charBtn" onclick="upgradeCharacter(\'' + char.id + '\')">'
            + ic('arrowUp',13) + ' ' + (o.star*150) + ' XP</button>'
          : '<span class="charMax">' + icF('star',13) + ' MAX</span>')
      + '</div>'
      + '</div>';
  }).join('');
}

/* ---------------------------------------------------------------------
   VOCABULARY
   --------------------------------------------------------------------- */
function drawVocab(){
  const el = $('vocabToday');
  if(!el) return;

  const words = typeof todaysVocab === 'function' ? todaysVocab() : [];
  const learnedCount = typeof vocabLearnedTodayCount === 'function' ? vocabLearnedTodayCount() : 0;
  const totalBase = Math.min(words.length, typeof VOCAB_PER_DAY !== 'undefined' ? VOCAB_PER_DAY : 15);

  const vt = $('vocabTag');
  if(vt){
    vt.textContent = learnedCount + ' / ' + words.length + ' LEARNED';
    vt.style.color = learnedCount >= words.length && words.length > 0 ? 'var(--green)' : 'var(--glow)';
  }

  let html = '';
  html += '<div class="vocab-action-bar" style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap;">'
        + '<div style="font-size:13px;color:var(--text);"><b>' + totalBase + ' New Words Today</b> &bull; <span style="color:var(--glow);">' + learnedCount + ' / ' + words.length + ' Practiced</span></div>'
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;">'
        +   '<button class="btn vq-btn" onclick="loadMoreVocab()" style="background:rgba(0,240,255,0.12);border:1px solid var(--glow);color:var(--glow);font-weight:700;padding:7px 14px;">+ Load 5 More</button>'
        +   '<button class="btn vq-btn" onclick="openVocabQuizModal()" style="background:rgba(251,191,36,0.12);border:1px solid var(--gold);color:var(--gold);font-weight:700;padding:7px 14px;">⚡ 60s Speed Quiz</button>'
        + '</div>'
        + '</div>';

  html += words.map(w => {
    const k = vocabKey(w.w);
    const status = typeof getVocabStatus === 'function' ? getVocabStatus(w.w) : 'new';
    const isMastered = status === 'mastered';
    const isLearning = status === 'learning';
    const cleanWord = esc(w.w).replace(/'/g, "\\'");

    return '<div class="vocabCard ' + status + '">'
      + '<div class="vcHead">'
      +   '<div style="display:flex;align-items:center;gap:8px;">'
      +     '<div class="vcWord">' + esc(w.w) + '</div>'
      +     '<button class="speak-btn" title="Listen (Web Speech)" onclick="event.stopPropagation(); speakVocabWord(\'' + cleanWord + '\');" style="background:transparent;border:none;color:var(--glow);cursor:pointer;font-size:1.1rem;padding:0 4px;">🔊</button>'
      +   '</div>'
      +   '<div class="vcPhonetic" style="font-size:0.8rem;color:var(--muted);font-style:italic;">' + esc(w.phonetic || '') + '</div>'
      + '</div>'
      + '<div class="vcAr">' + esc(w.ar) + '</div>'
      + '<div class="vcDef">' + esc(w.def) + '</div>'
      + '<div class="vcEx">&ldquo;' + esc(w.ex) + '&rdquo;</div>'
      + '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.08);flex-wrap:wrap;gap:8px;">'
      +   '<div class="vcCat">' + esc(w.cat) + '</div>'
      +   '<div class="vocab-status-pills" style="display:flex;gap:6px;">'
      +     '<button class="v-pill ' + (status === 'new' ? 'active' : '') + '" onclick="event.stopPropagation(); setVocabStatus(\'' + cleanWord + '\', \'new\');">New</button>'
      +     '<button class="v-pill ' + (isLearning ? 'active' : '') + '" onclick="event.stopPropagation(); setVocabStatus(\'' + cleanWord + '\', \'learning\');">Learning (+5 XP)</button>'
      +     '<button class="v-pill ' + (isMastered ? 'active' : '') + '" onclick="event.stopPropagation(); setVocabStatus(\'' + cleanWord + '\', \'mastered\');">Mastered (+15 XP)</button>'
      +   '</div>'
      + '</div>'
      + '</div>';
  }).join('');

  el.innerHTML = html;

  const masteredCount = S.masteredVocabulary ? Object.keys(S.masteredVocabulary).length : (S.vocabTotal || 0);
  const poolSize = typeof VOCAB !== 'undefined' ? VOCAB.length : 0;
  const histDaysCount = S.vocabularyHistory ? Object.keys(S.vocabularyHistory).length : 0;

  if($('vTotal')) $('vTotal').textContent = masteredCount;
  if($('vToday')) $('vToday').textContent = learnedCount + ' / ' + words.length;
  if($('vDays'))  $('vDays').textContent  = histDaysCount;
  if($('vPool'))  $('vPool').textContent  = poolSize;
  if($('vocabTotalTag')) $('vocabTotalTag').textContent = masteredCount + ' / ' + poolSize + ' MASTERED';

  const bank = $('vocabBank');
  if(bank && typeof VOCAB !== 'undefined'){
    const cats = {};
    VOCAB.forEach(w => { (cats[w.cat] = cats[w.cat] || []).push(w); });
    bank.innerHTML = Object.keys(cats).map(cat =>
      '<div class="vocabCat">'
      + '<div class="vcatHead">' + esc(cat) + '<span>' + cats[cat].length + '</span></div>'
      + cats[cat].map(w => {
          const st = typeof getVocabStatus === 'function' ? getVocabStatus(w.w) : 'new';
          const on = st === 'mastered';
          const cleanW = esc(w.w).replace(/'/g, "\\'");
          return '<div class="vbRow ' + st + '">'
            + '<span class="vbWord">' + esc(w.w) + '</span>'
            + '<button class="speak-btn-mini" onclick="speakVocabWord(\'' + cleanW + '\')" style="background:transparent;border:none;color:var(--glow);cursor:pointer;font-size:0.8rem;padding:0 2px;">🔊</button>'
            + '<span class="vbAr">' + esc(w.ar) + '</span>'
            + (on ? '<span class="vbTick">' + ic('check',14) + '</span>' : '')
            + '</div>';
        }).join('')
      + '</div>').join('');
  }
}

/* ---------------------------------------------------------------------
   VISION BOARD
   --------------------------------------------------------------------- */
function drawVision(){
  const grid = $('visionGrid');
  if(!grid) return;

  $('visionTag').textContent = S.vision.length + ' / ' + VISION_BOARD.length + ' SET';

  grid.innerHTML = VISION_BOARD.map(v =>
    '<div class="bk visionCard ' + (S.vision.includes(v.id) ? 'on' : '') + '" onclick="toggleVision(\'' + v.id + '\')">'
    + '<div class="visionGlyph">' + ic(v.icon,44) + '</div>'
    + '<div class="t">' + esc(v.title) + '</div>'
    + '<div class="w">' + esc(v.desc) + '</div>'
    + '</div>').join('');
}

/* ---------------------------------------------------------------------
   COACH
   --------------------------------------------------------------------- */


function sendToHermes(){
  const s = $('cName').value.trim();
  const b = $('cBody').value.trim();
  if(!s && !b){ alert('Write something first.'); return; }

  const subject = s || 'Progress update';
  const av = available(DAILY);
  const full = 'SOLO LEVELING REPORT\n'
    + 'Subject: ' + subject + '\n'
    + 'Level: ' + S.level + ' | XP: ' + S.xp + ' | Rank: ' + RANKS[rankIdx(S.xp)].name
    + ' | Streak: ' + S.streak + ' days | Freezes: ' + S.freezes + '\n'
    + (S.punishment > 0 ? 'Freeze debt outstanding: ' + S.punishment + ' XP\n' : '')
    + 'Missions completed today: ' + av.filter(m=>S.daily[m.id]).length + ' / ' + av.length + '\n'
    + 'Courses completed: ' + Object.keys(S.courses).length + ' / ' + COURSES.length + '\n\n'
    + b;

  saveMsg(subject, b);
  copy(full);
  $('cName').value = ''; $('cBody').value = '';
  log('COACH','Message saved and copied. Paste it to Hermes in chat.');
  renderAll();
}

function quickReport(){
  const av = available(DAILY);
  const done = av.filter(m => S.daily[m.id]);
  const miss = av.filter(m => !S.daily[m.id]);

  const body = 'What I completed today:\n'
    + (done.length ? done.map(m=>'  - '+m.name).join('\n') : '  (nothing yet)') + '\n\n'
    + 'What I did not complete:\n'
    + (miss.length ? miss.map(m=>'  - '+m.name).join('\n') : '  (all done)') + '\n\n'
    + 'Boss raid progress:\n'
    + BOSSES.map(b => '  ' + b.name + ': ' + bossPct(b.id) + '%').join('\n') + '\n\n'
    + 'What I want from Hermes:\n  ';

  $('cName').value = 'Daily progress report';
  $('cBody').value = body;
}

function copy(text){
  try{
    if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(text); return; }
  }catch(e){}
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); }catch(e){}
  ta.remove();
}

/* ---------------------------------------------------------------------
   STATUS
   --------------------------------------------------------------------- */
/* ---- the all-time records block (was on the Status tab) ---- */
function drawRecords(){
  const r = id => (document.getElementById(id) || {}).textContent;
  const set = (id,v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
  set('rQ', S.qDone);
  set('rS', S.sDone);
  set('rB', S.best);
  set('rR', (S.rewards||[]).filter(x=>x.claimed).length);
  set('rP', S.penCount);
  set('rL', S.xpLost);
  set('rC', Object.keys(S.courses||{}).length);
  set('rF', S.freezes);

  /* the hunter rank ladder */
  const rl = document.getElementById('rankList');
  if(rl){
    const ri = rankIdx(S.xp);
    rl.innerHTML = RANKS.map((r,i) => {
      const got = i <= ri;
      const nxt = RANKS[i+1];
      let pct = 0;
      if(got) pct = (i < ri) ? 100 : (nxt ? Math.min(100,(S.xp-r.xp)/(nxt.xp-r.xp)*100) : 100);
      return '<div class="stat" style="margin-bottom:10px;'+(got?'border-color:var(--glow)':'')+'">'
        + '<div class="h"><span class="n">'+r.name+'</span><span class="lv">'+(got?ic('check',16):'')+'</span></div>'
        + '<div class="bar thin"><i style="width:'+pct+'%"></i></div>'
        + '<div class="sb">'+r.note+' &middot; unlocks at '+r.xp.toLocaleString()+' XP</div></div>';
    }).join('');
  }
}

/* ---- badges: earned ones light up, locked ones stay grey ---- */
function drawBadges(){
  const got = S.badges.length;
  $('badgeTag').textContent = got + ' / ' + BADGES.length + ' EARNED';
  $('badgeGrid').innerHTML = BADGES.map(b => {
    const on = S.badges.includes(b.id);
    return '<div class="badgeItem '+(on?'got':'')+'">'
      + '<div class="bIcon">'+(on ? ic(b.icon,30) : ic('lock',30))+'</div>'
      + '<div class="bName">'+esc(b.name)+'</div>'
      + '<div class="bDesc">'+esc(b.desc)+'</div>'
      + '</div>';
  }).join('');
}

/* ---------------------------------------------------------------------
   WEEKLY REVIEW
   --------------------------------------------------------------------- */
function drawReview(){
  const due = reviewDue();
  const tag = $('reviewTag');
  if(tag){
    tag.textContent = due ? 'DUE NOW' : 'UP TO DATE';
    tag.style.color = due ? 'var(--gold)' : 'var(--green)';
    tag.style.borderColor = due ? 'rgba(255,204,77,.5)' : 'rgba(37,224,122,.5)';
  }

  const wk = weekKey();
  const saved = (S.reviews || []).find(r => r.week === wk);
  const savedA = saved ? saved.answers : {};

  $('reviewForm').innerHTML = REVIEW_QS.map(q =>
    '<div><label style="display:block;font-size:13px;color:var(--glow);margin-bottom:6px;letter-spacing:.5px">'
    + esc(q.q) + '</label>'
    + '<textarea id="rv_' + q.k + '" data-k="' + q.k + '" placeholder="Be honest. Nobody reads this but you.">'
    + esc(savedA[q.k] || '') + '</textarea></div>').join('');

  const list = S.reviews || [];
  $('reviewCount').textContent = list.length;
  $('reviewList').innerHTML = list.length
    ? list.map(r =>
        '<div class="bk"><div class="t">Week of ' + esc(r.week) + '</div>'
        + '<div class="a">Level ' + r.level + ' &middot; ' + (r.xp||0).toLocaleString() + ' XP &middot; '
        + r.missions + ' missions &middot; streak ' + r.streak + '</div>'
        + REVIEW_QS.map(q => r.answers && r.answers[q.k]
            ? '<div class="w"><b style="color:var(--glow)">' + esc(q.q) + '</b><br>' + esc(r.answers[q.k]) + '</div>'
            : '').join('')
        + '</div>').join('')
    : '<div class="hint" style="margin:0">No reviews saved yet. Do the first one this Sunday.</div>';
}

function submitReview(){
  const answers = {};
  REVIEW_QS.forEach(q => {
    const el = $('rv_' + q.k);
    if(el) answers[q.k] = el.value.trim();
  });
  const filled = Object.values(answers).filter(v => v).length;
  if(filled < 3){ alert('Answer at least three of the five questions. A review with nothing in it is not a review.'); return; }
  saveReview(answers);
}

/* ---------------------------------------------------------------------
   INSIGHTS
   --------------------------------------------------------------------- */
function drawInsights(){
  const today = typeof dayKey === 'function' ? dayKey() : new Date().toISOString().slice(0,10);
  if(typeof TaskEngine !== 'undefined' && TaskEngine.syncTodayHistory) TaskEngine.syncTodayHistory();

  const cal = streakCalendar();
  if($('heatMap')) $('heatMap').innerHTML = cal.html;

  const analytics = (typeof XpEngine !== 'undefined' && XpEngine.getAnalytics) ? XpEngine.getAnalytics() : { today: 0, thisWeek: 0, thisMonth: 0, trend14: [], bySource: {} };
  const todayRec = (S.dailyHistory && S.dailyHistory[today]) || { missionsCompleted: 0, missionsTotal: 6 };

  // Compute real 7-day & 30-day completion metrics from S.dailyHistory
  let wkDone = 0, wkTot = 0, active30 = 0, missed30 = 0, tot30Done = 0, tot30Total = 0;
  for(let i = 0; i < 30; i++){
    const dt = typeof SystemClock !== 'undefined' ? SystemClock.shiftDayKey(today, -i) : today;
    const rec = S.dailyHistory && S.dailyHistory[dt];
    if(i < 7 && rec){
      wkDone += Number(rec.missionsCompleted || 0);
      wkTot  += Number(rec.missionsTotal || 0);
    }
    if(rec){
      if(rec.activeDay || (rec.missionsCompleted > 0)) active30++;
      else if(i > 0) missed30++;
      tot30Done  += Number(rec.missionsCompleted || 0);
      tot30Total += Number(rec.missionsTotal || 0);
    }
  }
  const compRate = tot30Total > 0 ? Math.round((tot30Done / tot30Total) * 100) : 0;

  if($('streakStats')){
    $('streakStats').innerHTML =
        statCard('Current Streak', (S.streak || 0) + ' Days', 'consecutive active days', 'var(--gold)')
      + statCard('Best Streak', (S.best || 0) + ' Days', 'all-time record', 'var(--glow)')
      + statCard('Today', todayRec.missionsCompleted + ' / ' + todayRec.missionsTotal, 'missions cleared today', 'var(--glow)')
      + statCard('Weekly Completion', wkDone + ' / ' + (wkTot || 0), 'last 7 days', 'var(--green)')
      + statCard('Weekly XP', '+' + (analytics.thisWeek || 0).toLocaleString(), 'last 7 days from ledger', 'var(--glow)')
      + statCard('Monthly XP', '+' + (analytics.thisMonth || 0).toLocaleString(), 'this month from ledger', 'var(--gold)')
      + statCard('Active Days (30d)', active30, missed30 + ' missed days', active30 >= 20 ? 'var(--green)' : 'var(--gold)')
      + statCard('Completion Rate', compRate + '%', '30-day mission rate', compRate >= 60 ? 'var(--green)' : 'var(--muted)');
  }

  /* XP Trend (Last 14 Days from Ledger) & Source Breakdown */
  const xb = $('xpBreak');
  if(xb){
    const trend = analytics.trend14 || [];
    const maxDayXP = Math.max(10, ...trend.map(t => Math.max(t.earned, t.penalty)));
    let trendHtml = '<div style="margin-bottom:18px;">'
      + '<div style="font-size:12px;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">14-Day XP Trend (Real Ledger)</div>'
      + '<div style="display:flex;align-items:flex-end;gap:6px;height:90px;padding:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:6px;">'
      + trend.map(t => {
          const hPct = Math.round((t.earned / maxDayXP) * 100);
          const lbl = t.date.slice(5);
          return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;" title="'+t.date+': +'+t.earned+' XP earned / -'+t.penalty+' penalty">'
            + '<div style="width:100%;max-width:22px;height:'+Math.max(4, hPct)+'%;background:'+(t.earned > 0 ? 'var(--glow)' : 'rgba(255,255,255,0.08)')+';border-radius:3px 3px 0 0;"></div>'
            + '<div style="font-size:9px;color:var(--muted);margin-top:4px;">'+lbl+'</div>'
            + '</div>';
        }).join('')
      + '</div></div>';

    const bySrc = analytics.bySource || S.xpSource || {};
    const rows = Object.keys(bySrc)
      .map(k => ({ n: k.toUpperCase(), v: bySrc[k] || 0 }))
      .filter(r => r.v > 0)
      .sort((a,b) => b.v - a.v);
    const totalSrc = Math.max(1, rows.reduce((acc, r) => acc + r.v, 0));

    xb.innerHTML = trendHtml + (rows.length ? rows.map(r =>
      '<div class="skillrow">'
      + '<div class="skhead"><span class="skname">' + esc(r.n) + '</span>'
      + '<span class="skval" style="color:var(--glow);">' + r.v.toLocaleString() + ' XP</span></div>'
      + '<div class="sktrack"><i class="skfill" style="width:' + Math.min(100, r.v/totalSrc*100) + '%;background:var(--glow);"></i></div>'
      + '</div>').join('') : '<div class="hint">Complete missions to populate your XP breakdown.</div>');
  }

  /* Rank progress */
  const ri = rankIdx(S.xp || 0);
  const cur = RANKS[ri], nxt = RANKS[ri+1];
  if($('rankProgTag')) $('rankProgTag').textContent = cur.name;
  if($('rankProg')){
    if(nxt){
      const span = nxt.xp - cur.xp, done = Math.max(0, (S.xp || 0) - cur.xp);
      const pct = Math.min(100, done/span*100);
      const left = Math.max(0, nxt.xp - (S.xp || 0));
      $('rankProg').innerHTML =
          '<div class="skhead"><span class="skname">' + cur.name + ' &rarr; ' + nxt.name + '</span>'
        + '<span class="skval" style="color:var(--glow)">' + done.toLocaleString() + ' / ' + span.toLocaleString() + '</span></div>'
        + '<div class="sktrack"><i class="skfill" style="width:' + pct + '%;background:linear-gradient(90deg,var(--glow),var(--glow2))"></i></div>'
        + '<div class="skmeta"><span>' + Math.round(pct) + '% complete</span><span>' + left.toLocaleString() + ' XP remaining</span></div>';
    } else {
      $('rankProg').innerHTML = '<div class="hint" style="margin:0;color:var(--green)">Maximum rank reached.</div>';
    }
  }

  /* Domain balance */
  if($('domainBal')){
    const vals = STATS.map(s => ({key:s.key, name:s.name, icon:s.icon, xp:(S.statXP && S.statXP[s.key])||0}));
    const maxV = Math.max(1, ...vals.map(v => v.xp));
    $('domainBal').innerHTML = vals.map(v =>
      '<div class="skillrow">'
      + '<div class="skhead"><span class="skname">' + ic(v.icon,17) + ' ' + v.name + '</span>'
      + '<span class="skval" style="color:var(--glow)">' + v.xp.toLocaleString() + ' XP</span></div>'
      + '<div class="sktrack"><i class="skfill" style="width:' + (v.xp/maxV*100) + '%;background:linear-gradient(90deg,var(--glow),var(--glow2))"></i></div>'
      + '</div>').join('');
  }

  const sg = $('statGrid');
  if(sg){
    sg.innerHTML = STATS.map(s => {
      const lv = statOverall(s.key);
      const xp = (S.statXP && S.statXP[s.key]) || 0;
      const inLv = xp % STAT_XP;
      return '<div class="stat">'
        + '<div class="h"><span class="n">'+ic(s.icon,18)+' '+s.name+'</span><span class="lv">Lv '+lv+'</span></div>'
        + '<div class="bar thin"><i style="width:'+(inLv/STAT_XP*100)+'%"></i></div>'
        + '<div class="sb">'+esc(s.why)+'</div></div>';
    }).join('');
  }

  const al = $('assessList');
  if(al){
    al.innerHTML = ASSESSMENT.map(a =>
      '<div class="bk"><div class="t">'+esc(a.title)+'</div>'
      + '<div class="w">'+esc(a.body).replace(/\\n/g,'<br>')+'</div></div>').join('');
  }

  if(typeof drawBadges === 'function') drawBadges();
  if(typeof drawRecords === 'function') drawRecords();
}

let CAL_OFFSET = 0;
function calMonth(dir){
  CAL_OFFSET += dir;
  drawInsights();
}

/* Monthly streak calendar strictly using Africa/Cairo keys & S.dailyHistory */
function streakCalendar(){
  const todayStr = typeof dayKey === 'function' ? dayKey() : new Date().toISOString().slice(0,10);
  const [ty, tm, td] = todayStr.split('-').map(Number);

  const viewDate = new Date(Date.UTC(ty, tm - 1 + CAL_OFFSET, 1));
  const y = viewDate.getUTCFullYear();
  const m = viewDate.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const firstDay = new Date(Date.UTC(y, m, 1)).getUTCDay();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['S','M','T','W','T','F','S'];

  let active = 0, missed = 0, cells = '';
  cells += '<div class="calHead"><button class="calNav" onclick="calMonth(-1)">&larr;</button>'
         + '<div class="calTitle">' + monthNames[m] + ' ' + y + '</div>'
         + '<button class="calNav" onclick="calMonth(1)">&rarr;</button></div>';
  cells += '<div class="calGrid">';
  dayNames.forEach(d => { cells += '<div class="calDow">' + d + '</div>'; });
  for(let i = 0; i < firstDay; i++) cells += '<div class="calCell empty"></div>';

  for(let day = 1; day <= daysInMonth; day++){
    const k = y + '-' + String(m+1).padStart(2,'0') + '-' + String(day).padStart(2,'0');
    const isToday = (k === todayStr);
    const isFuture = k > todayStr;
    const rec = (S.dailyHistory && S.dailyHistory[k]) || null;

    let done = 0, tot = 0, cls = 'calCell';
    if(isFuture){
      cls += ' future';
    } else if(rec){
      done = Number(rec.missionsCompleted || 0);
      tot  = Number(rec.missionsTotal || 0);
      const pct = tot > 0 ? done / tot : (rec.activeDay ? 1 : 0);
      if(pct >= 1)      { cls += ' dFull'; active++; }
      else if(pct > 0 || rec.activeDay) { cls += ' dSome'; active++; }
      else { cls += ' dMiss'; missed++; }
    } else if(S.started && S.startedOn && k >= S.startedOn && k < todayStr){
      cls += ' dMiss'; missed++;
    } else {
      cls += ' dNone';
    }

    if(isToday) cls += ' today';
    const detail = isFuture ? 'Future'
      : (rec && (tot > 0 || done > 0) ? done + '/' + Math.max(done, tot) + ' missions'
        : (cls.includes('dMiss') ? '0 missions (Missed)' : ''));

    cells += '<div class="' + cls + '" title="' + k + (detail ? ' · ' + detail : '') + '">'
           + '<span class="calNum">' + day + '</span>'
           + (done > 0 && done >= tot && tot > 0 ? '<span class="calStar">&#9733;</span>' : '')
           + (detail ? '<span class="calInfo">' + detail + '</span>' : '')
           + '</div>';
  }
  cells += '</div>';

  const runs = '<div class="calLegend">'
        + '<span><i class="calCell dFull"></i> Completed (All)</span>'
        + '<span><i class="calCell dSome"></i> Active (Partial)</span>'
        + '<span><i class="calCell dMiss"></i> Missed (0)</span>'
        + '<span><i class="calCell dNone"></i> Before start</span>'
        + '</div>';

  return { html: cells + runs, active: active, missed: missed };
}

function statCard(label, value, sub, colour){
  return '<div class="stat"><div class="h"><span class="n">' + esc(label) + '</span>'
    + '<span class="lv" style="color:' + colour + '">' + value + '</span></div>'
    + '<div class="sb">' + esc(sub) + '</div></div>';
}

/* ---------------------------------------------------------------------
   DAILY BRIEFING
   --------------------------------------------------------------------- */
function showBriefing(){
  const av = available(DAILY);
  const pend = av.filter(m => !S.daily[m.id]);
  const tier = S.level >= 15 ? 3 : (S.level >= 5 ? 2 : 1);

  let txt = GUIDE_BY_TIER[tier] + '\n\n';
  txt += pend.length
    ? 'Still outstanding today (' + pend.length + '):\n' + pend.map(m => '  \u2022 ' + m.name).join('\n')
    : 'Every mission today is complete. Rest is part of the training.';

  const nb = BOSSES.filter(b => !bossDone(b.id));
  if(nb.length){
    txt += '\n\nOpen raids:\n' + nb.slice(0,3).map(b => '  \u2022 ' + b.name + ' \u2014 ' + bossPct(b.id) + '%').join('\n');
  }
  if(S.punishment > 0) txt += '\n\nFreeze debt outstanding: ' + S.punishment + ' XP.';
  txt += '\n\nLevel ' + S.level + ' \u00b7 ' + S.xp + ' XP \u00b7 ' + S.streak + '-day streak \u00b7 ' + S.freezes + ' freeze(s).';

  openModal('Daily Briefing', 'From your guide', txt);
}

/* Habit actions (addHabit, checkHabit, removeHabit) live exclusively in habits.js (HabitEngine) */

/* ---------------------------------------------------------------------
   MASTER RENDER
   --------------------------------------------------------------------- */
/* =====================================================================
   PORTALS & SUB-NAV SYSTEM ARCHITECTURE — SOLO LEVELING LIFE OS
   Consolidates all functions into 6 Master System Portals.
   ===================================================================== */
const PORTALS = {
  dash: {
    id: 'dash',
    name: 'Command',
    icon: '⚡',
    bg: 'assets/bg/bg-system-gate.jpg',
    tabs: [
      { id: 'dash', label: 'Dashboard' },
      { id: 'lifestatus', label: 'Overview' }
    ]
  },
  quests: {
    id: 'quests',
    name: 'Missions',
    icon: '⚔️',
    bg: 'assets/bg/bg-system-gate.jpg',
    tabs: [
      { id: 'daily', label: 'Daily Missions' },
      { id: 'weekly', label: 'Weekly Missions' },
      { id: 'boss', label: 'Boss Raids' }
    ]
  },
  habits: {
    id: 'habits',
    name: 'Habits',
    icon: '🔄',
    bg: 'assets/bg/bg-hunter-status.jpg',
    tabs: [
      { id: 'habits', label: 'Daily Habits' },
      { id: 'insight', label: 'Streak & Insights' },
      { id: 'health', label: 'Health & Recovery' },
      { id: 'planner', label: 'Planner' }
    ]
  },
  roadmap: {
    id: 'roadmap',
    name: 'Progress',
    icon: '🎯',
    bg: 'assets/bg/bg-hunter.jpg',
    tabs: [
      { id: 'roadmap', label: 'Roadmap' },
      { id: 'projects', label: 'Projects' },
      { id: 'courses', label: 'Courses' }
    ]
  },
  knowledge: {
    id: 'knowledge',
    name: 'Knowledge',
    icon: '🧠',
    bg: 'assets/bg/bg-academy-training.jpg',
    tabs: [
      { id: 'knowledge', label: 'Knowledge Base' },
      { id: 'skills', label: 'Skills' },
      { id: 'vocab', label: 'Vocabulary (15/day)' },
      { id: 'speaking', label: 'Speaking' },
      { id: 'podcasts', label: 'Podcasts' },
      { id: 'library', label: 'Library' }
    ]
  },
  resources: {
    id: 'resources',
    name: 'System',
    icon: '💎',
    bg: 'assets/bg/bg-vault.jpg',
    tabs: [
      { id: 'expenses', label: 'Expenses' },
      { id: 'journal', label: 'Journal' },
      { id: 'review', label: 'Weekly Review' },
      { id: 'shadow', label: 'Shadow Army' }
    ]
  }
};

let currentPortal = 'dash';
let currentActiveTab = 'dash';

function switchPortal(portalId, targetTabId){
  const p = PORTALS[portalId];
  if(!p) return;
  currentPortal = portalId;

  document.querySelectorAll('.portal-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.portal === portalId);
  });

  const subnav = $('subnavContainer');
  if(subnav){
    subnav.innerHTML = p.tabs.map(t =>
      `<button class="subnav-pill" data-page="${t.id}" onclick="switchTab('${t.id}')">${t.label}</button>`
    ).join('');
  }

  const chosenTab = targetTabId || p.tabs[0].id;
  switchTab(chosenTab);
}

function switchTab(tabId){
  const cleanId = (tabId === 'tasks') ? 'daily' : tabId;
  let ownerPortal = null;
  for(const pid in PORTALS){
    if(PORTALS[pid].tabs.some(t => t.id === cleanId)){
      ownerPortal = pid;
      break;
    }
  }

  if(ownerPortal && ownerPortal !== currentPortal){
    currentPortal = ownerPortal;
    document.querySelectorAll('.portal-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.portal === ownerPortal);
    });
    const subnav = $('subnavContainer');
    if(subnav){
      subnav.innerHTML = PORTALS[ownerPortal].tabs.map(t =>
        `<button class="subnav-pill" data-page="${t.id}" onclick="switchTab('${t.id}')">${t.label}</button>`
      ).join('');
    }
  }

  currentActiveTab = cleanId;

  document.querySelectorAll('.subnav-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.page === cleanId);
  });

  document.querySelectorAll('.page').forEach(page => {
    page.classList.toggle('active', page.id === cleanId);
  });

  const bg = (PORTALS[ownerPortal] && PORTALS[ownerPortal].bg) || 'assets/bg/bg-system-gate.jpg';
  setBG(bg);

  sfx('tab');
  drawTab(cleanId);
}

window.goTab = switchTab;

function renderAll(){
  drawHUD();
  drawTab(currentActiveTab || 'dash');
  if($('fCost'))  $('fCost').textContent  = FREEZE.costXP;
  if($('fDebt'))  $('fDebt').textContent  = FREEZE.punishmentXP;
  if($('fEvery')) $('fEvery').textContent = FREEZE.earnEvery;
  if($('courseTag')) $('courseTag').textContent = Object.keys(S.courses || {}).length + ' / ' + COURSES.length + ' DONE';
  if($('badgeTag'))  $('badgeTag').textContent  = (S.badges || []).length + ' / ' + BADGES.length + ' EARNED';
  if($('libTag'))    $('libTag').textContent    = booksRead() + ' / ' + allBooks().length + ' READ';
}

function drawTab(page){
  switch(page){
    case 'dash':       drawDashboardLifeOS(); break;
    case 'lifestatus': drawLifeCommandCenter(); break;
    case 'tasks':
    case 'daily':      drawDaily(); if(typeof renderStrengthBars === 'function') renderStrengthBars(); break;
    case 'habits':     drawHabitsSection(); break;
    case 'health':     if(window.HealthSystem) window.HealthSystem.render('health-portal-content'); break;
    case 'planner':    if(window.PlannerSystem) window.PlannerSystem.render('planner-portal-content'); break;
    case 'roadmap':    drawRoadmapSection(); break;
    case 'projects':   drawProjectsSection(); break;
    case 'knowledge':  drawKnowledgeBaseSection(); break;
    case 'skills':     drawSkillsSection(); break;
    case 'vocab':      drawVocab(); break;
    case 'expenses':   drawFinanceSection(); break;
    case 'journal':    drawJournalSection(); break;
    case 'weekly':     drawWeekly(); break;
    case 'boss':       drawBosses(); break;
    case 'courses':    drawCourses(); drawCourseTree(); break;
    case 'library':    drawLibrary(); break;
    case 'review':     drawReview(); break;
    case 'insight':    drawInsights(); break;
    case 'shadow':     drawEggs(); drawShadow(); drawVision(); if(typeof renderEquipmentPanel === 'function') renderEquipmentPanel(); break;
    case 'speaking':   drawSpeaking(); break;
    case 'uptodate':   drawUpToDate(); break;
    case 'podcasts':   drawPodcasts(); break;
  }
}

function renderEverything(){
  drawHUD();
  drawTab(currentActiveTab || 'dash');
}

function boot(){
  buildGuideIndex();

  /* 1. Start unified Daily Rollover & Cairo Midnight Scheduler FIRST so state is fresh before first render */
  if(typeof TaskEngine !== 'undefined' && TaskEngine.startDailyScheduler){
    TaskEngine.startDailyScheduler();
  }

  /* 2. Render initial portal smoothly */
  const initialHash = (location.hash || '').replace('#','');
  if (initialHash && $(initialHash)) {
    switchTab(initialHash);
  } else {
    switchPortal('dash', 'dash');
  }
  drawHUD();

  autoBackup();
  checkForUpdates();

  cloudLoad().then(function(pulled){
    if(pulled){
      renderEverything();
    }
  });
  resumePomodoro();
  showPhrase();

  if(S.guideHidden){
    const g = $('guidePop');
    if(g) g.classList.add('hidden');
    const btn = $('guideReopenBtn');
    if(btn) btn.style.display = 'flex';
  }
  sfx('boot');
  const mb = $('muteBtn');
  if(mb){
    const m = sfxMuted();
    mb.textContent = m ? 'Sound Off' : 'Sound On';
    mb.classList.toggle('off', m);
  }

  guideTimer = setInterval(() => { nextPhrase(true); popGuide(); }, 3*60*1000);
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });
}

function setBG(src){
  const l = $('bgLayer');
  if(!l) return;
  l.classList.remove('on');
  setTimeout(() => {
    l.style.backgroundImage = "url('" + src + "')";
    l.classList.add('on');
  }, 150);
}

/* 1. DASHBOARD LIFE OS ENGINE */
/* 1. DASHBOARD LIFE OS ENGINE & FOUNDATION COMMAND */
function drawDashboardLifeOS(){
  const dashList = $('dashList');
  if(!dashList) return;

  const missions = (typeof TaskEngine !== 'undefined' && TaskEngine.getDailyMissions) ? TaskEngine.getDailyMissions() : [];
  const doneCount = missions.filter(m => S.daily && S.daily[m.id]).length;
  const totalCount = missions.length;
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  const analytics = (typeof XpEngine !== 'undefined' && XpEngine.getAnalytics) ? XpEngine.getAnalytics() : { today: 0, thisWeek: 0 };
  const hr = typeof getCairoHour === 'function' ? getCairoHour() : new Date().getHours();
  const greeting = hr < 12 ? 'GOOD MORNING, HUNTER' : (hr < 18 ? 'GOOD AFTERNOON, HUNTER' : 'GOOD EVENING, HUNTER');

  if($('dashBar')) $('dashBar').style.width = pct + '%';
  if($('todayTag')) $('todayTag').textContent = doneCount + ' / ' + totalCount + ' MISSIONS';
  if($('dashThresholdStatus')){
    $('dashThresholdStatus').className = 'quest-threshold-status ' + (doneCount === 0 ? 'tier-danger' : (pct >= 100 ? 'tier-srank' : 'tier-cleared'));
    $('dashThresholdStatus').innerHTML = doneCount === 0
      ? '⚠️ Complete at least <b>1 mission</b> to keep your streak active. Unchecked missions cost <b>-2&times; XP</b> at midnight.'
      : (pct >= 100
        ? '👑 <b>All ' + totalCount + ' Daily Missions Cleared!</b> Active Day secured.'
        : '⚔️ <b>' + doneCount + ' / ' + totalCount + ' Missions Cleared</b> &bull; Active Day secured!');
  }

  let html = '';

  /* 1. 2-Second Hero Clarity Strip */
  html += '<div class="life-hud-card" style="padding:14px 18px;margin-bottom:14px;">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">'
    +   '<div>'
    +     '<div style="font-family:var(--hud);font-size:15px;color:#00f0ff;letter-spacing:1.2px;font-weight:800;">' + greeting + '</div>'
    +     '<div style="font-size:12.5px;color:var(--muted);margin-top:2px;">Cairo Day: <b>' + (typeof dayKey === 'function' ? dayKey() : '') + '</b> &bull; Resets 00:00 AM</div>'
    +   '</div>'
    +   '<div style="display:flex;gap:14px;flex-wrap:wrap;">'
    +     '<div><span style="font-size:11px;color:var(--muted);display:block;">TODAY</span><b style="color:#fff;font-size:14px;">' + doneCount + ' / ' + totalCount + ' Missions</b></div>'
    +     '<div><span style="font-size:11px;color:var(--muted);display:block;">TODAY XP</span><b style="color:var(--gold);font-size:14px;">+' + (analytics.today || 0) + ' XP</b></div>'
    +     '<div><span style="font-size:11px;color:var(--muted);display:block;">STREAK</span><b style="color:var(--green);font-size:14px;">' + (S.streak || 0) + ' Days</b></div>'
    +   '</div>'
    + '</div>'
    + '</div>';

  /* 2. Today's Clear Missions Checklist */
  html += missions.map(m => missionRow(m, 'daily')).join('');
  html += '<div style="display:flex;gap:10px;margin-top:12px;margin-bottom:16px;flex-wrap:wrap;">'
    + '<button class="btn" style="flex:1;" onclick="openTaskModal()">+ Add Custom Mission</button>'
    + '<button class="btn secondary" onclick="switchTab(\'daily\')">Full Daily View &rarr;</button>'
    + '</div>';

  /* 3. Quick Cards: Vocabulary (0 / 15) + Today's Habits + Bassem School */
  const vWords = typeof todaysVocab === 'function' ? todaysVocab() : [];
  const vLearned = typeof vocabLearnedTodayCount === 'function' ? vocabLearnedTodayCount() : 0;
  const hList = typeof HabitEngine !== 'undefined' ? HabitEngine.getHabitsList() : [];
  const hDone = typeof HabitEngine !== 'undefined' ? HabitEngine.getTodayCount() : 0;

  html += '<div class="grid" style="margin-bottom:16px;">'
    + '<div class="stat" style="cursor:pointer;" onclick="switchTab(\'vocab\')">'
    +   '<div class="h"><span class="n">Today\'s Vocabulary</span><span class="lv" style="color:var(--glow);">' + vLearned + ' / ' + vWords.length + '</span></div>'
    +   '<div class="sb">15 daily words &middot; Tap to practice &rarr;</div>'
    + '</div>'
    + '<div class="stat" style="cursor:pointer;" onclick="switchTab(\'habits\')">'
    +   '<div class="h"><span class="n">Daily Habits</span><span class="lv" style="color:var(--green);">' + hDone + ' / ' + hList.length + '</span></div>'
    +   '<div class="sb">Resets daily &middot; History preserved &rarr;</div>'
    + '</div>'
    + '<div class="stat" style="cursor:pointer;" onclick="switchTab(\'insight\')">'
    +   '<div class="h"><span class="n">Streak &amp; Insights</span><span class="lv" style="color:var(--gold);">' + (S.streak || 0) + ' Days</span></div>'
    +   '<div class="sb">Best: ' + (S.best || 0) + ' days &middot; View heatmap &rarr;</div>'
    + '</div>'
    + '</div>';

  /* 4. Bassem School Raid Card (if loaded) */
  if(typeof renderBassemDashboardCard === 'function'){
    html += renderBassemDashboardCard();
  }

  dashList.innerHTML = html;
}

function drawTaskManager(){ drawDaily(); }

/* 3. UNIFIED DAILY HABITS & HISTORY RENDERER */
function drawHabitsSection(){
  const container = $('habitTrackerContainer');
  if(!container) return;

  const list = typeof HabitEngine !== 'undefined' ? HabitEngine.getHabitsList() : [];
  const completedCount = typeof HabitEngine !== 'undefined' ? HabitEngine.getTodayCount() : 0;
  const totalCount = list.length;

  const morning = list.filter(h => (h.timeOfDay || '').includes('morn'));
  const day     = list.filter(h => (h.timeOfDay || '').includes('day') || (!h.timeOfDay && !h.custom));
  const night   = list.filter(h => (h.timeOfDay || '').includes('even') || (h.timeOfDay || '').includes('night'));
  const custom  = list.filter(h => !!h.custom);

  let html = '<div class="panel">'
    + '<div class="st">'
    +   '<h2>Daily Habits</h2>'
    +   '<span class="tag">' + completedCount + ' / ' + totalCount + ' COMPLETED TODAY</span>'
    + '</div>'
    + '<div class="hint">Every habit starts <b>Incomplete (&#9744;)</b> at Cairo midnight (00:00 AM). Checking a habit logs today in permanent history without locking tomorrow.</div>'
    + '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">'
    +   '<input type="text" id="newHabitInput" placeholder="Add new custom habit..." style="flex:1;min-width:200px;padding:8px 12px;background:rgba(0,0,0,0.4);border:1px solid var(--line);border-radius:6px;color:#fff;">'
    +   '<button class="btn" onclick="const inp=$(\'newHabitInput\'); if(inp && inp.value.trim()){ HabitEngine.addCustomHabit(inp.value); inp.value=\'\'; }">+ Add Habit</button>'
    + '</div>'
    + '</div>';

  const renderGroup = (title, items) => {
    if(!items.length) return '';
    let gHtml = '<div class="panel">'
      + '<div class="st"><h2>' + title + '</h2><span class="tag">' + items.filter(h => HabitEngine.isDoneToday(h.id)).length + ' / ' + items.length + ' TODAY</span></div>'
      + '<div class="habit-group-grid">';
    items.forEach(h => {
      const doneToday = HabitEngine.isDoneToday(h.id);
      const stats = HabitEngine.getHabitStats(h.id);
      const dots = stats.last14.map(d => '<span title="'+d.date+': '+(d.completed?'Done':'Missed')+'" style="display:inline-block;width:9px;height:9px;border-radius:2px;background:'+(d.completed?'var(--green)':'rgba(255,255,255,0.1)')+';margin-right:2px;"></span>').join('');
      gHtml += '<div class="habit-routine-card ' + (doneToday ? 'done' : '') + '" onclick="HabitEngine.toggleHabit(\'' + h.id + '\', event)">'
        + '<div class="hrc-left">'
        +   '<div class="p-check">' + (doneToday ? '&#10003;' : '') + '</div>'
        +   '<div>'
        +     '<div class="hrc-title">' + esc(h.name) + '</div>'
        +     '<div class="hrc-why">' + esc(h.why || '') + '</div>'
        +     '<div style="margin-top:6px;" title="Last 14 days history">' + dots + ' <span style="font-size:11px;color:var(--muted);margin-left:6px;">' + stats.totalCompletions + ' total days &middot; Streak: ' + stats.currentStreak + '</span></div>'
        +   '</div>'
        + '</div>'
        + '<div class="hrc-right">'
        +   '<span class="p-xp">+' + HabitEngine.XP_PER_HABIT + ' XP</span>'
        +   (h.custom ? '<button class="xbtn" style="margin-left:6px;" onclick="event.stopPropagation(); HabitEngine.removeCustomHabit(\'' + h.id + '\');">✕</button>' : '')
        + '</div>'
        + '</div>';
    });
    gHtml += '</div></div>';
    return gHtml;
  };

  html += renderGroup('🌅 Morning Habits', morning);
  html += renderGroup('⚡ Daytime Habits', day);
  html += renderGroup('🌙 Evening Habits', night);
  html += renderGroup('✨ Custom Habits', custom);

  /* Explicit Habit History Panel (Yesterday + Recent 7 Days) */
  if(typeof HabitEngine !== 'undefined' && HabitEngine.getRecentHistoryRows){
    const histRows = HabitEngine.getRecentHistoryRows(7);
    html += '<div class="panel">'
      + '<div class="st"><h2>Habit History (Last 7 Days)</h2><span class="tag">PERSISTENT LOG</span></div>'
      + '<div class="hint">Past habit completions stay permanently archived here even after today resets to unchecked.</div>'
      + histRows.map(r => '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);flex-wrap:wrap;gap:6px;">'
          + '<div><b style="color:var(--glow);">' + r.date + '</b> <span style="font-size:12px;color:var(--muted);">(' + r.completedCount + ' / ' + r.totalCount + ' habits)</span></div>'
          + '<div style="font-size:12px;color:' + (r.completedCount > 0 ? 'var(--green)' : 'var(--muted)') + ';">' + (r.completedNames.length ? r.completedNames.slice(0,4).map(esc).join(', ') + (r.completedNames.length > 4 ? ' +' + (r.completedNames.length - 4) + ' more' : '') : 'No habits logged') + '</div>'
          + '</div>').join('')
      + '</div>';
  }

  container.innerHTML = html;
}

/* 4. SAUDI ROADMAP SECTION ENGINE */
function drawRoadmapSection(){
  const container = $('roadList');
  if(!container) return;

  const milestones = typeof SAUDI_MILESTONES !== 'undefined' ? SAUDI_MILESTONES : [];

  let html = '<div class="saudi-hero-card" style="margin-bottom:20px;">'
    + '<div class="shc-header">'
    +   '<div class="shc-badge"><span class="pulse-dot"></span> UNIFIED DEVELOPMENT PATH</div>'
    +   '<div class="shc-target">EST. MID-2027 RELOCATION</div>'
    + '</div>'
    + '<div class="shc-title">SAUDI ARABIA CAREER & RELOCATION ROADMAP</div>'
    + '<div class="shc-sub">The previous competing 3 paths have been eliminated. Every goal, project, and habit contributes directly to preparing for high-value Saudi marketing opportunities.</div>'
    + '</div>';

  milestones.forEach((m, idx) => {
    const status = m.status || (m.progress >= 70 ? 'CURRENT FOCUS' : (m.progress > 0 ? 'IN PROGRESS' : 'UPCOMING'));
    const isCurrent = status === 'CURRENT FOCUS' || idx === 0;
    const timeframe = m.timeframe || m.targetDate || '2027';
    const xpReward = m.xpReward || (idx === 0 ? 500 : 350);
    const objectives = (m.objectives && m.objectives.length) ? m.objectives : (m.desc ? [m.desc] : []);
    const deliverables = m.deliverables || [];

    html += '<div class="milestone-card ' + (isCurrent ? 'active' : '') + '">'
      + '<div class="mc-head">'
      +   '<div>'
      +     '<span class="mc-tag ' + (isCurrent ? 'active-tag' : '') + '">' + esc(status) + '</span>'
      +     '<h3 class="mc-title">' + esc(m.name) + '</h3>'
      +     '<div class="mc-timeframe">&#128197; ' + esc(timeframe) + '</div>'
      +   '</div>'
      +   '<div class="mc-xp">+' + xpReward + ' XP</div>'
      + '</div>'
      + '<div class="mc-body">'
      +   '<div class="mc-section-title">CORE OBJECTIVES</div>'
      +   '<ul class="mc-list">'
      +     objectives.map(o => '<li>' + esc(o) + '</li>').join('')
      +   '</ul>'
      +   '<div class="mc-section-title" style="margin-top:12px;">KEY DELIVERABLES & PROOF</div>'
      +   '<div class="mc-deliverables">'
      +     deliverables.map(d => '<span class="mc-deliv-pill">&#10003; ' + esc(d) + '</span>').join('')
      +   '</div>'
      + '</div>'
      + '</div>';
  });

  container.innerHTML = html;
}

/* 5. PROJECTS SECTION ENGINE */
function drawProjectsSection(){
  const container = $('projectsContainer');
  if(!container) return;

  const projects = typeof LIFE_OS_PROJECTS !== 'undefined' ? LIFE_OS_PROJECTS : [];

  let html = '<div class="panel">'
    + '<div class="st">'
    +   '<h2>Notion-Style Project Workspace</h2>'
    +   '<span class="tag">' + projects.length + ' ACTIVE INITIATIVES</span>'
    + '</div>'
    + '<div class="hint">'
    +   'High-impact projects structured around the Saudi Arabia career mission. Complete subtasks, attach notes, and advance progress towards senior marketing placement.'
    + '</div>'
    + '</div>'
    + '<div class="projects-grid">';

  projects.forEach(p => {
    const userP = (S.projects && S.projects[p.id]) || { progress: 0, subtasks: {}, notes: [] };
    const subtasks = (p.subtasks && p.subtasks.length) ? p.subtasks : (p.tasks || []);
    const doneCount = subtasks.filter(s => (userP.subtasks && userP.subtasks[s.id]) || (userP.subtasks && userP.subtasks[s.id] === undefined && s.done)).length;
    const pct = subtasks.length ? Math.round((doneCount / subtasks.length) * 100) : (p.progress || userP.progress || 0);
    const pName = p.title || p.name || 'Untitled Project';
    const pCat = p.category || 'Initiative';
    const pStatus = (p.status || 'Active').toUpperCase();
    const pDesc = p.objective || p.desc || '';

    html += '<div class="notion-proj-card">'
      + '<div class="npc-header">'
      +   '<div>'
      +     '<span class="npc-cat">' + esc(pCat) + '</span>'
      +     '<h3 class="npc-title">' + esc(pName) + '</h3>'
      +   '</div>'
      +   '<span class="npc-status ' + pStatus.toLowerCase().replace(/\s+/g,'-') + '">' + esc(pStatus) + '</span>'
      + '</div>'
      + '<div class="npc-desc">' + esc(pDesc) + '</div>'
      + '<div class="npc-progress-row">'
      +   '<div class="npc-prog-meta">'
      +     '<span>Progress (' + doneCount + '/' + subtasks.length + ' subtasks)</span>'
      +     '<span class="gold-num">' + pct + '%</span>'
      +   '</div>'
      +   '<div class="bar thin"><i style="width:' + pct + '%;background:linear-gradient(90deg,var(--sys-blue),var(--glow2))"></i></div>'
      + '</div>'
      + '<div class="npc-subtasks-title">ACTIONABLE SUBTASKS</div>'
      + '<div class="npc-subtask-list">'
      + subtasks.map(st => {
          const isDone = !!((userP.subtasks && userP.subtasks[st.id]) || (userP.subtasks && userP.subtasks[st.id] === undefined && st.done));
          const stName = st.text || st.name || '';
          return '<div class="npc-subtask-item ' + (isDone ? 'done' : '') + '" onclick="toggleProjectSubtask(\'' + p.id + '\', \'' + st.id + '\')">'
            + '<span class="npc-subtask-check">' + (isDone ? '&#10003;' : '') + '</span>'
            + '<span class="npc-subtask-name">' + esc(stName) + '</span>'
            + '</div>';
        }).join('')
      + '</div>'
      + '<div class="npc-notes-area">'
      +   '<div class="npc-notes-head">PROJECT LOG & NOTES</div>'
      +   '<div class="npc-notes-list">'
      +     (userP.notes || []).map(n => '<div class="npc-note-item">&bull; ' + esc(n.text) + ' <span style="font-size:10px;color:var(--muted)">(' + n.date + ')</span></div>').join('')
      +     ((!userP.notes || !userP.notes.length) ? '<div style="font-size:11px;color:var(--muted);font-style:italic;">No notes recorded yet.</div>' : '')
      +   '</div>'
      +   '<div class="npc-note-input-row">'
      +     '<input type="text" id="pnote_' + p.id + '" placeholder="Add note / progress update..." onkeydown="if(event.key===\'Enter\'){ addProjectNote(\'' + p.id + '\', this.value); this.value=\'\'; }">'
      +     '<button class="npc-note-btn" onclick="const el=$(\'pnote_' + p.id + '\'); addProjectNote(\'' + p.id + '\', el.value); el.value=\'\';">Add</button>'
      +   '</div>'
      + '</div>'
      + '</div>';
  });

  html += '</div>';
  container.innerHTML = html;
}

/* 6. KNOWLEDGE BASE & SECOND BRAIN ENGINE */
let knowledgeFilter = { search: '', category: 'all' };

function setKnowledgeSearch(val){
  knowledgeFilter.search = (val || '').toLowerCase().trim();
  drawKnowledgeBaseSection();
}

function setKnowledgeCategory(cat){
  knowledgeFilter.category = cat;
  drawKnowledgeBaseSection();
}

function drawKnowledgeBaseSection(){
  const container = $('knowledgeBaseContainer');
  if(!container) return;

  const frameworks = typeof KNOWLEDGE_BASE_DATA !== 'undefined' ? KNOWLEDGE_BASE_DATA : [];
  const customNotes = (S.knowledgeNotes || []);

  const availableCats = Array.from(new Set(frameworks.map(f => f.category))).filter(Boolean);
  const cats = ['all', ...availableCats, 'Custom Notes'];

  let allItems = [];
  frameworks.forEach(f => {
    allItems.push({
      id: f.id,
      title: f.title,
      category: f.category,
      tags: f.tags || [],
      summary: f.summary,
      content: f.content,
      isCustom: false
    });
  });

  customNotes.forEach(n => {
    allItems.push({
      id: n.id,
      title: n.title,
      category: 'Custom Notes',
      tags: n.tags || [],
      summary: n.content.substring(0, 140) + '...',
      content: n.content,
      isCustom: true,
      date: n.date
    });
  });

  let filtered = allItems;
  if(knowledgeFilter.category !== 'all'){
    filtered = filtered.filter(item => item.category === knowledgeFilter.category);
  }

  if(knowledgeFilter.search){
    const q = knowledgeFilter.search;
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.summary.toLowerCase().includes(q) || 
      item.content.toLowerCase().includes(q) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  let html = '<div class="panel">'
    + '<div class="st">'
    +   '<h2>Second Brain Knowledge Base</h2>'
    +   '<span class="tag">' + allItems.length + ' FRAMEWORKS & NOTES</span>'
    + '</div>'
    + '<div class="hint">'
    +   'Verified marketing architectures, conversion models, tracking guides, and personal strategic playbooks.'
    + '</div>'
    + '<div class="kb-controls">'
    +   '<div class="kb-search-wrap">'
    +     '<input type="text" class="kb-search-input" placeholder="Search frameworks, models, tags, keywords..." value="' + esc(knowledgeFilter.search) + '" oninput="setKnowledgeSearch(this.value)">'
    +   '</div>'
    +   '<button class="btn" onclick="openNoteModal()">+ Add New Note</button>'
    + '</div>'
    + '<div class="kb-cat-pills">'
    + cats.map(c => '<button class="kb-cat-pill ' + (knowledgeFilter.category === c ? 'active' : '') + '" onclick="setKnowledgeCategory(\'' + c + '\')">' + (c === 'all' ? 'All Resources' : c) + '</button>').join('')
    + '</div>'
    + '</div>'
    + '<div class="kb-grid">';

  if(filtered.length === 0){
    html += '<div class="empty-priority-card" style="grid-column:1/-1;">No knowledge items match your search.</div>';
  } else {
    filtered.forEach(item => {
      html += '<div class="kb-card">'
        + '<div class="kb-card-head">'
        +   '<span class="kb-cat-tag">' + esc(item.category) + '</span>'
        +   (item.isCustom ? '<button class="kb-del-btn" onclick="deleteKnowledgeNote(\'' + item.id + '\')" title="Delete note">&#10005;</button>' : '')
        + '</div>'
        + '<h3 class="kb-card-title">' + esc(item.title) + '</h3>'
        + '<div class="kb-card-tags">'
        +   (item.tags || []).map(t => '<span class="kb-tag">#' + esc(t) + '</span>').join('')
        + '</div>'
        + '<div class="kb-card-summary">' + esc(item.summary) + '</div>'
        + '<div class="kb-card-content" id="kbc_' + item.id + '" style="display:none;">'
        +   '<div class="kb-expanded-body">' + esc(item.content).replace(/\n/g, '<br>') + '</div>'
        + '</div>'
        + '<button class="kb-expand-btn" onclick="const el=$(\'kbc_' + item.id + '\'); const isHid=el.style.display===\'none\'; el.style.display=isHid?\'block\':\'none\'; this.textContent=isHid?\'Hide Details &uarr;\':\'Read Full Framework &rarr;\';">'
        +   'Read Full Framework &rarr;'
        + '</button>'
        + '</div>';
    });
  }

  html += '</div>';
  container.innerHTML = html;
}

/* 7. SKILLS MATRIX ENGINE */
function drawSkillsSection(){
  const container = $('skillsMatrixContainer');
  if(!container) return;

  const skills = typeof SKILL_MATRIX_DEF !== 'undefined' ? SKILL_MATRIX_DEF : [];

  let html = '<div class="panel">'
    + '<div class="st">'
    +   '<h2>Professional Skills Competency Matrix</h2>'
    +   '<span class="tag">TARGET: SENIOR GCC STANDARDS</span>'
    + '</div>'
    + '<div class="hint">'
    +   'Visual comparison of your <b>Current Competency Level</b> versus the <b>Required Level for Senior Roles in Saudi Arabia</b>. Focus your training where the gap is largest.'
    + '</div>'
    + '<div class="skills-matrix-grid">';

  skills.forEach(s => {
    const isScale10 = (s.current <= 10 && s.target <= 10);
    const curPct = isScale10 ? Math.min(100, (s.current / 10) * 100) : Math.min(100, s.current);
    const tgtPct = isScale10 ? Math.min(100, (s.target / 10) * 100) : Math.min(100, s.target);
    const gap = s.target - s.current;
    const curLabel = isScale10 ? (s.current + '/10') : (s.current + '%');
    const tgtLabel = isScale10 ? (s.target + '/10') : (s.target + '%');
    const gapLabel = gap <= 0 ? 'MASTERY' : ('GAP: +' + gap + (isScale10 ? ' LVL' : '%'));
    const domain = s.domain || s.cat || 'Marketing Competency';
    const action = s.action || s.proof || '';

    html += '<div class="skill-matrix-card">'
      + '<div class="smc-head">'
      +   '<div>'
      +     '<span class="smc-domain">' + esc(domain) + '</span>'
      +     '<h4 class="smc-name">' + esc(s.name) + '</h4>'
      +   '</div>'
      +   '<span class="smc-gap ' + (gap <= 10 ? 'low-gap' : 'high-gap') + '">' + gapLabel + '</span>'
      + '</div>'
      + '<div class="smc-bars">'
      +   '<div class="smc-bar-row">'
      +     '<span>Current Competency (' + curLabel + ')</span>'
      +     '<div class="bar thin"><i style="width:' + curPct + '%;background:var(--sys-blue);"></i></div>'
      +   '</div>'
      +   '<div class="smc-bar-row">'
      +     '<span>Saudi Target (' + tgtLabel + ')</span>'
      +     '<div class="bar thin"><i style="width:' + tgtPct + '%;background:linear-gradient(90deg,var(--glow),var(--monarch-purple));"></i></div>'
      +   '</div>'
      + '</div>'
      + '<div class="smc-action">'
      +   '<b style="color:var(--sys-blue);">Verified Evidence / Action:</b> ' + esc(action)
      + '</div>'
      + '</div>';
  });

  html += '</div></div>';
  container.innerHTML = html;

  if(typeof drawExtras === 'function') drawExtras();
  if(typeof drawSkillTree === 'function') drawSkillTree();
}

/* Vocabulary UI unified in drawVocab() */
function drawVocabSection(){ drawVocab(); }

/* 9. FINANCE & RUNWAY BUFFER ENGINE */
function drawFinanceSection(){
  const runwayContainer = $('relocationRunwayContainer');
  if(runwayContainer){
    const fund = S.relocationFund || { target: 120000, current: 0, currency: 'EGP' };
    const pct = Math.min(100, Math.round((fund.current / fund.target) * 100));

    let html = '<div class="panel">'
      + '<div class="st">'
      +   '<h2>Saudi Relocation Runway Buffer</h2>'
      +   '<span class="tag gold-num">' + fund.current.toLocaleString() + ' / ' + fund.target.toLocaleString() + ' EGP (' + pct + '%)</span>'
      + '</div>'
      + '<div class="hint">'
      +   'Financial runway buffer required before stepping foot in Riyadh: covers work visa fees, flights, initial 2 months housing deposit, and personal living buffer ($2,500 USD equivalent).'
      + '</div>'
      + '<div class="runway-widget">'
      +   '<div class="bar" style="height:14px;margin-bottom:14px;"><i style="width:' + pct + '%;background:linear-gradient(90deg,var(--gold),#ffe066);"></i></div>'
      +   '<div class="runway-breakdown-grid">'
      +     '<div class="rb-item">'
      +       '<span class="rb-title">&#9992; Visa & Flight Tickets</span>'
      +       '<span class="rb-val">45,000 EGP</span>'
      +       '<span class="rb-sub">Airfare & visa processing</span>'
      +     '</div>'
      +     '<div class="rb-item">'
      +       '<span class="rb-title">&#127968; Initial 2 Months Rent</span>'
      +       '<span class="rb-val">50,000 EGP</span>'
      +       '<span class="rb-sub">Housing deposit in Riyadh</span>'
      +     '</div>'
      +     '<div class="rb-item">'
      +       '<span class="rb-title">&#128176; Emergency Buffer</span>'
      +       '<span class="rb-val">25,000 EGP</span>'
      +       '<span class="rb-sub">Living expenses & contingency</span>'
      +     '</div>'
      +   '</div>'
      +   '<div class="runway-update-row">'
      +     '<input type="number" id="runwayInput" placeholder="Update current saved EGP amount..." value="' + fund.current + '">'
      +     '<button class="btn" onclick="const val=$(\'runwayInput\').value; updateRelocationBuffer(val);">Update Buffer</button>'
      +   '</div>'
      + '</div>'
      + '</div>';
    runwayContainer.innerHTML = html;
  }

  if(typeof drawExpenses === 'function') drawExpenses();
}

/* 10. DAILY JOURNAL & REFLECTION ENGINE */
function drawJournalSection(){
  const container = $('journalContainer');
  if(!container) return;

  const today = dayKey();
  const entry = (S.journal && S.journal[today]) || { wins: '', blockers: '', lessons: '' };
  const allEntries = S.journal ? Object.values(S.journal).sort((a,b) => b.timestamp - a.timestamp) : [];

  let html = '<div class="panel">'
    + '<div class="st">'
    +   '<h2>Daily Reflection & Continuous Improvement</h2>'
    +   '<span class="tag">' + today + '</span>'
    + '</div>'
    + '<div class="hint">'
    +   'Every successful operator ends their day with honest reflection. Document your wins, identify operational friction, and set the single priority that matters tomorrow.'
    + '</div>'
    + '<div class="journal-form">'
    +   '<div class="jf-field">'
    +     '<label class="jf-label">&#127942; Daily Wins (What went well today? Tasks completed, metrics improved, skills practiced):</label>'
    +     '<textarea id="jWins" class="jf-textarea" placeholder="e.g. Audited CAPI server-side tags, finished English speaking drill without missing B/P...">' + esc(entry.wins || '') + '</textarea>'
    +   '</div>'
    +   '<div class="jf-field">'
    +     '<label class="jf-label">&#9888; Friction & Blockers (What slowed me down, distracted me, or caused resistance?):</label>'
    +     '<textarea id="jBlockers" class="jf-textarea" placeholder="e.g. Procrastinated on drafting the case study outline, spent 40 mins on phone...">' + esc(entry.blockers || '') + '</textarea>'
    +   '</div>'
    +   '<div class="jf-field">'
    +     '<label class="jf-label">&#127919; Tomorrow\'s Single Priority (The one thing that makes tomorrow a win):</label>'
    +     '<input type="text" id="jLessons" class="jf-input" placeholder="e.g. Finalize 3-page IRA Academy Case Study draft..." value="' + esc(entry.lessons || '') + '">'
    +   '</div>'
    +   '<button class="btn" style="margin-top:10px;" onclick="const w=$(\'jWins\').value; const b=$(\'jBlockers\').value; const l=$(\'jLessons\').value; saveJournalReflection(w, b, l);">'
    +     'Save Reflection &bull; +15 XP'
    +   '</button>'
    + '</div>'
    + '</div>'
    + '<div class="panel">'
    + '<div class="st">'
    +   '<h2>Recent Reflections Log</h2>'
    +   '<span class="tag">' + allEntries.length + ' LOGGED</span>'
    + '</div>'
    + '<div class="journal-history-list">'
    + allEntries.slice(0, 7).map(e => '<div class="jh-card">'
        + '<div class="jh-date">&#128197; ' + e.date + '</div>'
        + (e.wins ? '<div class="jh-row"><b style="color:var(--green);">Wins:</b> ' + esc(e.wins) + '</div>' : '')
        + (e.blockers ? '<div class="jh-row"><b style="color:var(--red);">Blockers:</b> ' + esc(e.blockers) + '</div>' : '')
        + (e.lessons ? '<div class="jh-row"><b style="color:var(--gold);">Next Focus:</b> ' + esc(e.lessons) + '</div>' : '')
        + '</div>').join('')
    + (allEntries.length === 0 ? '<div style="font-size:12px;color:var(--muted);font-style:italic;">No reflections saved yet. Complete your first today.</div>' : '')
    + '</div>'
    + '</div>';

  container.innerHTML = html;
}

/* UI MODAL CONTROLLERS */
function openTaskModal(){
  const m = $('taskModal');
  if(m) m.classList.add('on');
}
function closeTaskModal(){
  const m = $('taskModal');
  if(m) m.classList.remove('on');
}
function submitTaskModal(){
  const title = ($('tmTitle').value || '').trim();
  const sub = ($('tmSub').value || '').trim();
  const xp = parseInt($('tmXP').value, 10) || 20;
  const dur = ($('tmDur').value || '').trim() || '25 min';
  const priority = $('tmPriority').value || 'medium';
  const proj = $('tmProject').value || null;
  const why = ($('tmWhy').value || '').trim();

  if(!title){
    alert('Please enter a task title.');
    return;
  }

  const ok = createCustomTask(title, sub, xp, dur, priority, proj, title, why);
  if(ok){
    $('tmTitle').value = '';
    $('tmWhy').value = '';
    closeTaskModal();
  }
}

function openNoteModal(){
  const m = $('noteModal');
  if(m) m.classList.add('on');
}
function closeNoteModal(){
  const m = $('noteModal');
  if(m) m.classList.remove('on');
}
function submitNoteModal(){
  const title = ($('nmTitle').value || '').trim();
  const cat = $('nmCat').value || 'General';
  const tags = ($('nmTags').value || '').trim();
  const content = ($('nmContent').value || '').trim();

  if(!title || !content){
    alert('Please enter both title and content for your note.');
    return;
  }

  saveKnowledgeNote(title, cat, tags, content);
  $('nmTitle').value = '';
  $('nmTags').value = '';
  $('nmContent').value = '';
  closeNoteModal();
}

function closeHabitGradModal(){
  const m = $('habitGradModal');
  if(m) m.classList.remove('on');
}

/* =====================================================================
   14. LIFE STATUS COMMAND CENTER ENGINE & REFLECTION CONTROLLER
   ===================================================================== */
function drawLifeCommandCenter(){
  const root = $('lifeCommandRoot');
  if(!root) return;

  const ls = S.lifeStatus || {
    location: 'Cairo, Egypt',
    destination: 'Saudi Arabia (Riyadh / Jeddah)',
    travelStatus: 'imminent',
    targetTravelDate: 'Late November 2026',
    expensesPaid: true,
    flightBooked: false,
    flightDetails: '',
    documentsReady: true,
    saudiPhone: false,
    saudiPhoneNumber: '',
    currentDifficulty: 1,
    difficultyName: 'Level 1 — Normal',
    activeBossFocus: 'b2',
    checkinHistory: []
  };

  const fp = S.foundationProfile || {
    dayIndex: 1,
    foundationActive: true,
    recoveryMode: false,
    totalMandatoryMinutes: 220
  };

  const diffLevel = ls.currentDifficulty || 1;
  const isRecovery = !!fp.recoveryMode;
  const unlocks = S.systemUnlocks || [];
  const checkins = ls.checkinHistory || [];

  let html = '';

  /* Header Hero */
  html += '<div class="life-status-hero">'
    + '<div class="lsh-top">'
    +   '<div class="lsh-badge"><span class="pulse-dot"></span> 14-DAY FOUNDATION PHASE &bull; DAY ' + (fp.dayIndex || 1) + ' OF 14</div>'
    +   '<div class="lsh-window">DEPARTURE WINDOW: ' + esc(ls.targetTravelDate) + ' (IMMINENT)</div>'
    + '</div>'
    + '<h1 class="lsh-title">PREPARING FOR SAUDI ARABIA TRANSITION</h1>'
    + '<div class="lsh-sub">Cairo, Egypt &rarr; Riyadh / Jeddah, Saudi Arabia &bull; 4+ Hours Available Daily &bull; ~3.5–4h Mandatory Foundation Workload (220 min)</div>'
    + '<div class="lsh-grid">'
    +   '<div class="lsh-card">'
    +     '<div class="lsh-card-k">RELOCATION EXPENSES</div>'
    +     '<div class="lsh-card-v" style="color:var(--green);">&#10003; 100% PAID &amp; CLEARED</div>'
    +     '<div class="lsh-card-sub">Visa, medical, and degree attestations fully settled</div>'
    +   '</div>'
    +   '<div class="lsh-card">'
    +     '<div class="lsh-card-k">FLIGHT TICKET</div>'
    +     '<div class="lsh-card-v" style="color:' + (ls.flightBooked ? 'var(--green)' : 'var(--gold)') + ';">'
    +       (ls.flightBooked ? '&#10003; BOOKED &amp; CONFIRMED' : '&#9203; PENDING BOOKING (Late Nov)')
    +     '</div>'
    +     '<div class="lsh-card-sub">' + (ls.flightDetails || 'Final arrangement pending') + '</div>'
    +   '</div>'
    +   '<div class="lsh-card">'
    +     '<div class="lsh-card-k">SAUDI PHONE NUMBER</div>'
    +     '<div class="lsh-card-v" style="color:' + (ls.saudiPhone ? 'var(--green)' : 'var(--red)') + ';">'
    +       (ls.saudiPhone ? '&#10003; ACTIVE: ' + esc(ls.saudiPhoneNumber || 'Confirmed') : '&#128274; GATED (Upon Arrival in KSA)')
    +     '</div>'
    +     '<div class="lsh-card-sub">Direct job search opens when verified</div>'
    +   '</div>'
    +   '<div class="lsh-card">'
    +     '<div class="lsh-card-k">SYSTEM DIFFICULTY</div>'
    +     '<div class="lsh-card-v" style="color:var(--sys-blue);">' + esc(ls.difficultyName || 'Level 1 — Normal') + '</div>'
    +     '<div class="lsh-card-sub">' + (isRecovery ? 'Recovery Mode (2–3 tasks, ~35 min)' : 'Days 1–14: 3–5 tasks/day (~220 min)') + '</div>'
    +   '</div>'
    + '</div>'
    + '</div>';

  /* Daily Time Allocation Budgets Panel */
  html += '<div class="panel" style="margin-top:16px;">'
    + '<div class="st"><h2>Daily Time Budget Allocation (~3.5–4 Hours Total)</h2><span class="tag">FLEXIBLE BUDGETS</span></div>'
    + '<div class="hint">These are time budgets, not rigid checklists. Rotate activities where appropriate and avoid creating unnecessary tasks.</div>'
    + '<div class="diff-levels-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">'
    +   '<div class="diff-card"><div class="dc-name" style="font-size:14px;color:var(--sys-blue);">🗣️ English Development</div><div class="dc-meta" style="font-size:16px;color:#fff;">60 Minutes</div><div class="dc-focus">Speaking analysis, pronunciation, interview defense, practical grammar</div></div>'
    +   '<div class="diff-card"><div class="dc-name" style="font-size:14px;color:#c084fc;">💼 Career &amp; Skills</div><div class="dc-meta" style="font-size:16px;color:#fff;">60 Minutes</div><div class="dc-focus">Hero case studies (1,544 leads @ 4.62 TL), ATS CV, campaign analytics</div></div>'
    +   '<div class="diff-card"><div class="dc-name" style="font-size:14px;color:var(--gold);">🇸🇦 Saudi Prep</div><div class="dc-meta" style="font-size:16px;color:#fff;">45 Minutes</div><div class="dc-focus">Document archives, flight check, Riyadh agency mapping (no premature apply)</div></div>'
    +   '<div class="diff-card"><div class="dc-name" style="font-size:14px;color:var(--green);">⚙️ AI Automation</div><div class="dc-meta" style="font-size:16px;color:#fff;">35 Minutes</div><div class="dc-focus">Google Sheets scripts, prompt engineering, reporting scenarios</div></div>'
    +   '<div class="diff-card"><div class="dc-name" style="font-size:14px;color:#f472b6;">🎬 Content Creation</div><div class="dc-meta" style="font-size:16px;color:#fff;">20 Minutes</div><div class="dc-focus">Direct-response ad hooks, 60s video outlines, CapCut desktop editing</div></div>'
    +   '<div class="diff-card"><div class="dc-name" style="font-size:14px;color:#38bdf8;">🎓 Germany M.Sc</div><div class="dc-meta" style="font-size:16px;color:#fff;">2x / Week</div><div class="dc-focus">30–45 min research sessions (DAAD programs, ECTS requirements)</div></div>'
    + '</div>'
    + '</div>';

  /* Interactive Status Controls */
  html += '<div class="panel" style="margin-top:16px;">'
    + '<div class="st"><h2>Interactive Life Status Controls</h2><span class="tag">REAL-TIME CALIBRATION</span></div>'
    + '<div class="hint">Toggle these switches as real-world arrangements update. The system automatically recalculates tasks, gates, and downstream raid stages.</div>'
    + '<div class="lsc-controls-grid">'
    +   '<div class="lsc-ctrl-row">'
    +     '<div>'
    +       '<div class="lsc-ctrl-title">Flight Ticket to Saudi Arabia</div>'
    +       '<div class="lsc-ctrl-desc">Mark booked once late November flight is purchased.</div>'
    +     '</div>'
    +     '<button class="btn ' + (ls.flightBooked ? '' : 'secondary') + '" onclick="toggleFlightStatus()">'
    +       (ls.flightBooked ? '&#10003; Flight Booked' : 'Mark as Booked')
    +     '</button>'
    +   '</div>'
    +   '<div class="lsc-ctrl-row">'
    +     '<div>'
    +       '<div class="lsc-ctrl-title">Local Saudi SIM &amp; Mobile Phone Number</div>'
    +       '<div class="lsc-ctrl-desc">Gating rule: Direct Saudi job applications remain locked until this is active.</div>'
    +     '</div>'
    +     '<button class="btn ' + (ls.saudiPhone ? '' : 'secondary') + '" style="' + (ls.saudiPhone ? 'border-color:var(--green);color:var(--green);' : '') + '" onclick="toggleSaudiPhoneStatus()">'
    +       (ls.saudiPhone ? '&#10003; Saudi Phone Active' : 'Activate Local Phone')
    +     '</button>'
    +   '</div>'
    +   '<div class="lsc-ctrl-row">'
    +     '<div>'
    +       '<div class="lsc-ctrl-title">Recovery Mode (Difficult / Low-Energy Days)</div>'
    +       '<div class="lsc-ctrl-desc">Drops daily task workload to 2–3 gentle tasks (~35 min) to protect consistency and preserve your streak.</div>'
    +     '</div>'
    +     '<button class="btn ' + (isRecovery ? '' : 'secondary') + '" style="' + (isRecovery ? 'border-color:var(--gold);color:var(--gold);' : '') + '" onclick="toggleRecoveryMode()">'
    +       (isRecovery ? '🛡️ Recovery Mode Active' : 'Enable Recovery Mode')
    +     '</button>'
    +   '</div>'
    + '</div>'
    + '</div>';

  /* Gradual Difficulty Calibration */
  html += '<div class="panel" style="margin-top:16px;">'
    + '<div class="st"><h2>Gradual Difficulty Calibration (Levels 1 to 4)</h2><span class="tag">PACING ENGINE</span></div>'
    + '<div class="hint">Days 1–14 Foundation Phase starts at Normal (3–5 daily tasks). Escalate to 5–7 tasks only after consistent completion and positive feedback. Never exceeds 10 tasks.</div>'
    + '<div class="diff-levels-grid">'
    + [
        { lvl: 1, name: 'Normal', tasks: '3-5 tasks/day', time: '15-25 min', focus: '14-Day Foundation anchor, consistency building, zero burnout' },
        { lvl: 2, name: 'Developing', tasks: '4-6 tasks/day', time: '25-35 min', focus: 'Skill expansion, deeper portfolio work, English fluency' },
        { lvl: 3, name: 'Advanced', tasks: '5-7 tasks/day', time: '30-45 min', focus: 'Complex campaigns, video production, automation testing' },
        { lvl: 4, name: 'Elite', tasks: '6-8 tasks/day', time: '30-45 min', focus: 'Maximum leverage, direct outreach, end-to-end pipelines' }
      ].map(d => {
        const isCurrent = diffLevel === d.lvl;
        return '<div class="diff-card ' + (isCurrent ? 'active' : '') + '" onclick="setSystemDifficulty(' + d.lvl + ')">'
          + '<div class="dc-head">'
          +   '<span class="dc-badge">LEVEL ' + d.lvl + '</span>'
          +   (isCurrent ? '<span class="dc-active-tag">CURRENT</span>' : '')
          + '</div>'
          + '<div class="dc-name">' + esc(d.name) + '</div>'
          + '<div class="dc-meta">' + esc(d.tasks) + ' &bull; ' + esc(d.time) + '</div>'
          + '<div class="dc-focus">' + esc(d.focus) + '</div>'
          + '</div>';
      }).join('')
    + '</div>'
    + '</div>';

  /* Practical B1/B2 English Development Lab */
  if(typeof B1_B2_ENGLISH_TRACK !== 'undefined'){
    html += '<div class="panel" style="margin-top:16px;">'
      + '<div class="st"><h2>Practical B1/B2 English Development Lab</h2><span class="tag">DIAGNOSTIC &amp; RECORDED</span></div>'
      + '<div class="hint">Every speaking drill features a clear objective, recording instructions, self-evaluation criteria, identified common traps, and a measurable next step. Level assessed through recorded evidence, not assumed.</div>'
      + '<div class="eng-track-grid">'
      + B1_B2_ENGLISH_TRACK.map(m => {
          return '<div class="eng-module-card">'
            + '<div class="emc-head">'
            +   '<h4 class="emc-title">' + esc(m.module) + '</h4>'
            +   '<div class="emc-meta">'
            +     '<span class="tag" style="color:var(--sys-blue);border-color:rgba(0,212,255,0.3);">' + esc(m.level) + '</span>'
            +     '<span class="tag" style="color:var(--gold);border-color:rgba(255,204,77,0.3);">&#9201; ' + esc(m.duration) + '</span>'
            +   '</div>'
            + '</div>'
            + '<div class="emc-obj"><b>Target Objective:</b> ' + esc(m.objective) + '</div>'
            + '<div class="emc-steps-box">'
            +   '<div style="font-family:var(--hud);font-size:11px;color:var(--sys-blue);margin-bottom:4px;">Recording Instructions:</div>'
            +   m.instructions.map(ins => '<div>' + esc(ins) + '</div>').join('')
            + '</div>'
            + '<div class="emc-grid">'
            +   '<div class="emc-crit-box">'
            +     '<div style="font-family:var(--hud);font-size:10.5px;color:var(--green);margin-bottom:4px;">&#10003; Self-Evaluation Checklist:</div>'
            +     m.feedbackCriteria.map(fc => '<div>&bull; ' + esc(fc) + '</div>').join('')
            +   '</div>'
            +   '<div class="emc-traps-box">'
            +     '<div style="font-family:var(--hud);font-size:10.5px;color:var(--red);margin-bottom:4px;">&#9888; Traps &amp; Common Mistakes to Avoid:</div>'
            +     m.commonTraps.map(ct => '<div>&bull; ' + esc(ct) + '</div>').join('')
            +   '</div>'
            + '</div>'
            + '<div class="emc-next-box"><b>Measurable Next Step:</b> ' + esc(m.nextStep) + '</div>'
            + '<div style="margin-top:10px;text-align:right;">'
            +   '<button class="btn secondary" style="font-size:11.5px;padding:4px 10px;" onclick="goTab(\'speaking\')">Launch Speaking Recorder &rarr;</button>'
            + '</div>'
            + '</div>';
        }).join('')
      + '</div>'
      + '</div>';
  }

  /* Interactive Daily / Weekly Reflection Widget */
  html += '<div class="panel" style="margin-top:16px;">'
    + '<div class="st"><h2>Daily / Weekly Tactical Check-in</h2><span class="tag">AI CALIBRATION</span></div>'
    + '<div class="hint">Check in with the System. If tasks feel overwhelming or too simple, the System adjusts your daily load automatically. Earns <b>+20 XP</b>.</div>'
    + '<div class="checkin-box">'
    +   '<div class="cb-field">'
    +     '<label class="cb-label">1. How did your tasks feel today / this week?</label>'
    +     '<div class="cb-options">'
    +       '<button type="button" class="cb-opt-btn" id="cbOptHard" onclick="selectCheckinRating(\'too_hard\')">&#128308; Too Difficult / Heavy (Lower Difficulty / Split Tasks)</button>'
    +       '<button type="button" class="cb-opt-btn selected" id="cbOptRight" onclick="selectCheckinRating(\'just_right\')">&#128994; Just Right / Productive Pace (Maintain)</button>'
    +       '<button type="button" class="cb-opt-btn" id="cbOptEasy" onclick="selectCheckinRating(\'too_easy\')">&#128309; Too Easy / Want More Challenge (Level Up)</button>'
    +     '</div>'
    +   '</div>'
    +   '<div class="cb-field" style="margin-top:12px;">'
    +     '<label class="cb-label">2. Any real life changes or travel updates?</label>'
    +     '<input type="text" class="cb-input" id="cbLifeUpdates" placeholder="e.g. Flight booked for Nov 26, passport stamped, or arrived in Riyadh...">'
    +   '</div>'
    +   '<div class="cb-field" style="margin-top:12px;">'
    +     '<label class="cb-label">3. Notes or reflections on today\'s execution:</label>'
    +     '<textarea class="cb-textarea" id="cbNotes" rows="2" placeholder="What went well? Any friction points or English speaking insights?"></textarea>'
    +   '</div>'
    +   '<div style="margin-top:14px;display:flex;justify-content:flex-end;">'
    +     '<button class="btn" onclick="handleCheckinSubmit()">Submit Reflection &amp; Calibrate System &rarr;</button>'
    +   '</div>'
    + '</div>'
    + '</div>';

  /* Systemic Unlocks History */
  html += '<div class="panel" style="margin-top:16px;">'
    + '<div class="st"><h2>Systemic Unlocks &amp; Milestones</h2><span class="tag">' + unlocks.length + ' UNLOCKED</span></div>'
    + '<div class="hint">Milestones achieved and downstream features unlocked across the 4 Master Boss Raids.</div>';
  if(unlocks.length === 0){
    html += '<div class="hint" style="font-style:italic;">No boss raid milestones checked off yet. Clear steps in Boss Raids to trigger systemic unlocks.</div>';
  } else {
    html += '<div class="unlocks-timeline">';
    unlocks.forEach(u => {
      html += '<div class="ut-item">'
        + '<div class="ut-dot">&#10003;</div>'
        + '<div class="ut-body">'
        +   '<div class="ut-title">' + esc(u.bossName || u.bossId) + ' &bull; ' + esc(u.date) + '</div>'
        +   '<div class="ut-desc">' + esc(u.stepText) + '</div>'
        + '</div>'
        + '</div>';
    });
    html += '</div>';
  }
  html += '</div>';

  root.innerHTML = html;
}

window._selectedCheckinRating = 'just_right';
function selectCheckinRating(rating){
  window._selectedCheckinRating = rating;
  ['cbOptHard', 'cbOptRight', 'cbOptEasy'].forEach(id => {
    const el = $(id);
    if(el) el.classList.remove('selected');
  });
  if(rating === 'too_hard' && $('cbOptHard')) $('cbOptHard').classList.add('selected');
  if(rating === 'just_right' && $('cbOptRight')) $('cbOptRight').classList.add('selected');
  if(rating === 'too_easy' && $('cbOptEasy')) $('cbOptEasy').classList.add('selected');
}

function handleCheckinSubmit(){
  const rating = window._selectedCheckinRating || 'just_right';
  const updates = $('cbLifeUpdates') ? $('cbLifeUpdates').value.trim() : '';
  const notes = $('cbNotes') ? $('cbNotes').value.trim() : '';

  if(typeof submitLifeCheckin === 'function'){
    submitLifeCheckin(rating, notes, updates);
  }
}

function setSystemDifficulty(lvl){
  if(typeof updateLifeStatus === 'function'){
    updateLifeStatus('currentDifficulty', lvl);
  }
}

function toggleFlightStatus(){
  const current = !!(S.lifeStatus && S.lifeStatus.flightBooked);
  const next = !current;
  let details = '';
  if(next){
    details = prompt('Enter flight details (e.g. Cairo to Riyadh, Nov 26, Flynas / Saudia):', 'Cairo to Riyadh, Late Nov 2026') || 'Late Nov 2026';
    if(S.lifeStatus) S.lifeStatus.flightDetails = details;
  }
  if(typeof updateLifeStatus === 'function'){
    updateLifeStatus('flightBooked', next);
  }
}

function toggleSaudiPhoneStatus(){
  const current = !!(S.lifeStatus && S.lifeStatus.saudiPhone);
  const next = !current;
  let number = '';
  if(next){
    number = prompt('Enter your local Saudi phone number (e.g. +966 5X XXX XXXX):', '+966 5') || '+966';
    if(S.lifeStatus) S.lifeStatus.saudiPhoneNumber = number;
  }
  if(typeof updateLifeStatus === 'function'){
    updateLifeStatus('saudiPhone', next);
  }
}
