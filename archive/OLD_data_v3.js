/* =====================================================================
   SOLO LEVELING — PLAYER SYSTEM  ·  DATA LAYER
   Edit this file to change missions, guides, rewards and phrases.
   ===================================================================== */

/* ---------------------------------------------------------------
   STATS  (Hadi's real starting point — Level 1, honest zeros)
   --------------------------------------------------------------- */
const STATS = [
  {key:'career',   name:'Career',           icon:'\uD83D\uDCBC', start:3},
  {key:'skills',   name:'Skills',           icon:'\uD83D\uDEE0',  start:2},
  {key:'money',    name:'Money',            icon:'\uD83D\uDCB0', start:2},
  {key:'selfdev',  name:'Self-Development', icon:'\uD83D\uDCDA', start:4},
  {key:'health',   name:'Health',           icon:'\uD83D\uDCAA', start:2},
  {key:'relations',name:'Relationships',    icon:'\uD83E\uDD1D', start:4}
];
/* stat level = floor(statXP / 120) + 1, capped at 10 */

/* ---------------------------------------------------------------
   DAILY MISSIONS
   tier: 1 = available from the start
   unlock: {level:n} or {tier:n}  — missions appear when unlocked
   guide: the actual instructions (what to DO)
   --------------------------------------------------------------- */
const DAILY = [
  /* ---------- TIER 1 : FOUNDATION (Level 1+) ---------- */
  {id:'d1', t:1, name:'Fajr on time',              sub:'Faith',      stat:null,      xp:10,
   guide:'Wake for Fajr and pray it on time. Then sit for five minutes and read your morning adhkar. This is the anchor of the whole day — if it holds, everything else holds.'},

  {id:'d2', t:1, name:'Brush teeth — morning',      sub:'Health',     stat:'health',  xp:5,
   guide:'Two full minutes, morning. Non-negotiable, every single day.'},

  {id:'d3', t:1, name:'Brush teeth — night',        sub:'Health',     stat:'health',  xp:5,
   guide:'Two full minutes before sleep. No exceptions, no "I am too tired".'},

  {id:'d4', t:1, name:'Drink 2 litres of water',    sub:'Health',     stat:'health',  xp:5,
   guide:'Fill a 1-litre bottle in the morning and finish it before Dhuhr. Fill it again and finish it before Maghrib. Two bottles, done.'},

  {id:'d5', t:1, name:'10-minute home workout',     sub:'Health',     stat:'health',  xp:10,
   guide:'NO EXCUSES ROUTINE — 10 minutes, no equipment.\n\nWarm-up (2 min): 30s arm circles \u00b7 30s jumping jacks \u00b7 30s high knees \u00b7 30s bodyweight squats.\n\nCircuit \u2014 3 rounds, 40s work / 20s rest:\n  1. Push-ups (knees if needed)\n  2. Bodyweight squats\n  3. Plank\n  4. Glute bridge\n  5. Mountain climbers\n\nCool-down (2 min): stretch quads, hamstrings, chest, back.\n\nWeek 1 you will struggle. Week 3 you will not. That is the whole point.'},

  {id:'d6', t:1, name:'30 minutes of English',      sub:'Self-Development', stat:'selfdev', xp:15,
   guide:'B1+ \u2192 B2 PLAN — 30 minutes, split like this:\n\n\u2022 10 min \u2014 LISTENING: watch one English video with subtitles ON, then rewatch the same clip with subtitles OFF. Try "BBC Learning English" or "English with Lucy".\n\u2022 10 min \u2014 VOCABULARY: learn 8 new words. Write each one in a sentence about YOUR life, not a dictionary sentence. Use Anki or a plain notebook.\n\u2022 10 min \u2014 SPEAKING: record yourself for 2 minutes talking about your day, then listen back and note one mistake.\n\nWhy this order: B2 is not about knowing more words, it is about using the words you already know without translating in your head. Speaking is the part everyone skips \u2014 do not skip it.\n\nTarget: 8 words a day = 240 words a month = the B2 vocabulary gap, closed.'},

  {id:'d7', t:1, name:'30 minutes of reading',      sub:'Self-Development', stat:'selfdev', xp:10,
   guide:'Read 30 minutes. Paper or screen, no phone nearby.\n\nOpen the "Library" tab for the full reading list with why each book is on it.\n\nIf 30 minutes feels long, read 10 pages instead. Ten pages a day is 12 books a year.'},

  {id:'d8', t:1, name:'No phone for the first 30 min', sub:'Discipline', stat:null,   xp:10,
   guide:'From the moment you wake until 30 minutes later: no phone. Not for the time, not for messages, not for anything.\n\nPut it across the room before you sleep so you have to physically get up to reach it.'},

  {id:'d9', t:1, name:'No phone for the last 30 min',  sub:'Discipline', stat:null,   xp:10,
   guide:'Phone goes away 30 minutes before sleep. Charge it outside the bedroom if you can.\n\nThis single habit will fix your Fajr more than any alarm.'},

  {id:'d10',t:1, name:'Social media under 1 hour',  sub:'Discipline', stat:null,      xp:10,
   guide:'One hour of social media per day, total, all apps combined.\n\nSet a timer on the phone (Digital Wellbeing on Android, Screen Time on iPhone). When the hour is gone, it is gone.\n\nWhen you reach for the phone out of habit, read one page of a book instead. That swap alone will change your year.'},

  /* ---------- TIER 2 : HUNTING (Level 5+) ---------- */
  {id:'d11',t:2, name:'Log today\'s expenses',      sub:'Money',      stat:'money',   xp:5, unlock:{level:5},
   guide:'Write down every pound you spent today. One line each: what, how much.\n\nUse a notes app or a notebook. The point is not budgeting yet \u2014 it is seeing where the money actually goes. Most people are shocked in week one.'},

  {id:'d12',t:2, name:'Save a fixed amount today',  sub:'Money',      stat:'money',   xp:10, unlock:{level:5},
   guide:'Move a fixed amount into a separate savings pot today. Even a small amount.\n\nThis pot has one name: SAUDI FUND. Do not touch it for anything else. This is the money that buys your ticket.'},

  {id:'d13',t:2, name:'Study Saudi market — 20 min',sub:'Career',     stat:'career',  xp:15, unlock:{level:5},
   guide:'20 minutes researching the market you are moving into:\n\n\u2022 Which agencies and companies in Riyadh / Jeddah / Dammam are hiring in your field?\n\u2022 What do their job ads ask for that you do not have yet?\n\u2022 What is the salary range for your role?\n\u2022 Which of your skills are most in demand there?\n\nWrite down one gap you found. That gap is tomorrow\'s work.'},

  {id:'d14',t:2, name:'Practise interview answers', sub:'Career',     stat:'career',  xp:15, unlock:{level:5},
   guide:'Rehearse out loud, not in your head.\n\nToday\'s question: "Tell me about yourself."\n\nAnswer in 90 seconds. Structure: who you are \u2192 what you do \u2192 your strongest result with a number \u2192 why this role.\n\nRecord it on your phone, listen back, cut the filler words. Do this with a different question each day.'},

  /* ---------- TIER 3 : AWAKENED (Level 15+) ---------- */
  {id:'d15',t:3, name:'English speaking — 15 min',  sub:'Self-Development', stat:'selfdev', xp:20, unlock:{level:15},
   guide:'Speak English out loud for 15 minutes. Not reading, not listening \u2014 speaking.\n\nOptions: talk to yourself about your work, use an AI voice chat, or book a tutor on a conversation platform.\n\nThe goal is fluency under pressure, which is exactly what an interview in Saudi Arabia will test.'},

  {id:'d16',t:3, name:'Post or comment on LinkedIn',sub:'Career',     stat:'career',  xp:20, unlock:{level:15},
   guide:'Engage publicly once a day. Either a short post about something you learned, or a thoughtful comment on someone else\'s post in your field.\n\nThree lines is enough. Consistency beats brilliance here \u2014 the algorithm rewards showing up.'}
];

/* ---------------------------------------------------------------
   WEEKLY MISSIONS
   --------------------------------------------------------------- */
const WEEKLY = [
  {id:'w1', t:1, name:'Publish one LinkedIn post',      sub:'Career',           stat:'career',    xp:50, unlock:null,
   guide:'One post a week, about your actual work. What you built, what broke, what you learned.\n\nFormat that works: a hook line \u2192 the problem \u2192 what you did \u2192 the result \u2192 one question to the reader.\n\nDo not wait until you have something impressive. Post the process.'},

  {id:'w2', t:1, name:'Contact one new person',         sub:'Relationships',    stat:'relations', xp:50, unlock:null,
   guide:'Reach out to one person you do not already talk to \u2014 in your field, or in Saudi Arabia.\n\nOne honest message. Say who you are, what you are working toward, and ask one specific question. Not "can you help me" \u2014 a real question they can actually answer in two lines.'},

  {id:'w3', t:1, name:'Call family or meet a friend',   sub:'Relationships',    stat:'relations', xp:50, unlock:null,
   guide:'A real conversation, not a text. Call your parents. Meet a friend.\n\nThis is one of the few things on this list that will still matter to you in ten years. Treat it like it.'},

  {id:'w4', t:1, name:'Summarise a book or chapter',    sub:'Self-Development', stat:'selfdev',   xp:50, unlock:null,
   guide:'Write 5 bullet points on what you read this week, in your own words.\n\nBonus: turn those bullets into a LinkedIn post and you have completed two weekly missions with one piece of work.'},

  {id:'w5', t:1, name:'Review and update CV',           sub:'Career',           stat:'career',    xp:50, unlock:null,
   guide:'Open your CV and change one thing: a stronger verb, a number added to a result, a section reordered.\n\nSmall weekly edits beat one big rewrite. Recruiters notice a CV that is clearly alive.'},

  {id:'w6', t:2, name:'One market research session',    sub:'Career',           stat:'career',    xp:100, unlock:{level:8},
   guide:'One hour, one company. Pick a company you want to work for in Saudi Arabia and learn it properly:\n\n\u2022 What they actually do, in plain words\n\u2022 Who their clients are\n\u2022 Who their competitors are\n\u2022 Recent news or campaigns\n\u2022 Who you would need to talk to\n\nWalk into an interview knowing this and you are already ahead of most candidates.'},

  {id:'w7', t:3, name:'Weekly review — Sunday',         sub:'System',           stat:null,        xp:50, unlock:{level:15},
   guide:'Fifteen minutes, every Sunday, five questions:\n\n1. How many missions did I complete this week?\n2. What did I learn?\n3. What failed, and why \u2014 honestly?\n4. What is the ONE thing that matters most next week?\n5. What am I changing?\n\nWrite the answers down. A week that is not reviewed is a week that is repeated.'}
];

/* ---------------------------------------------------------------
   BOSS RAIDS  — step-by-step real goals
   --------------------------------------------------------------- */
const BOSSES = [
  {id:'b1', name:'Land the job in Saudi Arabia', desc:'The first gate. Everything else waits behind it.', xp:250,
   steps:[
     'Rebuild the CV from zero \u2014 English, one page, results with numbers',
     'Build a portfolio that proves the work, not describes it',
     'Rewrite the LinkedIn profile: headline, about, featured work',
     'Get the CV reviewed by someone already working in Saudi Arabia',
     'Apply to 20 relevant roles',
     'Apply to 50 relevant roles',
     'Complete 3 mock interviews out loud',
     'Reach a final-stage interview',
     'Sign the offer']},

  {id:'b2', name:'Reach English B2', desc:'From B1+ to B2. The gate that opens everything else.', xp:250,
   steps:[
     'Take a placement test and write down the exact weak spots',
     'Study 30 minutes every day for 90 days',
     'Finish one complete course (grammar or business English)',
     'Learn 500 new words with sentences about your own life',
     'Have 10 real conversations with fluent speakers',
     'Pass a B2 mock exam']},

  {id:'b3', name:'Build the personal brand', desc:'Be known for one specific thing in your field.', xp:300,
   steps:[
     'Choose one narrow niche and commit to it',
     'Rewrite every profile around that one niche',
     'Publish 30 posts',
     'Reach 1,000 real followers',
     'Get your first inbound opportunity']},

  {id:'b4', name:'Travel to Saudi Arabia', desc:'The moment the plan becomes real.', xp:400,
   steps:[
     'Complete the Saudi FUND savings target',
     'Get the passport and documents in order',
     'Finish the medical and any required paperwork',
     'Sign the work contract',
     'Book the flight',
     'Land in Saudi Arabia']},

  {id:'b5', name:'Master content creation', desc:'Photography, lighting and video \u2014 the craft that makes the brand real.', xp:400,
   steps:[
     'Learn manual mode: aperture, shutter, ISO',
     'Learn one-light and two-light setups',
     'Shoot 10 practice projects',
     'Edit a complete video from start to finish',
     'Build a portfolio of 20 finished pieces']},

  {id:'b6', name:'Launch the agency', desc:'Advertising and marketing, Gulf market.', xp:500,
   steps:[
     'Define the service and the pricing',
     'Build the brand identity',
     'Build the website and portfolio',
     'Register the business',
     'Land the first paying client']},

  {id:'b7', name:'Reach 10 clients', desc:'A real book of business, not a side hustle.', xp:600,
   steps:[
     'First client',
     'Third client',
     'Fifth client',
     'Tenth client']},

  {id:'b8', name:'MBA in Germany', desc:'The final raid. The long game.', xp:1000,
   steps:[
     'Shortlist 8 universities and compare them properly',
     'Prepare for the GMAT or equivalent requirement',
     'Reach the required English score (IELTS / TOEFL)',
     'Save the full cost of study and living',
     'Write the application essays',
     'Secure the recommendation letters',
     'Submit the applications',
     'Get accepted']}
];

/* ---------------------------------------------------------------
   REWARD VAULT  — every reward is written by Hadi himself.
   Nothing is pre-filled. He adds it, he claims it, he records it.
   --------------------------------------------------------------- */
const STARTER_REWARDS = [
  {id:'r1', name:'Write your first reward here', unlockType:'level', value:3,
   hint:'Something small and real. A favourite coffee, a dessert, an hour of gaming with zero guilt.'},
  {id:'r2', name:'Write your second reward here', unlockType:'level', value:5,
   hint:'A little bigger. Something you would normally feel bad about buying.'}
];

/* ---------------------------------------------------------------
   HUNTER RANKS
   --------------------------------------------------------------- */
const RANKS = [
  {name:'E-RANK HUNTER', xp:0,    note:'Awakened. The weakest rank there is \u2014 and the only one that can grow.'},
  {name:'D-RANK HUNTER', xp:800,  note:'The habit has formed. You are no longer faking it.'},
  {name:'C-RANK HUNTER', xp:2500, note:'Competent. People in your field start recognising the name.'},
  {name:'B-RANK HUNTER', xp:6000, note:'Dangerous. You are now in the top tier of your market.'},
  {name:'A-RANK HUNTER', xp:12000,note:'National level. Offers come to you now, not the other way round.'},
  {name:'S-RANK HUNTER', xp:24000,note:'The Shadow Monarch. There is nothing left to prove.'}
];

/* ---------------------------------------------------------------
   JIN-WOO — THE GUIDE
   --------------------------------------------------------------- */
const GUIDE_PHRASES = [
  "You are the weakest hunter alive. That is exactly why you are the only one who can grow without limit.",
  "Everyone else stopped at their limit. You do not have one.",
  "The System did not choose you because you were strong. It chose you because you kept getting up.",
  "Level 1 is not a shame. Level 1 forever is.",
  "I have seen the end of this path. You are closer than you think.",
  "Nobody is coming to save you. Good. That means nobody can stop you either.",
  "You asked for a job in Saudi Arabia. So why are you on your phone?",
  "The daily quest is not optional. Ask anyone who ignored it.",
  "Do you remember why you started? Say it out loud.",
  "Weakness is a starting point, not a verdict.",
  "Every hunter you admire was once where you are standing right now.",
  "One more day of discipline and you are stronger than yesterday's version of yourself.",
  "They will not see you coming. That is your advantage.",
  "The English, the CV, the portfolio. One at a time. Not all at once.",
  "You are not behind. You are early in a very long game.",
  "Arise. Not tomorrow. Now.",
  "The version of you that lives in Riyadh is built by the version of you that studies tonight.",
  "Nobody remembers the level you started at. They remember where you finished.",
  "Your limit does not exist. You have tested it. You know this.",
  "Keep going. I will be here when you look back."
];

const GUIDE_BY_TIER = {
  1: "Foundation tier. Fajr, water, ten minutes of movement, thirty minutes of English, no phone in the morning. Small things, done daily. This is how a weak hunter becomes a real one.",
  2: "Hunting tier. Now the money starts moving and the market research begins. You are no longer just building habits \u2014 you are building leverage.",
  3: "Awakened tier. Speaking, publishing, reviewing. The world starts to notice you exist. Do not slow down now."
};

/* ---------------------------------------------------------------
   LIBRARY  — book list (English + Arabic)
   --------------------------------------------------------------- */
const BOOKS = [
  {cat:'Mind & Discipline', items:[
    {t:'Atomic Habits', a:'James Clear', why:'The clearest book ever written on why small daily actions beat big intentions. Read this first.'},
    {t:'Deep Work', a:'Cal Newport', why:'Directly answers your phone problem. Teaches you how to protect long blocks of focus in a distracted world.'},
    {t:'Can\'t Hurt Me', a:'David Goggins', why:'When motivation is gone, this is the book that makes you move anyway.'},
    {t:'The Power of Habit', a:'Charles Duhigg', why:'Understand the loop behind your phone habit so you can actually break it.'}
  ]},
  {cat:'Career & Money', items:[
    {t:'So Good They Can\'t Ignore You', a:'Cal Newport', why:'Why "follow your passion" is bad advice, and what to do instead to become valuable.'},
    {t:'Never Split the Difference', a:'Chris Voss', why:'Negotiation. This is the book that gets you a better salary offer.'},
    {t:'The Personal MBA', a:'Josh Kaufman', why:'A full business education in one book. Ideal groundwork before your MBA \u2014 and before your agency.'},
    {t:'Rich Dad Poor Dad', a:'Robert Kiyosaki', why:'A simple introduction to how money works. Read it as a starting point, not a gospel.'}
  ]},
  {cat:'Business & Branding', items:[
    {t:'Building a StoryBrand', a:'Donald Miller', why:'How to write about a business so people actually understand and buy. Core skill for your agency.'},
    {t:'This Is Marketing', a:'Seth Godin', why:'Marketing as service, not noise. Short chapters, big ideas.'},
    {t:'Influence', a:'Robert Cialdini', why:'The psychology of why people say yes. Essential for advertising work.'},
    {t:'The 1-Page Marketing Plan', a:'Allan Dib', why:'Practical, fast, and directly usable for your first clients.'}
  ]},
  {cat:'Photography & Content', items:[
    {t:'Understanding Exposure', a:'Bryan Peterson', why:'The clearest explanation of aperture, shutter and ISO ever written. Read before you buy any gear.'},
    {t:'Light: Science and Magic', a:'Fil Hunter', why:'The definitive book on lighting. This is the skill that separates amateurs from professionals.'},
    {t:'The Visual Story', a:'Bruce Block', why:'How to build a shot that actually communicates. Useful for both photography and video.'}
  ]},
  {cat:'Arabic \u2014 \u0627\u0644\u0639\u0631\u0628\u064a\u0629', items:[
    {t:'\u0627\u0644\u0639\u0627\u062f\u0627\u062a \u0627\u0644\u0630\u0631\u064a\u0629', a:'\u062c\u064a\u0645\u0633 \u0643\u0644\u064a\u0631', why:'\u0627\u0644\u0646\u0633\u062e\u0629 \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0645\u0646 \u0623\u0647\u0645 \u0643\u062a\u0627\u0628 \u0641\u064a \u0628\u0646\u0627\u0621 \u0627\u0644\u0639\u0627\u062f\u0627\u062a. \u0627\u0628\u062f\u0623 \u0628\u0647.'},
    {t:'\u0623\u064a\u0647\u0627 \u0627\u0644\u0635\u0628\u064a \u0627\u0644\u0645\u062d\u0628\u0648\u0633', a:'\u062d\u0633\u064a\u0646 \u0627\u0644\u0634\u0627\u0641\u0639\u064a', why:'\u0644\u0644\u062d\u0627\u0644\u0629 \u0627\u0644\u0646\u0641\u0633\u064a\u0629 \u0648\u0627\u0644\u062a\u0631\u0643\u064a\u0632. \u0642\u0631\u0627\u0621\u0629 \u0633\u0647\u0644\u0629 \u0648\u0639\u0645\u064a\u0642\u0629.'},
    {t:'\u0644\u0627 \u062a\u062d\u0632\u0646', a:'\u0639\u0627\u0626\u0636 \u0627\u0644\u0642\u0631\u0646\u064a', why:'\u0644\u0644\u062a\u0648\u0627\u0632\u0646 \u0648\u0627\u0644\u0631\u0627\u062d\u0629 \u0627\u0644\u0646\u0641\u0633\u064a\u0629. \u0645\u0646\u0627\u0633\u0628 \u0644\u0644\u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0645\u0633\u0627\u0626\u064a\u0629.'}
  ]}
];

/* ---------------------------------------------------------------
   PENALTIES  — what happens if the daily quest is failed
   --------------------------------------------------------------- */
const PENALTY_RULES = [
  {name:'Missed 3 missions in a day',   cost:20,  note:'A light hit. The System is patient.'},
  {name:'Missed 5 missions in a day',   cost:40,  note:'The daily quest was failed. Lose XP and reset nothing else.'},
  {name:'Zero missions completed',      cost:60,  note:'A full failure. The System logs it. Two in a row and you lose a level.'}
];

/* ---------------------------------------------------------------
   MISSING INFO  — what the System still needs to be exact
   (shown in the Status tab)
   --------------------------------------------------------------- */
const MISSING = [
  {item:'Current monthly income',      why:'Money stat and the Saudi FUND target cannot be calculated without a starting number.',    how:'Tell Hermes your monthly income and target savings amount.'},
  {item:'Current weight and height',   why:'The Health stat cannot measure real progress without a baseline.',                          how:'Give Hermes your weight and height, then log it weekly.'},
  {item:'Exact English weak spots',    why:'The 30-minute English plan is generic until we know if your gap is listening, speaking or grammar.', how:'Take a free placement test and send Hermes the score breakdown.'},
  {item:'Your Saudi job target',       why:'Market research missions need a specific role and city to be useful.',                    how:'Tell Hermes the exact job title and city you are targeting.'},
  {item:'CV and portfolio status',     why:'The Career missions assume nothing exists yet. If something does, the plan changes.',   how:'Send Hermes your current CV so the roadmap can be adjusted.'},
  {item:'Reading speed',               why:'"30 minutes" means different things at different reading speeds.',                       how:'Read for 15 minutes and count the pages. Send Hermes the number.'}
];
