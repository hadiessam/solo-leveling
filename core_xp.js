/* =====================================================================
   SOLO LEVELING — UNIFIED XP ENGINE & TRANSACTION LEDGER
   Prevents double XP, click-spamming, negative corruption,
   tracks an immutable audit ledger, and supports targeted breakdowns.
   ===================================================================== */

const XpEngine = (function(){
  const clickLocks = new Map();
  const LOCK_DURATION_MS = 600;

  /* Check if an action is temporarily locked to prevent duplicate completion */
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

  /* Authoritative XP Granting function - supports object or positional arguments */
  function grantXP(arg1, arg2, arg3, arg4){
    const opts = (typeof arg1 === 'object' && arg1 !== null) ? arg1 : {
      amount: arg1,
      reason: arg2,
      sourceId: arg3,
      stat: arg4
    };
    const { amount, stat, source, sourceId, reason, metadata, isBonus } = opts;
    if(typeof S === 'undefined' || !S) return { granted: false, amount: 0 };
    if(typeof amount !== 'number' || isNaN(amount) || amount <= 0) return { granted: false, amount: 0 };

    // 1. Anti-duplication lock on specific sourceId
    if(sourceId && isActionLocked(sourceId)){
      console.warn(`[XpEngine] Blocked rapid double-click XP grant for: ${sourceId}`);
      return { granted: false, amount: 0, reason: 'duplicate_locked' };
    }

    // 2. Streak multiplier calculation (applied unless it's already a bonus)
    let multiplier = 1.0;
    if(!isBonus && S.streak > 1){
      multiplier = Math.min(1.5, 1 + (S.streak / 200) * 0.5);
    }
    const finalAmount = Math.round(amount * multiplier);

    // 3. Update Player XP & Stats
    const previousXp = S.xp || 0;
    const previousLevel = S.level || 1;
    S.xp = previousXp + finalAmount;
    S.level = Math.max(1, Math.floor(S.xp / 400) + 1);

    // Update domain stat XP if specified
    if(stat){
      if(!S.statXP) S.statXP = {};
      S.statXP[stat] = (S.statXP[stat] || 0) + finalAmount;
    }

    // Update legacy xpSource tally
    const srcKey = source || 'general';
    if(!S.xpSource) S.xpSource = {};
    S.xpSource[srcKey] = (S.xpSource[srcKey] || 0) + finalAmount;

    // 4. Record to Immutable XP Ledger
    if(!S.xpLedger) S.xpLedger = [];
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);
    const ledgerEntry = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      timestamp: Date.now(),
      date: today,
      amount: finalAmount,
      baseAmount: amount,
      multiplier: multiplier,
      stat: stat || 'general',
      source: srcKey,
      sourceId: sourceId || '',
      reason: reason || (srcKey + ' reward'),
      runningTotal: S.xp
    };
    S.xpLedger.unshift(ledgerEntry);
    if(S.xpLedger.length > 500){
      S.xpLedger = S.xpLedger.slice(0, 500); // Maintain fast 500-transaction rolling ledger
    }

    // 5. Emit event
    if(typeof SystemEvents !== 'undefined'){
      SystemEvents.emit('XP_GRANTED', { amount: finalAmount, stat, source: srcKey, total: S.xp });
    }

    // 6. Check for level up celebration
    if(S.level > previousLevel){
      if(typeof SystemEvents !== 'undefined'){
        SystemEvents.emit('LEVEL_UP', { oldLevel: previousLevel, newLevel: S.level });
      }
      if(typeof ceremonyCard === 'function'){
        ceremonyCard({
          kicker: 'LEVEL CONQUERED',
          big: 'LEVEL ' + S.level,
          sub: 'Hunter power capacity expanded.',
          stat: '+' + finalAmount + ' XP Collected',
          rare: true
        });
      }
      if(typeof sfx === 'function') sfx('levelUp');
      if(typeof log === 'function') log('LEVEL UP', `Advanced to <b>Level ${S.level}</b>!`);
    }

    return {
      granted: true,
      amount: finalAmount,
      level: S.level,
      xp: S.xp,
      valueOf: function(){ return finalAmount; },
      toString: function(){ return String(finalAmount); }
    };
  }

  /* Authoritative XP Reversal function (for unchecking/undoing) */
  function reverseXP(arg1, arg2, arg3, arg4){
    const opts = (typeof arg1 === 'object' && arg1 !== null) ? arg1 : {
      sourceId: typeof arg1 === 'string' ? arg1 : arg3,
      amount: typeof arg1 === 'number' ? arg1 : (typeof arg2 === 'number' ? arg2 : undefined),
      stat: arg3,
      reason: arg4
    };
    let { amount, stat, source, sourceId, reason } = opts;
    if(typeof S === 'undefined' || !S) return { reversed: false, amount: 0 };

    // Auto-detect amount from ledger if only sourceId provided
    if((!amount || isNaN(amount)) && sourceId && S.xpLedger){
      const lastEntry = S.xpLedger.find(e => e.sourceId === sourceId && e.amount > 0);
      if(lastEntry){
        amount = lastEntry.amount;
        stat = stat || lastEntry.stat;
        source = source || lastEntry.source;
      }
    }
    if(typeof amount !== 'number' || isNaN(amount) || amount <= 0) return { reversed: false, amount: 0 };

    const previousXp = S.xp || 0;
    const finalAmount = Math.min(previousXp, amount); // Cannot drop below 0
    S.xp = previousXp - finalAmount;
    S.level = Math.max(1, Math.floor(S.xp / 400) + 1);

    if(stat && S.statXP && S.statXP[stat]){
      S.statXP[stat] = Math.max(0, S.statXP[stat] - finalAmount);
    }

    const srcKey = source || 'general';
    if(S.xpSource && S.xpSource[srcKey]){
      S.xpSource[srcKey] = Math.max(0, S.xpSource[srcKey] - finalAmount);
    }

    // Record reversal in ledger
    if(!S.xpLedger) S.xpLedger = [];
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);
    S.xpLedger.unshift({
      id: 'tx_rev_' + Date.now(),
      timestamp: Date.now(),
      date: today,
      amount: -finalAmount,
      baseAmount: -amount,
      stat: stat || 'general',
      source: srcKey,
      sourceId: sourceId || '',
      reason: 'Reversal: ' + (reason || srcKey),
      runningTotal: S.xp
    });

    if(typeof SystemEvents !== 'undefined'){
      SystemEvents.emit('XP_REVERSED', { amount: finalAmount, stat, source: srcKey, total: S.xp });
    }

    return {
      reversed: true,
      amount: finalAmount,
      valueOf: function(){ return finalAmount; },
      toString: function(){ return String(finalAmount); }
    };
  }

  /* Calculate Analytics Breakdown */
  function getAnalytics(){
    if(!S || !S.xpLedger) return { today: 0, thisWeek: 0, thisMonth: 0, allTime: (S ? S.xp : 0), bySource: {} };
    const today = typeof SystemClock !== 'undefined' ? SystemClock.dayKey() : new Date().toISOString().slice(0, 10);
    const thisMonth = today.slice(0, 7);

    let todayXP = 0;
    let monthXP = 0;
    const bySource = {};

    S.xpLedger.forEach(tx => {
      if(tx.amount > 0){
        if(tx.date === today) todayXP += tx.amount;
        if(tx.date.startsWith(thisMonth)) monthXP += tx.amount;
        const src = tx.source || 'other';
        bySource[src] = (bySource[src] || 0) + tx.amount;
      }
    });

    return {
      today: todayXP,
      thisMonth: monthXP,
      allTime: S.xp || 0,
      bySource: bySource
    };
  }

  return {
    grantXP: grantXP,
    reverseXP: reverseXP,
    getAnalytics: getAnalytics,
    isActionLocked: isActionLocked
  };
})();

/* Global backward-compatible wrappers for app.js and render.js */
function grantXP(params){
  return XpEngine.grantXP(params);
}

// Upgrade existing addXP to transparently route through XpEngine
const _legacyAddXP = typeof addXP === 'function' ? addXP : null;
window.addXP = function(amount, stat, isBonus, source, sourceId){
  return XpEngine.grantXP({
    amount: amount,
    stat: stat,
    isBonus: isBonus,
    source: source,
    sourceId: sourceId,
    reason: source
  });
};

const _legacySubXP = typeof subXP === 'function' ? subXP : null;
window.subXP = function(amount, stat, source, exactAmount, sourceId){
  return XpEngine.reverseXP({
    amount: exactAmount || amount,
    stat: stat,
    source: source,
    sourceId: sourceId,
    reason: source
  });
};


if(typeof window !== 'undefined'){
  window.XpEngine = XpEngine;
}
if(typeof module !== 'undefined' && module.exports){
  module.exports = XpEngine;
}
