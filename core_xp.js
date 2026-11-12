/* =====================================================================
   SOLO LEVELING — ONE AUTHORITATIVE XP ENGINE & LEDGER (v52)
   Single Source of Truth for ALL XP Grants, Reversals, and Penalties.
   Zero double-XP, zero refresh duplication, zero uncheck mismatch.
   ===================================================================== */

const XpEngine = (function(){
  const clickLocks = new Map();
  const LOCK_DURATION_MS = 500;
  const LEVEL_XP_STEP = 400;
  const MULT_MAX_VAL = 1.5;
  const MULT_SPAN_DAYS = 200;

  function todayCairo(){
    return typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);
  }

  function calcLevel(xp){
    return Math.max(1, Math.floor(Math.max(0, xp || 0) / LEVEL_XP_STEP) + 1);
  }

  function getStreakMultiplier(){
    if(typeof S === 'undefined' || !S || !S.streak || S.streak <= 1) return 1.0;
    const m = 1 + Math.min(MULT_MAX_VAL - 1, (S.streak / MULT_SPAN_DAYS) * (MULT_MAX_VAL - 1));
    return Math.round(m * 100) / 100;
  }

  /* Fast click debounce mutex */
  function isActionLocked(sourceId){
    if(!sourceId) return false;
    const lastTime = clickLocks.get(sourceId);
    const now = Date.now();
    if(lastTime && (now - lastTime) < LOCK_DURATION_MS){
      return true;
    }
    clickLocks.set(sourceId, now);
    return false;
  }

  /* Check if sourceId has an active (unreversed) positive grant in ledger */
  function findActiveGrant(sourceId){
    if(!sourceId || !S || !Array.isArray(S.xpLedger)) return null;
    for(let i = 0; i < S.xpLedger.length; i++){
      const tx = S.xpLedger[i];
      if(tx.sourceId === sourceId){
        const val = tx.finalXP !== undefined ? tx.finalXP : tx.amount;
        if(val < 0 && tx.type !== 'MISSED_TASK') return null; // Already reversed
        if(val > 0) return tx; // Active grant found
      }
    }
    return null;
  }

  /* Check if a penalty was already recorded for sourceId */
  function hasPenalty(sourceId, date){
    if(!sourceId || !S) return false;
    if(date && S.penaltyLog && S.penaltyLog[date] && S.penaltyLog[date][sourceId] !== undefined){
      return true;
    }
    if(Array.isArray(S.xpLedger)){
      return S.xpLedger.some(tx => tx.type === 'MISSED_TASK' && tx.sourceId === sourceId);
    }
    return false;
  }

  /* AUTHORITATIVE GRANT XP */
  function grantXP(arg1, arg2, arg3, arg4){
    const opts = (typeof arg1 === 'object' && arg1 !== null) ? arg1 : {
      amount: arg1,
      reason: arg2,
      sourceId: arg3,
      stat: arg4
    };
    const baseXP = Number(opts.baseXP !== undefined ? opts.baseXP : opts.amount);
    const { stat, source, sourceId, reason, isBonus, type } = opts;

    if(typeof S === 'undefined' || !S) return { granted: false, baseXP: 0, finalXP: 0 };
    if(isNaN(baseXP) || baseXP <= 0) return { granted: false, baseXP: 0, finalXP: 0 };

    // 1. Click-spam lock & ledger duplicate lock
    if(sourceId){
      if(isActionLocked(sourceId)){
        return { granted: false, baseXP: 0, finalXP: 0, reason: 'duplicate_locked' };
      }
      if(findActiveGrant(sourceId)){
        return { granted: false, baseXP: 0, finalXP: 0, reason: 'already_granted' };
      }
    }

    // 2. Multiplier (applies to non-bonus actions when streak > 1)
    const shouldApplyMult = opts.applyMultiplier !== undefined ? !!opts.applyMultiplier : !isBonus;
    const multiplier = shouldApplyMult ? getStreakMultiplier() : 1.0;
    const finalXP = Math.round(baseXP * multiplier);

    // 3. Apply XP & check rank/level changes
    const prevXP = Math.max(0, Number(S.xp) || 0);
    const prevLevel = calcLevel(prevXP);
    const prevRank = typeof rankIdx === 'function' ? rankIdx(prevXP) : 0;

    S.xp = prevXP + finalXP;
    S.level = calcLevel(S.xp);

    if(stat){
      if(!S.statXP) S.statXP = {};
      S.statXP[stat] = (S.statXP[stat] || 0) + finalXP;
    }

    const srcKey = source || 'general';
    if(!S.xpSource) S.xpSource = {};
    S.xpSource[srcKey] = (S.xpSource[srcKey] || 0) + finalXP;

    // 4. Write immutable transaction to XP Ledger
    if(!Array.isArray(S.xpLedger)) S.xpLedger = [];
    const today = todayCairo();
    const tx = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      timestamp: Date.now(),
      date: today,
      type: type || (srcKey === 'task' ? 'TASK_COMPLETION' : srcKey.toUpperCase()),
      source: srcKey,
      sourceId: sourceId || '',
      baseXP: baseXP,
      finalXP: finalXP,
      amount: finalXP,
      multiplier: multiplier,
      stat: stat || 'general',
      reason: reason || (srcKey + ' reward'),
      runningTotal: S.xp
    };
    S.xpLedger.unshift(tx);
    if(S.xpLedger.length > 1000) S.xpLedger = S.xpLedger.slice(0, 1000);

    // 5. Update Daily History XP if today's bucket exists
    if(S.dailyHistory && S.dailyHistory[today]){
      S.dailyHistory[today].xpEarned = (S.dailyHistory[today].xpEarned || 0) + finalXP;
    }

    // 6. Emit & trigger progression ceremonies safely
    const newRank = typeof rankIdx === 'function' ? rankIdx(S.xp) : prevRank;
    if(typeof SystemEvents !== 'undefined'){
      SystemEvents.emit('XP_GRANTED', { baseXP, finalXP, stat, source: srcKey, total: S.xp });
    }
    if(newRank > prevRank && typeof rankCeremony === 'function'){
      rankCeremony(prevRank, newRank);
    } else if(S.level > prevLevel){
      if(typeof SystemEvents !== 'undefined') SystemEvents.emit('LEVEL_UP', { oldLevel: prevLevel, newLevel: S.level });
      if(typeof levelCeremony === 'function') levelCeremony(prevLevel, S.level);
      if(typeof sfx === 'function') sfx('levelup');
    }
    if(typeof checkUnlocks === 'function') checkUnlocks(prevLevel);
    if(typeof checkBadges === 'function') checkBadges();

    return {
      granted: true,
      baseXP: baseXP,
      finalXP: finalXP,
      amount: finalXP,
      multiplier: multiplier,
      level: S.level,
      xp: S.xp
    };
  }

  /* AUTHORITATIVE REVERSE XP (for unchecking/undoing today) */
  function reverseXP(arg1, arg2, arg3, arg4){
    const opts = (typeof arg1 === 'object' && arg1 !== null) ? arg1 : {
      sourceId: typeof arg1 === 'string' ? arg1 : arg3,
      amount: typeof arg1 === 'number' ? arg1 : (typeof arg2 === 'number' ? arg2 : undefined),
      stat: arg3,
      reason: arg4
    };
    let { amount, stat, source, sourceId, reason, type } = opts;
    if(typeof S === 'undefined' || !S) return { reversed: false, amount: 0, finalXP: 0 };

    // Prefer exact granted transaction from XP Ledger by sourceId
    let matchedBase = amount;
    if(sourceId){
      const activeTx = findActiveGrant(sourceId);
      if(activeTx){
        amount = activeTx.finalXP !== undefined ? activeTx.finalXP : activeTx.amount;
        matchedBase = activeTx.baseXP !== undefined ? activeTx.baseXP : amount;
        stat = stat || activeTx.stat;
        source = source || activeTx.source;
      } else if(amount === undefined){
        // Do not reverse blindly if no active grant exists for this sourceId!
        return { reversed: false, amount: 0, finalXP: 0, reason: 'no_active_grant' };
      }
    }

    amount = Number(amount);
    if(isNaN(amount) || amount <= 0) return { reversed: false, amount: 0, finalXP: 0 };

    const prevXP = Math.max(0, Number(S.xp) || 0);
    const revAmt = Math.min(prevXP, Math.round(amount));
    S.xp = Math.max(0, prevXP - revAmt);
    S.level = calcLevel(S.xp);

    if(stat && S.statXP && S.statXP[stat]){
      S.statXP[stat] = Math.max(0, S.statXP[stat] - revAmt);
    }

    const srcKey = source || 'general';
    if(S.xpSource && S.xpSource[srcKey]){
      S.xpSource[srcKey] = Math.max(0, S.xpSource[srcKey] - revAmt);
    }

    if(!Array.isArray(S.xpLedger)) S.xpLedger = [];
    const today = todayCairo();
    S.xpLedger.unshift({
      id: 'tx_rev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      timestamp: Date.now(),
      date: today,
      type: type || 'TASK_REVERSAL',
      source: srcKey,
      sourceId: sourceId || '',
      baseXP: -(matchedBase || revAmt),
      finalXP: -revAmt,
      amount: -revAmt,
      multiplier: 1.0,
      stat: stat || 'general',
      reason: 'Reversal: ' + (reason || srcKey),
      runningTotal: S.xp
    });

    if(S.dailyHistory && S.dailyHistory[today]){
      S.dailyHistory[today].xpEarned = Math.max(0, (S.dailyHistory[today].xpEarned || 0) - revAmt);
    }

    if(typeof SystemEvents !== 'undefined'){
      SystemEvents.emit('XP_REVERSED', { amount: revAmt, finalXP: revAmt, stat, source: srcKey, total: S.xp });
    }

    return {
      reversed: true,
      amount: revAmt,
      finalXP: revAmt
    };
  }

  /* AUTHORITATIVE MISSED MISSION PENALTY (-2x base XP, strictly idempotent) */
  function applyPenalty({ baseXP, sourceId, date, reason }){
    if(typeof S === 'undefined' || !S) return { applied: false, penaltyXP: 0 };
    const bXP = Number(baseXP) || 0;
    if(bXP <= 0) return { applied: false, penaltyXP: 0 };

    const penaltyDate = date || todayCairo();
    const sid = sourceId || ('miss_' + penaltyDate + '_' + Math.random().toString(36).slice(2, 6));

    // Strictly prevent duplicate penalty for the same task/date
    if(hasPenalty(sid, penaltyDate)){
      return { applied: false, penaltyXP: 0, reason: 'already_penalized' };
    }

    const penaltyXP = Math.round(bXP * 2); // Missed Task Penalty = baseXP * 2
    const prevXP = Math.max(0, Number(S.xp) || 0);
    const actualDeducted = Math.min(prevXP, penaltyXP);

    S.xp = Math.max(0, prevXP - penaltyXP);
    S.level = calcLevel(S.xp);
    S.penCount = (S.penCount || 0) + 1;
    S.xpLost = (S.xpLost || 0) + actualDeducted;

    if(!S.penaltyLog) S.penaltyLog = {};
    if(!S.penaltyLog[penaltyDate]) S.penaltyLog[penaltyDate] = {};
    S.penaltyLog[penaltyDate][sid] = penaltyXP;

    if(!Array.isArray(S.xpLedger)) S.xpLedger = [];
    S.xpLedger.unshift({
      id: 'tx_pen_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      timestamp: Date.now(),
      date: penaltyDate,
      type: 'MISSED_TASK',
      source: 'penalty',
      sourceId: sid,
      baseXP: -bXP,
      finalXP: -actualDeducted,
      amount: -actualDeducted,
      multiplier: 2.0,
      stat: 'discipline',
      reason: reason || 'Missed Daily Mission (-2x XP)',
      runningTotal: S.xp
    });

    if(typeof SystemEvents !== 'undefined'){
      SystemEvents.emit('XP_PENALTY', { baseXP: bXP, penaltyXP: actualDeducted, sourceId: sid, date: penaltyDate });
    }

    return { applied: true, penaltyXP: actualDeducted, nominalPenalty: penaltyXP };
  }

  /* AUTHORITATIVE XP ANALYTICS FROM LEDGER (100% Real, Zero Fake Numbers) */
  function getAnalytics(){
    const today = todayCairo();
    const thisMonth = today.slice(0, 7);
    const last7Dates = new Set();
    const last14Dates = [];
    for(let i = 13; i >= 0; i--){
      const k = typeof SystemClock !== 'undefined' ? SystemClock.shiftDayKey(today, -i) : today;
      last14Dates.push(k);
      if(i < 7) last7Dates.add(k);
    }

    let todayXP = 0, weekXP = 0, monthXP = 0, penaltyTotal = 0;
    const bySource = {};
    const trendMap = {};
    last14Dates.forEach(d => { trendMap[d] = { date: d, earned: 0, penalty: 0, net: 0 }; });

    const ledger = (typeof S !== 'undefined' && S && Array.isArray(S.xpLedger)) ? S.xpLedger : [];
    ledger.forEach(tx => {
      const val = Number(tx.finalXP !== undefined ? tx.finalXP : tx.amount) || 0;
      const dt = tx.date || today;
      if(dt === today) todayXP += val;
      if(last7Dates.has(dt)) weekXP += val;
      if(dt.startsWith(thisMonth)) monthXP += val;

      if(val > 0){
        const src = tx.source || 'general';
        bySource[src] = (bySource[src] || 0) + val;
      } else if(tx.type === 'MISSED_TASK'){
        penaltyTotal += Math.abs(val);
      }

      if(trendMap[dt]){
        if(val > 0) trendMap[dt].earned += val;
        else trendMap[dt].penalty += Math.abs(val);
        trendMap[dt].net += val;
      }
    });

    return {
      today: Math.max(0, todayXP),
      thisWeek: Math.max(0, weekXP),
      thisMonth: Math.max(0, monthXP),
      allTime: (typeof S !== 'undefined' && S) ? (S.xp || 0) : 0,
      penaltiesLogged: penaltyTotal,
      bySource: bySource,
      trend14: last14Dates.map(d => trendMap[d])
    };
  }

  return {
    grantXP,
    reverseXP,
    applyPenalty,
    getAnalytics,
    getStreakMultiplier,
    isActionLocked,
    clearLocks: () => clickLocks.clear(),
    findActiveGrant,
    hasPenalty
  };
})();

/* Single Unified Global Wrappers (used by auxiliary modules like courses/bassem/speaking) */
function grantXP(params){ return XpEngine.grantXP(params); }
function streakMult(){ return XpEngine.getStreakMultiplier(); }
function applyMult(base){ return Math.round((Number(base) || 0) * XpEngine.getStreakMultiplier()); }

function addXP(n, statKey, raw, source, sourceId){
  const res = XpEngine.grantXP({
    amount: n,
    baseXP: n,
    stat: statKey,
    isBonus: !!raw,
    applyMultiplier: !raw,
    source: source || 'general',
    sourceId: sourceId || '',
    reason: source || 'XP Reward'
  });
  if(typeof save === 'function') save();
  return res.finalXP || 0;
}

function subXP(n, statKey, source, actualGain, sourceId){
  const res = XpEngine.reverseXP({
    amount: actualGain !== undefined ? actualGain : n,
    stat: statKey,
    source: source || 'general',
    sourceId: sourceId || '',
    reason: source || 'XP Reversal'
  });
  if(typeof save === 'function') save();
  return res.finalXP || 0;
}

if(typeof window !== 'undefined'){
  window.XpEngine = XpEngine;
  window.grantXP = grantXP;
  window.addXP = addXP;
  window.subXP = subXP;
  window.streakMult = streakMult;
  window.applyMult = applyMult;
}
if(typeof module !== 'undefined' && module.exports){
  module.exports = XpEngine;
}
