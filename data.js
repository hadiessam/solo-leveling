/* =====================================================================
   SOLO LEVELING — PLAYER SYSTEM  ·  DATA LAYER
   Edit THIS file to change missions, courses, rewards, phrases.
   Nothing here affects saved progress.
   ===================================================================== */

/* ---------------------------------------------------------------
   STATS — built from Hadi's real profile
   start = honest starting level (1-10) from his actual CV + data
   --------------------------------------------------------------- */
const STATS = [
  {key:'career',   name:'Career',           icon:'career', start:5,
   why:'14 months running Meta Ads end to end, TL 171K managed, 11,406 leads, 27 programs. Real experience, not a beginner.'},
  {key:'skills',   name:'Skills',           icon:'skills',  start:4,
   why:'Strong in paid media and analytics. The gap is Google Ads depth, TikTok/Snapchat, and measurement rigour.'},
  {key:'money',    name:'Money',            icon:'money', start:1,
   why:'EGP 12,000 expected monthly, but nothing received for two months. The weakest domain and the one blocking everything else.'},
  {key:'selfdev',  name:'Self-Development', icon:'selfdev', start:5,
   why:'Degree plus five certifications. English measured: Listening 63 (C1), Speaking 50, Reading 48, Writing 33 (A2). Writing is the whole gap.'},
  {key:'health',   name:'Health',           icon:'health', start:2,
   why:'167 cm, 85 kg. BMI 30.5 \u2014 clinically obese. No established training habit yet.'},
  {key:'relations',name:'Relationships',    icon:'relations', start:4,
   why:'Agency internship and client work give you a network. It needs to be activated deliberately for the Saudi move.'}
];

/* ---------------------------------------------------------------
   COURSES — free, verified, ordered by real priority
   stage 1 unlocks at level 1, stage 2 at level 10, stage 3 at level 30
   --------------------------------------------------------------- */
const COURSES = [
  {id:'c1', stage:1, name:'Google Ads Search Certification', platform:'Google Skillshop',
   url:'https://skillshop.withgoogle.com/', hours:'4-6h',
   why:'You list Google Ads on your CV but your experience is Meta-first. This closes that gap and is the most expected credential for a media buyer in Saudi Arabia.',
   proof:'Free certificate, add to LinkedIn.'},

  {id:'c2', stage:1, name:'Google Analytics Certification (GA4)', platform:'Google Skillshop',
   url:'https://skillshop.withgoogle.com/', hours:'4-6h',
   why:'You already hold the 2024 GA4 course. This is the official certification and it is what recruiters search for.',
   proof:'Free certificate, verifiable ID.'},

  {id:'c3', stage:1, name:'Meta Media Buying Professional', platform:'Meta Blueprint',
   url:'https://certifications.facebookblueprint.com/', hours:'study guide + practice test',
   why:'You run Meta Ads daily. This is the credential that proves it formally, and the study guide itself will sharpen how you structure campaigns.',
   proof:'Study guide and practice tests are free; the exam is paid \u2014 study free first.'},

  {id:'c4', stage:1, name:'TikTok Media Buying Certification', platform:'TikTok Academy',
   url:'https://ads.tiktok.com/business/en-US/academy', hours:'~2h exam',
   why:'TikTok is the fastest-growing paid channel in the Gulf and almost nobody in your market is certified on it. Immediate differentiator.',
   proof:'Free certification, valid 2 years.'},

  {id:'c5', stage:1, name:'Snapchat Ads Certification (Snap Focus)', platform:'Snapchat for Business',
   url:'https://forbusiness.snapchat.com/resources/snapfocus', hours:'2-4h',
   why:'Snapchat is a major channel in Saudi Arabia specifically \u2014 far bigger there than in Egypt. Knowing it before you land is a genuine advantage.',
   proof:'Free certification.'},

  {id:'c6', stage:2, name:'Digital Advertising Certification', platform:'HubSpot Academy',
   url:'https://academy.hubspot.com/courses/digital-advertising', hours:'4h',
   why:'Covers paid advertising strategy across channels with a framework you can reuse in interviews and client pitches.',
   proof:'Free badge, valid 2 years.'},

  {id:'c7', stage:2, name:'Content Marketing Certification', platform:'HubSpot Academy',
   url:'https://academy.hubspot.com/courses/content-marketing', hours:'6-7h',
   why:'You write ad copy already. This teaches the strategy layer above it \u2014 positioning, storytelling, repurposing \u2014 which separates a media buyer from a marketer.',
   proof:'Free badge, valid 2 years.'},

  {id:'c8', stage:2, name:'Learning How to Learn', platform:'Coursera \u00b7 McMaster University',
   url:'https://www.coursera.org/learn/learning-how-to-learn', hours:'~15h',
   why:'Directly attacks your two real problems: studying efficiently for English, courses and eventually the MBA. The discipline you already have; this is the method.',
   proof:'Free to audit; certificate optional and paid.'},

  {id:'c9', stage:2, name:'Excel Skills for Business', platform:'Coursera \u00b7 Macquarie University',
   url:'https://www.coursera.org/specializations/excel', hours:'~20h',
   why:'Every performance marketing job in Saudi Arabia will test Excel. Pivot tables and reporting are assumed, not taught. Feeds directly into the automated reporting you will build in Make.',
   proof:'Free to audit.'},

  {id:'c10', stage:3, name:'Inbound Marketing Certification', platform:'HubSpot Academy',
   url:'https://academy.hubspot.com/courses/inbound', hours:'4-5h',
   why:'The strategic framework behind lead generation. You generate leads; this teaches why the funnel is shaped the way it is.',
   proof:'Free badge, valid 2 years.'},

  {id:'c11', stage:3, name:'SEO Certification', platform:'HubSpot Academy',
   url:'https://academy.hubspot.com/courses/seo', hours:'4-5h',
   why:'Clients will ask for it. An agency that cannot do SEO loses the retainer to one that can.',
   proof:'Free badge, valid 2 years.'},

  {id:'c12', stage:3, name:'AI for Marketing Certification', platform:'HubSpot Academy',
   url:'https://academy.hubspot.com/certification', hours:'2-3h',
   why:'Fast, current, and it is what agencies in 2026 are pitching. A cheap credibility win.',
   proof:'Free badge.'},

  /* --- STAGE 1 (continues): META DEPTH — your S-tier track --- */
  {id:'c13', stage:1, name:'Meta Pixel & Conversions API Setup', platform:'Meta Blueprint',
   url:'https://certifications.facebookblueprint.com/student/path/211547-meta-pixel-conversions-api-course',
   hours:'10m + credential',
   why:'THE single most valuable technical skill for a media buyer in 2026. Tracking is what separates someone who runs ads from someone who can be trusted with a budget. If the pixel is wrong, every number in the account is a lie and the client finds out eventually.',
   proof:'Free credential on completion.'},

  {id:'c14', stage:1, name:'Conversions API \u2014 Direct Integration (Developer Docs)', platform:'Meta for Developers',
   url:'https://developers.facebook.com/docs/marketing-api/conversions-api',
   hours:'self-paced',
   why:'The real documentation, not a course. Server-side tracking, event deduplication, matching quality, access tokens. This is where you go from "I can set up a pixel" to "I can architect tracking". Very few media buyers in the Gulf can do this.',
   proof:'No certificate \u2014 it is a skill, and you prove it in the interview.'},

  {id:'c15', stage:1, name:'Marketing API & Advanced Meta', platform:'Meta for Developers',
   url:'https://developers.facebook.com/docs/marketing-apis/',
   hours:'self-paced',
   why:'Programmatic campaign management, reporting at scale, custom dashboards. This is the bridge between media buyer and marketing engineer \u2014 and it is what makes automation possible.',
   proof:'No certificate \u2014 it is a capability.'},

  {id:'c16', stage:1, name:'Meta Blueprint Certification Path', platform:'Meta Blueprint',
   url:'https://www.facebook.com/business/learn/certification',
   hours:'study + exam',
   why:'The formal Media Buying Professional credential. You already run Meta daily \u2014 this makes it official on paper for a Saudi recruiter who does not know your name yet.',
   proof:'Study guide and practice tests free; exam is paid.'},

  /* --- STAGE 2 (continues): AUTOMATION --- */
  {id:'c17', stage:2, name:'Make Academy \u2014 Full Track', platform:'Make.com',
   url:'https://academy-content.make.com/', hours:'24 courses, self-paced',
   why:'Automation is how one person does the work of three. Make is the best value platform for an agency: 1,000 free operations a month, webhooks included, and a visual canvas that handles branching logic Zapier cannot. Build client reporting, lead routing and alerting workflows.',
   proof:'Free, forever. No subscription needed to learn.'},

  {id:'c18', stage:2, name:'AI Agents Foundations & Building', platform:'Make Academy',
   url:'https://academy-content.make.com/', hours:'~5 units',
   why:'Agentic automation \u2014 workflows that reason and take action, not just move data. This is what agencies will be selling in 2027. Learn it now and you are early, which is the only real advantage anyone ever has.',
   proof:'Free.'},

  {id:'c19', stage:2, name:'n8n \u2014 Self-hosted Automation', platform:'n8n (free, self-hosted)',
   url:'https://n8n.io/', hours:'self-paced',
   why:'Unlimited workflows, unlimited runs, zero ongoing cost if you self-host. For an agency this is the difference between paying $200 a month and paying nothing. Pairs directly with your Meta Marketing API skills.',
   proof:'Free when self-hosted. Your laptop is enough to start.'},

  {id:'c20', stage:2, name:'Zapier \u2014 Automation Fundamentals', platform:'Zapier Learn',
   url:'https://learn.zapier.com/', hours:'self-paced',
   why:'The simplest automation platform and the one most Gulf companies already pay for. Learn Zapier for client work, Make for your own agency, and you can walk into any team and automate their reporting in week one.',
   proof:'Free courses.'},

  /* --- STAGE 1 (continues): SPEED & CRAFT --- */
  {id:'c21', stage:1, name:'Touch Typing \u2014 Reach 60 WPM', platform:'Keybr',
   url:'https://www.keybr.com/', hours:'10 min/day, ~8 weeks',
   why:'The highest-return skill nobody talks about. You will write reports, proposals and ad copy for the rest of your career. Going from 25 to 60 WPM saves you 24 minutes on every 1,000-word document, forever. It also frees your eyes from the keyboard so you can think while you type.',
   proof:'No certificate \u2014 the speed is the proof. Track it weekly on Monkeytype.'},

  {id:'c22', stage:1, name:'The Elements of Style (read it twice)', platform:'Project Gutenberg',
   url:'https://www.gutenberg.org/ebooks/37134', hours:'~1h each read',
   why:'Your measured weakness is sentence control. This book is nothing but sentence control: short sentences, cut the fat, put the full stop where the thought ends. It is a century old and still the standard. Read it, then read it again.',
   proof:'Free, public domain, in the Library tab as well.'},

  /* --- STAGE 2 (continues): THE BUSINESS SKILLS --- */
  {id:'c23', stage:2, name:'Business Communication for Success', platform:'OpenStax',
   url:'https://openstax.org/details/books/business-communication', hours:'reference',
   why:'A free university textbook on writing reports, proposals, emails and presentations that people actually read. This is the professional version of the writing gap you are already fixing on Write & Improve.',
   proof:'Free, openly licensed.'},

  {id:'c24', stage:2, name:'Principles of Management', platform:'OpenStax',
   url:'https://openstax.org/details/books/principles-management', hours:'reference',
   why:'You plan to run an agency. Planning, organising, leading, controlling \u2014 the fundamentals you will need the day you hire your first person.',
   proof:'Free, openly licensed.'},

  {id:'c25', stage:2, name:'Principles of Finance', platform:'OpenStax',
   url:'https://openstax.org/details/books/principles-finance', hours:'reference',
   why:'Cash flow, budgets, pricing, reading a P&L. An agency owner who cannot read their own numbers does not stay an owner long. Also makes you better at the money domain in your Status.',
   proof:'Free, openly licensed.'},

  /* --- STAGE 3 (continues): DEPTH --- */
  {id:'c26', stage:3, name:'Basic HTML & Landing Pages', platform:'MDN Web Docs',
   url:'https://developer.mozilla.org/en-US/docs/Learn/HTML', hours:'~10h',
   why:'You will need to fix a broken landing page at 11pm before a launch. Knowing basic HTML means you can do it yourself instead of losing the client.',
   proof:'Free.'},

  {id:'c27', stage:3, name:'Saudi Business Culture', platform:'Expatica',
   url:'https://www.expatica.com/sa/working/employment-law/saudi-arabia-business-culture-217246/', hours:'~1h',
   why:'How meetings actually run, how decisions get made, what the hierarchy means, and what is expected of you. Read it before you land, not after your first awkward week.',
   proof:'Free.'}
];

/* ---------------------------------------------------------------
   DAILY MISSIONS
   --------------------------------------------------------------- */
const DAILY = [
  /* ---------- TIER 1 : FOUNDATION ---------- */
  {id:'d1', t:1, name:'Fajr on time',              sub:'Faith',      stat:null,      xp:10,
   guide:'Wake for Fajr and pray it on time. Then five minutes of morning adhkar.\n\nThis is the anchor of the whole day. If it holds, everything else holds. If it slips, everything else follows it down.'},

  {id:'d2', t:1, name:'Brush teeth \u2014 morning',  sub:'Health',     stat:'health',  xp:5,
   guide:'Two full minutes, morning. Non-negotiable, every single day.'},

  {id:'d3', t:1, name:'Brush teeth \u2014 night',    sub:'Health',     stat:'health',  xp:5,
   guide:'Two full minutes before sleep. No exceptions, no "I am too tired".'},

  {id:'d4', t:1, name:'Drink 2 litres of water',    sub:'Health',     stat:'health',  xp:5,
   guide:'Fill a 1-litre bottle in the morning and finish it before Dhuhr. Fill it again and finish it before Maghrib.\n\nTwo bottles, done. At 85 kg this is the cheapest change available to you.'},

  {id:'d5', t:1, name:'15-minute home workout',     sub:'Health',     stat:'health',  xp:15,
   guide:'BUILD FROM ZERO \u2014 15 minutes, no equipment, no jumping (knee-friendly at 85 kg).\n\nWarm-up (2 min): 30s arm circles \u00b7 30s marching in place \u00b7 30s hip circles \u00b7 30s slow bodyweight squats.\n\nCircuit \u2014 3 rounds, 40s work / 30s rest:\n  1. Incline push-ups (hands on a chair or wall)\n  2. Chair-assisted squats\n  3. Knee plank (build to full plank)\n  4. Glute bridge\n  5. Dead bug (core, back-safe)\n\nCool-down (3 min): stretch quads, hamstrings, chest, lower back.\n\nWeek 1 you will struggle. Week 3 you will not. Do not skip rest days \u2014 3 to 4 sessions a week, not 7.'},

  {id:'d6', t:1, name:'English Training \u2014 30 min', sub:'Self-Development', stat:'selfdev', xp:40,
   guide:'YOUR REAL PROFILE (EF SET 4-skill, measured):\n  Listening 63 \u2014 C1 ADVANCED\n  Speaking  50 \u2014 B1\n  Reading   48 \u2014 B1\n  Writing   33 \u2014 A2 ELEMENTARY  \u2190 THIS IS THE PROBLEM\n\nAverage 49 = B1. B2 needs 51. The whole gap is in WRITING.\n\nTHE MATH: if writing goes from 33 to 43, your average hits 51 and you are B2. One skill. Ten points.\n\n\u2500\u2500\u2500 THE 30 MINUTES \u2500\u2500\u2500\n\n\u2022 15 min \u2014 WRITE AND GET CORRECTED: use writeandimprove.com (free, Cambridge University). Pick a B1/B2 task, write at least 200 words, and the tool returns instant feedback on grammar, spelling and vocabulary plus a CEFR score. Rewrite using the feedback. This is the single highest-value 15 minutes available to you.\n\n\u2022 10 min \u2014 GRAMMAR DRILL: fix the errors Write & Improve keeps flagging. Same mistake three times = that is your drill for the week.\n\n\u2022 5 min \u2014 SPEAK ALOUD: read your corrected text out loud. Speaking is already 50, one point from B2 \u2014 this keeps it there while you fix writing.\n\n\u2500\u2500\u2500 VOCABULARY \u2500\u2500\u2500\n\nLearn 5 new English words. Write each one in a sentence about your work or life. Use a notebook or a notes app. Review them tomorrow. This builds vocabulary without feeling like studying.\n\nWHY NOT MORE LISTENING: you are C1 at listening. Watching more English content is the most comfortable thing to do and the least useful. Do not spend your 30 minutes there.\n\nYou are not learning English. You are fixing one skill.'},

  {id:'d7', t:1, name:'30 minutes of reading',      sub:'Self-Development', stat:'selfdev', xp:10,
   guide:'You read about 5 pages per 15 minutes, so 30 minutes is roughly 10 pages. Aim for 10 pages, not for 30 minutes.\n\nRead in English when you can \u2014 it compounds with the English work. Arabic is fine for the mindset books.\n\nThe Library tab now has REAL books you can open and read right now, free and legal: As a Man Thinketh (35 min, start tonight), The Art of War, Meditations, The Richest Man in Babylon, and full university textbooks on marketing and business writing.'},

  {id:'d18', t:1, name:'10 minutes of touch typing', sub:'Skills', stat:'skills', xp:10,
   guide:'THE HIGHEST-RETURN 10 MINUTES IN THIS LIST.\n\nGo to keybr.com and do one session. It finds the letters you are slow at and drills them automatically. No setup, no account needed.\n\nWHY IT MATTERS: you will write client reports, campaign summaries, proposals and ad copy for the rest of your career. At 25 words per minute a 1,000-word report takes 40 minutes. At 60 WPM it takes 16. That is 24 minutes back on every single document, forever.\n\nOnce a week, test yourself on monkeytype.com and write the number down. You will be at 60 WPM in about 8 weeks.'},

  {id:'d8', t:1, name:'No phone for the first 30 min', sub:'Discipline', stat:null,   xp:10,
   guide:'From waking until 30 minutes later: no phone. Not for the time, not for messages, not for anything.\n\nPut it across the room before you sleep so you must physically get up to reach it.'},

  {id:'d9', t:1, name:'No phone for the last 30 min',  sub:'Discipline', stat:null,   xp:10,
   guide:'Phone away 30 minutes before sleep. Charge it outside the bedroom if you can.\n\nThis single habit will fix your Fajr more than any alarm will.'},

  {id:'d10',t:1, name:'Phone-free hour',  sub:'Discipline', stat:null,      xp:15,
   guide:'One full hour with the phone completely off or in another room. Not "I will not scroll" \u2014 physically away.\n\nPick a fixed time every day (e.g. 9pm-10pm). During that hour: read, study, walk, or just sit. The goal is to prove to yourself that you can exist without it.\n\nStart with one hour. If that feels easy, extend to two.'},

  {id:'d21',t:1, name:'Practice a skill for 15 min', sub:'Skills', stat:'skills', xp:10,
   guide:'Spend 15 minutes practicing any skill: typing, Excel, presentation design, HTML, or anything from the Skills tab.\n\nUse the phone-free hour for this. The goal is to replace scrolling with learning.'},

  {id:'d22',t:1, name:'Plan tomorrow\'s top 3', sub:'Discipline', stat:null, xp:5,
   guide:'Before sleeping, write down the 3 most important things to do tomorrow. Not 10 \u2014 just 3.\n\nThis takes 2 minutes and makes tomorrow 10x easier. Do it on paper, not on your phone.'},

  {id:'d24',t:1, name:'Course work \u2014 20 min', sub:'Self-Development', stat:'selfdev', xp:20,
   guide:'Open the Course Track tab and work on ONE course for 20 minutes.\n\nNot browsing the list \u2014 actual work. Watch a lesson, do the exercise, take notes.\n\nStage 1 courses open right now:\n  \u2022 Google Ads Search Certification\n  \u2022 Google Analytics 4 Certification\n  \u2022 Meta Pixel & Conversions API Setup\n  \u2022 TikTok Media Buying Certification\n  \u2022 Snapchat Ads Certification\n  \u2022 Touch Typing \u2014 Reach 60 WPM\n\nFinish a whole course and tick it on the Course Track for +60 XP \u2014 and it advances the "Clear the certification stack" boss raid automatically.\n\nOne course at a time. Finishing one beats starting five.'},



  /* ---------- TIER 2 : HUNTING (level 5) ---------- */
  {id:'d11',t:2, name:'Log today\'s expenses',      sub:'Money',      stat:'money',   xp:5, unlock:{level:5},
   guide:'Every pound you spent today. One line each: what, how much.\n\nNotes app or notebook. The point is not budgeting yet \u2014 it is seeing where the money actually goes. Most people are shocked in week one.'},

  {id:'d12',t:2, name:'Save a fixed amount',        sub:'Money',      stat:'money',   xp:10, unlock:{level:5},
   guide:'Move a fixed amount into a separate pot today. Any amount, but fixed.\n\nName the pot SAUDI FUND. Nothing else touches it. This is the money that buys the ticket.'},

  {id:'d13',t:2, name:'Saudi market study \u2014 20 min', sub:'Career', stat:'career', xp:15, unlock:{level:5},
   guide:'You are targeting PERFORMANCE MARKETING / MEDIA BUYER roles in RIYADH. Research exactly that:\n\n\u2022 Search LinkedIn Jobs and Bayt for "performance marketing Riyadh" and "media buyer Riyadh". Read 5 ads properly.\n\u2022 Note the salary bands quoted.\n\u2022 Note which tools they ask for that you do not list.\n\u2022 Note which industries are hiring most (e-commerce, real estate, government, agencies).\n\nWrite down one gap you found. That gap is tomorrow\'s work.'},

  {id:'d14',t:2, name:'Practise interview answers', sub:'Career',     stat:'career',  xp:15, unlock:{level:5},
   guide:'Out loud, not in your head. You are a strong candidate with real numbers \u2014 the job is presenting them without hesitating.\n\nToday: "Tell me about yourself."\nStructure: who you are \u2192 what you do \u2192 your strongest number \u2192 why this role.\n90 seconds. Use your real figures: 27 programs, 11,406 leads, TL 15.06 blended CPL.\n\nRecord it, listen back, cut the filler. New question each day.'},

  /* ---------- TIER 3 : AWAKENED (level 15) ---------- */
  {id:'d15',t:3, name:'English speaking \u2014 15 min', sub:'Self-Development', stat:'selfdev', xp:20, unlock:{level:15},
   guide:'15 minutes of spoken English. Not reading, not listening \u2014 speaking.\n\nOptions: talk to yourself about a campaign you ran, use an AI voice chat, or book a conversation tutor.\n\nThe goal is fluency under pressure, which is exactly what a Riyadh interview will test.'},

  {id:'d16',t:3, name:'Study one course module',    sub:'Self-Development', stat:'selfdev', xp:20, unlock:{level:15},
   guide:'One module of your current course from the Course Track tab.\n\nNot "study a course" \u2014 one specific module, finished. One course at a time. Do not start five.\n\nPick from the Course Track tab. Stage 1 opens now. Each completed course is +60 XP and advances the certification boss raid.'},

  {id:'d17',t:3, name:'Post or comment on LinkedIn',sub:'Career',     stat:'career',  xp:20, unlock:{level:15},
   guide:'You have the profile, the logo and the portfolio built. The only thing missing is output.\n\nEither a short post about something you learned, or a real comment on someone\'s post in your field. Three lines is enough.\n\nYou manage 27 programs and TL 171K of spend. You have more to say than most people posting in your niche.'}
];

/* ---------------------------------------------------------------
   WEEKLY MISSIONS
   --------------------------------------------------------------- */
const WEEKLY = [
  {id:'w1', t:1, name:'Publish one LinkedIn post',      sub:'Career',           stat:'career',    xp:50, unlock:null,
   guide:'One post a week, about your actual work.\n\nFormat: hook \u2192 the problem \u2192 what you did \u2192 the result with a number \u2192 one question.\n\nYour material is unusually strong: the CPL recovery from 130.62 to 50.79, the 1,544-lead campaign at TL 4.62. Those are real case studies \u2014 post them.'},

  {id:'w2', t:1, name:'Contact one new person',         sub:'Relationships',    stat:'relations', xp:50, unlock:null,
   guide:'One person you do not already talk to \u2014 ideally someone working in performance marketing in Riyadh.\n\nOne honest message: who you are, what you are working toward, one specific question they can answer in two lines. Not "can you help me".'},

  {id:'w3', t:1, name:'Call family or meet a friend',   sub:'Relationships',    stat:'relations', xp:50, unlock:null,
   guide:'A real conversation, not a text. Call your parents. Meet a friend.\n\nThis is one of the few things on this list that will still matter to you in ten years.'},

  {id:'w4', t:1, name:'Summarise a book or chapter',    sub:'Self-Development', stat:'selfdev',   xp:50, unlock:null,
   guide:'Five bullet points on what you read this week, in your own words.\n\nBonus: turn those bullets into the LinkedIn post and you clear two weekly missions with one piece of work.'},

  {id:'w5', t:1, name:'Review and update CV',           sub:'Career',           stat:'career',    xp:50, unlock:null,
   guide:'Your CV is already strong. Change one thing: a stronger verb, a number added to a result, a section reordered.\n\nSmall weekly edits beat one big rewrite.'},

  {id:'w6', t:2, name:'One company research session',   sub:'Career',           stat:'career',    xp:100, unlock:{level:8},
   guide:'One hour, one Riyadh company you want to work for.\n\n\u2022 What they actually do, in plain words\n\u2022 Who their clients are\n\u2022 Who their competitors are\n\u2022 Recent campaigns or news\n\u2022 Who you would need to talk to\n\nWalk into an interview knowing this and you are ahead of most candidates.'},

  {id:'w7', t:3, name:'Weekly review \u2014 Sunday',       sub:'System',           stat:null,        xp:50, unlock:{level:15},
   guide:'Fifteen minutes, every Sunday, five questions:\n\n1. How many missions did I complete?\n2. What did I learn?\n3. What failed, and why \u2014 honestly?\n4. What is the ONE thing that matters most next week?\n5. What am I changing?\n\nWrite the answers down. A week that is not reviewed is a week that is repeated.'}
];

/* ---------------------------------------------------------------
   BOSS RAIDS
   xp     = XP awarded PER STEP (visible before you start)
   reward = what clearing the whole raid gives you on top
   --------------------------------------------------------------- */
const BOSSES = [
  {id:'b1', name:'Land the job in Riyadh', desc:'The first gate. Everything else waits behind it.', xp:250, reward:1500,
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

  {id:'b2', name:'Reach English B2', desc:'Listening C1 \u00b7 Speaking 50 \u00b7 Reading 48 \u00b7 Writing 33. Writing is the whole gap.', xp:200, reward:1200,
   steps:[
     'Baseline recorded: EF SET 4-skill = 49 (Listening 63, Speaking 50, Reading 48, Writing 33)',
     'Write 30 pieces on Write & Improve and act on every correction',
     'Cut the top 5 grammar errors you repeat \u2014 diagnosed from your own writing',
     'Raise writing from 33 to 43',
     'Raise reading from 48 to 51',
     'Retake the EF SET and cross 51 overall']},

  {id:'b3', name:'Clear the certification stack', desc:'Every free credential that closes a real gap on your CV.', xp:180, reward:1000,
   steps:[
     'Google Ads Search Certification',
     'Google Analytics 4 Certification',
     'TikTok Media Buying Certification',
     'Snapchat Ads Certification',
     'Meta Media Buying study guide completed',
     'HubSpot Digital Advertising Certification',
     'One HubSpot certification from stage 2']},

  {id:'b9', name:'Become an S-Tier Meta Specialist', desc:'Pixel, Conversions API, Marketing API. The skills almost no media buyer in the Gulf has.', xp:350, reward:2000,
   steps:[
     'Install a Meta Pixel on a real site and verify it with Pixel Helper',
     'Set up standard and custom events correctly',
     'Build a Conversions API integration and confirm events are received',
     'Implement event deduplication and verify matching quality in Events Manager',
     'Pull campaign data programmatically through the Marketing API',
     'Build an automated reporting dashboard with no manual exports',
     'Diagnose a deliberately broken tracking setup and fix it']},

  {id:'b10', name:'Master automation', desc:'One person doing the work of three. This is the agency leverage.', xp:300, reward:1800,
   steps:[
     'Complete the Make Academy foundation track',
     'Build a client reporting workflow that runs itself',
     'Build a lead routing workflow from Meta to CRM',
     'Learn the AI Agent module in Make',
     'Self-host n8n on your own machine',
     'Rebuild one Make scenario in n8n and compare cost',
     'Sell one automation as a paid add-on service']},

  {id:'b4', name:'Travel to Saudi Arabia', desc:'The moment the plan becomes real.', xp:400, reward:2500,
   steps:[
     'Reach the SAUDI FUND savings target',
     'Passport and documents in order',
     'Complete the medical and any required paperwork',
     'Sign the work contract',
     'Book the flight',
     'Land in Riyadh']},

  {id:'b5', name:'Master content creation', desc:'Your gear is a good phone camera. That is genuinely enough to start.', xp:250, reward:1500,
   steps:[
     'Learn manual control on the phone camera: exposure lock, focus lock, white balance',
     'Learn one-light and window-light setups using what you already own',
     'Learn phone-first audio (the microphone matters more than the camera)',
     'Shoot 10 practice projects',
     'Edit a complete video from start to finish',
     'Build a portfolio of 20 finished pieces']},

  {id:'b6', name:'Launch the agency', desc:'Advertising and marketing, Gulf market.', xp:450, reward:3000,
   steps:[
     'Define the service and the pricing',
     'Build the brand identity (the logo is already done)',
     'Build the website and portfolio',
     'Register the business',
     'Land the first paying client']},

  {id:'b7', name:'Reach 10 clients', desc:'A real book of business, not a side hustle.', xp:500, reward:3500,
   steps:['First client','Third client','Fifth client','Tenth client']},

  {id:'b8', name:'MBA in Germany', desc:'The final raid. The long game.', xp:600, reward:5000,
   steps:[
     'Shortlist 8 universities and compare them properly',
     'Prepare for the GMAT or equivalent requirement',
     'Reach the required IELTS / TOEFL score',
     'Save the full cost of study and living',
     'Write the application essays',
     'Secure the recommendation letters',
     'Submit the applications',
     'Get accepted']}
];

/* ---------------------------------------------------------------
   HUNTER RANKS
   --------------------------------------------------------------- */
const RANKS = [
  {name:'E-RANK HUNTER', xp:0,     note:'Foundation stage. Habits not yet formed. This is where everyone starts and most people stop.'},
  {name:'D-RANK HUNTER', xp:2000,  note:'The habit has formed. You are no longer relying on motivation.'},
  {name:'C-RANK HUNTER', xp:6000,  note:'Competent and consistent. This is roughly where your CV already puts you professionally.'},
  {name:'B-RANK HUNTER', xp:14000, note:'Dangerous. You would now be a strong hire in Riyadh, not a gamble.'},
  {name:'A-RANK HUNTER', xp:28000, note:'National level. Offers come to you now, not the other way round.'},
  {name:'S-RANK HUNTER', xp:52000, note:'The Shadow Monarch. There is nothing left to prove.'}
];

/* ---------------------------------------------------------------
   HONEST ASSESSMENT — shown in Status. No flattery.
   --------------------------------------------------------------- */
const ASSESSMENT = [
  {title:'What is genuinely strong',
   body:'You are not a beginner pretending to be experienced \u2014 you are experienced and underselling it. TL 171,000 managed, 11,406 leads, 27 concurrent programs, and a documented CPL recovery from 130.62 to 50.79. Most people applying for media buyer roles in Riyadh cannot show a recovery case study. You can. Your CV and portfolio are already better than the average applicant\'s.'},
  {title:'Your English, measured properly',
   body:'EF SET scored all four skills separately. This is the most useful thing you have learned about yourself this year:\n\nLISTENING 63 \u2014 C1 Advanced. You understand extended speech, films, idiomatic expressions. This is a genuinely strong skill and it is the reason you believed your English was fine. It is \u2014 one part of it.\n\nSPEAKING 50 \u2014 B1. One point from B2. Closer than you thought.\n\nREADING 48 \u2014 B1. Three points from B2.\n\nWRITING 33 \u2014 A2 Elementary. This is the problem. It is a full two levels below your listening.\n\nAverage 49, which reads as B1. But you are not a uniform B1. You are a C1 listener wearing a B1 label because of one skill.\n\nThe math: raise writing from 33 to 43 and your average hits 51. That is B2. One skill. Ten points.'},
  {title:'What is actually blocking you',
   body:'Three things, in order of severity.\n\n1. MONEY. Two months with no income from the academy. This is the real emergency, not the level system. If it continues, the Saudi move slips regardless of how good your CV is.\n\n2. HEALTH. 167 cm and 85 kg is a BMI of 30.5 \u2014 clinically obese. This is not a cosmetic issue. It affects energy, sleep quality, and how you perform in interviews and at work.\n\n3. WRITING. Not speaking \u2014 you said speaking was the problem and you were wrong about that. Writing scored 33 (A2) against your listening at 63 (C1). Every CV, every proposal, every LinkedIn post, every client report you will write in Saudi Arabia runs through the weakest of your four skills. Fix that one and the B2 label comes with it.'},
  {title:'What you are doing right',
   body:'A 434-day Duolingo streak is not a small thing. It proves you can hold a daily commitment longer than most people hold anything. The entire problem is that this discipline is currently pointed at Duolingo instead of at the things that move your life. Same muscle, wrong target.'},
  {title:'The honest rating',
   body:'Career 5/10 \u2014 real results, but zero income for two months and no Gulf experience yet.\nSkills 4/10 \u2014 excellent at Meta, untested elsewhere.\nMoney 1/10 \u2014 the weakest domain and the one that gates everything.\nSelf-development 5/10 \u2014 strong credentials, real English gap.\nHealth 2/10 \u2014 no routine and a BMI that needs attention.\nRelationships 4/10 \u2014 network exists, unused.\n\nOverall: a strong professional standing still. The work ahead is not learning new things \u2014 it is converting what you already have into income, health and a ticket out.'}
];

/* ---------------------------------------------------------------
   PENALTY RULES
   --------------------------------------------------------------- */
const PENALTY_RULES = [
  {name:'Missed 3 missions', cost:25},
  {name:'Missed 5 missions', cost:50},
  {name:'Zero missions completed', cost:80}
];

/* ---------------------------------------------------------------
   STREAK FREEZE
   --------------------------------------------------------------- */
const FREEZE = {
  max:2,
  costXP:300,           /* was 150 — a safety net should cost something */
  earnEvery:21,         /* was 14 — rarer */
  punishmentXP:150      /* was 100 */
};

/* ---------------------------------------------------------------
   JIN-WOO — GUIDE PHRASES
   grouped by what is actually happening to you right now
   --------------------------------------------------------------- */
const GUIDE_PHRASES = [
  /* --- when you are just starting --- */
  "You are the weakest hunter alive. That is exactly why you are the only one who can grow without limit.",
  "Level 1 is not a shame. Level 1 forever is.",
  "Everyone else stopped at their limit. You do not have one.",
  "The System did not choose you because you were strong. It chose you because you kept getting up.",
  "Every hunter you admire was once standing exactly where you are.",
  "Weakness is a starting point, not a verdict.",

  /* --- when you want to quit --- */
  "Nobody is coming to save you. Good. That means nobody can stop you either.",
  "Do you remember why you started? Say it out loud.",
  "You asked for a job in Riyadh. So why are you on your phone?",
  "The daily quest is not optional. Ask anyone who ignored it.",
  "One more day of discipline and you are stronger than yesterday's version of you.",
  "Motivation is a visitor. Discipline lives here.",
  "You have quit things before. Not this one.",

  /* --- about the long game --- */
  "You are not behind. You are early in a very long game.",
  "The version of you that lives in Riyadh is built by the version of you that studies tonight.",
  "Nobody remembers the level you started at. They remember where you finished.",
  "They will not see you coming. That is your advantage.",
  "The English, the CV, the portfolio. One at a time. Not all at once.",
  "Keep going. I will be here when you look back.",
  "Three years from now, this week will be the story you tell people.",

  /* --- about your actual measured gaps --- */
  "49 out of 100. But your listening is C1 and your writing is A2. You have been carrying a B1 label because of one skill.",
  "You thought your problem was speaking. It is writing. Speaking is one point from B2.",
  "Writing 33 to 43. That is the whole distance between you and B2.",
  "You do not need to learn English. You need to write the English you already speak.",
  "Top of B1 is not a failure. It is one skill away from the door.",
  "A C1 listener with A2 writing. Close that one gap and the whole picture changes.",

  /* --- about consistency and streaks --- */
  "434 days. You already proved you can do this. Point it at something that matters.",
  "You showed up yesterday. That is already more than most people manage.",
  "The streak is not a number. It is evidence.",
  "Miss a day and you lose a day. Miss a week and you lose the habit.",

  /* --- about work and money --- */
  "You managed TL 171,000 and 11,406 leads. You are not a beginner. Start acting like the professional you already are.",
  "Your CV is stronger than you think. The problem is that nobody knows it exists yet.",
  "Two months without income is not a failure. It is a deadline.",
  "The agency does not start when you register it. It starts the day you decide.",
  "Someone in Riyadh is doing the job you want right now. Why not you?",

  /* --- short, sharp --- */
  "Arise. Not tomorrow. Now.",
  "Your limit does not exist. You have tested it. You know this.",
  "One page. One sentence. One rep. Start.",
  "Do it tired. Do it badly. Just do it.",
  "Stop negotiating with yourself.",
  "The work is the shortcut.",
  "You already know what to do. Go do it."
];

/* context-aware lines — shown when something specific happens */
const GUIDE_CONTEXT = {
  notStarted:  "The System is dormant. It only starts judging you after your first mission \u2014 so fix your sleep first, then begin clean.",
  noMissions:  "Nothing done today. The day is not over yet. Pick the easiest mission and clear it.",
  halfDay:     "You are halfway through today's quest. Finish it \u2014 the bonus is real.",
  perfectDay:  "Every mission cleared. This is what a perfect day looks like. Do it again tomorrow.",
  missedDay:   "You missed yesterday. One missed day is nothing. Two is a pattern. Break it today.",
  debt:        "You have an outstanding debt. It does not clear itself. Earn it back.",
  reviewDue:   "It is Sunday. Five questions. Write them down \u2014 an unreviewed week repeats itself.",
  highStreak:  "The streak is doing work for you now. Every mission is worth more than it was last month.",
  rankNear:    "You are close to the next rank. This is the part where most people coast. Do not.",
  bossNear:    "One raid is almost finished. Finish it today and take the completion bonus.",
  longAway:    "You have been away. No lecture. Just start again \u2014 today counts.",
  bookWaiting: "There is a 35-minute book in the Library that would change how you see this week. Read it tonight."
};

const GUIDE_BY_TIER = {
  1: "Foundation tier. Fajr, water, fifteen minutes of movement, thirty minutes of English, no phone in the morning. Small things, done daily.",
  2: "Hunting tier. Money starts moving and the Riyadh market research begins. You are building leverage now, not just habits.",
  3: "Awakened tier. Speaking, courses, publishing. The market starts to notice you exist. Do not slow down."
};

/* ---------------------------------------------------------------
   LIBRARY — real books, free and legal, readable right now.
   xp = awarded when you mark it finished
   --------------------------------------------------------------- */
const BOOKS = [
  {cat:'Start Here \u2014 Short & Powerful', items:[
    {t:'As a Man Thinketh', a:'James Allen', yr:1903, mins:35, xp:150,
     why:'Tiny book, huge effect. Written in 1903 and still the clearest thing ever written on how your thinking shapes your circumstances. Read it in one sitting tonight.',
     read:'https://www.gutenberg.org/ebooks/4507', src:'Project Gutenberg'},

    {t:'The Art of War', a:'Sun Tzu', yr:'5th c. BC', mins:60, xp:200,
     why:'Not about war. About winning without fighting, choosing your ground, and knowing when to wait. You are running a campaign against your own old habits.',
     read:'https://www.gutenberg.org/ebooks/17405', src:'Project Gutenberg'},

    {t:'Meditations', a:'Marcus Aurelius', yr:'c. 180 AD', mins:180, xp:350,
     why:'The private diary of a Roman emperor, never meant to be published. Discipline, duty, and doing the work when nobody is watching. Read one page a day.',
     read:'https://www.gutenberg.org/ebooks/2680', src:'Project Gutenberg'},

    {t:'The Autobiography of Benjamin Franklin', a:'Benjamin Franklin', yr:1791, mins:240, xp:400,
     why:'Franklin invented the daily-habit tracker you are using right now. Read how he built his system, tracked thirteen virtues, and failed and restarted \u2014 exactly like you will.',
     read:'https://www.gutenberg.org/ebooks/5827', src:'Project Gutenberg'}
  ]},

  {cat:'Money \u2014 Read These Two First', items:[
    {t:'The Richest Man in Babylon', a:'George S. Clason', yr:1926, mins:150, xp:300,
     why:'The best book ever written on the basics: pay yourself first, live below your means, make money work. Told as short parables set in ancient Babylon. This is where your SAUDI FUND comes from.',
     read:'https://en.wikisource.org/wiki/The_Richest_Man_In_Babylon', src:'Wikisource'},

    {t:'The Wealth of Nations (selected chapters)', a:'Adam Smith', yr:1776, mins:'long', xp:250,
     why:'Do not read all of it. Read Book I, chapters 1-3 on the division of labour. It explains why specialising is how you get paid more than a generalist.',
     read:'https://www.gutenberg.org/ebooks/3300', src:'Project Gutenberg'},

    {t:'The Science of Getting Rich', a:'Wallace D. Wattles', yr:1910, mins:120, xp:250,
     why:'The book that inspired almost every modern money book. Practical and direct: think in a certain way, act in a certain way, and results follow. Free and in the public domain.',
     read:'https://www.gutenberg.org/ebooks/45122', src:'Project Gutenberg'}
  ]},

  {cat:'Marketing & Business \u2014 Free Textbooks', items:[
    {t:'Principles of Marketing', a:'OpenStax (Rice University)', yr:2023, mins:'textbook', xp:600,
     why:'A full, peer-reviewed university marketing textbook. Free, legal, and better than most paid courses. Use it as reference \u2014 jump to the chapter you need, do not read cover to cover.',
     read:'https://openstax.org/details/books/principles-marketing', src:'OpenStax'},

    {t:'Business Communication for Success', a:'OpenStax', yr:2019, mins:'textbook', xp:600,
     why:'Directly targets your weakest skill. How to write reports, proposals, emails and presentations that get read. Every client report you write in Riyadh runs through this.',
     read:'https://openstax.org/details/books/business-communication', src:'OpenStax'},

    {t:'Principles of Management', a:'OpenStax', yr:2019, mins:'textbook', xp:600,
     why:'You want to run an agency. This is the groundwork: planning, organising, leading, controlling. Read it before you hire anyone.',
     read:'https://openstax.org/details/books/principles-management', src:'OpenStax'},

    {t:'Principles of Finance', a:'OpenStax', yr:2022, mins:'textbook', xp:600,
     why:'Cash flow, budgets, pricing, reading a P&L. An agency owner who cannot read their own numbers does not stay an owner for long.',
     read:'https://openstax.org/details/books/principles-finance', src:'OpenStax'}
  ]},

  {cat:'Writing \u2014 Fix Your Actual Gap', items:[
    {t:'The Elements of Style', a:'Strunk & White', yr:1918, mins:60, xp:200,
     why:'THE rule book. Short sentences. Cut every useless word. Your entire problem is sentence control, and this book is nothing but sentence control. Read it twice.',
     read:'https://www.gutenberg.org/ebooks/37134', src:'Project Gutenberg'},

    {t:'English Grammar and Composition', a:'Various', yr:'public domain', mins:'reference', xp:200,
     why:'A free grammar reference for when Write & Improve flags something you do not understand. Look things up, do not read it front to back.',
     read:'https://www.gutenberg.org/ebooks/14006', src:'Project Gutenberg'}
  ]},

  {cat:'Arabic \u2014 \u0627\u0644\u0639\u0631\u0628\u064a\u0629', items:[
    {t:'\u0643\u0644\u064a\u0644\u0629 \u0648\u062f\u0645\u0646\u0629', a:'\u062c\u0628\u0631\u0627\u0646 \u062e\u0644\u064a\u0644 \u062c\u0628\u0631\u0627\u0646', xp:250,
     why:'\u0645\u0646 \u0623\u062c\u0645\u0644 \u0645\u0627 \u0643\u062a\u0628 \u0628\u0627\u0644\u0639\u0631\u0628\u064a\u0629. \u0642\u0631\u0627\u0621\u0629 \u0633\u0647\u0644\u0629 \u0648\u0644\u063a\u0629 \u062c\u0645\u064a\u0644\u0629 \u2014 \u0645\u0641\u064a\u062f\u0629 \u0644\u0644\u062a\u0623\u0645\u0644.',
     read:'https://www.hindawi.org/books/74326274/', src:'Hindawi'},
    {t:'\u0627\u0644\u0623\u064a\u0627\u0645', a:'\u0637\u0647 \u062d\u0633\u064a\u0646', xp:350,
     why:'\u0633\u064a\u0631\u0629 \u0637\u0647 \u062d\u0633\u064a\u0646 \u0648\u0647\u0648 \u0645\u0646 \u0623\u0647\u0645 \u0643\u062a\u0628 \u0627\u0644\u0644\u063a\u0629 \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u0627\u0644\u062d\u062f\u064a\u062b\u0629.',
     read:'https://www.hindawi.org/books/68233032/', src:'Hindawi'}
  ]}
];

/* ---------------------------------------------------------------
   TYPING SPEED — a real skill for your job
   --------------------------------------------------------------- */
const TYPING = {
  targetWPM: 60,
  why: 'You will write client reports, campaign summaries, ad copy and proposals for the rest of your career. At 25 words per minute, a 1,000-word report takes 40 minutes. At 60, it takes 16. That is 24 minutes back, every single report, forever.',
  tools:[
    {n:'Keybr', u:'https://www.keybr.com/', w:'Start here. It teaches touch typing properly \u2014 it finds the letters you are slow at and drills them. 10 minutes a day.'},
    {n:'Monkeytype', u:'https://monkeytype.com/', w:'The cleanest speed test. Use it to measure progress once a week, not every day.'},
    {n:'TypingClub', u:'https://www.typingclub.com/', w:'Structured lessons from zero if you want a full course rather than drills.'},
    {n:'10FastFingers', u:'https://10fastfingers.com/', w:'Quick test plus multi-language practice. Arabic typing practice available too.'}
  ],
  levels:[
    {wpm:30, label:'Hunt and peck',    note:'You look at the keyboard. Every report is slow.'},
    {wpm:45, label:'Functional',       note:'You can work, but you still look down. This is where most people stop.'},
    {wpm:60, label:'Professional',     note:'Touch typing. You stop thinking about the keyboard. This is the target.'},
    {wpm:80, label:'Fast',             note:'You write faster than you think. Reports become easy.'},
    {wpm:100,label:'Exceptional',      note:'Rare. Writing stops being a task at all.'}
  ]
};

/* ---------------------------------------------------------------
   SKILLS YOU DID NOT ASK FOR BUT NEED
   Each one has real places to learn it, with links.
   --------------------------------------------------------------- */
const EXTRAS = [
  {n:'Touch Typing', tag:'Skill', target:'60 WPM',
   why:'The highest-return skill on this list. A 1,000-word report takes 40 minutes at 25 WPM and 16 minutes at 60. That is 24 minutes back on every document, forever.',
   learn:[
     {n:'Keybr \u2014 start here', u:'https://www.keybr.com/', w:'Adaptive drills. It finds your slow letters and trains them. 10 min/day.'},
     {n:'Monkeytype \u2014 measure weekly', u:'https://monkeytype.com/', w:'The cleanest speed test. One 60-second test a week is enough.'},
     {n:'TypingClub', u:'https://www.typingclub.com/', w:'Full structured course from zero, if you prefer lessons over drills.'}
   ]},

  {n:'Google Sheets & Excel', tag:'Tool', target:'Pivot tables + reporting',
   why:'Every performance marketing role in Riyadh tests this. Recruiters assume it, they do not teach it. You already handle TL 171K of spend \u2014 this is how you present it properly.',
   learn:[
     {n:'Google\u2019s official Sheets training', u:'https://support.google.com/a/users/answer/9282959', w:'Free, straight from Google. Covers everything from basics to pivot tables.'},
     {n:'GCFGlobal \u2014 Excel tutorial', u:'https://edu.gcfglobal.org/en/excel/', w:'Gentle, well-made free tutorial. Good if spreadsheets feel intimidating.'},
     {n:'Excel Pivot Tables (Coursera)', u:'https://www.coursera.org/learn/data-analysis-with-excel-pivot-tables', w:'Free to audit. 1 hour, focused on turning raw campaign data into insight.'}
   ]},

  {n:'Presentation & Slide Design', tag:'Skill', target:'A clean deck in 20 minutes',
   why:'You will pitch to clients. Bad slides kill good campaigns \u2014 the client judges the deck before they judge the numbers. This is a 20-hour skill that pays back on every pitch for the rest of your career.',
   learn:[
     {n:'Google Slides \u2014 official help', u:'https://support.google.com/docs/topic/9054603', w:'Free, complete, from Google. Start with "Get started with Slides".'},
     {n:'Slidesgo School \u2014 free design course', u:'https://slidesgo.com/slidesgo-school', w:'Free course on presentation design. Teaches you why some decks land and others do not.'},
     {n:'Presentation Zen (the idea)', u:'https://www.garrreynolds.com/', w:'Garr Reynolds\u2019 free site. Read his rules on simplicity \u2014 they will change how you build every deck.'},
     {n:'SlidesCarnival \u2014 free templates', u:'https://www.slidescarnival.com/', w:'Free professional templates. Never present on the default theme again.'}
   ]},

  {n:'Basic HTML & Landing Pages', tag:'Tech', target:'Fix a broken page yourself',
   why:'You will need to fix a broken landing page at 11pm before a launch. Knowing basic HTML means you fix it in ten minutes instead of losing the client.',
   learn:[
     {n:'MDN \u2014 Learn HTML', u:'https://developer.mozilla.org/en-US/docs/Learn/HTML', w:'The official reference. Start with the "Getting started" modules.'},
     {n:'freeCodeCamp \u2014 Responsive Web Design', u:'https://www.freecodecamp.org/learn/2022/responsive-web-design/', w:'Free, hands-on, certificate at the end. ~20 hours.'}
   ]},

  {n:'Reading a P&L and Cash Flow', tag:'Business', target:'Know your own numbers',
   why:'Before you open an agency. An owner who cannot read their own numbers does not stay an owner long. Also feeds the Money domain in your Status.',
   learn:[
     {n:'OpenStax \u2014 Principles of Finance', u:'https://openstax.org/details/books/principles-finance', w:'Free full textbook. Read the cash-flow and budgeting chapters.'},
     {n:'Investopedia \u2014 P&L explained', u:'https://www.investopedia.com/terms/i/incomestatement.asp', w:'Short, clear, and free. Read it before the textbook.'}
   ]},

  {n:'Negotiation', tag:'Skill', target:'A better salary offer',
   why:'Your salary in Riyadh is negotiable. One good conversation can be worth a year of savings. This is the highest hourly rate you will ever earn.',
   learn:[
     {n:'Never Split the Difference \u2014 summary', u:'https://www.blackswanltd.com/never-split-the-difference', w:'Chris Voss\u2019 own site. Free articles on tactical empathy.'},
     {n:'Harvard PON \u2014 free negotiation resources', u:'https://www.pon.harvard.edu/free-reports/', w:'Free reports from Harvard\u2019s Program on Negotiation. Genuinely useful.'},
     {n:'Khan Academy \u2014 Negotiation', u:'https://www.khanacademy.org/economics-finance-domain/core-finance', w:'Free foundation on the economics behind any deal.'}
   ]},

  {n:'Public Speaking', tag:'Skill', target:'Present without fear',
   why:'You will present to clients and teams. Speaking in front of people is a skill, not a personality trait \u2014 and it is trainable.',
   learn:[
     {n:'Yoodli \u2014 AI speech coach', u:'https://yoodli.ai/', w:'Free tier. Records you and counts filler words, pacing, eye contact. Practise alone first.'},
     {n:'Toastmasters', u:'https://www.toastmasters.org/find-a-club', w:'The gold standard. Real audiences, real feedback. Guest visits are usually free \u2014 find a club in Riyadh before you land.'},
     {n:'Speaking.io \u2014 public speaking practice', u:'https://speaking.io/', w:'Free, practical, no fluff. Built by people who speak for a living.'}
   ]},

  {n:'Saudi Business Culture', tag:'Gulf', target:'Learn before you land',
   why:'How meetings actually run, how decisions get made, what the hierarchy means, what is expected of you. Learning this before you arrive is worth a month of awkward mistakes.',
   learn:[
     {n:'Expatica \u2014 Saudi business culture', u:'https://www.expatica.com/sa/working/employment-law/saudi-arabia-business-culture-217246/', w:'Practical, honest, free. Read it before your first interview.'},
     {n:'Vision 2030 official site', u:'https://www.vision2030.gov.sa/', w:'The plan driving every major hiring decision in the country. Know it \u2014 it will come up in interviews.'},
     {n:'Saudi Press Agency \u2014 business news', u:'https://www.spa.gov.sa/en', w:'Follow it weekly. Walking into an interview knowing current events is a real edge.'}
   ]},

  {n:'LinkedIn & Personal Branding', tag:'Career', target:'Be findable',
   why:'You have the profile, the logo and the portfolio. The only missing piece is output. Recruiters in Riyadh search before they post \u2014 being visible is how they find you.',
   learn:[
     {n:'LinkedIn \u2014 official creator resources', u:'https://www.linkedin.com/help/linkedin/answer/a549033', w:'Free guidance straight from LinkedIn on what the algorithm rewards.'},
     {n:'Buffer \u2014 social media guides', u:'https://buffer.com/resources/', w:'Free, practical, no fluff. Good on what to actually post.'}
   ]}
];

/* ---------------------------------------------------------------
   CLASS SYSTEM — choose your path at level 10
   Inspired by Habitica's class system
   --------------------------------------------------------------- */
const CLASSES = [
  {id:'warrior', name:'Warrior', icon:'sword', stat:'str',
   desc:'Deals heavy damage to bosses. High defense against penalties. Best for players who want steady progress.',
   ability:{name:'Brutal Smash', cost:30, desc:'Deal 2x damage to the next boss step you complete.'},
   passive:'+10% XP from boss raids'},
  {id:'mage', name:'Mage', icon:'orb', stat:'int',
   desc:'Gains XP faster and regenerates mana quickly. Best for players who want to level up fast.',
   ability:{name:'Burst of Flames', cost:25, desc:'Instantly gain 50 XP.'},
   passive:'+10% XP from all sources'},
  {id:'healer', name:'Healer', icon:'heal', stat:'con',
   desc:'High defense against damage. Can heal HP and reduce penalties. Best for players with many daily missions.',
   ability:{name:'Protective Aura', cost:35, desc:'Restore 20 HP and reduce next penalty by 50%.'},
   passive:'Lose 20% less HP from missed missions'},
  {id:'rogue', name:'Rogue', icon:'dagger', stat:'per',
   desc:'Finds most loot and gold. Higher critical hit chance. Best for players who want rewards and drops.',
   ability:{name:'Steal Loot', cost:20, desc:'Gain a random bonus reward immediately.'},
   passive:'25% chance of bonus XP on any mission'}
];

/* ---------------------------------------------------------------
   SHADOW SOLDIER — your virtual companion (inspired by Finch)
   Grows as you complete missions. Has moods and needs.
   --------------------------------------------------------------- */
const SHADOW_SOLDIER = {
  name: 'Shadow',
  stages: [
    {level:0, name:'Egg', icon:'egg', desc:'A mysterious egg. It needs your care to hatch.'},
    {level:1, name:'Hatchling', icon:'hatchling', desc:'A small shadow creature. It is learning about the world.'},
    {level:5, name:'Young Shadow', icon:'young', desc:'Growing stronger every day. It believes in you.'},
    {level:15, name:'Shadow Warrior', icon:'sword', desc:'A powerful companion. It fights alongside you.'},
    {level:30, name:'Shadow Knight', icon:'shield', desc:'Elite status. Your bond is unbreakable.'},
    {level:50, name:'Shadow Monarch', icon:'crown', desc:'The final form. You have both reached the peak.'}
  ],
  moods: {
    happy: {icon:'smile', desc:'Your Shadow is happy! Keep up the good work.'},
    neutral: {icon:'meh', desc:'Your Shadow is doing okay. Complete more missions to cheer it up.'},
    sad: {icon:'frown', desc:'Your Shadow is sad. It misses your attention.'},
    hungry: {icon:'beast', desc:'Your Shadow is hungry. Complete a mission to feed it.'},
    sleeping: {icon:'sleep', desc:'Your Shadow is sleeping. Come back tomorrow.'}
  }
};

/* ---------------------------------------------------------------
   SHADOW CHARACTERS — unlockable characters from Solo Leveling
   Each has a level, power, and rarity. Unlocked randomly from eggs.
   star = ★1-★5 ascension (duplicates merge and raise the star)
   --------------------------------------------------------------- */
const SHADOW_CHARACTERS = [
  /* ---- MYTHIC: the founder ---- */
  {id:'ashborn', name:'Ashborn', title:'The Shadow Monarch \u00b7 Founder of the System', icon:'crown', rarity:'mythic',
   power:100, img:'',
   desc:'The original Shadow Monarch. Once the greatest Ruler \u2014 the Most Brilliant Fragment of Light \u2014 he stayed loyal to the Absolute Being when every other Ruler rebelled. Defeated and left for dead, he discovered the power hidden inside him and rose as the King of the Dead. Feared by both sides, betrayed by both, he built the System itself to find one human with the will to finish what he could not. That human was Sung Jin-Woo.',
   ability:'Monarch\u2019s Will \u2014 The System itself answers to you. Massive XP bonus and every boss step costs one less.'},

  /* ---- LEGENDARY ---- */
  {id:'igris', name:'Igris', title:'Red-Blood Commander', icon:'sword', rarity:'legendary',
   power:85, img:'',
   desc:'The first shadow Jin-Woo ever extracted, from the Red Gate. A towering knight in deep-crimson armour wielding a massive greatsword. Loyal before anything else.',
   ability:'Crimson Slash \u2014 Deals massive damage to the next boss step.'},
  {id:'beru', name:'Beru', title:'Ant King', icon:'ant', rarity:'legendary',
   power:90, img:'',
   desc:'Originally the terror of the Jeju Island S-Rank gate who nearly killed Cha Hae-In. After extraction he became Jin-Woo\u2019s most loyal and arguably strongest shadow.',
   ability:'Lightning Fast \u2014 2x XP from all sources for one hour.'},
  {id:'bellion', name:'Bellion', title:'Grand Marshal of the Shadow Army', icon:'shield', rarity:'legendary',
   power:95, img:'',
   desc:'Ashborn\u2019s oldest and most powerful soldier, commander of the Shadow Army long before Jin-Woo existed. He served the first Shadow Monarch for eons and only bent the knee to Jin-Woo after being defeated.',
   ability:'Grand Marshal \u2014 All boss raid steps award double XP for one day.'},

  /* ---- EPIC ---- */
  {id:'tank', name:'Tank', title:'Ice Bear', icon:'bear', rarity:'epic',
   power:70, img:'',
   desc:'The brute-force Ice Bear shadow. Slow to move, impossible to stop. A loyal frontline fighter.',
   ability:'Frozen Shield \u2014 Blocks the next penalty entirely.'},
  {id:'iron', name:'Iron', title:'Fallen Hunter', icon:'shield', rarity:'epic',
   power:65, img:'',
   desc:'Former A-Rank hunter Kim Chul, transformed into a loyal shadow tank after his death in the Red Gate. Strong defence, unwavering loyalty.',
   ability:'Iron Wall \u2014 Reduces all damage by 25% for one day.'},
  {id:'kaisel', name:'Kaisel', title:'Wyvern Mount', icon:'dragon', rarity:'epic',
   power:68, img:'',
   desc:'The wyvern Jin-Woo rides into battle. A rare flying shadow, used for speed and aerial advantage.',
   ability:'Flight \u2014 Complete one weekly mission instantly.'},
  {id:'greed', name:'Greed', title:'Shadow Beast', icon:'wolf', rarity:'epic',
   power:62, img:'',
   desc:'A shadow beast extracted from the demon castle. Fast, vicious and entirely obedient.',
   ability:'Bloodlust \u2014 +15% XP for the rest of the day.'},

  /* ---- RARE ---- */
  {id:'tusk', name:'Tusk', title:'High Orc Shaman', icon:'orb', rarity:'rare',
   power:55, img:'',
   desc:'A High Orc Shaman with an arcane staff and crimson robes. Provides magical support and unexpected wisdom.',
   ability:'Arcane Wisdom \u2014 +10% XP from courses for one day.'},
  {id:'jima', name:'Jima', title:'Shadow Hunter', icon:'dagger', rarity:'rare',
   power:50, img:'',
   desc:'A skilled shadow hunter. Fast and agile, built for reconnaissance and quick decisive strikes.',
   ability:'Shadow Step \u2014 Complete two missions in half the time.'},
  {id:'fangs', name:'Fangs', title:'Shadow Wolf', icon:'wolf', rarity:'rare',
   power:48, img:'',
   desc:'A pack hunter extracted from the instant dungeon. Fights best alongside others.',
   ability:'Pack Instinct \u2014 +10 XP on every mission today.'},

  /* ---- COMMON ---- */
  {id:'soldier', name:'Shadow Soldier', title:'Standard Infantry', icon:'soldier', rarity:'common',
   power:35, img:'',
   desc:'A basic shadow soldier raised from a fallen hunter. Not the strongest, but the army is built from these.',
   ability:'Arise \u2014 Summons ten shadow soldiers to help.'},
  {id:'knight', name:'Shadow Knight', title:'Elite Soldier', icon:'sword', rarity:'common',
   power:40, img:'',
   desc:'An elite shadow knight. Well-trained, disciplined and reliable. A solid addition to any army.',
   ability:'Knight\u2019s Oath \u2014 +5% XP from all sources for one day.'},
  {id:'hunter', name:'Shadow Archer', title:'Ranged Unit', icon:'archer', rarity:'common',
   power:38, img:'',
   desc:'A ranged shadow unit. Picks off targets before they become a problem.',
   ability:'Precision \u2014 Reveals your weakest domain and gives +5 XP there.'}
];

/* rarity order + the pity/merge rules */
const RARITY_ORDER = {common:1, rare:2, epic:3, legendary:4, mythic:5};
const RARITY_LABEL = {common:'Common', rare:'Rare', epic:'Epic', legendary:'Legendary', mythic:'MYTHIC'};
const RARITY_COLOR = {common:'#8fa3c0', rare:'#0066ff', epic:'#8900ff', legendary:'#DCA15A', mythic:'#ff4d5e'};
const MAX_STARS = 5;

/* ---------------------------------------------------------------
   EGG SYSTEM — eggs are EARNED, never bought.
   You play normally, eggs pile up, you open them in one click.
   No XP cost, no confirm dialog, no grind.
   --------------------------------------------------------------- */
const EGG_TYPES = [
  {id:'basic',     name:'Basic Egg',     icon:'egg', tier:1, chances:{common:68, rare:22, epic:8,  legendary:2,  mythic:0}},
  {id:'premium',   name:'Premium Egg',   icon:'egg', tier:2, chances:{common:35, rare:38, epic:22, legendary:5,  mythic:0}},
  {id:'legendary', name:'Legendary Egg', icon:'egg', tier:3, chances:{common:0,  rare:28, epic:47, legendary:25, mythic:0}},
  {id:'monarch',   name:'Monarch Egg',   icon:'crown', tier:4, chances:{common:0,  rare:0,  epic:30, legendary:60, mythic:10}}
];

/* how eggs arrive — all passive, nothing to farm */
const EGG_DROPS = {
  missionsPerEgg: 5,        /* every 5 daily missions cleared -> 1 Basic */
  perfectDay: 'premium',    /* a perfect day -> 1 Premium */
  streakEvery: 7,           /* every 7 days of streak -> 1 Premium */
  bossClear: 'legendary',   /* clearing a boss raid -> 1 Legendary */
  levelEvery: 25            /* every 25 levels -> 1 Monarch */
};

/* ---------------------------------------------------------------
   DUPLICATE MERGE — a repeat pull raises the star instead of wasting
   star 1 -> 5. Each star adds power. Star 5 is the ceiling.
   --------------------------------------------------------------- */
const STAR_BONUS = 8;   /* power gained per star */

/* ---------------------------------------------------------------
   FOCUS TIMER — Pomodoro-style (inspired by Duolingo)
   --------------------------------------------------------------- */
const FOCUS = {
  workMin: 25,
  breakMin: 5,
  sessionsPerDay: 4,
  xpPerSession: 15
};

/* ---------------------------------------------------------------
   LOOT SYSTEM — random drops (inspired by Habitica)
   --------------------------------------------------------------- */
const LOOT = [
  {id:'gold_small', name:'Small Gold Pile', icon:'money', xp:25, chance:.3},
  {id:'gold_med', name:'Medium Gold Pile', icon:'money', xp:50, chance:.15},
  {id:'gold_large', name:'Large Gold Pile', icon:'money', xp:100, chance:.05},
  {id:'potion_hp', name:'Health Potion', icon:'potionHp', hp:15, chance:.1},
  {id:'potion_mana', name:'Mana Potion', icon:'potionMana', mana:20, chance:.1},
  {id:'scroll', name:'XP Scroll', icon:'scroll', xp:75, chance:.08},
  {id:'gem', name:'Rare Gem', icon:'gem', xp:150, chance:.02},
  {id:'chest', name:'Treasure Chest', icon:'gift', xp:200, chance:.01}
];

/* ---------------------------------------------------------------
   VISION BOARD — visual goals (inspired by Gamified Life OS)
   --------------------------------------------------------------- */
const VISION_BOARD = [
  {id:'v1', icon:'flag', title:'Riyadh', desc:'Live and work in Saudi Arabia'},
  {id:'v2', icon:'career', title:'Dream Job', desc:'Performance Marketing / Media Buyer'},
  {id:'v3', icon:'building', title:'My Agency', desc:'Own advertising agency in the Gulf'},
  {id:'v4', icon:'graduation', title:'MBA Germany', desc:'Master of Business Administration'},
  {id:'v5', icon:'muscle', title:'Healthy Body', desc:'BMI under 25, strong and energetic'},
  {id:'v6', icon:'globe', title:'Global Network', desc:'10+ clients and international connections'}
];


/* ---------------------------------------------------------------
   BADGES — permanent achievements, earned once, never lost
   --------------------------------------------------------------- */
const BADGES = [
  {id:'first',   icon:'star', name:'First Step',        desc:'Completed your very first mission.',              test:s=>s.qDone>=1},
  {id:'ten',     icon:'bolt',  name:'Ten Missions',      desc:'Ten missions completed.',                          test:s=>s.qDone>=10},
  {id:'fifty',   icon:'flame', name:'Fifty Missions',    desc:'Fifty missions completed.',                        test:s=>s.qDone>=50},
  {id:'century', icon:'gem', name:'Century',           desc:'One hundred missions completed.',                  test:s=>s.qDone>=100},
  {id:'twofifty',icon:'sparkle', name:'Two Hundred Fifty', desc:'250 missions completed.',                          test:s=>s.qDone>=250},
  {id:'fivehundred',icon:'flame', name:'Five Hundred',   desc:'500 missions completed. This is who you are now.',  test:s=>s.qDone>=500},

  {id:'streak7', icon:'calendar', name:'One Week Strong',   desc:'Seven-day streak.',                                test:s=>s.best>=7},
  {id:'streak30',icon:'medal', name:'Thirty Days',       desc:'Thirty-day streak. The habit is real now.',        test:s=>s.best>=30},
  {id:'streak100',icon:'crown',name:'Hundred Days',      desc:'One hundred consecutive days.',                    test:s=>s.best>=100},
  {id:'streak365',icon:'calendar',name:'One Year',          desc:'A full year unbroken. Almost nobody does this.',   test:s=>s.best>=365},

  {id:'perfect1',icon:'shieldCheck', name:'Perfect Day',       desc:'Cleared every available mission in one day.',       test:s=>s.perfectDays && s.perfectDays.length>=1},
  {id:'perfect7',icon:'target', name:'Seven Perfect Days', desc:'Seven perfect days.',                            test:s=>s.perfectDays && s.perfectDays.length>=7},
  {id:'perfect30',icon:'gem',name:'Thirty Perfect Days',desc:'Thirty perfect days. Machine-like.',             test:s=>s.perfectDays && s.perfectDays.length>=30},

  {id:'firstboss',icon:'sword', name:'First Blood',       desc:'Cleared your first boss raid.',                    test:s=>BOSSES.some(b=>bossDone(b.id))},
  {id:'boss3',   icon:'dagger', name:'Raid Veteran',     desc:'Three boss raids cleared.',                       test:s=>BOSSES.filter(b=>bossDone(b.id)).length>=3},
  {id:'boss6',   icon:'trophy', name:'Raid Master',       desc:'Six boss raids cleared.',                          test:s=>BOSSES.filter(b=>bossDone(b.id)).length>=6},
  {id:'bossall', icon:'crown', name:'All Raids Cleared',  desc:'Every boss raid finished.',                        test:s=>BOSSES.every(b=>bossDone(b.id))},

  {id:'course1', icon:'graduation', name:'Certified',         desc:'Finished your first course.',                      test:s=>Object.keys(s.courses).length>=1},
  {id:'course5', icon:'selfdev', name:'Course Collector',  desc:'Five courses finished.',                           test:s=>Object.keys(s.courses).length>=5},
  {id:'course10',icon:'brain', name:'Knowledge Hunter',  desc:'Ten courses finished.',                            test:s=>Object.keys(s.courses).length>=10},
  {id:'courseall',icon:'globe',name:'Full Curriculum',   desc:'Every course in the track completed.',             test:s=>Object.keys(s.courses).length>=COURSES.length},

  {id:'rankd',   icon:'shield', name:'D-Rank',           desc:'Reached D-Rank Hunter.',                           test:s=>rankIdx(s.xp)>=1},
  {id:'rankc',   icon:'dagger', name:'C-Rank',           desc:'Reached C-Rank Hunter.',                           test:s=>rankIdx(s.xp)>=2},
  {id:'rankb',   icon:'target', name:'B-Rank',           desc:'Reached B-Rank Hunter. You would be a strong hire now.', test:s=>rankIdx(s.xp)>=3},
  {id:'ranka',   icon:'medal', name:'A-Rank',           desc:'Reached A-Rank Hunter. Offers come to you now.',   test:s=>rankIdx(s.xp)>=4},
  {id:'ranks',   icon:'crown', name:'S-RANK',           desc:'The Shadow Monarch. There is nothing left to prove.', test:s=>rankIdx(s.xp)>=5},

  {id:'lvl10',   icon:'key', name:'Level 10',          desc:'Reached level 10.',                                test:s=>s.level>=10},
  {id:'lvl25',   icon:'arrowUp', name:'Level 25',          desc:'Reached level 25.',                                test:s=>s.level>=25},
  {id:'lvl50',   icon:'sparkle', name:'Level 50',          desc:'Reached level 50. Half way to a hundred.',         test:s=>s.level>=50},
  {id:'lvl100',  icon:'crown', name:'Level 100',         desc:'Reached the maximum level.',                       test:s=>s.level>=100},

  {id:'nomiss',  icon:'shield', name:'Untouched',         desc:'Reached a 14-day streak without spending a freeze.', test:s=>s.best>=14 && s.freezeUsed.length===0},
  {id:'mult15',  icon:'bolt',  name:'Maximum Multiplier', desc:'Reached the x1.50 streak multiplier.',             test:s=>s.streak>=200}
];

/* ---------------------------------------------------------------
   WEEKLY REVIEW — the Sunday checkpoint
   --------------------------------------------------------------- */
const REVIEW_QS = [
  {k:'done',  q:'How many missions did I complete this week?'},
  {k:'learn', q:'What did I actually learn?'},
  {k:'fail',  q:'What failed, and why \u2014 honestly?'},
  {k:'one',   q:'What is the ONE thing that matters most next week?'},
  {k:'change',q:'What am I changing because of it?'}
];

/* ---------------------------------------------------------------
   ENGLISH SKILL PROFILE — measured, not estimated
   --------------------------------------------------------------- */
const SKILLS = [
  {k:'Listening', v:63, lvl:'C1 Advanced',        note:'Extended speech, films, idioms. Genuinely strong.'},
  {k:'Speaking',  v:50, lvl:'B1 Intermediate',    note:'One point from B2. Closer than you thought.'},
  {k:'Reading',   v:48, lvl:'B1 Intermediate',    note:'Three points from B2.'},
  {k:'Writing',   v:33, lvl:'A2 Elementary',      note:'THE GAP. Two full levels below your listening.'}
];
const SKILL_AVG = 49;
const B2_LINE   = 51;

/* ---------------------------------------------------------------
   ENGLISH RESOURCES
   --------------------------------------------------------------- */
const ENGLISH_TOOLS = [
  {n:'Write & Improve (Cambridge) \u2014 YOUR #1 TOOL', u:'https://writeandimprove.com/',
   w:'Free, from Cambridge University. Write a task, get instant feedback on grammar, spelling and vocabulary plus a CEFR score, then rewrite and resubmit. This is the exact tool for your exact gap. Use it 15 minutes every day.'},
  {n:'Your full result \u2014 Listening 63 / Speaking 50 / Reading 48 / Writing 33', u:'https://cert.efset.org/en/score/4skill/49',
   w:'Listening C1 \u00b7 Speaking B1 \u00b7 Reading B1 \u00b7 Writing A2. Average 49. B2 needs 51. Raise writing to 43 and you are there.'},
  {n:'EF SET quick check (15 min)', u:'https://www.efset.org/quick-check/',
   w:'A fast 20-question practice test. Use it weekly to see movement without sitting the full 90 minutes.'},
  {n:'SpeakNow \u2014 pronunciation drills', u:'https://speaknow.co.in/',
   w:'Free, no sign-up. Sound drills for th, r/l, v/w and word stress. Your speaking is 50 \u2014 one point from B2 \u2014 so this is maintenance, not the priority.'},
  {n:'British Council level test', u:'https://learnenglish.britishcouncil.org/english-levels/online-english-level-test',
   w:'Grammar, vocabulary and phrasing. Use it if Write & Improve feedback is not specific enough about a grammar rule.'},
  {n:'EF SET 2-skill (50 min)', u:'https://www.efset.org/ef-set-50/',
   w:'Reading and listening only, with a LinkedIn certificate. Optional \u2014 you already have both numbers.'}
];
