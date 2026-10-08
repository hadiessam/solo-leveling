/* =====================================================================
   SOLO LEVELING — 21-DAY HABIT TRACKER
   Tracks daily habits, streaks, and XP rewards.
   ===================================================================== */

const HABIT_TRACKER = {
  /* Target days for habit completion */
  targetDays: 21,

  /* XP rewards */
  xpPerHabit: 10,
  xpAllHabitsBonus: 25,

  /* Get today's date key (Cairo time) */
  todayKey: function() {
    return dayKey();
  },

  /* Get all habit IDs from HABITS data */
  getAllHabitIds: function() {
    return HABITS.map(function(h) { return h.id; });
  },

  /* Initialize habit state for a given habit if it doesn't exist */
  ensureHabitState: function(habitId) {
    if (!S.habits) S.habits = {};
    if (!S.habits[habitId]) {
      S.habits[habitId] = {
        days: [],
        currentStreak: 0,
        longestStreak: 0
      };
    }
    return S.habits[habitId];
  },

  /* Check if a habit is done for today */
  isDoneToday: function(habitId) {
    var state = S.habits && S.habits[habitId];
    if (!state || !state.days) return false;
    return state.days.indexOf(dayKey()) !== -1;
  },

  /* Get count of habits done today */
  getTodayCount: function() {
    var self = this;
    var ids = this.getAllHabitIds();
    return ids.filter(function(id) { return self.isDoneToday(id); }).length;
  },

  /* Check if all habits are done for today */
  allDoneToday: function() {
    var self = this;
    var ids = this.getAllHabitIds();
    if (ids.length === 0) return false;
    return ids.every(function(id) { return self.isDoneToday(id); });
  }
};

/* ---------------------------------------------------------------------
   GET HABIT NAME — helper
   --------------------------------------------------------------------- */
function getHabitName(habitId) {
  var habit = HABITS.find(function(h) { return h.id === habitId; });
  return habit ? habit.name : 'Unknown';
}

/* ---------------------------------------------------------------------
   GET HABIT PROGRESS — returns {current, target, percentage}
   --------------------------------------------------------------------- */
function getHabitProgress(habitId) {
  var state = S.habits && S.habits[habitId];
  var current = state ? state.days.length : 0;
  var target = HABIT_TRACKER.targetDays;
  var percentage = Math.min(100, Math.round((current / target) * 100));
  return {
    current: current,
    target: target,
    percentage: percentage
  };
}

/* ---------------------------------------------------------------------
   GET HABIT STREAK — returns current consecutive days
   --------------------------------------------------------------------- */
function getHabitStreak(habitId) {
  var state = S.habits && S.habits[habitId];
  if (!state) return 0;
  return state.currentStreak || 0;
}

/* ---------------------------------------------------------------------
   RECALCULATE STREAKS — after check/uncheck
   --------------------------------------------------------------------- */
function recalculateStreaks(state) {
  if (!state.days || state.days.length === 0) {
    state.currentStreak = 0;
    state.longestStreak = 0;
    return;
  }

  /* Sort days ascending */
  var sorted = state.days.slice().sort();

  /* Calculate longest streak */
  var longest = 1;
  var currentRun = 1;
  for (var i = 1; i < sorted.length; i++) {
    var diff = daysBetween(sorted[i - 1], sorted[i]);
    if (diff === 1) {
      currentRun++;
      if (currentRun > longest) longest = currentRun;
    } else {
      currentRun = 1;
    }
  }
  state.longestStreak = longest;

  /* Calculate current streak (consecutive days ending today or yesterday) */
  var today = dayKey();
  var todayIdx = sorted.indexOf(today);
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  var yKey = dayKey.call(null); /* not used, just for safety */

  /* Find the most recent day in the sorted array */
  var mostRecent = sorted[sorted.length - 1];
  var daysFromToday = daysBetween(mostRecent, today);

  /* If the most recent completion is today or yesterday, count backwards */
  if (daysFromToday <= 1) {
    var streak = 1;
    for (var i = sorted.length - 2; i >= 0; i--) {
      var gap = daysBetween(sorted[i], sorted[i + 1]);
      if (gap === 1) {
        streak++;
      } else {
        break;
      }
    }
    state.currentStreak = streak;
  } else {
    state.currentStreak = 0;
  }
}


