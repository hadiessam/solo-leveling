/**
 * Solo Leveling — Features Pack 2
 * Monthly Boss Challenge, Equipment System, AI Coach
 * Plain JavaScript, no frameworks. Integrates with existing app state (S) and helpers (save, addXP, renderAll).
 */

/* ============================================================
   1. MONTHLY BOSS CHALLENGE
   ============================================================ */

const MONTHLY_BOSS_CONFIG = {
  durationDays: 30,
  targetMissions: 30,
  rewardXP: 500,
  rewardBadge: 'monthly_boss_slayer',
  badgeName: 'Monthly Boss Slayer',
  badgeIcon: '👑',
};

/**
 * Starts a 30-day Monthly Boss Challenge.
 * Sets S.monthlyBoss with start/end dates, mission counter, and active flag.
 * Idempotent: if already active, returns current state.
 */
function startMonthlyBoss() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // If already active this month, don't restart
  if (S.monthlyBoss && S.monthlyBoss.active) {
    return S.monthlyBoss;
  }

  S.monthlyBoss = {
    active: true,
    startDate: startOfMonth.toISOString(),
    endDate: endOfMonth.toISOString(),
    missionsCompleted: 0,
    targetMissions: MONTHLY_BOSS_CONFIG.targetMissions,
    rewardXP: MONTHLY_BOSS_CONFIG.rewardXP,
    rewardBadge: MONTHLY_BOSS_CONFIG.rewardBadge,
    completed: false,
    rewarded: false,
  };

  save();
  renderAll();
  return S.monthlyBoss;
}

/**
 * Checks if the Monthly Boss Challenge is complete and awards the reward.
 * Returns { complete: bool, rewarded: bool, progress: number }
 */
function checkMonthlyBoss() {
  if (!S.boss || !S.monthlyBoss || !S.monthlyBoss.active) {
    return { complete: false, rewarded: false, progress: 0 };
  }

  const m = S.monthlyBoss;
  const progress = Math.min(1, m.missionsCompleted / m.targetMissions);
  const isComplete = m.missionsCompleted >= m.targetMissions;

  if (isComplete && !m.rewarded) {
    // Award XP
    addXP(m.rewardXP);

    // Award badge
    if (!S.badges) S.badges = [];
    if (!S.badges.find(b => b.id === m.rewardBadge)) {
      S.badges.push({
        id: m.rewardBadge,
        name: MONTHLY_BOSS_CONFIG.badgeName,
        icon: MONTHLY_BOSS_CONFIG.badgeIcon,
        earnedDate: new Date().toISOString(),
      });
    }

    m.completed = true;
    m.rewarded = true;
    save();
    renderAll();
  }

  return { complete: isComplete, rewarded: m.rewarded, progress };
}

/**
 * Returns the Monthly Boss Challenge progress as a percentage (0–100).
 */
function getMonthlyBossProgress() {
  if (!S.boss || !S.monthlyBoss || !S.monthlyBoss.active) return 0;
  const m = S.monthlyBoss;
  return Math.min(100, Math.round((m.missionsCompleted / m.targetMissions) * 100));
}

/**
 * Records a mission completion toward the Monthly Boss Challenge.
 * Call this whenever a mission/quest is completed.
 */
function recordMonthlyBossMission() {
  if (!S.boss || !S.monthlyBoss || !S.monthlyBoss.active) return;
  S.monthlyBoss.missionsCompleted++;
  checkMonthlyBoss(); // auto-check for completion
  save();
}

/**
 * Auto-starts the Monthly Boss Challenge on the 1st of each month.
 * Call this on app init / page load.
 */
function autoStartMonthlyBoss() {
  const today = new Date();
  if (today.getDate() === 1) {
    // Check if we already have an active challenge for this month
    if (!S.boss || !S.monthlyBoss || !S.monthlyBoss.active) {
      startMonthlyBoss();
    }
  }
}

/* ============================================================
   2. EQUIPMENT SYSTEM
   ============================================================ */

const RARITY_COLORS = {
  common: '#9e9e9e',
  uncommon: '#4caf50',
  rare: '#2196f3',
  epic: '#9c27b0',
  legendary: '#ff9800',
};

const RARITY_WEIGHTS = {
  common: 50,
  uncommon: 30,
  rare: 14,
  epic: 5,
  legendary: 1,
};

/**
 * Master equipment catalog.
 * Slots: weapon, armor, accessory
 * Bonus types: xp_boost, streak_shield, mission_reward, boss_damage, loot_luck
 */
const EQUIPMENT = [
  // ── Weapons ──
  { id: 'w1', slot: 'weapon', name: 'Rusty Dagger',        bonusType: 'xp_boost',       bonusValue: 5,   rarity: 'common' },
  { id: 'w2', slot: 'weapon', name: 'Iron Sword',          bonusType: 'xp_boost',       bonusValue: 10,  rarity: 'uncommon' },
  { id: 'w3', slot: 'weapon', name: 'Shadow Blade',        bonusType: 'boss_damage',    bonusValue: 15,  rarity: 'rare' },
  { id: 'w4', slot: 'weapon', name: 'Dragon Fang',         bonusType: 'boss_damage',    bonusValue: 25,  rarity: 'epic' },
  { id: 'w5', slot: 'weapon', name: 'Monarch\'s Edge',     bonusType: 'boss_damage',    bonusValue: 40,  rarity: 'legendary' },

  // ── Armor ──
  { id: 'a1', slot: 'armor', name: 'Cloth Robe',           bonusType: 'streak_shield',  bonusValue: 1,   rarity: 'common' },
  { id: 'a2', slot: 'armor', name: 'Leather Armor',        bonusType: 'streak_shield',  bonusValue: 2,   rarity: 'uncommon' },
  { id: 'a3', slot: 'armor', name: 'Chainmail',            bonusType: 'streak_shield',  bonusValue: 3,   rarity: 'rare' },
  { id: 'a4', slot: 'armor', name: 'Shadow Plate',         bonusType: 'streak_shield',  bonusValue: 5,   rarity: 'epic' },
  { id: 'a5', slot: 'armor', name: 'Monarch\'s Aegis',     bonusType: 'streak_shield',  bonusValue: 8,   rarity: 'legendary' },

  // ── Accessories ──
  { id: 'c1', slot: 'accessory', name: 'Copper Ring',       bonusType: 'mission_reward', bonusValue: 5,   rarity: 'common' },
  { id: 'c2', slot: 'accessory', name: 'Silver Amulet',     bonusType: 'mission_reward', bonusValue: 10,  rarity: 'uncommon' },
  { id: 'c3', slot: 'accessory', name: 'Lucky Charm',       bonusType: 'loot_luck',      bonusValue: 10,  rarity: 'rare' },
  { id: 'c4', slot: 'accessory', name: 'Shadow Pendant',    bonusType: 'loot_luck',      bonusValue: 20,  rarity: 'epic' },
  { id: 'c5', slot: 'accessory', name: 'Monarch\'s Crest',  bonusType: 'xp_boost',       bonusValue: 20,  rarity: 'legendary' },
];

/**
 * Initialize equipment state on S if not present.
 */
function initEquipment() {
  if (!S.equipment) {
    S.equipment = {
      equipped: { weapon: null, armor: null, accessory: null },
      inventory: [],        // array of item ids
      lootDropChance: 0.10, // 10% base chance
    };
  }
}

/**
 * Equip an item to its slot. Removes from inventory, swaps with current.
 * @param {string} slot - 'weapon' | 'armor' | 'accessory'
 * @param {string} itemId - the item's id from EQUIPMENT
 */
function equipItem(slot, itemId) {
  initEquipment();

  const item = EQUIPMENT.find(e => e.id === itemId);
  if (!item) return false;
  if (item.slot !== slot) return false;

  // Remove from inventory
  const invIdx = S.equipment.inventory.indexOf(itemId);
  if (invIdx === -1) return false;
  S.equipment.inventory.splice(invIdx, 1);

  // Swap: put currently equipped back into inventory
  const currentEquippedId = S.equipment.equipped[slot];
  if (currentEquippedId) {
    S.equipment.inventory.push(currentEquippedId);
  }

  // Equip new item
  S.equipment.equipped[slot] = itemId;
  save();
  renderAll();
  return true;
}

/**
 * Unequip an item from a slot. Returns it to inventory.
 * @param {string} slot - 'weapon' | 'armor' | 'accessory'
 */
function unequipItem(slot) {
  initEquipment();

  const currentEquippedId = S.equipment.equipped[slot];
  if (!currentEquippedId) return false;

  S.equipment.equipped[slot] = null;
  S.equipment.inventory.push(currentEquippedId);
  save();
  renderAll();
  return true;
}

/**
 * Get the total bonus value from all equipped items for a given bonus type.
 * @param {string} type - e.g. 'xp_boost', 'streak_shield', 'boss_damage', 'loot_luck', 'mission_reward'
 * @returns {number} total bonus value
 */
function getEquipmentBonus(type) {
  initEquipment();

  let total = 0;
  for (const slot of ['weapon', 'armor', 'accessory']) {
    const itemId = S.equipment.equipped[slot];
    if (!itemId) continue;
    const item = EQUIPMENT.find(e => e.id === itemId);
    if (item && item.bonusType === type) {
      total += item.bonusValue;
    }
  }
  return total;
}

/**
 * Roll for a loot drop after a boss raid.
 * Base chance: 10%. Modified by loot_luck equipment bonus.
 * @returns {object|null} the dropped item, or null if no drop
 */
function rollLootDrop() {
  initEquipment();

  const luckBonus = getEquipmentBonus('loot_luck');
  const dropChance = S.equipment.lootDropChance + (luckBonus / 100);

  if (Math.random() > dropChance) return null;

  // Weighted random selection by rarity
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
  let roll = Math.random() * totalWeight;
  let selectedRarity = 'common';

  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    roll -= weight;
    if (roll <= 0) {
      selectedRarity = rarity;
      break;
    }
  }

  // Pick a random item of that rarity
  const candidates = EQUIPMENT.filter(e => e.rarity === selectedRarity);
  const drop = candidates[Math.floor(Math.random() * candidates.length)];

  // Add to inventory
  S.equipment.inventory.push(drop.id);
  save();
  renderAll();
  return drop;
}

/**
 * Get full details of an equipped item by slot.
 * @returns {object|null}
 */
function getEquippedItem(slot) {
  initEquipment();
  const itemId = S.equipment.equipped[slot];
  if (!itemId) return null;
  return EQUIPMENT.find(e => e.id === itemId) || null;
}

/* ============================================================
   3. AI COACH
   ============================================================ */

const COACH_MESSAGES = {
  // Streak-based
  streak: {
    0: [
      "Every hunter starts at E-rank. Your journey begins now. 🎯",
      "No streak today? Perfect day to start a new one!",
      "The strongest hunters were once beginners. Let's go.",
    ],
    1: [
      "Day 1 — the hardest step is the first one. You took it. 🔥",
      "A streak of 1 is the seed of something legendary.",
    ],
    3: [
      "3 days in! You're building real momentum. 💪",
      "Consistency is the hunter's greatest weapon. Keep sharpening it.",
    ],
    7: [
      "A full week! You're no longer playing — you're training. ⚔️",
      "7-day streak. The system is taking notice of you.",
    ],
    14: [
      "Two weeks of discipline. S-rank habits forming. 🌟",
      "14 days. Most hunters quit by now. You're different.",
    ],
    30: [
      "30-day streak! You've awakened something powerful. 🐉",
      "A month of relentless effort. The Monarchs would be proud.",
    ],
  },

  // XP / level progress
  xp: {
    low: [
      "XP is like mana — it grows with every quest you take.",
      "Small gains compound. Every mission matters.",
    ],
    mid: [
      "You're leveling steadily. The gap to your next rank is closing.",
      "Your power curve is trending upward. Stay the course.",
    ],
    high: [
      "Massive XP reserves! You're on the verge of a breakthrough.",
      "Your growth rate is exceptional. Keep pushing toward S-rank.",
    ],
  },

  // Time of day
  time: {
    morning: [
      "Good morning, hunter. The dungeon awaits. ☀️",
      "Rise and grind! A new day, a new quest.",
      "Morning missions set the tone for victory.",
    ],
    afternoon: [
      "Afternoon session? Perfect time for a boss raid. ⚔️",
      "The sun is high — so is your potential.",
      "Keep the momentum going. The evening grind is coming.",
    ],
    evening: [
      "Evening grind! Night hunters are the most dangerous. 🌙",
      "The shadows grow longer — just like your power.",
      "One more mission before rest? The dungeon never sleeps.",
    ],
    night: [
      "Late night session? True hunters rest never. 🦇",
      "The night belongs to the awakened. Make it count.",
      "Burning midnight oil. Your dedication is S-rank material.",
    ],
  },

  // Recent activity
  activity: {
    idle: [
      "It's been a while, hunter. The dungeon misses your presence.",
      "Even the strongest hunters need to return to the gate.",
      "Your streak is waiting. Don't let it fade.",
    ],
    active: [
      "You're on fire lately! Keep this energy burning. 🔥",
      "Recent activity detected — you're in the zone.",
      "Your consistency is remarkable. The system approves.",
    ],
    bossSlain: [
      "Boss defeated! Your power level is rising exponentially. 💀",
      "Another Monarch falls. Your legend grows.",
      "Victory tastes sweet, doesn't it? On to the next raid.",
    ],
  },

  // General motivational
  general: [
    "The System does not give up on you. Don't give up on yourself.",
    "Pain is temporary. Power is forever. ⚡",
    "You are the protagonist of your own leveling story.",
    "Arise. Fight. Conquer. Repeat.",
    "Every S-rank hunter was once told they weren't strong enough.",
    "The gate is open. Step through.",
    "Your potential has no ceiling. Break through it.",
    "Discipline is the bridge between goals and accomplishment.",
    "The dungeon rewards the bold. Be bold today.",
    "You don't need talent — you need tenacity.",
    "Level up your life like you level up your character.",
    "The only way out is through. Keep going.",
    "Your future self is watching. Make them proud.",
    "Hunters don't wait for opportunities — they create them.",
    "The grind is the gift. Embrace it.",
    "One quest at a time. One level at a time. One legend at a time.",
    "You are stronger than your excuses.",
    "The System has chosen you. Don't waste it.",
    "Legends aren't born. They're grinded into existence.",
    "Your next breakthrough is one mission away.",
    "The hunter who never stops is the hunter who never loses.",
    "Believe in the you that the System sees.",
    "Every defeat is a lesson. Every victory is a step.",
    "The path to S-rank is paved with daily quests.",
    "You are the anomaly. The exception. The awakening.",
  ],
};

/**
 * Get a contextual motivational message from the AI Coach.
 * Considers: streak length, XP progress, time of day, recent activity.
 * @returns {string} a motivational message
 */
function getCoachMessage() {
  const now = new Date();
  const hour = now.getHours();

  // Determine time of day
  let timeOfDay;
  if (hour >= 5 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
  else timeOfDay = 'night';

  // Determine streak tier
  const streak = S.streak || 0;
  let streakTier;
  if (streak === 0) streakTier = 0;
  else if (streak === 1) streakTier = 1;
  else if (streak < 3) streakTier = 3;
  else if (streak < 7) streakTier = 3;
  else if (streak < 14) streakTier = 7;
  else if (streak < 30) streakTier = 14;
  else streakTier = 30;

  // Determine XP tier
  const xp = S.xp || 0;
  const level = S.level || 1;
  const xpForNext = level * 100; // simple formula
  const xpPercent = Math.min(1, xp / xpForNext);
  let xpTier;
  if (xpPercent < 0.33) xpTier = 'low';
  else if (xpPercent < 0.66) xpTier = 'mid';
  else xpTier = 'high';

  // Determine activity
  let activity = 'active';
  if (S.lastActiveDate) {
    const lastActive = new Date(S.lastActiveDate);
    const hoursSince = (now - lastActive) / (1000 * 60 * 60);
    if (hoursSince > 48) activity = 'idle';
  }
  if (S.lastBossKill) {
    const lastKill = new Date(S.lastBossKill);
    const hoursSinceKill = (now - lastKill) / (1000 * 60 * 60);
    if (hoursSinceKill < 24) activity = 'bossSlain';
  }

  // Build candidate pool with priority weighting
  const pool = [];

  // Streak messages (high priority if streak > 0)
  if (streakTier > 0 && COACH_MESSAGES.streak[streakTier]) {
    pool.push(...COACH_MESSAGES.streak[streakTier].map(m => ({ text: m, weight: 3 })));
  } else if (streakTier === 0) {
    pool.push(...COACH_MESSAGES.streak[0].map(m => ({ text: m, weight: 2 })));
  }

  // XP messages
  pool.push(...COACH_MESSAGES.xp[xpTier].map(m => ({ text: m, weight: 2 })));

  // Time of day messages
  pool.push(...COACH_MESSAGES.time[timeOfDay].map(m => ({ text: m, weight: 2 })));

  // Activity messages
  pool.push(...COACH_MESSAGES.activity[activity].map(m => ({ text: m, weight: 2 })));

  // General messages (always included, lower weight)
  pool.push(...COACH_MESSAGES.general.map(m => ({ text: m, weight: 1 })));

  // Weighted random selection
  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const item of pool) {
    roll -= item.weight;
    if (roll <= 0) return item.text;
  }

  // Fallback
  return COACH_MESSAGES.general[0];
}

/**
 * Render the AI Coach panel into the DOM.
 * Creates/updates a dedicated panel with the coach message.
 */
function renderCoachPanel() {
  let panel = document.getElementById('coach-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'coach-panel';
    panel.className = 'coach-panel';
    panel.innerHTML = `
      <div class="coach-header">
        <span class="coach-icon">🤖</span>
        <span class="coach-title">AI Coach</span>
      </div>
      <div class="coach-message" id="coach-message"></div>
    `;
    // Insert after header or at top of main content
    const main = document.querySelector('main') || document.body;
    main.insertBefore(panel, main.firstChild);
  }

  const msgEl = document.getElementById('coach-message');
  if (msgEl) {
    msgEl.textContent = getCoachMessage();
  }
}

/* ============================================================
   INIT — call on app load
   ============================================================ */

function initFeatures2() {
  autoStartMonthlyBoss();
  initEquipment();
  renderCoachPanel();
}
