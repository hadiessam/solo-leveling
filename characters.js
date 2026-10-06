/* =====================================================================
   SOLO LEVELING — 3D CHARACTER SYSTEM
   18 unique characters, one per tab, built from Three.js geometries.
   Each character has a distinct color scheme, accessories, and idle
   animation. Characters appear in the top-right corner of each tab.
   ===================================================================== */

/* ---------------------------------------------------------------------
   CHARACTER DEFINITIONS
   Each entry maps a tab key to a character with name, colors, and
   a build function that constructs the 3D model from primitives.
   --------------------------------------------------------------------- */
const CHARACTERS = [
  {
    key: 'dashboard',
    name: 'System Guide',
    tabId: 'dash',
    bodyColor: 0x0066ff,
    accentColor: 0x8900ff,
    glowColor: 0x00aaff,
    build: buildSystemGuide
  },
  {
    key: 'daily',
    name: 'Daily Knight',
    tabId: 'daily',
    bodyColor: 0x4488ff,
    accentColor: 0xffcc00,
    glowColor: 0x66aaff,
    build: buildDailyKnight
  },
  {
    key: 'weekly',
    name: 'Weekly Mage',
    tabId: 'weekly',
    bodyColor: 0x8900ff,
    accentColor: 0x00ffcc,
    glowColor: 0xaa44ff,
    build: buildWeeklyMage
  },
  {
    key: 'boss',
    name: 'Boss Hunter',
    tabId: 'boss',
    bodyColor: 0xcc3333,
    accentColor: 0xffaa00,
    glowColor: 0xff5533,
    build: buildBossHunter
  },
  {
    key: 'courses',
    name: 'Course Scholar',
    tabId: 'courses',
    bodyColor: 0x22aa66,
    accentColor: 0xffdd44,
    glowColor: 0x44cc88,
    build: buildCourseScholar
  },
  {
    key: 'roadmap',
    name: 'Pathfinder',
    tabId: 'roadmap',
    bodyColor: 0xff8800,
    accentColor: 0x00ccff,
    glowColor: 0xffaa33,
    build: buildPathfinder
  },
  {
    key: 'rewards',
    name: 'Treasure Keeper',
    tabId: 'vault',
    bodyColor: 0xDCA15A,
    accentColor: 0xff4488,
    glowColor: 0xffcc66,
    build: buildTreasureKeeper
  },
  {
    key: 'library',
    name: 'Librarian',
    tabId: 'library',
    bodyColor: 0x8866cc,
    accentColor: 0x44ffaa,
    glowColor: 0xaa88ee,
    build: buildLibrarian
  },
  {
    key: 'typing',
    name: 'Speed Demon',
    tabId: 'typing',
    bodyColor: 0x00ccff,
    accentColor: 0xff6600,
    glowColor: 0x33ddff,
    build: buildSpeedDemon
  },
  {
    key: 'skills',
    name: 'Skill Master',
    tabId: 'skills',
    bodyColor: 0xff4488,
    accentColor: 0x44ddff,
    glowColor: 0xff66aa,
    build: buildSkillMaster
  },
  {
    key: 'review',
    name: 'Reviewer',
    tabId: 'review',
    bodyColor: 0x66aacc,
    accentColor: 0xffcc44,
    glowColor: 0x88ccee,
    build: buildReviewer
  },
  {
    key: 'insights',
    name: 'Oracle',
    tabId: 'insight',
    bodyColor: 0xaa44ff,
    accentColor: 0x00ffaa,
    glowColor: 0xcc66ff,
    build: buildOracle
  },
  {
    key: 'coach',
    name: 'Coach',
    tabId: 'coach',
    bodyColor: 0x44cc44,
    accentColor: 0xffaa00,
    glowColor: 0x66ee66,
    build: buildCoach
  },
  {
    key: 'hunter',
    name: 'Shadow Hunter',
    tabId: 'hunter',
    bodyColor: 0x333344,
    accentColor: 0x8900ff,
    glowColor: 0x5544aa,
    build: buildShadowHunter
  },
  {
    key: 'eggs',
    name: 'Egg Keeper',
    tabId: 'eggs',
    bodyColor: 0xffdd88,
    accentColor: 0x88ccff,
    glowColor: 0xffeeaa,
    build: buildEggKeeper
  },
  {
    key: 'shadow',
    name: 'Shadow Lord',
    tabId: 'shadow',
    bodyColor: 0x1a1a2e,
    accentColor: 0x8900ff,
    glowColor: 0x4400aa,
    build: buildShadowLord
  },
  {
    key: 'vocab',
    name: 'Word Wizard',
    tabId: 'vocab',
    bodyColor: 0xcc88ff,
    accentColor: 0x44ff88,
    glowColor: 0xddaaff,
    build: buildWordWizard
  },
  {
    key: 'status',
    name: 'Status Keeper',
    tabId: 'stats',
    bodyColor: 0x88aacc,
    accentColor: 0xffcc00,
    glowColor: 0xaaccff,
    build: buildStatusKeeper
  }
];

/* ---------------------------------------------------------------------
   TAB EXPLANATIONS — what each character says when their tab is active
   --------------------------------------------------------------------- */
const TAB_EXPLANATIONS = {
  dashboard: 'Welcome, Hunter. This is your command center. Track your progress, XP, and daily missions here.',
  daily: 'Complete your daily missions to earn XP. Each mission brings you closer to your goals.',
  weekly: 'Weekly missions are bigger challenges. They reset every Friday and give bonus XP.',
  boss: 'Boss raids are your long-term goals. Tap each step to advance and earn XP.',
  courses: 'Courses build your skills. Complete them to unlock new abilities and knowledge.',
  roadmap: 'Your roadmap shows the path from where you are to where you want to be.',
  rewards: 'Spend your hard-earned XP on rewards that motivate you to keep going.',
  library: 'Books expand your mind. Read them to gain XP and wisdom.',
  typing: 'Typing speed matters. Practice daily to increase your WPM.',
  skills: 'Skills are your abilities. Level them up to become more effective.',
  review: 'Weekly review helps you reflect and plan. Answer questions to earn bonus XP.',
  insights: 'Data tells your story. See your patterns and optimize your growth.',
  coach: 'Your AI coach provides guidance and motivation tailored to your journey.',
  hunter: 'The Hunter tab combines your class, focus timer, and vision board.',
  eggs: 'Eggs contain shadow characters. Earn them by completing missions.',
  shadow: 'Your shadow army grows stronger with every mission you complete.',
  vocab: 'Words are power. Learn new vocabulary to improve your English.',
  status: 'Your status window shows honest assessments and progress.'
};

/* =====================================================================
   CHARACTER BUILDER FUNCTIONS
   Each function returns a THREE.Group containing the character model.
   Characters are built from spheres, boxes, and cylinders.
   ===================================================================== */

function buildSystemGuide() {
  const g = new THREE.Group();
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 24, 24),
    new THREE.MeshPhongMaterial({ color: 0x0066ff, emissive: 0x003388, shininess: 80 })
  );
  g.add(orb);
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.65, 0.04, 8, 32),
    new THREE.MeshPhongMaterial({ color: 0x00aaff, emissive: 0x0066aa })
  );
  halo.rotation.x = Math.PI / 2;
  halo.position.y = 0.6;
  g.add(halo);
  const inner = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6 })
  );
  g.add(inner);
  return g;
}

function buildDailyKnight() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.6, 0.35),
    new THREE.MeshPhongMaterial({ color: 0x4488ff, shininess: 40 })
  );
  body.position.y = 0.3;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  head.position.y = 0.75;
  g.add(head);
  const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshPhongMaterial({ color: 0x4488ff, shininess: 60 })
  );
  helmet.position.y = 0.78;
  g.add(helmet);
  const blade = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.7, 0.02),
    new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 100 })
  );
  blade.position.set(0.35, 0.5, 0);
  blade.rotation.z = -0.3;
  g.add(blade);
  const hilt = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.06, 0.06),
    new THREE.MeshPhongMaterial({ color: 0xffcc00 })
  );
  hilt.position.set(0.28, 0.2, 0);
  g.add(hilt);
  const shield = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.04, 6),
    new THREE.MeshPhongMaterial({ color: 0xffcc00, shininess: 50 })
  );
  shield.rotation.z = Math.PI / 2;
  shield.position.set(-0.3, 0.35, 0);
  g.add(shield);
  const legL = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.3, 0.12),
    new THREE.MeshPhongMaterial({ color: 0x3366cc })
  );
  legL.position.set(-0.12, -0.15, 0);
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.12;
  g.add(legR);
  return g;
}

function buildWeeklyMage() {
  const g = new THREE.Group();
  const robe = new THREE.Mesh(
    new THREE.ConeGeometry(0.4, 1.0, 8),
    new THREE.MeshPhongMaterial({ color: 0x8900ff, shininess: 30 })
  );
  robe.position.y = 0.2;
  g.add(robe);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  head.position.y = 0.8;
  g.add(head);
  const hat = new THREE.Mesh(
    new THREE.ConeGeometry(0.25, 0.5, 8),
    new THREE.MeshPhongMaterial({ color: 0x6600cc })
  );
  hat.position.y = 1.1;
  g.add(hat);
  const brim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 0.03, 16),
    new THREE.MeshPhongMaterial({ color: 0x6600cc })
  );
  brim.position.y = 0.9;
  g.add(brim);
  const staff = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8),
    new THREE.MeshPhongMaterial({ color: 0x8B4513 })
  );
  staff.position.set(0.35, 0.4, 0);
  g.add(staff);
  const staffOrb = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 12, 12),
    new THREE.MeshPhongMaterial({ color: 0x00ffcc, emissive: 0x00aa88 })
  );
  staffOrb.position.set(0.35, 1.05, 0);
  g.add(staffOrb);
  return g;
}

function buildBossHunter() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.65, 0.4),
    new THREE.MeshPhongMaterial({ color: 0xcc3333, shininess: 70 })
  );
  body.position.y = 0.3;
  g.add(body);
  const padL = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 12, 12),
    new THREE.MeshPhongMaterial({ color: 0xffaa00, shininess: 80 })
  );
  padL.position.set(-0.35, 0.55, 0);
  g.add(padL);
  const padR = padL.clone();
  padR.position.x = 0.35;
  g.add(padR);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  head.position.y = 0.78;
  g.add(head);
  const visor = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.08, 0.1),
    new THREE.MeshPhongMaterial({ color: 0x333333 })
  );
  visor.position.set(0, 0.78, 0.15);
  g.add(visor);
  const bow = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.025, 8, 16, Math.PI),
    new THREE.MeshPhongMaterial({ color: 0x8B4513 })
  );
  bow.position.set(0.4, 0.4, 0);
  bow.rotation.z = -Math.PI / 2;
  g.add(bow);
  const string = new THREE.Mesh(
    new THREE.CylinderGeometry(0.005, 0.005, 0.6, 4),
    new THREE.MeshBasicMaterial({ color: 0xcccccc })
  );
  string.position.set(0.4, 0.4, 0);
  g.add(string);
  const legL = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.3, 0.14),
    new THREE.MeshPhongMaterial({ color: 0x992222 })
  );
  legL.position.set(-0.14, -0.15, 0);
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.14;
  g.add(legR);
  return g;
}

function buildCourseScholar() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.55, 0.3),
    new THREE.MeshPhongMaterial({ color: 0x22aa66 })
  );
  body.position.y = 0.28;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  head.position.y = 0.72;
  g.add(head);
  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.04, 0.35),
    new THREE.MeshPhongMaterial({ color: 0x111111 })
  );
  cap.position.y = 0.9;
  g.add(cap);
  const capTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.12, 8),
    new THREE.MeshPhongMaterial({ color: 0x111111 })
  );
  capTop.position.y = 0.82;
  g.add(capTop);
  const book = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.04, 0.18),
    new THREE.MeshPhongMaterial({ color: 0xffdd44 })
  );
  book.position.set(0.3, 0.35, 0.1);
  g.add(book);
  const pages = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.03, 0.15),
    new THREE.MeshPhongMaterial({ color: 0xffffee })
  );
  pages.position.set(0.3, 0.35, 0.1);
  g.add(pages);
  const legL = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.25, 0.1),
    new THREE.MeshPhongMaterial({ color: 0x116644 })
  );
  legL.position.set(-0.1, -0.12, 0);
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.1;
  g.add(legR);
  return g;
}

function buildPathfinder() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.25, 0.6, 8),
    new THREE.MeshPhongMaterial({ color: 0xff8800 })
  );
  body.position.y = 0.3;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  head.position.y = 0.75;
  g.add(head);
  const hat = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.25, 0.1, 12),
    new THREE.MeshPhongMaterial({ color: 0xcc6600 })
  );
  hat.position.y = 0.9;
  g.add(hat);
  const compass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.03, 16),
    new THREE.MeshPhongMaterial({ color: 0x00ccff, shininess: 100 })
  );
  compass.position.set(0.28, 0.4, 0.1);
  g.add(compass);
  const needle = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.01, 0.12),
    new THREE.MeshPhongMaterial({ color: 0xff0000 })
  );
  needle.position.set(0.28, 0.42, 0.1);
  g.add(needle);
  const legL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.3, 8),
    new THREE.MeshPhongMaterial({ color: 0xcc5500 })
  );
  legL.position.set(-0.1, -0.15, 0);
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.1;
  g.add(legR);
  return g;
}

function buildTreasureKeeper() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.35),
    new THREE.MeshPhongMaterial({ color: 0xDCA15A, shininess: 60 })
  );
  body.position.y = 0.25;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  head.position.y = 0.68;
  g.add(head);
  const crown = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.18, 0.12, 6),
    new THREE.MeshPhongMaterial({ color: 0xffcc00, shininess: 100 })
  );
  crown.position.y = 0.88;
  g.add(crown);
  const chest = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.2, 0.2),
    new THREE.MeshPhongMaterial({ color: 0x8B4513 })
  );
  chest.position.set(0.35, 0.1, 0.1);
  g.add(chest);
  const lid = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.06, 0.2),
    new THREE.MeshPhongMaterial({ color: 0x6B3410 })
  );
  lid.position.set(0.35, 0.22, 0.1);
  g.add(lid);
  for (let i = 0; i < 3; i++) {
    const coin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.015, 12),
      new THREE.MeshPhongMaterial({ color: 0xffdd00, shininess: 100 })
    );
    coin.position.set(0.3 + i * 0.06, 0.26, 0.1);
    g.add(coin);
  }
  const legL = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.2, 0.1),
    new THREE.MeshPhongMaterial({ color: 0xaa7733 })
  );
  legL.position.set(-0.1, -0.1, 0);
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.1;
  g.add(legR);
  return g;
}

function buildLibrarian() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 0.55, 8),
    new THREE.MeshPhongMaterial({ color: 0x8866cc })
  );
  body.position.y = 0.28;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  head.position.y = 0.7;
  g.add(head);
  const glassL = new THREE.Mesh(
    new THREE.TorusGeometry(0.06, 0.012, 8, 16),
    new THREE.MeshPhongMaterial({ color: 0x333333 })
  );
  glassL.position.set(-0.07, 0.72, 0.15);
  g.add(glassL);
  const glassR = glassL.clone();
  glassR.position.x = 0.07;
  g.add(glassR);
  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.015, 0.015),
    new THREE.MeshPhongMaterial({ color: 0x333333 })
  );
  bridge.position.set(0, 0.72, 0.15);
  g.add(bridge);
  const book1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.04, 0.15),
    new THREE.MeshPhongMaterial({ color: 0x44ffaa })
  );
  book1.position.set(0.28, 0.35, 0.08);
  g.add(book1);
  const book2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.04, 0.13),
    new THREE.MeshPhongMaterial({ color: 0xff6688 })
  );
  book2.position.set(0.28, 0.39, 0.08);
  g.add(book2);
  const legL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.25, 8),
    new THREE.MeshPhongMaterial({ color: 0x6644aa })
  );
  legL.position.set(-0.08, -0.12, 0);
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.08;
  g.add(legR);
  return g;
}

function buildSpeedDemon() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.5, 0.25),
    new THREE.MeshPhongMaterial({ color: 0x00ccff, shininess: 80 })
  );
  body.position.y = 0.25;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  head.position.y = 0.65;
  g.add(head);
  const headphone = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.025, 8, 16, Math.PI),
    new THREE.MeshPhongMaterial({ color: 0xff6600 })
  );
  headphone.position.y = 0.68;
  g.add(headphone);
  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.03, 0.15),
    new THREE.MeshPhongMaterial({ color: 0x333333 })
  );
  keyboard.position.set(0, 0.05, 0.2);
  g.add(keyboard);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      const key = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.015, 0.03),
        new THREE.MeshPhongMaterial({ color: 0x666666 })
      );
      key.position.set(-0.12 + c * 0.035, 0.07, 0.15 + r * 0.04);
      g.add(key);
    }
  }
  const legL = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.2, 0.08),
    new THREE.MeshPhongMaterial({ color: 0x0099cc })
  );
  legL.position.set(-0.08, -0.1, 0);
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.08;
  g.add(legR);
  return g;
}

function buildSkillMaster() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.25, 0.55, 8),
    new THREE.MeshPhongMaterial({ color: 0xff4488 })
  );
  body.position.y = 0.28;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  head.position.y = 0.7;
  g.add(head);
  const armPositions = [
    { x: -0.25, y: 0.4, rz: 0.5 },
    { x: 0.25, y: 0.4, rz: -0.5 },
    { x: -0.2, y: 0.2, rz: 0.8 },
    { x: 0.2, y: 0.2, rz: -0.8 }
  ];
  armPositions.forEach(pos => {
    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8),
      new THREE.MeshPhongMaterial({ color: 0xff6699 })
    );
    arm.position.set(pos.x, pos.y, 0);
    arm.rotation.z = pos.rz;
    g.add(arm);
    const hand = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 8, 8),
      new THREE.MeshPhongMaterial({ color: 0xffcc88 })
    );
    hand.position.set(
      pos.x + Math.sin(pos.rz) * 0.2,
      pos.y + Math.cos(pos.rz) * 0.2,
      0
    );
    g.add(hand);
  });
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshPhongMaterial({ color: 0x44ddff, emissive: 0x2288aa })
    );
    orb.position.set(Math.cos(angle) * 0.4, 0.5, Math.sin(angle) * 0.4);
    g.add(orb);
  }
  const legL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.25, 8),
    new THREE.MeshPhongMaterial({ color: 0xcc2266 })
  );
  legL.position.set(-0.1, -0.12, 0);
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.1;
  g.add(legR);
  return g;
}

function buildReviewer() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.5, 0.28),
    new THREE.MeshPhongMaterial({ color: 0x66aacc })
  );
  body.position.y = 0.25;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  head.position.y = 0.65;
  g.add(head);
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.3, 0.02),
    new THREE.MeshPhongMaterial({ color: 0x8B4513 })
  );
  board.position.set(0.28, 0.35, 0.1);
  g.add(board);
  const paper = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.25, 0.005),
    new THREE.MeshPhongMaterial({ color: 0xffffee })
  );
  paper.position.set(0.28, 0.35, 0.115);
  g.add(paper);
  const clip = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.03, 0.025),
    new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 100 })
  );
  clip.position.set(0.28, 0.48, 0.11);
  g.add(clip);
  const pen = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.15, 8),
    new THREE.MeshPhongMaterial({ color: 0xffcc44 })
  );
  pen.position.set(-0.25, 0.35, 0.1);
  pen.rotation.z = 0.3;
  g.add(pen);
  const legL = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.2, 0.09),
    new THREE.MeshPhongMaterial({ color: 0x4488aa })
  );
  legL.position.set(-0.08, -0.1, 0);
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.08;
  g.add(legR);
  return g;
}

function buildOracle() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.8, 8),
    new THREE.MeshPhongMaterial({ color: 0xaa44ff, shininess: 40 })
  );
  body.position.y = 0.15;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  head.position.y = 0.65;
  g.add(head);
  const hood = new THREE.Mesh(
    new THREE.ConeGeometry(0.22, 0.35, 8),
    new THREE.MeshPhongMaterial({ color: 0x8822dd })
  );
  hood.position.y = 0.75;
  g.add(hood);
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0x00ffaa, emissive: 0x00aa66, transparent: true, opacity: 0.8 })
  );
  ball.position.set(0.3, 0.45, 0.1);
  g.add(ball);
  const stand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.06, 0.1, 8),
    new THREE.MeshPhongMaterial({ color: 0x444444 })
  );
  stand.position.set(0.3, 0.32, 0.1);
  g.add(stand);
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const rune = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.08, 0.01),
      new THREE.MeshPhongMaterial({ color: 0xcc66ff, emissive: 0x8822aa })
    );
    rune.position.set(Math.cos(angle) * 0.35, 0.5, Math.sin(angle) * 0.35);
    rune.rotation.y = angle;
    g.add(rune);
  }
  return g;
}

function buildCoach() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.55, 0.3),
    new THREE.MeshPhongMaterial({ color: 0x44cc44 })
  );
  body.position.y = 0.28;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  head.position.y = 0.7;
  g.add(head);
  const whistle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.06, 0.08, 8),
    new THREE.MeshPhongMaterial({ color: 0xffaa00, shininess: 100 })
  );
  whistle.position.set(0.15, 0.55, 0.15);
  whistle.rotation.x = 0.5;
  g.add(whistle);
  const lanyard = new THREE.Mesh(
    new THREE.TorusGeometry(0.12, 0.008, 8, 16, Math.PI),
    new THREE.MeshPhongMaterial({ color: 0xff0000 })
  );
  lanyard.position.set(0, 0.55, 0);
  lanyard.rotation.x = Math.PI / 2;
  g.add(lanyard);
  const playbook = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.25, 0.02),
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  );
  playbook.position.set(-0.28, 0.35, 0.1);
  g.add(playbook);
  const x1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.01, 0.01),
    new THREE.MeshPhongMaterial({ color: 0xff0000 })
  );
  x1.position.set(-0.32, 0.4, 0.115);
  x1.rotation.z = 0.7;
  g.add(x1);
  const o1 = new THREE.Mesh(
    new THREE.TorusGeometry(0.02, 0.006, 6, 12),
    new THREE.MeshPhongMaterial({ color: 0x0000ff })
  );
  o1.position.set(-0.24, 0.32, 0.115);
  g.add(o1);
  const legL = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.22, 0.1),
    new THREE.MeshPhongMaterial({ color: 0x228822 })
  );
  legL.position.set(-0.1, -0.11, 0);
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.1;
  g.add(legR);
  return g;
}

function buildShadowHunter() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.55, 0.25),
    new THREE.MeshPhongMaterial({ color: 0x333344, shininess: 20 })
  );
  body.position.y = 0.28;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0x444455 })
  );
  head.position.y = 0.68;
  g.add(head);
  const eyeL = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x8900ff })
  );
  eyeL.position.set(-0.06, 0.7, 0.15);
  g.add(eyeL);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.06;
  g.add(eyeR);
  const hood = new THREE.Mesh(
    new THREE.ConeGeometry(0.22, 0.3, 8),
    new THREE.MeshPhongMaterial({ color: 0x222233 })
  );
  hood.position.y = 0.78;
  g.add(hood);
  const daggerL = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.25, 0.015),
    new THREE.MeshPhongMaterial({ color: 0xaaaacc, shininess: 100 })
  );
  daggerL.position.set(-0.28, 0.3, 0.08);
  daggerL.rotation.z = 0.4;
  g.add(daggerL);
  const daggerR = daggerL.clone();
  daggerR.position.x = 0.28;
  daggerR.rotation.z = -0.4;
  g.add(daggerR);
  const hiltL = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.04, 0.04),
    new THREE.MeshPhongMaterial({ color: 0x8900ff })
  );
  hiltL.position.set(-0.32, 0.2, 0.08);
  g.add(hiltL);
  const hiltR = hiltL.clone();
  hiltR.position.x = 0.32;
  g.add(hiltR);
  const legL = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 0.22, 0.09),
    new THREE.MeshPhongMaterial({ color: 0x222233 })
  );
  legL.position.set(-0.08, -0.11, 0);
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.08;
  g.add(legR);
  return g;
}

function buildEggKeeper() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffdd88 })
  );
  body.position.y = 0.35;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  head.position.y = 0.75;
  g.add(head);
  const eyeL = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x333333 })
  );
  eyeL.position.set(-0.06, 0.78, 0.15);
  g.add(eyeL);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.06;
  g.add(eyeR);
  const blushL = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xff8888, transparent: true, opacity: 0.5 })
  );
  blushL.position.set(-0.12, 0.72, 0.14);
  g.add(blushL);
  const blushR = blushL.clone();
  blushR.position.x = 0.12;
  g.add(blushR);
  const egg = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 12, 12),
    new THREE.MeshPhongMaterial({ color: 0x88ccff, shininess: 60 })
  );
  egg.scale.y = 1.3;
  egg.position.set(0, 0.35, 0.25);
  g.add(egg);
  for (let i = 0; i < 3; i++) {
    const spot = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 6, 6),
      new THREE.MeshPhongMaterial({ color: 0x66aadd })
    );
    const angle = (i / 3) * Math.PI * 2;
    spot.position.set(Math.cos(angle) * 0.08, 0.35 + Math.sin(angle) * 0.1, 0.25 + 0.06);
    g.add(spot);
  }
  const armL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.2, 8),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  armL.position.set(-0.15, 0.35, 0.15);
  armL.rotation.z = 0.8;
  g.add(armL);
  const armR = armL.clone();
  armR.position.x = 0.15;
  armR.rotation.z = -0.8;
  g.add(armR);
  const footL = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 8, 8),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  footL.position.set(-0.1, 0.02, 0);
  g.add(footL);
  const footR = footL.clone();
  footR.position.x = 0.1;
  g.add(footR);
  return g;
}

function buildShadowLord() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.3, 0.7, 8),
    new THREE.MeshPhongMaterial({ color: 0x1a1a2e, shininess: 30 })
  );
  body.position.y = 0.2;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0x2a2a3e })
  );
  head.position.y = 0.72;
  g.add(head);
  const crown = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 0.15, 6),
    new THREE.MeshPhongMaterial({ color: 0x8900ff, emissive: 0x4400aa, shininess: 100 })
  );
  crown.position.y = 0.92;
  g.add(crown);
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const spike = new THREE.Mesh(
      new THREE.ConeGeometry(0.03, 0.1, 4),
      new THREE.MeshPhongMaterial({ color: 0x8900ff, emissive: 0x4400aa })
    );
    spike.position.set(Math.cos(angle) * 0.15, 1.02, Math.sin(angle) * 0.15);
    g.add(spike);
  }
  const eyeL = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xaa00ff })
  );
  eyeL.position.set(-0.07, 0.74, 0.16);
  g.add(eyeL);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.07;
  g.add(eyeR);
  const cape = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.6),
    new THREE.MeshPhongMaterial({ color: 0x0a0a1e, side: THREE.DoubleSide })
  );
  cape.position.set(0, 0.3, -0.15);
  cape.rotation.x = 0.2;
  g.add(cape);
  const aura = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x4400aa, transparent: true, opacity: 0.15 })
  );
  aura.position.y = 0.35;
  g.add(aura);
  return g;
}

function buildWordWizard() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.ConeGeometry(0.25, 0.7, 8),
    new THREE.MeshPhongMaterial({ color: 0xcc88ff })
  );
  body.position.y = 0.2;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  head.position.y = 0.65;
  g.add(head);
  const hat = new THREE.Mesh(
    new THREE.ConeGeometry(0.2, 0.4, 8),
    new THREE.MeshPhongMaterial({ color: 0xaa66ee })
  );
  hat.position.y = 0.9;
  g.add(hat);
  const brim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.02, 16),
    new THREE.MeshPhongMaterial({ color: 0xaa66ee })
  );
  brim.position.y = 0.72;
  g.add(brim);
  const book = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.04, 0.15),
    new THREE.MeshPhongMaterial({ color: 0x44ff88 })
  );
  book.position.set(-0.25, 0.35, 0.1);
  g.add(book);
  const wand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.3, 8),
    new THREE.MeshPhongMaterial({ color: 0x8B4513 })
  );
  wand.position.set(0.25, 0.45, 0.1);
  wand.rotation.z = -0.5;
  g.add(wand);
  const wandTip = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 8),
    new THREE.MeshPhongMaterial({ color: 0x44ff88, emissive: 0x22aa44 })
  );
  wandTip.position.set(0.32, 0.58, 0.1);
  g.add(wandTip);
  const letters = ['A', 'B', 'C'];
  letters.forEach((letter, i) => {
    const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
    const letterMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.08, 0.01),
      new THREE.MeshPhongMaterial({ color: 0xffdd44, emissive: 0xaa8800 })
    );
    letterMesh.position.set(Math.cos(angle) * 0.35, 0.5, Math.sin(angle) * 0.35);
    letterMesh.rotation.y = angle;
    g.add(letterMesh);
  });
  return g;
}

function buildStatusKeeper() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.55, 0.3),
    new THREE.MeshPhongMaterial({ color: 0x88aacc })
  );
  body.position.y = 0.28;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xffcc88 })
  );
  head.position.y = 0.7;
  g.add(head);
  const shield = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.15, 0.04, 6),
    new THREE.MeshPhongMaterial({ color: 0xffcc00, shininess: 80 })
  );
  shield.rotation.x = Math.PI / 2;
  shield.position.set(0.3, 0.35, 0);
  g.add(shield);
  const emblem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.05, 6),
    new THREE.MeshPhongMaterial({ color: 0x0066ff, emissive: 0x003388 })
  );
  emblem.rotation.x = Math.PI / 2;
  emblem.position.set(0.3, 0.35, 0.01);
  g.add(emblem);
  const scroll = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.2, 8),
    new THREE.MeshPhongMaterial({ color: 0xffffee })
  );
  scroll.position.set(-0.25, 0.35, 0.1);
  scroll.rotation.z = 0.3;
  g.add(scroll);
  const scrollEnd1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.02, 8),
    new THREE.MeshPhongMaterial({ color: 0xcc9944 })
  );
  scrollEnd1.position.set(-0.28, 0.42, 0.1);
  scrollEnd1.rotation.z = 0.3;
  g.add(scrollEnd1);
  const scrollEnd2 = scrollEnd1.clone();
  scrollEnd2.position.set(-0.22, 0.28, 0.1);
  g.add(scrollEnd2);
  const legL = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.22, 0.1),
    new THREE.MeshPhongMaterial({ color: 0x6688aa })
  );
  legL.position.set(-0.1, -0.11, 0);
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.1;
  g.add(legR);
  return g;
}

/* =====================================================================
   CHARACTER3D CLASS
   Creates a Three.js scene, builds the character, handles animation,
   and provides show/hide/speak methods.
   ===================================================================== */
class Character3D {
  /**
   * @param {Object} definition - Character definition from CHARACTERS array
   * @param {HTMLElement} container - DOM element to render into
   */
  constructor(definition, container) {
    this.def = definition;
    this.container = container;
    this.visible = false;
    this.animationId = null;
    this.time = 0;
    this.failed = false;

    // Create renderer — fallback to 2D if WebGL unavailable
    try{
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(200, 200);
      this.renderer.setPixelRatio(window.devicePixelRatio || 1);
      this.renderer.setClearColor(0x000000, 0);
      container.appendChild(this.renderer.domElement);
    }catch(e){
      this.failed = true;
      /* draw a simple 2D fallback: colored circle with character initial */
      try{
        const c = document.createElement('canvas');
        c.width = 200; c.height = 200;
        c.style.width = '100%'; c.style.height = '100%';
        const ctx = c.getContext('2d');
        if(ctx){
          const col = '#' + (this.def.bodyColor || 0x4488ff).toString(16).padStart(6,'0');
          const acc = '#' + (this.def.accentColor || 0xffcc44).toString(16).padStart(6,'0');
          ctx.fillStyle = col;
          ctx.beginPath(); ctx.arc(100, 100, 70, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = acc;
          ctx.beginPath(); ctx.arc(100, 85, 30, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(this.def.name ? this.def.name[0] : '?', 100, 93);
        }
        container.appendChild(c);
        this.fallbackCanvas = c;
      }catch(e2){
        /* even 2D failed — just show a colored div */
        const div = document.createElement('div');
        div.style.cssText = 'width:100%;height:100%;border-radius:50%;background:#4488ff;display:flex;align-items:center;justify-content:center;color:#fff;font-size:48px;font-weight:bold;';
        div.textContent = this.def.name ? this.def.name[0] : '?';
        container.appendChild(div);
      }
      return;
    }

    // Create scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0.5, 3);
    this.camera.lookAt(0, 0.4, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(2, 3, 4);
    this.scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(this.def.glowColor, 0.4);
    backLight.position.set(-2, 1, -2);
    this.scene.add(backLight);

    // Point light for glow effect
    const pointLight = new THREE.PointLight(this.def.glowColor, 0.5, 5);
    pointLight.position.set(0, 1, 1);
    this.scene.add(pointLight);

    // Build character model
    this.model = this.def.build();
    this.scene.add(this.model);

    // Create speech bubble element
    this.speechBubble = document.createElement('div');
    this.speechBubble.className = 'char-speech-bubble';
    this.speechBubble.innerHTML = `
      <div class="char-name">${this.def.name}</div>
      <div class="char-text"></div>
      <div class="char-tail"></div>
    `;
    this.speechBubble.style.display = 'none';
    container.appendChild(this.speechBubble);

    // Start animation loop
    this.animate();
  }

  /**
   * Animation loop - floating and slight rotation
   */
  animate() {
    if (this.failed) return; /* 2D fallback: no animation loop needed */
    this.animationId = requestAnimationFrame(() => this.animate());
    this.time += 0.02;

    if (this.model) {
      // Floating motion
      this.model.position.y = Math.sin(this.time) * 0.08;
      // Slight rotation
      this.model.rotation.y = Math.sin(this.time * 0.5) * 0.3;
      // Subtle tilt
      this.model.rotation.z = Math.sin(this.time * 0.7) * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Show the character and display speech bubble
   */
  show() {
    this.visible = true;
    this.container.style.display = 'block';
    this.container.classList.add('char-visible');
  }

  /**
   * Hide the character and speech bubble
   */
  hide() {
    this.visible = false;
    this.container.style.display = 'none';
    this.container.classList.remove('char-visible');
    if(this.speechBubble) this.speechBubble.style.display = 'none';
  }

  /**
   * Display a speech bubble with the given text
   * @param {string} text - Text to display in the speech bubble
   */
  speak(text) {
    if(!this.speechBubble) return;
    const textEl = this.speechBubble.querySelector('.char-text');
    if(!textEl) return;
    textEl.textContent = text;
    this.speechBubble.style.display = 'block';

    // Auto-hide after 8 seconds
    if (this.speakTimeout) clearTimeout(this.speakTimeout);
    this.speakTimeout = setTimeout(() => {
      if(this.speechBubble) this.speechBubble.style.display = 'none';
    }, 8000);
  }

  /**
   * Clean up resources
   */
  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.speakTimeout) clearTimeout(this.speakTimeout);
    if (this.renderer) this.renderer.dispose();
  }
}

/* =====================================================================
   INIT CHARACTERS
   Creates character containers for each tab, positions them, and
   hooks into the tab switching system.
   ===================================================================== */
function initCharacters() {
  // Track all character instances
  const characterInstances = {};

  // Create a character container for each tab
  CHARACTERS.forEach(def => {
    const tabPanel = document.getElementById(def.tabId);
    if (!tabPanel) {
      console.warn('Tab panel not found:', def.tabId);
      return;
    }

    // Create container div
    const container = document.createElement('div');
    container.className = 'char-container';
    container.id = 'char-' + def.key;

    // Position in top-right corner of the tab panel
    container.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      width: 200px;
      height: 200px;
      z-index: 100;
      pointer-events: none;
      display: none;
    `;

    // Make sure tab panel has position relative
    const panelStyle = window.getComputedStyle(tabPanel);
    if (panelStyle.position === 'static') {
      tabPanel.style.position = 'relative';
    }

    tabPanel.appendChild(container);

    // Create the 3D character
    try {
      const character = new Character3D(def, container);
      characterInstances[def.key] = character;
    } catch (e) {
      console.error('Failed to create character for', def.key, e);
    }
  });

  // Hook into tab switching
  // Override the existing tab click handler to also switch characters
  const tabs = document.querySelectorAll('.tab[data-page]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const pageName = tab.dataset.page;
      // Find the character for this tab
      const charDef = CHARACTERS.find(c => c.tabId === pageName);
      if (!charDef) return;

      // Hide all characters
      Object.values(characterInstances).forEach(c => c.hide());

      // Show the active character
      const activeChar = characterInstances[charDef.key];
      if (activeChar) {
        activeChar.show();
        // Show speech bubble with tab explanation
        const explanation = TAB_EXPLANATIONS[charDef.key];
        if (explanation) {
          setTimeout(() => activeChar.speak(explanation), 300);
        }
      }
    });
  });

  // Show character for initially active tab
  const activeTab = document.querySelector('.tab.active');
  if (activeTab) {
    const pageName = activeTab.dataset.page;
    const charDef = CHARACTERS.find(c => c.tabId === pageName);
    if (charDef && characterInstances[charDef.key]) {
      setTimeout(() => {
        characterInstances[charDef.key].show();
        const explanation = TAB_EXPLANATIONS[charDef.key];
        if (explanation) {
          setTimeout(() => characterInstances[charDef.key].speak(explanation), 300);
        }
      }, 500);
    }
  }

  // Expose for debugging
  window._characterInstances = characterInstances;
}

/* =====================================================================
   CSS STYLES (injected dynamically)
   ===================================================================== */
function injectCharacterStyles() {
  if (document.getElementById('char-styles')) return;

  const style = document.createElement('style');
  style.id = 'char-styles';
  style.textContent = `
    /* Character container */
    .char-container {
      transition: opacity 0.3s ease;
    }

    .char-container.char-visible {
      pointer-events: auto !important;
    }

    /* Speech bubble */
    .char-speech-bubble {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      width: 220px;
      background: rgba(13, 20, 36, 0.95);
      border: 1px solid #1e3a5f;
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 8px;
      pointer-events: none;
      z-index: 200;
      box-shadow: 0 4px 20px rgba(0, 102, 255, 0.2);
    }

    .char-speech-bubble .char-name {
      font-family: 'Orbitron', sans-serif;
      font-size: 10px;
      font-weight: 700;
      color: #0066ff;
      letter-spacing: 1px;
      margin-bottom: 4px;
      text-transform: uppercase;
    }

    .char-speech-bubble .char-text {
      font-family: 'Rajdhani', sans-serif;
      font-size: 13px;
      color: #e8eef7;
      line-height: 1.4;
    }

    .char-speech-bubble .char-tail {
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid #1e3a5f;
    }

    /* Canvas styling */
    .char-container canvas {
      display: block;
      border-radius: 50%;
    }
  `;
  document.head.appendChild(style);
}

/* =====================================================================
   BOOTSTRAP
   Initialize when DOM is ready
   ===================================================================== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    injectCharacterStyles();
    // Wait for Three.js to load
    if (typeof THREE !== 'undefined') {
      initCharacters();
    } else {
      // Poll for Three.js
      const checkThree = setInterval(() => {
        if (typeof THREE !== 'undefined') {
          clearInterval(checkThree);
          initCharacters();
        }
      }, 100);
      // Timeout after 10 seconds
      setTimeout(() => clearInterval(checkThree), 10000);
    }
  });
} else {
  injectCharacterStyles();
  if (typeof THREE !== 'undefined') {
    initCharacters();
  }
}

/* =====================================================================
   SHOW TAB CHARACTER — called from render.js when a tab is clicked
   ===================================================================== */
function showTabCharacter(pageName) {
  if (typeof CHARACTERS === 'undefined' || typeof TAB_EXPLANATIONS === 'undefined') return;
  const charDef = CHARACTERS.find(c => c.tabId === pageName);
  if (!charDef) return;

  // Hide all characters
  CHARACTERS.forEach(def => {
    const el = document.getElementById('char-' + def.key);
    if (el) el.style.display = 'none';
  });

  // Show the active character
  const activeEl = document.getElementById('char-' + charDef.key);
  if (activeEl) {
    activeEl.style.display = 'block';
    const explanation = TAB_EXPLANATIONS[charDef.key];
    if (explanation) {
      const bubble = activeEl.querySelector('.char-speech-bubble');
      if (bubble) {
        const textEl = bubble.querySelector('.char-text');
        if (textEl) textEl.textContent = explanation;
        bubble.style.display = 'block';
        setTimeout(() => { bubble.style.display = 'none'; }, 8000);
      }
    }
  }
}
