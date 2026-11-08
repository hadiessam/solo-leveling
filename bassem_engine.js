/* =====================================================================
   BASSEM SCHOOL — AI DIGITAL MARKETING MASTERY ENGINE
   State tracking, lesson toggling, study sessions, XP calculation,
   and Dashboard & Boss view renderers.
   ===================================================================== */

function initBassemState(){
  if(!S.bassem){
    S.bassem = {
      progress: 0,
      studyStreak: 0,
      lastStudyDate: '',
      totalStudyMinutes: 0,
      xpEarned: 0,
      completedLessons: {},
      todayMinutes: 0,
      todayLogDate: '',
      currentLesson: {
        phaseId: 'phase1',
        courseId: 'p1_strat',
        lessonIndex: 0,
        lessonName: 'SWOT Marketing Analysis'
      },
      weeklyLog: {},
      monthlyLog: {}
    };
  }
  if(!S.bassem.completedLessons) S.bassem.completedLessons = {};
  if(!S.bassem.weeklyLog) S.bassem.weeklyLog = {};
  if(!S.bassem.monthlyLog) S.bassem.monthlyLog = {};
  if(!S.bassem.currentLesson){
    S.bassem.currentLesson = {
      phaseId: 'phase1',
      courseId: 'p1_strat',
      lessonIndex: 0,
      lessonName: 'SWOT Marketing Analysis'
    };
  }
}

function getBassemTotalLessonsCount(){
  if(typeof BASSEM_RAID_DEF === 'undefined') return 357;
  var count = 0;
  BASSEM_RAID_DEF.phases.forEach(function(p){
    p.courses.forEach(function(c){
      count += c.lessons.length;
    });
  });
  return count || 357;
}

function getBassemCompletedCount(){
  initBassemState();
  return Object.keys(S.bassem.completedLessons).filter(function(k){
    return !!S.bassem.completedLessons[k];
  }).length;
}

function getBassemOverallPct(){
  var total = getBassemTotalLessonsCount();
  var done = getBassemCompletedCount();
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

function getBassemPhasePct(phaseId){
  initBassemState();
  if(typeof BASSEM_RAID_DEF === 'undefined') return 0;
  var p = BASSEM_RAID_DEF.phases.find(function(x){ return x.id === phaseId; });
  if(!p) return 0;
  var total = 0;
  var done = 0;
  p.courses.forEach(function(c){
    total += c.lessons.length;
    c.lessons.forEach(function(l, idx){
      var key = c.id + '_' + idx;
      if(S.bassem.completedLessons[key]) done++;
    });
  });
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

function getBassemCourseProgress(courseId){
  initBassemState();
  if(typeof BASSEM_RAID_DEF === 'undefined') return { done: 0, total: 0, pct: 0 };
  var foundCourse = null;
  for(var i=0; i<BASSEM_RAID_DEF.phases.length; i++){
    var c = BASSEM_RAID_DEF.phases[i].courses.find(function(x){ return x.id === courseId; });
    if(c){ foundCourse = c; break; }
  }
  if(!foundCourse) return { done: 0, total: 0, pct: 0 };
  var total = foundCourse.lessons.length;
  var done = 0;
  foundCourse.lessons.forEach(function(l, idx){
    var key = foundCourse.id + '_' + idx;
    if(S.bassem.completedLessons[key]) done++;
  });
  return {
    done: done,
    total: total,
    pct: total > 0 ? Math.round((done / total) * 100) : 0
  };
}

function getBassemNextLesson(){
  initBassemState();
  if(typeof BASSEM_RAID_DEF === 'undefined') return null;

  for(var pi=0; pi<BASSEM_RAID_DEF.phases.length; pi++){
    var p = BASSEM_RAID_DEF.phases[pi];
    for(var ci=0; ci<p.courses.length; ci++){
      var c = p.courses[ci];
      for(var li=0; li<c.lessons.length; li++){
        var key = c.id + '_' + li;
        if(!S.bassem.completedLessons[key]){
          return {
            phaseId: p.id,
            phaseName: p.name,
            courseId: c.id,
            courseName: c.name,
            lessonIndex: li,
            lessonName: c.lessons[li]
          };
        }
      }
    }
  }
  return null;
}

function toggleBassemLesson(courseId, lessonIdx, lessonName, ev){
  if(ev && ev.stopPropagation) ev.stopPropagation();
  initBassemState();
  var key = courseId + '_' + lessonIdx;
  var isDone = !S.bassem.completedLessons[key];
  S.bassem.completedLessons[key] = isDone;

  if(isDone){
    var xpGain = 15;
    addXP(xpGain, 'career', false, 'bassem_lesson');
    S.bassem.xpEarned = (S.bassem.xpEarned || 0) + xpGain;
    sfx('check');
    log('BASSEM LESSON CLEARED', '<b>' + esc(lessonName) + '</b> complete. +15 XP.');

    var next = getBassemNextLesson();
    if(next){
      S.bassem.currentLesson = next;
    }

    var overall = getBassemOverallPct();
    S.bassem.progress = overall;
    if(overall >= 100){
      ceremonyCard({
        kicker: 'LEGENDARY S-RANK RAID DEFEATED',
        big: 'Bassem School Mastery — 100% COMPLETE',
        sub: 'You have conquered the entire 3-Phase Digital Marketing & Content Creation Mastery curriculum.',
        stat: 'S-Rank Mastery Badge Unlocked · +5,000 Bonus XP',
        rare: true
      });
      addXP(5000, 'career', true, 'bassem_raid_defeated');
      log('RAID BOSS DEFEATED', '<b>Bassem School — AI Digital Marketing Mastery</b> is 100% CONQUERED!');
    }
  } else {
    subXP(15, 'career', 'bassem_lesson');
    S.bassem.xpEarned = Math.max(0, (S.bassem.xpEarned || 0) - 15);
    sfx('uncheck');
    S.bassem.progress = getBassemOverallPct();
  }

  save();
  renderAll();
}

function logBassemStudySession(minutes){
  initBassemState();
  var mins = parseInt(minutes, 10);
  if(isNaN(mins) || mins <= 0) return;

  var today = dayKey();
  if(S.bassem.todayLogDate !== today){
    S.bassem.todayLogDate = today;
    S.bassem.todayMinutes = 0;
  }

  var prevMinutes = S.bassem.todayMinutes || 0;
  S.bassem.todayMinutes = prevMinutes + mins;
  S.bassem.totalStudyMinutes = (S.bassem.totalStudyMinutes || 0) + mins;

  // Streak tracking
  if(S.bassem.lastStudyDate !== today){
    var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if(S.bassem.lastStudyDate === yesterday){
      S.bassem.studyStreak = (S.bassem.studyStreak || 0) + 1;
    } else {
      S.bassem.studyStreak = 1;
    }
    S.bassem.lastStudyDate = today;
  }

  // Weekly & Monthly logs
  var weekKeyStr = (typeof weekKey === 'function') ? weekKey() : today.slice(0, 7);
  var monthKeyStr = today.slice(0, 7);
  S.bassem.weeklyLog[weekKeyStr] = (S.bassem.weeklyLog[weekKeyStr] || 0) + mins;
  S.bassem.monthlyLog[monthKeyStr] = (S.bassem.monthlyLog[monthKeyStr] || 0) + mins;

  // XP calculation
  var baseAwardXP = Math.round(mins * 0.5); // ~30 XP per 60 min
  var bonusXP = 0;
  if(prevMinutes < 60 && S.bassem.todayMinutes >= 60){
    bonusXP += 10;
    if(!S.daily) S.daily = {};
    if(!S.daily['q_bassem_daily']){
      S.daily['q_bassem_daily'] = today;
      S.qDone = (S.qDone || 0) + 1;
    }
    log('DAILY RAID GOAL REACHED', 'Completed 60+ min study on Bassem School today! <b>+10 Bonus XP</b>');
  }
  if(prevMinutes < 90 && S.bassem.todayMinutes >= 90){
    bonusXP += 15;
    log('RAID BONUS 90m', 'Reached 90 minutes of dedicated study! <b>+15 Bonus XP</b>');
  }
  if(prevMinutes < 120 && S.bassem.todayMinutes >= 120){
    bonusXP += 25;
    log('RAID BONUS 120m', 'Maximum Focus: 120 minutes of study cleared! <b>+25 Bonus XP</b>');
  }

  var totalSessionXP = baseAwardXP + bonusXP;
  addXP(totalSessionXP, 'career', false, 'bassem_study');
  S.bassem.xpEarned = (S.bassem.xpEarned || 0) + totalSessionXP;

  sfx('levelUp');
  save();
  renderAll();
}

function promptLogBassemTime(){
  var raw = prompt('Enter study minutes completed for Bassem School:', '60');
  if(!raw) return;
  var mins = parseInt(raw, 10);
  if(mins > 0){
    logBassemStudySession(mins);
  }
}

function quickCompleteBassemDaily(minutes){
  var m = minutes || 60;
  logBassemStudySession(m);
}

function renderBassemDashboardCard(){
  initBassemState();
  var today = dayKey();
  if(S.bassem.todayLogDate !== today){
    S.bassem.todayLogDate = today;
    S.bassem.todayMinutes = 0;
  }

  var todayMins = S.bassem.todayMinutes || 0;
  var dailyTarget = 60;
  var isDailyDone = todayMins >= dailyTarget || !!(S.daily && S.daily['q_bassem_daily']);

  var overallPct = getBassemOverallPct();
  var doneLessons = getBassemCompletedCount();
  var totalLessons = getBassemTotalLessonsCount();
  var nextL = getBassemNextLesson() || S.bassem.currentLesson;
  var streak = S.bassem.studyStreak || 0;
  var totalHours = ((S.bassem.totalStudyMinutes || 0) / 60).toFixed(1);
  var xpEarned = (S.bassem.xpEarned || 0).toLocaleString();

  var p1 = getBassemPhasePct('phase1');
  var p2 = getBassemPhasePct('phase2');
  var p3 = getBassemPhasePct('phase3');

  var html = '<div class="bassem-hero-card">'
    + '<div class="bhc-top-row">'
    +   '<div class="bhc-badge"><span class="pulse-dot"></span> S-RANK MASTERY RAID &bull; BASSEM SCHOOL</div>'
    +   '<div class="bhc-tag ' + (isDailyDone ? 'cleared' : 'pending') + '">'
    +     (isDailyDone ? '&#10003; TODAY\'S RAID TRAINING CLEARED' : todayMins + ' / 60 MIN TODAY')
    +   '</div>'
    + '</div>'

    + '<div class="bhc-title-row">'
    +   '<div>'
    +     '<h2 class="bhc-title">BASSEM SCHOOL &mdash; AI DIGITAL MARKETING MASTERY</h2>'
    +     '<div class="bhc-sub">Parallel Mastery Track &bull; 3 Comprehensive Phases &bull; ' + totalLessons + ' Actionable Lessons &bull; Non-Certification Core Skills</div>'
    +   '</div>'
    +   '<div class="bhc-overall-box">'
    +     '<div class="bhc-ob-pct">' + overallPct + '%</div>'
    +     '<div class="bhc-ob-lbl">OVERALL RAID</div>'
    +   '</div>'
    + '</div>'

    /* 3 Phase Mini Progress Bars */
    + '<div class="bhc-phases-row">'
    +   '<div class="bhc-phase-item">'
    +     '<div class="bhc-pi-head"><span>Phase 1: Digital Marketing</span><b>' + p1 + '%</b></div>'
    +     '<div class="bar thin"><i style="width:' + p1 + '%;background:var(--sys-blue);"></i></div>'
    +   '</div>'
    +   '<div class="bhc-phase-item">'
    +     '<div class="bhc-pi-head"><span>Phase 2: Content Creation</span><b>' + p2 + '%</b></div>'
    +     '<div class="bar thin"><i style="width:' + p2 + '%;background:var(--gold);"></i></div>'
    +   '</div>'
    +   '<div class="bhc-phase-item">'
    +     '<div class="bhc-pi-head"><span>Phase 3: E-Commerce & Web</span><b>' + p3 + '%</b></div>'
    +     '<div class="bar thin"><i style="width:' + p3 + '%;background:var(--glow2);"></i></div>'
    +   '</div>'
    + '</div>'

    /* Daily Quest Target & Stats */
    + '<div class="bhc-stats-grid">'
    +   '<div class="bhc-stat-box">'
    +     '<span class="bhc-sb-k">&#128293; STUDY STREAK</span>'
    +     '<b class="bhc-sb-v">' + streak + ' Days</b>'
    +   '</div>'
    +   '<div class="bhc-stat-box">'
    +     '<span class="bhc-sb-k">&#9201; TOTAL STUDY</span>'
    +     '<b class="bhc-sb-v">' + totalHours + ' Hours</b>'
    +   '</div>'
    +   '<div class="bhc-stat-box">'
    +     '<span class="bhc-sb-k">&#10003; LESSONS DONE</span>'
    +     '<b class="bhc-sb-v">' + doneLessons + ' / ' + totalLessons + '</b>'
    +   '</div>'
    +   '<div class="bhc-stat-box">'
    +     '<span class="bhc-sb-k">&#10024; XP EARNED</span>'
    +     '<b class="bhc-sb-v" style="color:var(--gold);">+' + xpEarned + ' XP</b>'
    +   '</div>'
    + '</div>'

    /* Next Up Lesson Callout */
    + '<div class="bhc-next-box">'
    +   '<div class="bhc-nb-left">'
    +     '<span class="bhc-nb-lbl">&#127919; NEXT LESSON ON DECK:</span>'
    +     '<div class="bhc-nb-title">' + esc(nextL ? nextL.lessonName : 'All Lessons Cleared!') + '</div>'
    +     '<div class="bhc-nb-meta">' + esc(nextL ? (nextL.phaseName || 'Bassem School') + ' &bull; ' + (nextL.courseName || '') : '') + '</div>'
    +   '</div>'
    +   '<div class="bhc-nb-actions">'
    +     '<button class="btn" style="font-size:12px;padding:8px 14px;" onclick="goTab(\'boss\')">Open Raid Boss Curriculum &rarr;</button>'
    +     '<button class="btn secondary" style="font-size:12px;padding:8px 12px;" onclick="promptLogBassemTime()">+ Log Study Time</button>'
    +   '</div>'
    + '</div>'
    + '</div>';

  return html;
}

function renderBassemRaidBossDetailedView(){
  initBassemState();
  if(typeof BASSEM_RAID_DEF === 'undefined') return '';

  var def = BASSEM_RAID_DEF;
  var overallPct = getBassemOverallPct();
  var doneLessons = getBassemCompletedCount();
  var totalLessons = getBassemTotalLessonsCount();
  var totalHours = ((S.bassem.totalStudyMinutes || 0) / 60).toFixed(1);

  var html = '<div class="boss bassem-boss-card">'
    + '<div class="boss-title-row">'
    +   '<div>'
    +     '<div style="font-family:var(--hud);font-size:11px;color:var(--red);letter-spacing:1.5px;margin-bottom:4px;">' + esc(def.rank) + ' &bull; PARALLEL MASTERY TRACK</div>'
    +     '<h3 style="font-size:18px;margin:0;">' + esc(def.name) + '</h3>'
    +   '</div>'
    +   '<div class="boss-ar-title">' + esc(def.nameAr) + '</div>'
    + '</div>'
    + '<div class="ds" style="margin-top:6px;">' + esc(def.desc) + '</div>'

    + '<div class="bossPayout">'
    +   '<div class="bpItem"><span class="bpK">Per Lesson</span><span class="bpV">+15 XP</span></div>'
    +   '<div class="bpItem"><span class="bpK">60m Daily Target</span><span class="bpV gold">+30 to +70 XP</span></div>'
    +   '<div class="bpItem"><span class="bpK">Total Hours Studied</span><span class="bpV big">' + totalHours + 'h</span></div>'
    +   '<div class="bpItem"><span class="bpK">Mastery Bonus</span><span class="bpV gold">+5,000 XP</span></div>'
    + '</div>'

    + '<div class="pc">' + overallPct + '% COMPLETE &middot; ' + doneLessons + ' / ' + totalLessons + ' LESSONS CLEARED &middot; <span style="color:var(--gold);">ACTIVE EXPEDITION</span></div>'
    + '<div class="bar thin" style="margin-bottom:18px;"><i style="width:' + overallPct + '%;background:linear-gradient(90deg,var(--glow2),var(--gold));"></i></div>'

    + '<div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;">'
    +   '<button class="btn" onclick="promptLogBassemTime()">+ Log Study Time (60 / 90 / 120 min)</button>'
    +   '<button class="btn secondary" onclick="quickCompleteBassemDaily(60)">&#10003; Quick Complete 60m Daily Quest</button>'
    + '</div>';

  def.phases.forEach(function(ph, pIdx){
    var pPct = getBassemPhasePct(ph.id);
    html += '<div class="bassem-phase-section">'
      + '<div class="bassem-phase-head" onclick="toggleBassemPhaseCollapse(\'bassem_p_' + ph.id + '\')">'
      +   '<div>'
      +     '<span class="bph-num">PHASE ' + (pIdx + 1) + '</span>'
      +     '<b class="bph-title">' + esc(ph.name) + '</b>'
      +     '<div class="bph-ar">' + esc(ph.nameAr) + '</div>'
      +   '</div>'
      +   '<div style="text-align:right;">'
      +     '<span class="bph-pct">' + pPct + '%</span>'
      +     '<div style="font-size:10px;color:var(--muted);">' + esc(ph.courses.length) + ' Sub-Courses</div>'
      +   '</div>'
      + '</div>'
      + '<div class="bar thin" style="margin:4px 0 12px 0;"><i style="width:' + pPct + '%;background:var(--sys-blue);"></i></div>'

      + '<div id="bassem_p_' + ph.id + '" class="bassem-courses-grid">';

    ph.courses.forEach(function(c){
      var cp = getBassemCourseProgress(c.id);
      html += '<div class="bassem-course-box">'
        + '<div class="bcb-head">'
        +   '<div class="bcb-title">' + esc(c.name) + '</div>'
        +   '<span class="tag ' + (cp.pct === 100 ? 'success' : '') + '">' + cp.done + ' / ' + cp.total + '</span>'
        + '</div>'
        + '<div class="bar thin" style="margin:4px 0 8px 0;"><i style="width:' + cp.pct + '%;"></i></div>'
        + '<div class="bcb-lessons-list">';

      c.lessons.forEach(function(l, lIdx){
        var key = c.id + '_' + lIdx;
        var isDone = !!S.bassem.completedLessons[key];
        var escapedLesson = esc(l).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        html += '<div class="step ' + (isDone ? 'done' : '') + '" onclick="toggleBassemLesson(\'' + c.id + '\', ' + lIdx + ', \'' + escapedLesson + '\', event)">'
          + '<div class="sb">' + (isDone ? ic('check', 13) : '') + '</div>'
          + '<span>' + esc(l) + '</span>'
          + '<b class="stepXp">' + (isDone ? ic('check', 13) + ' +15' : '+15') + '</b>'
          + '</div>';
      });

      html += '</div></div>';
    });

    html += '</div></div>';
  });

  html += '</div>';
  return html;
}

function toggleBassemPhaseCollapse(elementId){
  var el = document.getElementById(elementId);
  if(!el) return;
  if(el.style.display === 'none'){
    el.style.display = 'grid';
  } else {
    el.style.display = 'none';
  }
}


if (typeof window !== 'undefined') {
  window.BassemEngine = {
    initState: initBassemState,
    getTotalLessonsCount: getBassemTotalLessonsCount,
    getCompletedCount: getBassemCompletedCount,
    getOverallPct: getBassemOverallPct,
    getPhasePct: getBassemPhasePct,
    getCourseProgress: getBassemCourseProgress,
    getNextIncompleteLesson: getBassemNextLesson,
    toggleLesson: toggleBassemLesson,
    logStudySession: logBassemStudySession,
    renderDashboardCard: renderBassemDashboardCard,
    renderRaidBossView: renderBassemRaidBossDetailedView
  };
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initBassemState,
    getBassemTotalLessonsCount,
    getBassemCompletedCount,
    getBassemOverallPct,
    getBassemPhasePct,
    getBassemCourseProgress,
    getBassemNextLesson,
    toggleLesson: toggleBassemLesson,
    logStudySession: logBassemStudySession
  };
}
