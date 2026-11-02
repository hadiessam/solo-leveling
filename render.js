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
    setTimeout(()=>el.remove(),500); }, 4500);
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
  const ri = rankIdx(S.xp);
  const cur = RANKS[ri], nxt = RANKS[ri+1];

  $('bLevel').textContent  = S.level;
  $('bXP').textContent     = S.xp.toLocaleString();
  $('bStreak').textContent = S.streak;
  $('bQuests').textContent = S.qDone;
  $('rankName').textContent = cur.name;
  $('bFreeze').textContent = S.freezes;

  const inLv = S.xp % LEVEL_XP;
  $('xpNow').textContent = inLv;
  $('xpNeed').textContent = LEVEL_XP;
  $('xpBar').style.width = (inLv/LEVEL_XP*100) + '%';

  if(nxt){
    const span = nxt.xp - cur.xp, done = S.xp - cur.xp;
    $('nextRank').textContent = nxt.name;
    $('rankNow').textContent = done;
    $('rankNeed').textContent = span;
    $('rankBar').style.width = Math.min(100, done/span*100) + '%';
  } else {
    $('nextRank').textContent = 'MAX RANK';
    $('rankNow').textContent = S.xp;
    $('rankNeed').textContent = S.xp;
    $('rankBar').style.width = '100%';
  }

  /* debt bar */
  const d = $('debtRow');
  if(S.punishment > 0){
    d.style.display = 'block';
    $('debtVal').textContent = S.punishment;
  } else {
    d.style.display = 'none';
  }

  /* daily quest meter */
  const av = available(DAILY);
  const done = av.filter(m => S.daily[m.id]).length;
  const pct = av.length ? done/av.length*100 : 0;
  $('penBar').style.width = pct + '%';
  $('penLabel').textContent = done + ' / ' + av.length;
  $('penLabel').style.color = pct === 100 ? 'var(--green)' : (pct < 40 ? 'var(--red)' : 'var(--gold)');

  /* Vitals: HP & Mana */
  if($('hpVal')) $('hpVal').textContent = (S.hp !== undefined ? S.hp : 100) + ' / ' + (S.maxHp || 100);
  if($('hpBar')) $('hpBar').style.width = Math.min(100, Math.max(0, (S.hp !== undefined ? S.hp : 100)/(S.maxHp || 100)*100)) + '%';
  if($('manaVal')) $('manaVal').textContent = (S.mana !== undefined ? S.mana : 50) + ' / ' + (S.maxMana || 50);
  if($('manaBar')) $('manaBar').style.width = Math.min(100, Math.max(0, (S.mana !== undefined ? S.mana : 50)/(S.maxMana || 50)*100)) + '%';
  if($('hudClass')) $('hudClass').textContent = (S.classId ? S.classId.toUpperCase() : 'ROGUE');
  if($('rankBadgeMini')) $('rankBadgeMini').textContent = (cur.name || 'E')[0];

  /* Ghost features HUD sync */
  if(typeof drawStatsHUD === 'function') drawStatsHUD();
  if(typeof drawPrestigeHUD === 'function') drawPrestigeHUD();
  if(typeof drawPauseHUD === 'function') drawPauseHUD();

  /* streak multiplier badge */
  const mult = streakMult();
  const mb = $('multBadge');
  if(mb){
    mb.textContent = 'x' + mult.toFixed(2);
    mb.style.color = mult > 1.25 ? 'var(--green)' : (mult > 1.05 ? 'var(--gold)' : 'var(--muted)');
    mb.title = 'Streak multiplier: ' + S.streak + ' days of consistency. Cap is x' + MULT_MAX.toFixed(2) + '.';
  }

  /* not-started banner */
  $('startBanner').style.display = S.started ? 'none' : 'block';

  /* weekly review reminder */
  const rb = $('reviewBanner');
  if(rb) rb.style.display = reviewDue() ? 'block' : 'none';

  /* streak danger warning — shows late in the day when nothing is done */
  const sd = $('streakDanger');
  if(sd){
    const h = (typeof getCairoHour === 'function') ? getCairoHour() : new Date().getHours();
    const av2 = available(DAILY);
    const doneToday = av2.filter(m => S.daily[m.id]).length;
    const late = h >= 20;
    const atRisk = S.started && S.streak > 0 && doneToday === 0 && late;
    sd.style.display = atRisk ? 'block' : 'none';
    if(atRisk){
      if($('sdHours')) $('sdHours').textContent = (24 - h) + ' hour' + ((24 - h) !== 1 ? 's' : '');
      if($('sdStreak')) $('sdStreak').textContent = S.streak;
    }
  }

  /* next-rank teaser in the HUD */
  const nt = $('rankTease');
  if(nt){
    const ri2 = rankIdx(S.xp), nx = RANKS[ri2 + 1];
    nt.textContent = nx
      ? (nx.xp - S.xp).toLocaleString() + ' XP to ' + nx.name
      : 'Maximum rank reached';
  }
}

/* jump to a tab by page name */
function goTab(name){
  const t = document.querySelector('.tab[data-page="' + name + '"]');
  if(t) t.click();
}

/* ---------------------------------------------------------------------
   MISSION ROWS
   --------------------------------------------------------------------- */
const GUIDE_TEXT = {};
function buildGuideIndex(){
  DAILY.concat(WEEKLY).forEach(m => { if(m.guide) GUIDE_TEXT[m.id] = m.guide; });
}

function missionRow(m, kind){
  const store = kind === 'daily' ? S.daily : S.weekly;
  const on = !!store[m.id];
  const nm = esc(m.name).replace(/'/g, "\\'");
  return '<div class="q '+(on?'done':'')+'">'
    + '<div class="box" onclick="toggleMission(\''+kind+'\',\''+m.id+'\',event)"></div>'
    + '<div class="qmain" onclick="toggleMission(\''+kind+'\',\''+m.id+'\',event)">'
    +   '<div class="qnm">'+esc(m.name)+'</div>'
    +   '<div class="qsb">'+esc(m.sub)+'</div>'
    + '</div>'
    + '<div class="xp" onclick="toggleMission(\''+kind+'\',\''+m.id+'\',event)">+'+m.xp+' XP</div>'
    + (m.guide ? '<button class="xbtn" onclick="event.stopPropagation();openModal(\''+nm+'\',\'How to do it\',GUIDE_TEXT[\''+m.id+'\'])">?</button>' : '')
    + '</div>';
}

function lockRow(m){
  return '<div class="lockrow">' + ic('lock',16) + ' <b style="color:var(--text)">'+esc(m.name)+'</b>'
    + ' &mdash; unlocks at level '+(m.unlock.level)+'</div>';
}

function drawDaily(){
  const av = available(DAILY), lk = lockedOf(DAILY);

  // Today's rotating weakness focus banner
  const todayDow = typeof getCairoDayOfWeek === 'function' ? getCairoDayOfWeek() : new Date().getDay();
  const themeObj = (typeof DAILY_THEMES !== 'undefined' && DAILY_THEMES[todayDow]) ? DAILY_THEMES[todayDow] : null;

  let html = '';
  if(themeObj){
    html += '<div class="daily-theme-card">'
          + '<div class="daily-theme-tag">TODAY\'S ROTATING WEAKNESS FOCUS &middot; ' + esc(themeObj.dayName) + '</div>'
          + '<div class="daily-theme-title">' + esc(themeObj.title) + '</div>'
          + '<div class="daily-theme-ar">' + esc(themeObj.titleAr) + '</div>'
          + '</div>';
  }

  html += av.map(m => missionRow(m,'daily')).join('');
  if(lk.length) html += lk.map(lockRow).join('');

  /* after 21 days a mission becomes a habit automatically — no extra tracking */
  const formed = formedHabits();
  if(formed.length){
    html += '<div class="st" style="margin-top:22px"><h2>Formed Habits</h2><span class="tag">' + formed.length + ' AUTOMATIC</span></div>';
    html += '<div class="hint" style="margin-bottom:14px">These missions ran for 21 days straight. They are habits now — they no longer appear in your daily quest. They just happen.</div>';
    html += '<div class="habitList">' + formed.map(h =>
      '<div class="habitChip">' + ic(h.icon || 'check', 16) + esc(h.name) + '</div>'
    ).join('') + '</div>';
  }

  $('dailyList').innerHTML = html;

  const pend = av.filter(m => !S.daily[m.id]);
  $('dashList').innerHTML = pend.length
    ? pend.slice(0,6).map(m => missionRow(m,'daily')).join('')
    : '<div class="hint" style="color:var(--green);margin:0">Daily quest complete. All missions cleared. Well done, Hunter.</div>';

  const done = av.filter(m => S.daily[m.id]).length;
  $('dashBar').style.width = (av.length ? done/av.length*100 : 0) + '%';
  $('dailyTag').textContent = done + ' / ' + av.length + ' COMPLETE';
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

  /* ===== GRAND CAMPAIGN RAIDS SECTION ===== */
  html += '<div class="st" style="margin-top:34px"><h2>Grand Campaign Raids &mdash; Saudi Arabia 2027</h2><span class="tag">STRATEGIC MILESTONES</span></div>';
  html += '<div class="hint">The 5 sovereign campaign gates. Clear every step to eliminate weaknesses and unlock the destination.</div>';

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
      + b.steps.map((s,i) =>
          '<div class="step '+(st[i]?'done':'')+'" onclick="toggleStep(\''+b.id+'\','+i+')">'
          + '<div class="sb"></div><span>'+esc(s)+'</span>'
          + '<b class="stepXp">'+(st[i]?ic('check',13)+' +'+b.xp:'+'+b.xp)+'</b></div>').join('')
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
  $('courseTag').textContent = done + ' / ' + COURSES.length + ' DONE';

  $('courseList').innerHTML = COURSES.map(c => {
    const open = courseOpen(c);
    const fin = !!S.courses[c.id];
    return '<div class="course '+(fin?'done':'')+'" style="'+(open?'':'opacity:.5')+'">'
      + '<div class="sb2" onclick="toggleCourse(\''+c.id+'\')">'+(fin?ic('check',16):'')+'</div>'
      + '<div class="cin">'
      +   '<div class="cn">'+esc(c.name)+'</div>'
      +   '<div class="cp">'+esc(c.platform)+' &middot; '+esc(c.hours)+' &middot; '+(open?'UNLOCKED':'UNLOCKS AT LEVEL '+STAGE_LEVELS[c.stage])+'</div>'
      +   '<div class="cw">'+esc(c.why)+'</div>'
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

/* ---------------------------------------------------------------------
   CLASS SYSTEM
   --------------------------------------------------------------------- */
function drawClass(){
  const list = $('classList');
  if(!list) return;

  if(S.classId){
    const c = CLASSES.find(x => x.id === S.classId);
    list.innerHTML = '<div class="hint">You are a <b>' + ic(c.icon,18) + ' ' + c.name + '</b>. ' + c.passive + '</div>';
  } else if(S.level < 10){
    list.innerHTML = '<div class="hint">Classes unlock at <b>level 10</b>. You are currently level ' + S.level + '.</div>';
  } else {
    list.innerHTML = CLASSES.map(c =>
      '<div class="bk classCard" onclick="chooseClass(\'' + c.id + '\')">'
      + '<div class="exTop"><span class="t">' + ic(c.icon,20) + ' ' + esc(c.name) + '</span><span class="exTag">' + esc(c.stat.toUpperCase()) + '</span></div>'
      + '<div class="w">' + esc(c.desc) + '</div>'
      + '<div class="exLearn"><div class="exLearnHead">ABILITY</div>'
      + '<div class="exItem"><div class="exLink">' + esc(c.ability.name) + ' (' + c.ability.cost + ' mana)</div>'
      + '<div class="exWhy">' + esc(c.ability.desc) + '</div></div>'
      + '<div class="exLearnHead" style="margin-top:8px">PASSIVE</div>'
      + '<div class="exItem"><div class="exWhy">' + esc(c.passive) + '</div></div></div>'
      + '</div></div>').join('');
  }

  if($('classHpVal')) $('classHpVal').textContent = S.hp + '/' + S.maxHp;
  if($('classHpBar')) $('classHpBar').style.width = (S.hp/S.maxHp*100) + '%';
  if($('classManaVal')) $('classManaVal').textContent = S.mana + '/' + S.maxMana;
  if($('classManaBar')) $('classManaBar').style.width = (S.mana/S.maxMana*100) + '%';
  if($('hpVal')) $('hpVal').textContent = S.hp + '/' + S.maxHp;
  if($('hpBar')) $('hpBar').style.width = (S.hp/S.maxHp*100) + '%';
  if($('manaVal')) $('manaVal').textContent = S.mana + '/' + S.maxMana;
  if($('manaBar')) $('manaBar').style.width = (S.mana/S.maxMana*100) + '%';
}

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

  const words = todaysVocab();
  const learned = vocabLearnedToday();

  const vt = $('vocabTag');
  if(vt){
    vt.textContent = learned + ' / ' + words.length;
    vt.style.color = learned === words.length ? 'var(--green)' : 'var(--glow)';
  }

  el.innerHTML = words.map(w => {
    const k = vocabKey(w.w);
    const on = S.vocab && S.vocab[k];
    return '<div class="vocabCard' + (on ? ' learned' : '') + '" onclick="learnVocab(\'' + k + '\')">'
      + '<div class="vcHead">'
      +   '<div class="vcWord">' + esc(w.w) + '</div>'
      +   '<div class="vcCheck">' + (on ? ic('check',18) : '') + '</div>'
      + '</div>'
      + '<div class="vcAr">' + esc(w.ar) + '</div>'
      + '<div class="vcDef">' + esc(w.def) + '</div>'
      + '<div class="vcEx">&ldquo;' + esc(w.ex) + '&rdquo;</div>'
      + '<div class="vcCat">' + esc(w.cat) + '</div>'
      + '</div>';
  }).join('');

  /* progress panel */
  const total = S.vocabTotal || 0;
  const pool = VOCAB.length;
  const doneDays = S.vocabDays || 0;

  if($('vTotal')) $('vTotal').textContent = total;
  if($('vToday')) $('vToday').textContent = learned + ' / ' + words.length;
  if($('vDays'))  $('vDays').textContent = doneDays;
  if($('vPool'))  $('vPool').textContent = pool;
  if($('vocabTotalTag')) $('vocabTotalTag').textContent = total + ' / ' + pool + ' WORDS';

  /* word bank, grouped */
  const bank = $('vocabBank');
  if(bank){
    const cats = {};
    VOCAB.forEach(w => { (cats[w.cat] = cats[w.cat] || []).push(w); });
    bank.innerHTML = Object.keys(cats).map(cat =>
      '<div class="vocabCat">'
      + '<div class="vcatHead">' + esc(cat) + '<span>' + cats[cat].length + '</span></div>'
      + cats[cat].map(w => {
          const k = vocabKey(w.w);
          const on = S.vocab && S.vocab[k];
          return '<div class="vbRow' + (on ? ' learned' : '') + '">'
            + '<span class="vbWord">' + esc(w.w) + '</span>'
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
  /* --- MONTHLY STREAK CALENDAR --- */
  const cal = streakCalendar();
  $('heatMap').innerHTML = cal.html;

  const active = cal.active;
  const perfect = (S.perfectDays || []).length;
  const misses = cal.missed;

  $('streakStats').innerHTML =
      statCard('Current Streak', S.streak, 'days in a row', 'var(--gold)')
    + statCard('Best Streak', S.best, 'your record', 'var(--glow)')
    + statCard('Active Days', active + '/30', 'last 30 days', active >= 24 ? 'var(--green)' : 'var(--gold)')
    + statCard('Perfect Days', perfect, 'all missions cleared', 'var(--green)')
    + statCard('Missed Days', misses, 'last 30 days', misses > 5 ? 'var(--red)' : 'var(--muted)')
    + statCard('Multiplier', 'x' + streakMult().toFixed(2), 'XP bonus from consistency', streakMult() > 1.25 ? 'var(--green)' : 'var(--gold)');

  /* --- where XP comes from ---
     real totals are tracked as they are earned, not estimated afterwards */
  const src = S.xpSource || {};
  const fromSteps    = src.boss     || 0;
  const fromMissions = src.mission  || 0;
  const fromCourses  = src.course   || 0;
  const fromBonus    = src.bonus    || 0;
  const fromVocab    = src.vocab    || 0;
  const fromOther    = Math.max(0, S.xp - (fromSteps + fromMissions + fromCourses + fromBonus + fromVocab));
  const total = Math.max(1, fromSteps + fromMissions + fromCourses + fromBonus + fromVocab + fromOther);

  const rows = [
    {n:'Daily missions',    v:fromMissions, c:'var(--glow)'},
    {n:'Boss raid steps',   v:fromSteps,    c:'var(--glow2)'},
    {n:'Bonuses & rewards', v:fromBonus,    c:'var(--gold)'},
    {n:'Courses',           v:fromCourses,  c:'var(--green)'},
    {n:'Vocabulary',        v:fromVocab,    c:'#25e07a'},
    {n:'Other',             v:fromOther,    c:'var(--muted)'}
  ].filter(r => r.v > 0).sort((a,b)=>b.v-a.v);

  $('xpBreak').innerHTML = (rows.length ? rows : [{n:'Nothing earned yet', v:0, c:'var(--muted)'}]).map(r =>
    '<div class="skillrow">'
    + '<div class="skhead"><span class="skname">' + r.n + '</span>'
    + '<span class="skval" style="color:' + r.c + '">' + r.v.toLocaleString() + '</span></div>'
    + '<div class="sktrack"><i class="skfill" style="width:' + Math.min(100, r.v/total*100)
    + '%;background:' + r.c + '"></i></div>'
    + '<div class="skmeta"><span>' + Math.round(r.v/total*100) + '% of your XP</span><span></span></div>'
    + '</div>').join('');

  /* --- rank progress --- */
  const ri = rankIdx(S.xp);
  const cur = RANKS[ri], nxt = RANKS[ri+1];
  $('rankProgTag').textContent = cur.name;

  if(nxt){
    const span = nxt.xp - cur.xp, done = S.xp - cur.xp;
    const pct = Math.min(100, done/span*100);
    const left = nxt.xp - S.xp;
    const perDay = active > 0 ? Math.round((S.xp - (S.startedOn ? 0 : 0)) / Math.max(1, active)) : 0;
    const daysLeft = perDay > 0 ? Math.ceil(left / perDay) : null;

    $('rankProg').innerHTML =
        '<div class="skhead"><span class="skname">' + cur.name + ' &rarr; ' + nxt.name + '</span>'
      + '<span class="skval" style="color:var(--glow)">' + done.toLocaleString() + ' / ' + span.toLocaleString() + '</span></div>'
      + '<div class="sktrack"><i class="skfill" style="width:' + pct + '%;background:linear-gradient(90deg,var(--glow),var(--glow2))"></i></div>'
      + '<div class="skmeta"><span>' + Math.round(pct) + '% of the way there</span>'
      + '<span>' + left.toLocaleString() + ' XP to go</span></div>'
      + '<div class="hint" style="margin-top:14px;margin-bottom:0">'
      + (perDay > 0
          ? 'You are earning roughly <b>' + perDay.toLocaleString() + ' XP per active day</b>. '
            + 'At that pace you reach <b>' + nxt.name + '</b> in about <b>' + daysLeft + ' active days</b>.'
          : 'Complete a few missions and this will start estimating your pace.')
      + '</div>';
  } else {
    $('rankProg').innerHTML = '<div class="hint" style="margin:0;color:var(--green)">Maximum rank reached. There is nothing above you.</div>';
  }

  /* --- domain balance --- */
  const vals = STATS.map(s => ({key:s.key, name:s.name, icon:s.icon, xp:S.statXP[s.key]||0}));
  const maxV = Math.max(1, ...vals.map(v => v.xp));
  const minV = Math.min(...vals.map(v => v.xp));
  $('domainBal').innerHTML = vals.map(v => {
    const weak = v.xp <= minV + 20 && maxV > 200;
    return '<div class="skillrow">'
      + '<div class="skhead"><span class="skname">' + ic(v.icon,17) + ' ' + v.name + '</span>'
      + '<span class="skval" style="color:' + (weak ? 'var(--red)' : 'var(--glow)') + '">' + v.xp.toLocaleString() + '</span></div>'
      + '<div class="sktrack"><i class="skfill" style="width:' + (v.xp/maxV*100) + '%;background:'
      + (weak ? 'linear-gradient(90deg,var(--red),var(--gold))' : 'linear-gradient(90deg,var(--glow),var(--glow2))') + '"></i></div>'
      + (weak ? '<div class="skmeta"><span style="color:var(--red)">Neglected &mdash; give this attention</span><span></span></div>' : '')
      + '</div>';
  }).join('');

  /* --- the status window that used to live in the Status tab --- */
  const sg = $('statGrid');
  if(sg){
    sg.innerHTML = STATS.map(s => {
      const lv = statOverall(s.key);
      const xp = S.statXP[s.key] || 0;
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
      + '<div class="w">'+esc(a.body).replace(/\n/g,'<br>')+'</div></div>').join('');
  }

  drawBadges();
  drawRecords();
}

/* build the monthly streak calendar */
function streakCalendar(){
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const firstDay = new Date(y, m, 1).getDay();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['S','M','T','W','T','F','S'];
  const today = dayKey();

  let active = 0, missed = 0, cells = '';

  cells += '<div class="calHead"><button class="calNav" onclick="calMonth(-1)">&larr;</button>'
         + '<div class="calTitle">' + monthNames[m] + ' ' + y + '</div>'
         + '<button class="calNav" onclick="calMonth(1)">&rarr;</button></div>';
  cells += '<div class="calGrid">';
  dayNames.forEach(d => { cells += '<div class="calDow">' + d + '</div>'; });
  for(let i = 0; i < firstDay; i++) cells += '<div class="calCell empty"></div>';

  for(let day = 1; day <= daysInMonth; day++){
    const k = y + '-' + String(m+1).padStart(2,'0') + '-' + String(day).padStart(2,'0');
    const isToday = (k === today);
    const rec = (S.log30 && S.log30[k]) || null;
    const perfect = (S.perfectDays || []).includes(k);
    const isFuture = day > now.getDate();

    let pct = 0, done = 0, tot = 0, cls = 'calCell';
    if(isFuture){ cls += ' future'; }
    else if(rec){ done = rec.done; tot = rec.total; pct = tot ? done/tot : 0; }
    else if(perfect){ done = 1; tot = 1; pct = 1; }

    if(!isFuture){
      if(pct >= 1)      { cls += ' dFull';   active++; }
      else if(pct >= .6){ cls += ' dHigh';   active++; }
      else if(pct > 0)  { cls += ' dSome';   active++; }
      else if(S.started && S.startedOn && k >= S.startedOn){ cls += ' dMiss'; missed++; }
      else { cls += ' dNone'; }
    }
    if(isToday) cls += ' today';
    if(perfect) cls += ' perfect';

    const detail = isFuture ? 'Future'
      : (done || tot ? done + '/' + tot + ' missions'
        : (S.started && S.startedOn && k >= S.startedOn ? 'No missions' : ''));

    cells += '<div class="' + cls + '" title="' + k + (detail ? ' \u00b7 ' + detail : '') + '">'
           + '<span class="calNum">' + day + '</span>'
           + (perfect ? '<span class="calStar">&#9733;</span>' : '')
           + (detail ? '<span class="calInfo">' + detail + '</span>' : '')
           + '</div>';
  }
  cells += '</div>';

  /* legend + the streak run itself */
  let runs = '';
  const last30 = (window.last30 ? null : null);
  runs += '<div class="calLegend">'
        + '<span><i class="calCell dFull"></i> Perfect</span>'
        + '<span><i class="calCell dHigh"></i> Strong</span>'
        + '<span><i class="calCell dSome"></i> Partial</span>'
        + '<span><i class="calCell dMiss"></i> Missed</span>'
        + '<span><i class="calCell dNone"></i> Before you started</span>'
        + '</div>';

  /* streak run: how many consecutive days ending today */
  let run = 0, runCells = '';
  for(let i = 0; i < 45; i++){
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = ymd(d);
    const rec = S.log30 && S.log30[k];
    const perfect = (S.perfectDays || []).includes(k);
    let on = false;
    if(rec && rec.done > 0) on = true;
    else if(perfect) on = true;
    if(i === 0 && !on){ /* today may still be in progress */ }
    if(!on) break;
    run++;
  }
  for(let i = run - 1; i >= 0; i--){
    const d = new Date(); d.setDate(d.getDate() - i);
    runCells += '<div class="streakDot on" title="' + ymd(d) + '"></div>';
  }
  for(let i = run; i < Math.max(7, run + 4); i++){
    runCells += '<div class="streakDot"></div>';
  }

  const streakHtml = '<div class="streakRunWrap"><div class="streakRunHead">'
    + '<span>CONSECUTIVE DAYS</span><span class="streakRunNum">' + S.streak + '</span></div>'
    + '<div class="streakRun">' + runCells + '</div>'
    + '<div class="streakRunHint">Days in a row you completed at least one mission.</div></div>';

  return { html: cells + runs + streakHtml, active: active, missed: missed };
}

function ymd(d){
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

let CAL_OFFSET = 0;
function calMonth(dir){
  CAL_OFFSET += dir;
  drawInsights();
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

/* ---------------------------------------------------------------------
   21-DAY HABIT TRACKER — UI Functions
   --------------------------------------------------------------------- */

/* ADD HABIT — add a custom habit to track */
function addHabit(name) {
  if (!name || !name.trim()) {
    alert('Please enter a habit name.');
    return null;
  }

  var habitId = 'custom_' + Date.now();
  var newHabit = {
    id: habitId,
    name: name.trim(),
    icon: 'target',
    category: 'Career',
    why: 'Custom habit added by you.',
    custom: true
  };

  /* Add to HABITS array */
  HABITS.push(newHabit);

  /* Initialize state */
  HABIT_TRACKER.ensureHabitState(habitId);

  save();
  sfx('success');
  log('HABIT', 'New habit added: <b>' + esc(name) + '</b>');
  return habitId;
}

/* CHECK / UNCHECK HABIT — toggle today's completion */
function checkHabit(habitId) {
  var state = HABIT_TRACKER.ensureHabitState(habitId);
  var today = dayKey();
  var idx = state.days.indexOf(today);
  var wasDone = idx !== -1;

  if (wasDone) {
    /* Uncheck: remove today from days array */
    state.days.splice(idx, 1);
    sfx('uncheck');
    log('HABIT', 'Unchecked: <b>' + esc(getHabitName(habitId)) + '</b>');

    /* Recalculate streaks */
    recalculateStreaks(state);

    save();
    } else {
    /* Check: add today to days array */
    state.days.push(today);

    /* Recalculate streaks */
    recalculateStreaks(state);

    /* Award XP for completing this habit */
    var gained = addXP(HABIT_TRACKER.xpPerHabit, null, false, 'habit');

    sfx('success');
    log('HABIT', 'Completed: <b>' + esc(getHabitName(habitId)) + '</b> — <b>+' + gained + ' XP</b>');

    /* Check if all habits are now done — award bonus */
    if (HABIT_TRACKER.allDoneToday()) {
      var bonusGained = addXP(HABIT_TRACKER.xpAllHabitsBonus, null, false, 'habitBonus');
      setTimeout(function() {
        log('ALL HABITS', 'Perfect day! All habits completed — <b>+' + bonusGained + ' XP</b> bonus!');
        sfx('levelup');
      }, 300);
    }

    save();
    }
}

/* REMOVE HABIT — remove a custom habit */
function removeHabit(habitId) {
  var habit = HABITS.find(function(h) { return h.id === habitId; });
  if (!habit) return;

  if (!confirm('Remove "' + habit.name + '" from tracking?')) return;

  /* Remove from HABITS array */
  var idx = HABITS.indexOf(habit);
  if (idx !== -1) HABITS.splice(idx, 1);

  /* Remove from state */
  if (S.habits && S.habits[habitId]) {
    delete S.habits[habitId];
  }

  save();
  log('HABIT', 'Removed: <b>' + esc(habit.name) + '</b>');
}

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
      { id: 'dash', label: 'System Dashboard' }
    ]
  },
  quests: {
    id: 'quests',
    name: 'Tasks',
    icon: '⚔️',
    bg: 'assets/bg/bg-system-gate.jpg',
    tabs: [
      { id: 'tasks', label: 'Task Manager' },
      { id: 'weekly', label: 'Weekly Quests' },
      { id: 'boss', label: 'Boss Raids' }
    ]
  },
  habits: {
    id: 'habits',
    name: 'Habits',
    icon: '🔄',
    bg: 'assets/bg/bg-hunter-status.jpg',
    tabs: [
      { id: 'habits', label: 'Daily Routines' },
      { id: 'insight', label: 'Streak & Insights' }
    ]
  },
  roadmap: {
    id: 'roadmap',
    name: 'Roadmap',
    icon: '🎯',
    bg: 'assets/bg/bg-hunter.jpg',
    tabs: [
      { id: 'roadmap', label: 'Saudi Arabia 2027' },
      { id: 'projects', label: 'Notion Projects' },
      { id: 'courses', label: 'Course Track' }
    ]
  },
  knowledge: {
    id: 'knowledge',
    name: 'Knowledge',
    icon: '🧠',
    bg: 'assets/bg/bg-academy-training.jpg',
    tabs: [
      { id: 'knowledge', label: 'Second Brain' },
      { id: 'skills', label: 'Skills Matrix' },
      { id: 'vocab', label: 'Vocabulary Bank' },
      { id: 'speaking', label: 'Speaking Lab' },
      { id: 'podcasts', label: 'Podcasts' },
      { id: 'library', label: 'Library' }
    ]
  },
  resources: {
    id: 'resources',
    name: 'Operations',
    icon: '💎',
    bg: 'assets/bg/bg-vault.jpg',
    tabs: [
      { id: 'expenses', label: 'Runway & Expenses' },
      { id: 'journal', label: 'Daily Reflections' },
      { id: 'review', label: 'Weekly Review' },
      { id: 'shadow', label: 'Shadow Army' },
      { id: 'hunter', label: 'Hunter Vitals' }
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
  let ownerPortal = null;
  for(const pid in PORTALS){
    if(PORTALS[pid].tabs.some(t => t.id === tabId)){
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

  currentActiveTab = tabId;

  document.querySelectorAll('.subnav-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.page === tabId);
  });

  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.page === tabId);
  });

  document.querySelectorAll('.page').forEach(page => {
    page.classList.toggle('active', page.id === tabId);
  });

  const bg = (PORTALS[ownerPortal] && PORTALS[ownerPortal].bg) || 'assets/bg/bg-system-gate.jpg';
  setBG(bg);

  sfx('tab');
  drawTab(tabId);
}

window.goTab = switchTab;

function renderAll(){
  drawHUD();
  checkHabitFormation();

  drawTab(currentActiveTab || 'dash');

  /* dynamic numbers that live outside the tab system */
  if($('fCost'))  $('fCost').textContent  = FREEZE.costXP;
  if($('fDebt'))  $('fDebt').textContent  = FREEZE.punishmentXP;
  if($('fEvery')) $('fEvery').textContent = FREEZE.earnEvery;
  if($('courseTag')) $('courseTag').textContent = Object.keys(S.courses).length + ' / ' + COURSES.length + ' DONE';
  if($('badgeTag'))  $('badgeTag').textContent  = S.badges.length + ' / ' + BADGES.length + ' EARNED';
  if($('libTag'))    $('libTag').textContent    = booksRead() + ' / ' + allBooks().length + ' READ';
}

/* draw one tab — the only place a tab's markup is rebuilt */
function drawTab(page){
  switch(page){
    case 'dash':      drawDashboardLifeOS(); break;
    case 'tasks':     drawTaskManager(); break;
    case 'daily':     drawTaskManager(); break;
    case 'habits':    drawHabitsSection(); break;
    case 'roadmap':   drawRoadmapSection(); break;
    case 'projects':  drawProjectsSection(); break;
    case 'knowledge': drawKnowledgeBaseSection(); break;
    case 'skills':    drawSkillsSection(); break;
    case 'vocab':     drawVocabSection(); break;
    case 'expenses':  drawFinanceSection(); break;
    case 'journal':   drawJournalSection(); break;
    case 'weekly':    drawWeekly(); break;
    case 'boss':      drawBosses(); break;
    case 'courses':   drawCourses(); drawCourseTree(); break;
    case 'library':   drawLibrary(); break;
    case 'review':    drawReview(); break;
    case 'insight':   drawInsights(); break;
    case 'hunter':    drawClass(); drawVision(); if(typeof renderEquipmentPanel === 'function') renderEquipmentPanel(); break;
    case 'shadow':    drawEggs(); drawShadow(); break;
    case 'money':     drawMoney(); break;
    case 'speaking':  drawSpeaking(); break;
    case 'uptodate':  drawUpToDate(); break;
    case 'podcasts':  drawPodcasts(); break;
  }
}

/* force a full rebuild — only used when data structure changes, not on
   every render tick */
function renderEverything(){
  drawHUD();
  drawDashboardLifeOS();
  drawTaskManager();
  drawHabitsSection();
  drawRoadmapSection();
  drawProjectsSection();
  drawKnowledgeBaseSection();
  drawSkillsSection();
  drawVocabSection();
  drawFinanceSection();
  drawJournalSection();
  drawWeekly(); drawBosses();
  drawCourses();
  drawLibrary();
  drawReview(); drawInsights(); drawCourseTree();
  drawClass(); drawVision();
  drawEggs();   /* this also draws the shadow + characters */
  drawMoney();
  drawSpeaking(); drawUpToDate(); drawPodcasts();
  if(typeof renderCoachPanel === 'function') renderCoachPanel();
  if(typeof renderStrengthBars === 'function') renderStrengthBars();
  if(typeof renderNegativeHabits === 'function') renderNegativeHabits();
  if(typeof renderEquipmentPanel === 'function') renderEquipmentPanel();
  if(typeof drawStatsHUD === 'function') drawStatsHUD();
  checkHabitFormation();
}

/* ---------------------------------------------------------------------
   BOOT
   --------------------------------------------------------------------- */
function boot(){
  buildGuideIndex();
  resets();
  autoBackup();
  checkForUpdates();
  /* pull cloud save first, then render */
  cloudLoad().then(function(pulled){
    /* one full rebuild at boot so every tab is populated, then the
       fast per-tab render takes over */
    renderEverything();
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
  /* reflect the saved mute state on the button */
  const mb = $('muteBtn');
  if(mb){
    const m = sfxMuted();
    mb.textContent = m ? 'Sound Off' : 'Sound On';
    mb.classList.toggle('off', m);
  }
  $('todayTag').textContent = new Date()
    .toLocaleDateString('en-GB',{timeZone:'Africa/Cairo',weekday:'short',day:'numeric',month:'short'}).toUpperCase();

  /* Initialize Portal Command Bar */
  document.querySelectorAll('.portal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchPortal(btn.dataset.portal);
    });
  });

  /* Keep legacy .tab selector working if present */
  document.querySelectorAll('.tab[data-page]').forEach(t => {
    t.addEventListener('click', () => {
      switchTab(t.dataset.page);
    });
  });

  /* Initial portal & tab boot */
  const initialHash = (location.hash || '').replace('#','');
  if (initialHash && $(initialHash)) {
    switchTab(initialHash);
  } else {
    switchPortal('dash', 'dash');
  }

  /* the guide changes his line every 10 minutes, and pops up on its own */
  /* rotate every 3 minutes — fast enough to feel alive */
  guideTimer = setInterval(() => { nextPhrase(true); popGuide(); }, 3*60*1000);

  /* ------------------------------------------------------------------
     MIDNIGHT ROLLOVER — the daily quest must reset at 00:00 Cairo time
     even when the page stays open all night.

     Why this needs three layers:
       1. A timer while the tab is focused
       2. A timer when the tab is in the background (browsers throttle
          setInterval to 1 call/minute when the tab is hidden)
       3. A check on visibility, focus and scroll — the moment you look
          at the page, it fixes itself

     Before this, the page only checked ONCE at boot, so if you left the
     tab open overnight the missions stayed frozen until you reloaded.
     ------------------------------------------------------------------ */
  function rolloverCheck(quiet){
    const t = dayKey();
    if(S.lastDay !== t){
      resets();
      autoBackup();
      renderAll();
      log('SYSTEM', 'A new day has begun. Daily quests reset. Prove yourself again, Hunter.');
      if(!quiet) sfx('boot');
      return true;
    }
    return false;
  }

  /* layer 1: every 20 seconds while focused */
  dayTimer = setInterval(function(){ rolloverCheck(false); }, 20*1000);

  /* layer 2: a wider net for when the tab is hidden (browsers throttle) */
  setInterval(function(){ rolloverCheck(false); }, 60*1000);

  /* layer 3: the instant you come back to the page */
  document.addEventListener('visibilitychange', function(){
    if(!document.hidden) rolloverCheck(false);
  });
  window.addEventListener('focus', function(){ rolloverCheck(true); });
  window.addEventListener('online', function(){ rolloverCheck(false); });

  if(!S.hist.length){
    setTimeout(() => log('SYSTEM',
      'Complete your first mission to activate the System. No penalties apply until you start.'), 800);
  }

  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });
}

function setBG(src){
  const l = $('bgLayer');
  l.classList.remove('on');
  setTimeout(() => {
    l.style.backgroundImage = "url('" + src + "')";
    l.classList.add('on');
  }, 150);
}

/* =====================================================================
   SOLO LEVELING PERSONAL LIFE OS — RENDERING ENGINES
   ===================================================================== */

/* 1. DASHBOARD LIFE OS ENGINE */
function drawDashboardLifeOS(){
  const dashList = $('dashList');
  if(!dashList) return;

  const priorities = getDailyPriorities();
  const completedCount = priorities.filter(t => S.daily && S.daily[t.id]).length;
  const totalCount = priorities.length;
  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  
  if($('dashBar')) $('dashBar').style.width = pct + '%';
  if($('penLabel')) $('penLabel').textContent = completedCount + ' / ' + totalCount;
  if($('penBar')) $('penBar').style.width = pct + '%';
  if($('todayTag')) $('todayTag').textContent = completedCount + ' / ' + totalCount + ' CLEARED';

  let html = '';
  
  /* Central Saudi Mission Hero Card */
  const fundCurrent = (S.relocationFund && S.relocationFund.current) || 0;
  const fundTarget = (S.relocationFund && S.relocationFund.target) || 120000;
  const fundPct = Math.min(100, Math.round((fundCurrent / fundTarget) * 100));

  html += '<div class="saudi-hero-card">'
    + '<div class="shc-header">'
    +   '<div class="shc-badge"><span class="pulse-dot"></span> CENTRAL LIFE MISSION</div>'
    +   '<div class="shc-target">TARGET: MID-2027</div>'
    + '</div>'
    + '<div class="shc-title">PREPARING FOR SAUDI ARABIA RELOCATION & CAREER</div>'
    + '<div class="shc-sub">Unified Progression &bull; Performance Marketing Leadership &bull; Financial Runway</div>'
    + '<div class="shc-quote">&ldquo;What should I do today to become more qualified, financially prepared, and professionally competitive for Saudi Arabia?&rdquo;</div>'
    + '<div class="shc-runway-row">'
    +   '<div class="shc-runway-meta">'
    +     '<span>Relocation Runway Fund ($2,500 Buffer)</span>'
    +     '<span class="gold-num">' + fundCurrent.toLocaleString() + ' / ' + fundTarget.toLocaleString() + ' EGP (' + fundPct + '%)</span>'
    +   '</div>'
    +   '<div class="bar thin"><i style="width:' + fundPct + '%;background:linear-gradient(90deg,var(--gold),#ffe066)"></i></div>'
    + '</div>'
    + '<div class="shc-actions">'
    +   '<button class="shc-btn" onclick="goTab(\'roadmap\')">View Saudi 5-Milestone Roadmap &rarr;</button>'
    +   '<button class="shc-btn secondary" onclick="goTab(\'projects\')">View Active Projects &rarr;</button>'
    + '</div>'
    + '</div>';

  /* Priorities Section Header */
  html += '<div class="priority-section-head">'
    + '<div>'
    +   '<h3 style="margin:0;font-family:var(--hud);font-size:15px;color:var(--sys-blue);letter-spacing:1px;">TODAY\'S STRATEGIC PRIORITIES</h3>'
    +   '<div style="font-size:12px;color:var(--muted);margin-top:2px;">Strict Limit: Never more than 10 tasks &bull; Focused on Saudi career readiness</div>'
    + '</div>'
    + '<div class="priority-load-badge ' + (totalCount > 8 ? 'heavy' : 'optimal') + '">'
    +   totalCount + ' / ' + MAX_DAILY_TASKS + ' ACTIVE TASKS'
    + '</div>'
    + '</div>';

  if(priorities.length === 0){
    html += '<div class="empty-priority-card">'
      + '<div style="font-size:28px;margin-bottom:8px;">⚔️</div>'
      + '<div style="font-family:var(--hud);font-size:14px;color:#fff;">NO ACTIVE PRIORITIES TODAY</div>'
      + '<div style="font-size:12px;color:var(--muted);margin-top:4px;">All routine tasks have graduated to Habits. Add a custom task or rest.</div>'
      + '</div>';
  } else {
    html += '<div class="priority-list">';
    priorities.forEach(t => {
      const isDone = !!(S.daily && S.daily[t.id]);
      const pColor = t.priority === 'high' ? 'var(--red)' : (t.priority === 'medium' ? 'var(--gold)' : 'var(--sys-blue)');
      html += '<div class="priority-item ' + (isDone ? 'done' : '') + '" onclick="toggleLifeOSTask(\'' + t.id + '\', event)">'
        + '<div class="p-check">' + (isDone ? '&#10003;' : '') + '</div>'
        + '<div class="p-content">'
        +   '<div class="p-top">'
        +     '<span class="p-name">' + esc(t.name) + '</span>'
        +     '<span class="p-badge" style="border-color:' + pColor + ';color:' + pColor + ';">' + (t.priority || 'medium').toUpperCase() + '</span>'
        +     '<span class="p-duration">' + esc(t.duration || '25 min') + '</span>'
        +   '</div>'
        +   '<div class="p-desc">' + esc(t.why || t.action || '') + '</div>'
        +   (t.outcome ? '<div class="p-outcome">Target: ' + esc(t.outcome) + '</div>' : '')
        + '</div>'
        + '<div class="p-xp">+' + t.xp + ' XP</div>'
        + '</div>';
    });
    html += '</div>';
  }

  html += '<div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;">'
    + '<button class="btn" style="flex:1;" onclick="openTaskModal()">+ Add New Priority Task</button>'
    + '<button class="btn secondary" onclick="goTab(\'tasks\')">Open Task Manager & Kanban &rarr;</button>'
    + '</div>';

  /* Habits Quick Glance Bar */
  if(typeof HABIT_ROUTINES_DEF !== 'undefined'){
    const completedHabits = HABIT_ROUTINES_DEF.filter(h => S.daily && S.daily[h.id]).length;
    html += '<div class="habits-glance-box">'
      + '<div class="hgb-head">'
      +   '<div>'
      +     '<span style="font-family:var(--hud);font-size:13px;color:#fff;letter-spacing:1px;">ESTABLISHED ROUTINES QUICK-CHECK</span>'
      +     '<span style="font-size:11.5px;color:var(--muted);margin-left:8px;">(Graduated from daily clutter)</span>'
      +   '</div>'
      +   '<span class="tag">' + completedHabits + ' / ' + HABIT_ROUTINES_DEF.length + ' DONE</span>'
      + '</div>'
      + '<div class="hgb-grid">'
      + HABIT_ROUTINES_DEF.map(h => {
          const done = !!(S.daily && S.daily[h.id]);
          const streak = (S.habitDays && S.habitDays[h.id] && S.habitDays[h.id].length) || 21;
          return '<div class="hgb-pill ' + (done ? 'done' : '') + '" onclick="toggleHabitRoutine(\'' + h.id + '\', event)">'
            + '<span class="hgb-check">' + (done ? '&#10003;' : '') + '</span>'
            + '<span class="hgb-name">' + esc(h.name) + '</span>'
            + '<span class="hgb-streak">&times;' + streak + '</span>'
            + '</div>';
        }).join('')
      + '</div>'
      + '<div style="margin-top:10px;text-align:right;">'
      +   '<a href="javascript:void(0)" onclick="goTab(\'habits\')" style="font-size:11.5px;color:var(--sys-blue);text-decoration:none;">View Full Habits Tracker & Routines &rarr;</a>'
      + '</div>'
      + '</div>';
  }

  /* Projects Quick Glance Bar */
  if(typeof LIFE_OS_PROJECTS !== 'undefined'){
    html += '<div class="projects-glance-box">'
      + '<div class="pgb-head">'
      +   '<span style="font-family:var(--hud);font-size:13px;color:#fff;letter-spacing:1px;">ACTIVE LIFE OS PROJECTS</span>'
      +   '<a href="javascript:void(0)" onclick="goTab(\'projects\')" style="font-size:11.5px;color:var(--sys-blue);text-decoration:none;">All Projects &rarr;</a>'
      + '</div>'
      + '<div class="pgb-list">'
      + LIFE_OS_PROJECTS.slice(0, 4).map(p => {
          const userP = (S.projects && S.projects[p.id]) || { progress: 0, subtasks: {} };
          const pSubtasks = (p.subtasks && p.subtasks.length) ? p.subtasks : (p.tasks || []);
          const subDone = pSubtasks.filter(s => (userP.subtasks && userP.subtasks[s.id]) || (userP.subtasks && userP.subtasks[s.id] === undefined && s.done)).length;
          const subTotal = pSubtasks.length;
          const progress = subTotal ? Math.round((subDone / subTotal) * 100) : (p.progress || userP.progress || 0);
          const pName = p.title || p.name || 'Untitled Project';
          const pCat = p.category || 'Initiative';
          const pDate = p.deadline || p.targetDate || '2027';
          return '<div class="pgb-row" onclick="goTab(\'projects\')">'
            + '<div class="pgb-info">'
            +   '<span class="pgb-name">' + esc(pName) + '</span>'
            +   '<span class="pgb-cat">' + esc(pCat) + ' &bull; Target: ' + esc(pDate) + '</span>'
            + '</div>'
            + '<div class="pgb-bar-wrap">'
            +   '<span class="pgb-pct">' + progress + '%</span>'
            +   '<div class="bar thin" style="width:100px;"><i style="width:' + progress + '%;background:linear-gradient(90deg,var(--glow),var(--glow2))"></i></div>'
            + '</div>'
            + '</div>';
        }).join('')
      + '</div>'
      + '</div>';
  }

  dashList.innerHTML = html;
}

/* 2. TASK MANAGER & KANBAN ENGINE */
let taskViewState = {
  view: 'list',
  filter: 'today'
};

function setTaskView(v){
  taskViewState.view = v;
  drawTaskManager();
}

function setTaskFilter(f){
  taskViewState.filter = f;
  drawTaskManager();
}

function drawTaskManager(){
  const container = $('taskManagerContainer');
  if(!container) return;

  const priorities = getDailyPriorities();
  const allCustom = (S.customTasks || []).filter(t => !t.archived);
  
  let allTasks = [];
  if(typeof ACTIVE_DAILY_TASKS_DEF !== 'undefined') allTasks = allTasks.concat(ACTIVE_DAILY_TASKS_DEF);
  allTasks = allTasks.concat(allCustom);

  let filtered = [];
  if(taskViewState.filter === 'today'){
    filtered = priorities;
  } else if(taskViewState.filter === 'in_progress'){
    filtered = allTasks.filter(t => (S.taskStatus && S.taskStatus[t.id] === 'in_progress') && !(S.daily && S.daily[t.id]));
  } else if(taskViewState.filter === 'upcoming'){
    filtered = allTasks.filter(t => t.status === 'upcoming' || (S.taskStatus && S.taskStatus[t.id] === 'upcoming'));
  } else if(taskViewState.filter === 'completed'){
    filtered = allTasks.filter(t => S.daily && S.daily[t.id]);
  } else {
    filtered = allTasks;
  }

  let html = '<div class="tm-header">'
    + '<div class="tm-top-bar">'
    +   '<div class="tm-views">'
    +     '<button class="tm-view-btn ' + (taskViewState.view === 'list' ? 'active' : '') + '" onclick="setTaskView(\'list\')">&#9776; List View</button>'
    +     '<button class="tm-view-btn ' + (taskViewState.view === 'kanban' ? 'active' : '') + '" onclick="setTaskView(\'kanban\')">&#9638; Kanban Board</button>'
    +   '</div>'
    +   '<button class="btn tm-add-btn" onclick="openTaskModal()">+ New Task</button>'
    + '</div>'
    + '<div class="tm-filter-bar">'
    +   '<button class="tm-filter-pill ' + (taskViewState.filter === 'today' ? 'active' : '') + '" onclick="setTaskFilter(\'today\')">Today (' + priorities.length + ')</button>'
    +   '<button class="tm-filter-pill ' + (taskViewState.filter === 'in_progress' ? 'active' : '') + '" onclick="setTaskFilter(\'in_progress\')">In Progress</button>'
    +   '<button class="tm-filter-pill ' + (taskViewState.filter === 'upcoming' ? 'active' : '') + '" onclick="setTaskFilter(\'upcoming\')">Upcoming</button>'
    +   '<button class="tm-filter-pill ' + (taskViewState.filter === 'completed' ? 'active' : '') + '" onclick="setTaskFilter(\'completed\')">Completed</button>'
    +   '<button class="tm-filter-pill ' + (taskViewState.filter === 'all' ? 'active' : '') + '" onclick="setTaskFilter(\'all\')">All Tasks</button>'
    +   '<div class="tm-cap-tag ' + (priorities.length >= MAX_DAILY_TASKS ? 'full' : '') + '">'
    +     'Capacity: ' + priorities.length + ' / ' + MAX_DAILY_TASKS
    +   '</div>'
    + '</div>'
    + '</div>';

  if(taskViewState.view === 'list'){
    html += '<div class="tm-list-view">';
    if(filtered.length === 0){
      html += '<div class="empty-priority-card" style="margin-top:20px;">No tasks match this filter.</div>';
    } else {
      filtered.forEach(t => {
        const isDone = !!(S.daily && S.daily[t.id]);
        const pColor = t.priority === 'high' ? 'var(--red)' : (t.priority === 'medium' ? 'var(--gold)' : 'var(--sys-blue)');
        html += '<div class="tm-task-row ' + (isDone ? 'done' : '') + '">'
          + '<div class="tm-task-left" onclick="toggleLifeOSTask(\'' + t.id + '\', event)">'
          +   '<div class="p-check">' + (isDone ? '&#10003;' : '') + '</div>'
          +   '<div>'
          +     '<div class="tm-task-title">' + esc(t.name) + '</div>'
          +     '<div class="tm-task-meta">'
          +       '<span class="p-badge" style="border-color:' + pColor + ';color:' + pColor + ';">' + (t.priority || 'medium').toUpperCase() + '</span>'
          +       '<span>' + esc(t.duration || '25 min') + '</span>'
          +       '<span>&bull;</span>'
          +       '<span>' + esc(t.sub || 'Career & Saudi') + '</span>'
          +       (t.project ? '<span class="tm-proj-tag">' + esc(t.project) + '</span>' : '')
          +     '</div>'
          +   '</div>'
          + '</div>'
          + '<div class="tm-task-right">'
          +   '<span class="p-xp">+' + t.xp + ' XP</span>'
          +   '<select class="tm-status-select" onchange="updateTaskStatus(\'' + t.id + '\', this.value)" onclick="event.stopPropagation()">'
          +     '<option value="today" ' + (((S.taskStatus && S.taskStatus[t.id] === 'today') || !S.taskStatus || !S.taskStatus[t.id]) ? 'selected' : '') + '>Today</option>'
          +     '<option value="in_progress" ' + (S.taskStatus && S.taskStatus[t.id] === 'in_progress' ? 'selected' : '') + '>In Progress</option>'
          +     '<option value="upcoming" ' + (S.taskStatus && S.taskStatus[t.id] === 'upcoming' ? 'selected' : '') + '>Upcoming</option>'
          +     '<option value="completed" ' + (isDone ? 'selected' : '') + '>Completed</option>'
          +   '</select>'
          + '</div>'
          + '</div>';
      });
    }
    html += '</div>';
  } else {
    const cols = [
      { id: 'today', name: "Today's Priorities", items: priorities.filter(t => !S.daily[t.id] && (!S.taskStatus || S.taskStatus[t.id] !== 'in_progress')) },
      { id: 'in_progress', name: 'In Progress', items: allTasks.filter(t => (S.taskStatus && S.taskStatus[t.id] === 'in_progress') && !S.daily[t.id]) },
      { id: 'upcoming', name: 'Upcoming & Inbox', items: allTasks.filter(t => (t.status === 'upcoming' || (S.taskStatus && S.taskStatus[t.id] === 'upcoming')) && !S.daily[t.id]) },
      { id: 'completed', name: 'Completed Today', items: allTasks.filter(t => S.daily && S.daily[t.id]) }
    ];

    html += '<div class="kanban-board">';
    cols.forEach(col => {
      html += '<div class="kanban-col">'
        + '<div class="kanban-col-head">'
        +   '<span>' + col.name + '</span>'
        +   '<span class="tag">' + col.items.length + '</span>'
        + '</div>'
        + '<div class="kanban-card-list">'
        + col.items.map(t => {
            const isDone = !!(S.daily && S.daily[t.id]);
            const pColor = t.priority === 'high' ? 'var(--red)' : (t.priority === 'medium' ? 'var(--gold)' : 'var(--sys-blue)');
            return '<div class="kanban-card ' + (isDone ? 'done' : '') + '" onclick="toggleLifeOSTask(\'' + t.id + '\', event)">'
              + '<div class="kc-top">'
              +   '<span class="p-badge" style="border-color:' + pColor + ';color:' + pColor + ';">' + (t.priority || 'medium').toUpperCase() + '</span>'
              +   '<span class="p-xp">+' + t.xp + ' XP</span>'
              + '</div>'
              + '<div class="kc-title">' + esc(t.name) + '</div>'
              + '<div class="kc-desc">' + esc(t.why || t.action || '') + '</div>'
              + '<div class="kc-footer">'
              +   '<span>' + esc(t.duration || '25 min') + '</span>'
              +   '<span class="kc-shift-btn" onclick="event.stopPropagation(); updateTaskStatus(\'' + t.id + '\', \'' + (col.id === 'today' ? 'in_progress' : (col.id === 'in_progress' ? 'completed' : 'today')) + '\')">Shift &rarr;</span>'
              + '</div>'
              + '</div>';
          }).join('')
        + (col.items.length === 0 ? '<div class="kanban-empty">Empty</div>' : '')
        + '</div>'
        + '</div>';
    });
    html += '</div>';
  }

  container.innerHTML = html;
}

/* 3. HABITS SECTION ENGINE */
function drawHabitsSection(){
  const container = $('habitTrackerContainer');
  if(!container) return;

  const routines = typeof HABIT_ROUTINES_DEF !== 'undefined' ? HABIT_ROUTINES_DEF : [];
  const completedCount = routines.filter(h => S.daily && S.daily[h.id]).length;
  const totalCount = routines.length;

  let morning = routines.filter(h => (h.time === 'Morning') || (h.timeOfDay || '').toLowerCase().includes('morn') || (h.category || '').toLowerCase().includes('morn'));
  let day = routines.filter(h => (h.time === 'Day') || (h.timeOfDay || '').toLowerCase().includes('day') || (h.category || '').toLowerCase().includes('day') || (h.category || '').toLowerCase().includes('prof') || (h.category || '').toLowerCase().includes('strat') || (h.category || '').toLowerCase().includes('work'));
  let night = routines.filter(h => (h.time === 'Night') || (h.timeOfDay || '').toLowerCase().includes('even') || (h.timeOfDay || '').toLowerCase().includes('night') || (h.category || '').toLowerCase().includes('even') || (h.category || '').toLowerCase().includes('night') || (h.category || '').toLowerCase().includes('recov'));

  let html = '<div class="panel">'
    + '<div class="st">'
    +   '<h2>Habits & Routines Management</h2>'
    +   '<span class="tag">' + completedCount + ' / ' + totalCount + ' COMPLETED TODAY</span>'
    + '</div>'
    + '<div class="hint">'
    +   '<b>Intelligent Habit Recognition System:</b> When a daily action reaches <b>21+ completions</b>, it automatically graduates from your active quest list to your permanent Habits section. It builds long-term discipline without cluttering your daily priorities.'
    + '</div>'
    + '<div class="habits-stats-row">'
    +   '<div class="stat"><div class="h"><span class="n">Active Habits</span><span class="lv" style="color:var(--sys-blue);">' + totalCount + '</span></div><div class="sb">Graduated routines</div></div>'
    +   '<div class="stat"><div class="h"><span class="n">Today\'s Progress</span><span class="lv" style="color:var(--green);">' + completedCount + '/' + totalCount + '</span></div><div class="sb">' + Math.round((completedCount/totalCount)*100 || 0) + '% completed</div></div>'
    +   '<div class="stat"><div class="h"><span class="n">Formation Threshold</span><span class="lv" style="color:var(--gold);">21 Days</span></div><div class="sb">Neuroplasticity lock</div></div>'
    +   '<div class="stat"><div class="h"><span class="n">Consistency Score</span><span class="lv" style="color:var(--glow);">' + (S.streak >= 21 ? 'EXEMPLARY' : 'STABLE') + '</span></div><div class="sb">' + S.streak + '-day streak</div></div>'
    + '</div>'
    + '</div>';

  const renderRoutineGroup = (title, icon, items) => {
    let groupHtml = '<div class="panel">'
      + '<div class="st"><h2 style="color:var(--sys-blue);">' + icon + ' ' + title + '</h2><span class="tag">' + items.filter(h => S.daily && S.daily[h.id]).length + ' / ' + items.length + ' DONE</span></div>'
      + '<div class="habit-group-grid">';
    items.forEach(h => {
      const isDone = !!(S.daily && S.daily[h.id]);
      const streak = (S.habitDays && S.habitDays[h.id] && S.habitDays[h.id].length) || 21;
      groupHtml += '<div class="habit-routine-card ' + (isDone ? 'done' : '') + '" onclick="toggleHabitRoutine(\'' + h.id + '\', event)">'
        + '<div class="hrc-left">'
        +   '<div class="p-check">' + (isDone ? '&#10003;' : '') + '</div>'
        +   '<div>'
        +     '<div class="hrc-title">' + esc(h.name) + '</div>'
        +     '<div class="hrc-why">' + esc(h.why) + '</div>'
        +   '</div>'
        + '</div>'
        + '<div class="hrc-right">'
        +   '<span class="hrc-grad-badge">&#127942; ESTABLISHED (' + streak + 'D)</span>'
        +   '<span class="p-xp">+10 XP</span>'
        + '</div>'
        + '</div>';
    });
    groupHtml += '</div></div>';
    return groupHtml;
  };

  html += renderRoutineGroup('Morning Routine — Foundation & Focus', '🌅', morning);
  html += renderRoutineGroup('Day & Work Routine — High Performance & Strategy', '⚡', day);
  html += renderRoutineGroup('Night Routine — Recovery, Expense Audit & Reflection', '🌙', night);

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

/* 8. VOCABULARY ENGINE WITH AUDIO TTS */
function speakWord(term){
  if('speechSynthesis' in window){
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(term);
    u.lang = 'en-US';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  } else {
    alert('Speech synthesis audio is not supported in this browser.');
  }
}

function drawVocabSection(){
  const todayContainer = $('vocabToday');
  if(!todayContainer) return;

  const vocabPool = typeof EXPANDED_VOCAB_DATA !== 'undefined' ? EXPANDED_VOCAB_DATA : (typeof VOCAB_DATA !== 'undefined' ? VOCAB_DATA : []);
  
  if($('vPool')) $('vPool').textContent = vocabPool.length;
  const learnedTotal = (S.vocabLearned || []).length;
  if($('vTotal')) $('vTotal').textContent = learnedTotal;
  if($('vocabTotalTag')) $('vocabTotalTag').textContent = learnedTotal + ' WORDS';

  let html = '<div class="vocab-cards-grid">';
  vocabPool.forEach(v => {
    const word = v.word || v.w || '';
    const isLearned = (S.vocabLearned || []).includes(word);
    const category = v.category || v.cat || 'Marketing';
    const ipa = v.ipa || '';
    const def = v.def || v.meaning || v.ctx || '';
    const ar = v.arabic || v.ar || '';
    const ex = v.example || v.ex || '';

    html += '<div class="vocab-card ' + (isLearned ? 'learned' : '') + '">'
      + '<div class="vc-top">'
      +   '<span class="vc-cat">' + esc(category) + '</span>'
      +   '<button class="vc-audio-btn" onclick="speakWord(\'' + esc(word).replace(/'/g, "\\'") + '\')">&#128266; Listen</button>'
      + '</div>'
      + '<div class="vc-word-row">'
      +   '<h3 class="vc-word">' + esc(word) + '</h3>'
      +   (ipa ? '<span class="vc-ipa">' + esc(ipa) + '</span>' : '')
      + '</div>'
      + '<div class="vc-def">' + esc(def) + '</div>'
      + (ar ? '<div class="vc-ar"><b>المعنى بالعربي:</b> ' + esc(ar) + '</div>' : '')
      + (ex ? '<div class="vc-ex">&ldquo;' + esc(ex) + '&rdquo;</div>' : '')
      + '<div class="vc-footer">'
      +   '<button class="vc-learn-btn ' + (isLearned ? 'done' : '') + '" onclick="toggleVocabLearned(\'' + esc(word).replace(/'/g, "\\'") + '\')">'
      +     (isLearned ? '&#10003; Learned' : 'Mark Learned (+8 XP)')
      +   '</button>'
      + '</div>'
      + '</div>';
  });
  html += '</div>';
  todayContainer.innerHTML = html;
}

function toggleVocabLearned(word){
  if(!S.vocabLearned) S.vocabLearned = [];
  const idx = S.vocabLearned.indexOf(word);
  if(idx !== -1){
    S.vocabLearned.splice(idx, 1);
    subXP(8, 'english', 'vocab', 8);
    sfx('uncheck');
  } else {
    S.vocabLearned.push(word);
    addXP(8, 'english', true, 'vocab');
    sfx('check');
    log('VOCAB LEARNED', 'Learned vocabulary: <b>' + esc(word) + '</b> (+8 XP).');
  }
  save();
  renderAll();
}

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
