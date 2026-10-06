/* =====================================================================
   SOLO LEVELING — RENDER LAYER
   Everything that draws the interface.
   ===================================================================== */

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

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
  drawHistory();
}

function beep(f, d, type){
  try{
    const C = window.AudioContext || window.webkitAudioContext;
    if(!C) return;
    window._ac = window._ac || new C();
    const ac = window._ac;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'sine';
    o.frequency.value = f;
    g.gain.setValueAtTime(.05, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + d);
    o.connect(g); g.connect(ac.destination);
    o.start(); o.stop(ac.currentTime + d);
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
  $('ovN').textContent = big;
  $('ovS').textContent = sub || '';
  $('ovb').className = 'ovb' + (bad ? ' bad' : '');
  $('ov').classList.add('show');
  if(!bad){
    confetti();
    beep(660,.12); setTimeout(()=>beep(880,.12),130); setTimeout(()=>beep(1180,.3),270);
  } else {
    beep(200,.3,'sawtooth');
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

  /* daily quest completion meter */
  const av = available(DAILY);
  const done = av.filter(m => S.daily[m.id]).length;
  const pct = av.length ? done/av.length*100 : 0;
  $('penBar').style.width = pct + '%';
  $('penLabel').textContent = done + ' / ' + av.length;
  $('penLabel').style.color = pct === 100 ? 'var(--green)' : (pct < 40 ? 'var(--red)' : 'var(--gold)');
}

/* ---------------------------------------------------------------------
   MISSION ROWS
   --------------------------------------------------------------------- */
function missionRow(m, kind){
  const store = kind === 'daily' ? S.daily : S.weekly;
  const on = !!store[m.id];
  return '<div class="q '+(on?'done':'')+'">'
    + '<div class="box" onclick="toggleMission(\''+kind+'\',\''+m.id+'\',event)"></div>'
    + '<div class="qmain" onclick="toggleMission(\''+kind+'\',\''+m.id+'\',event)">'
    +   '<div class="qnm">'+esc(m.name)+'</div>'
    +   '<div class="qsb">'+esc(m.sub)+'</div>'
    + '</div>'
    + '<div class="xp" onclick="toggleMission(\''+kind+'\',\''+m.id+'\',event)">+'+m.xp+' XP</div>'
    + (m.guide ? '<button class="xbtn" onclick="event.stopPropagation();openModal(\''+esc(m.name).replace(/'/g,"\\'")+'\',\'How to do it\',GUIDE_TEXT[\''+m.id+'\'])">?</button>' : '')
    + '</div>';
}

/* guide text lookup, built once from the mission data */
const GUIDE_TEXT = {};
function buildGuideIndex(){
  DAILY.concat(WEEKLY).forEach(m => { if(m.guide) GUIDE_TEXT[m.id] = m.guide; });
}

function lockRow(m){
  return '<div class="lockrow">&#128274; <b style="color:var(--text)">'+esc(m.name)+'</b>'
    + ' &mdash; unlocks at level '+(m.unlock.level||m.unlock.tier)+'</div>';
}

function drawDaily(){
  const av = available(DAILY), lk = lockedOf(DAILY);
  let html = av.map(m => missionRow(m,'daily')).join('');
  if(lk.length) html += lk.map(lockRow).join('');
  $('dailyList').innerHTML = html;

  /* dashboard: only unfinished */
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
  let html = av.map(m => missionRow(m,'weekly')).join('');
  if(lk.length) html += lk.map(lockRow).join('');
  $('weeklyList').innerHTML = html;
}

/* ---------------------------------------------------------------------
   BOSSES
   --------------------------------------------------------------------- */
function drawBosses(){
  $('bossList').innerHTML = BOSSES.map(b => {
    const st = S.boss[b.id] || b.steps.map(()=>false);
    const pct = bossPct(b.id);
    const fin = bossDone(b.id);
    return '<div class="boss '+(fin?'done':'')+'">'
      + '<h3>'+(fin?'&#10003; ':'')+esc(b.name)+'</h3>'
      + '<div class="ds">'+esc(b.desc)+'</div>'
      + '<div class="pc">'+pct+'% COMPLETE &middot; '+st.filter(Boolean).length+' / '+b.steps.length+' STEPS</div>'
      + '<div class="bar thin"><i style="width:'+pct+'%"></i></div>'
      + '<div class="steps">'
      + b.steps.map((s,i) =>
          '<div class="step '+(st[i]?'done':'')+'" onclick="toggleStep(\''+b.id+'\','+i+')">'
          + '<div class="sb"></div><span>'+esc(s)+'</span></div>').join('')
      + '</div></div>';
  }).join('');
}

/* ---------------------------------------------------------------------
   ROADMAP — chapters that unlock as you progress
   --------------------------------------------------------------------- */
const CHAPTERS = [
  {id:'c1', lvl:1,  name:'Chapter 1 &mdash; The Awakening', bg:'bg-dashboard',
   req:'Where you are now. Build the foundation: faith, health, English, reading, and phone discipline.',
   missions:['Fajr on time','10-minute home workout','30 minutes of English','30 minutes of reading','No phone for the first 30 min']},
  {id:'c2', lvl:5,  name:'Chapter 2 &mdash; The Hunt', bg:'bg-daily',
   req:'Money starts moving and the Saudi market research begins. Habits are set; now build leverage.',
   missions:['Log daily expenses','Save into the Saudi FUND','Study the Saudi market','Practise interview answers']},
  {id:'c3', lvl:15, name:'Chapter 3 &mdash; Awakened', bg:'bg-hunter',
   req:'Speaking, publishing, reviewing. The market starts to notice you exist.',
   missions:['English speaking practice','Post on LinkedIn daily','Weekly review every Sunday']},
  {id:'c4', lvl:25, name:'Chapter 4 &mdash; Saudi Arabia', bg:'bg-roadmap',
   req:'You are on the ground in Saudi Arabia. The job is secured. Now the reputation gets built.',
   missions:['Grow the professional network locally','Build the personal brand in the Gulf market','Study the Gulf advertising market','Build the first Gulf client relationships']},
  {id:'c5', lvl:40, name:'Chapter 5 &mdash; The Craft', bg:'bg-weekly',
   req:'Content creation becomes the priority. Photography, lighting and video to a professional standard.',
   missions:['Master manual camera control','Learn one-light and two-light setups','Shoot 10 practice projects','Build a 20-piece portfolio']},
  {id:'c6', lvl:55, name:'Chapter 6 &mdash; The Agency', bg:'bg-vault',
   req:'Your own advertising agency in the Gulf. From freelancer to founder.',
   missions:['Define services and pricing','Build the brand identity','Register the business','Land the first paying client']},
  {id:'c7', lvl:70, name:'Chapter 7 &mdash; Ten Clients', bg:'bg-boss',
   req:'A real book of business. Ten clients. The agency is no longer a gamble.',
   missions:['Grow to 3 clients','Grow to 5 clients','Grow to 10 clients','Build a team']},
  {id:'c8', lvl:85, name:'Chapter 8 &mdash; Germany', bg:'bg-guide',
   req:'The MBA. The final raid. Everything before this was preparation.',
   missions:['Shortlist 8 universities','Prepare for the GMAT','Reach the required IELTS score','Save the full cost','Submit the applications']}
];

function drawRoadmap(){
  $('roadList').innerHTML = CHAPTERS.map(c => {
    const on = S.level >= c.lvl;
    return '<div class="boss '+(on?'done':'')+'" style="'+(on?'':'opacity:.55')+'">'
      + '<h3>'+(on?'&#10003; ':'&#128274; ')+c.name+'</h3>'
      + '<div class="ds">'+c.req+'</div>'
      + '<div class="pc">'+(on ? 'UNLOCKED' : 'UNLOCKS AT LEVEL '+c.lvl)+'</div>'
      + '<div class="steps">'+c.missions.map(m =>
          '<div class="step '+(on?'done':'')+'"><div class="sb"></div><span>'+esc(m)+'</span></div>').join('')
      + '</div></div>';
  }).join('');
}

/* ---------------------------------------------------------------------
   REWARD VAULT
   --------------------------------------------------------------------- */
function drawRewards(){
  if(!S.rewards.length){
    $('rwList').innerHTML = '<div class="hint">You have not written any rewards yet. Add your first one below &mdash; something small and real.</div>';
    return;
  }
  $('rwList').innerHTML = S.rewards.map(r => {
    const open = rewardOpen(r);
    return '<div class="rw '+(open&&!r.claimed?'open':'')+' '+(r.claimed?'claimed':'')+'">'
      + '<div class="ic">'+(r.claimed?'&#10003;':'&#127873;')+'</div>'
      + '<div class="in">'
      +   '<div class="t">'+esc(r.name)+'</div>'
      +   '<div class="r">Unlock: reach '+r.unlockType+' '+r.value+(r.claimed?' &middot; claimed '+esc(r.claimedOn||''):'')+'</div>'
      +   (r.hint ? '<div class="hn">'+esc(r.hint)+'</div>' : '')
      + '</div>'
      + (r.claimed
          ? '<div class="lk">CLAIMED</div>'
          : (open ? '<div class="lk go" onclick="claimReward(\''+r.id+'\')">CLAIM</div>'
                  : '<div class="lk">LOCKED</div>'))
      + '<button class="xbtn" onclick="delReward(\''+r.id+'\')">&#10005;</button>'
      + '</div>';
  }).join('');
}

function openRewardForm(){
  const name = prompt('What is the reward?');
  if(!name || !name.trim()) return;
  const type = (prompt('Unlock by typing: level, streak, or xp','level')||'').trim().toLowerCase();
  if(!['level','streak','xp'].includes(type)){ alert('Please type level, streak, or xp.'); return; }
  const val = parseInt(prompt('Required '+type+' value:'),10);
  if(!val || val < 1){ alert('Please enter a number greater than zero.'); return; }
  const hint = prompt('Optional note to yourself (or leave empty):') || '';

  S.rewards.push({
    id:'r'+Date.now(),
    name:name.trim(), unlockType:type, value:val, hint:hint.trim(), claimed:false
  });
  save();
  log('SYSTEM','Reward added: <b>'+esc(name.trim())+'</b>.');
  renderAll();
}

function delReward(id){
  const r = S.rewards.find(x => x.id === id);
  if(!r) return;
  if(!confirm('Delete the reward "'+r.name+'"?')) return;
  S.rewards = S.rewards.filter(x => x.id !== id);
  save();
  renderAll();
}

/* ---------------------------------------------------------------------
   LIBRARY
   --------------------------------------------------------------------- */
function drawLibrary(){
  $('libList').innerHTML = BOOKS.map(c =>
    '<div class="cat"><h4>'+esc(c.cat)+'</h4>'
    + c.items.map(b =>
        '<div class="bk"><div class="t">'+esc(b.t)+'</div>'
        + '<div class="a">'+esc(b.a)+'</div>'
        + '<div class="w">'+esc(b.why)+'</div></div>').join('')
    + '</div>').join('');
}

/* ---------------------------------------------------------------------
   COACH
   --------------------------------------------------------------------- */
function drawCoach(){
  $('msgCount').textContent = S.msgs.length;
  $('msgList').innerHTML = S.msgs.length
    ? S.msgs.map(m =>
        '<div class="bk"><div class="t">'+esc(m.s)+'</div>'
        + '<div class="a">'+esc(m.d)+'</div>'
        + '<div class="w">'+esc(m.b).replace(/\n/g,'<br>')+'</div></div>').join('')
    : '<div class="hint" style="margin:0">Nothing sent yet.</div>';
}

function sendToHermes(){
  const s = $('cName').value.trim();
  const b = $('cBody').value.trim();
  if(!s && !b){ alert('Write something first.'); return; }

  const subject = s || 'Progress update';
  const full = 'SOLO LEVELING REPORT\n'
    + 'Subject: ' + subject + '\n'
    + 'Level: ' + S.level + ' | XP: ' + S.xp + ' | Rank: ' + RANKS[rankIdx(S.xp)].name
    + ' | Streak: ' + S.streak + ' days\n'
    + 'Missions completed today: ' + available(DAILY).filter(m=>S.daily[m.id]).length
    + ' / ' + available(DAILY).length + '\n\n'
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
  const bossLines = BOSSES.map(b => '  ' + b.name + ': ' + bossPct(b.id) + '%').join('\n');

  const body = 'What I completed today:\n'
    + (done.length ? done.map(m=>'  - '+m.name).join('\n') : '  (nothing yet)') + '\n\n'
    + 'What I did not complete:\n'
    + (miss.length ? miss.map(m=>'  - '+m.name).join('\n') : '  (all done)') + '\n\n'
    + 'Boss raid progress:\n' + bossLines + '\n\n'
    + 'What I want from Hermes:\n  ';

  $('cName').value = 'Daily progress report';
  $('cBody').value = body;
}

function copy(text){
  try{
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text);
      return;
    }
  }catch(e){}
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try{ document.execCommand('copy'); }catch(e){}
  ta.remove();
}

/* ---------------------------------------------------------------------
   STATUS
   --------------------------------------------------------------------- */
function drawStats(){
  $('statGrid').innerHTML = STATS.map(s => {
    const lv = statLevel(s.key);
    const xp = S.statXP[s.key] || 0;
    const inLv = xp % STAT_XP;
    return '<div class="stat">'
      + '<div class="h"><span class="n">'+s.icon+' '+s.name+'</span><span class="lv">Lv '+lv+'</span></div>'
      + '<div class="bar thin"><i style="width:'+(inLv/STAT_XP*100)+'%"></i></div>'
      + '<div class="sb">'+xp.toLocaleString()+' XP earned here</div></div>';
  }).join('');

  const ri = rankIdx(S.xp);
  $('rankList').innerHTML = RANKS.map((r,i) => {
    const got = i <= ri;
    const nxt = RANKS[i+1];
    let pct = 0;
    if(got) pct = (i < ri) ? 100 : (nxt ? Math.min(100,(S.xp-r.xp)/(nxt.xp-r.xp)*100) : 100);
    return '<div class="stat" style="margin-bottom:10px;'+(got?'border-color:var(--glow)':'')+'">'
      + '<div class="h"><span class="n">'+r.name+'</span><span class="lv">'+(got?'&#10003;':'')+'</span></div>'
      + '<div class="bar thin"><i style="width:'+pct+'%"></i></div>'
      + '<div class="sb">'+r.note+' &middot; unlocks at '+r.xp.toLocaleString()+' XP</div></div>';
  }).join('');

  $('rQ').textContent = S.qDone;
  $('rS').textContent = S.sDone;
  $('rB').textContent = S.best;
  $('rR').textContent = S.rewards.filter(r=>r.claimed).length;
  $('rP').textContent = S.penCount;
  $('rL').textContent = S.xpLost;

  $('missList').innerHTML = MISSING.map(m =>
    '<div class="bk"><div class="t">'+esc(m.item)+'</div>'
    + '<div class="w"><b style="color:var(--text)">Why:</b> '+esc(m.why)+'</div>'
    + '<div class="w"><b style="color:var(--glow)">How to fix:</b> '+esc(m.how)+'</div></div>').join('');
}

function drawHistory(){
  $('history').innerHTML = S.hist.length
    ? S.hist.slice(0,10).map(h =>
        '<div style="padding:9px 0;border-bottom:1px solid rgba(29,59,107,.5)">'
        + '<span style="font-family:var(--hud);font-size:10px;color:var(--glow);letter-spacing:1.4px">'+esc(h.h)+'</span> '
        + '<span style="font-size:14px">'+h.t+'</span>'
        + '<div style="font-size:11px;color:var(--muted);margin-top:2px">'+esc(h.d)+'</div></div>').join('')
    : 'No activity recorded yet. Start your first mission.';
}

/* ---------------------------------------------------------------------
   GUIDE (Jin-Woo)
   --------------------------------------------------------------------- */
let phraseIdx = 0;
function nextPhrase(){
  phraseIdx = (phraseIdx + 1) % GUIDE_PHRASES.length;
  $('gSay').textContent = GUIDE_PHRASES[phraseIdx];
  beep(600,.06,'triangle');
}

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
  txt += '\n\nLevel ' + S.level + ' \u00b7 ' + S.xp + ' XP \u00b7 ' + S.streak + '-day streak.';

  openModal('Daily Briefing', 'From your guide', txt);
}

/* ---------------------------------------------------------------------
   MASTER RENDER
   --------------------------------------------------------------------- */
function renderAll(){
  drawHUD(); drawDaily(); drawWeekly(); drawBosses();
  drawRoadmap(); drawRewards(); drawLibrary();
  drawCoach(); drawStats(); drawHistory();
}

/* ---------------------------------------------------------------------
   BOOT
   --------------------------------------------------------------------- */
function boot(){
  buildGuideIndex();
  resets();
  renderAll();

  $('gSay').textContent = GUIDE_PHRASES[0];
  $('todayTag').textContent = new Date()
    .toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'}).toUpperCase();

  /* tabs + backgrounds */
  document.querySelectorAll('.tab[data-page]').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.tab[data-page]').forEach(x => x.classList.remove('active'));
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      t.classList.add('active');
      $(t.dataset.page).classList.add('active');
      setBG(t.dataset.bg);
      beep(520,.05,'triangle');
      window.scrollTo({top:0,behavior:'smooth'});
    });
  });

  setBG('assets/bg/bg-dashboard.jpg');

  /* rotate the guide line every 45 seconds */
  setInterval(() => {
    if($('dash').classList.contains('active')) nextPhrase();
  }, 45000);

  if(!S.hist.length){
    setTimeout(() => log('SYSTEM',
      'You have acquired the qualifications to be a Player. Complete your daily quest.'), 800);
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

function resetAll(){
  if(!confirm('This erases all XP, levels, streaks and progress. Continue?')) return;
  if(!confirm('Final confirmation: start again from level 1?')) return;
  S = blank();
  save();
  renderAll();
  log('SYSTEM','All data reset. A new beginning.');
}
