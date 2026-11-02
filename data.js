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
   why:'Agency internship and client work give you a network. It needs to be activated deliberately for the career you are building.'}
];

/* ---------------------------------------------------------------
   COURSES — free, verified, ordered by real priority
   stage 1 unlocks at level 1, stage 2 at level 10, stage 3 at level 30
   --------------------------------------------------------------- */
const COURSES = [
  {id:'c1', stage:1, name:'Google Ads Search Certification', platform:'Google Skillshop',
   url:'https://skillshop.withgoogle.com/', hours:'4-6h',
   why:'You list Google Ads on your CV but your experience is Meta-first. This closes that gap and is the most expected credential for a media buyer in Egypt and the Gulf.',
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
   why:'Snapchat is a major channel in the Gulf specifically \u2014 far bigger there than in Egypt. Knowing it before you land is a genuine advantage.',
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
   why:'Every performance marketing job in Egypt and the Gulf will test Excel. Pivot tables and reporting are assumed, not taught. Feeds directly into the automated reporting you will build in Make.',
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
   why:'The formal Media Buying Professional credential. You already run Meta daily \u2014 this makes it official on paper for a recruiter who does not know your name yet.',
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
   proof:'Free.'},

  /* --- NEW: PERFORMANCE MARKETING DEPTH --- */
  {id:'c28', stage:1, name:'Performance Marketing Manager (Full Path)', platform:'Markampus',
   url:'https://markampus.com/learn/performance-marketing-manager/', hours:'50h, 19 modules, 90 lessons',
   why:'The most complete free performance marketing course available. Covers the full paid media stack — Google, Meta, programmatic — with multi-channel attribution, incrementality testing, and budget forecasting. This is the course that takes you from "I run ads" to "I manage performance marketing at scale".',
   proof:'Free verified certificate on completion. 100% free, forever.'},

  {id:'c29', stage:1, name:'PPC Specialist (Google + Meta)', platform:'Markampus',
   url:'https://markampus.com/learn/ppc-specialist/', hours:'45h, 18 modules, 87 lessons',
   why:'Deep-dive into paid search and paid social. Keyword strategy, bid management, audience targeting, creative testing, ROAS optimization. Complements the Google Ads and Meta certifications with the strategic layer underneath them.',
   proof:'Free verified certificate on completion.'},

  {id:'c30', stage:2, name:'AI Marketing Automation', platform:'Coursera · LearnKartS',
   url:'https://www.coursera.org/learn/ai-marketing-automation', hours:'~10h, 3 modules',
   why:'AI-fueled marketing automation — email workflows, chatbots, content creation, social media scheduling. This is what agencies will be selling in 2027. Learn it now and you are early.',
   proof:'Free to audit. Shareable certificate.'},

  {id:'c31', stage:2, name:'AI-Powered Marketing & CRM', platform:'Coursera · University of Rochester',
   url:'https://www.coursera.org/programs/coursera-for-university-of-rochester-mdtfv/learn/ai-powered-marketing-and-crm', hours:'14 modules',
   why:'Generative AI for marketing — personalized email copy, prompt libraries, CRM data optimization, AI lead scoring, CLV analysis. The most comprehensive AI-for-marketing course available.',
   proof:'Free to audit. Shareable certificate.'},

  {id:'c32', stage:2, name:'AI for Marketing', platform:'HubSpot Academy',
   url:'https://academy.hubspot.com/courses/AI-for-Marketers', hours:'~2h, 5 lessons',
   why:'Practical AI for marketers — content creation, personalization, prompt engineering, AI tools evaluation. Fast, current, and directly applicable to your daily work.',
   proof:'Free course. HubSpot Academy badge.'},

  {id:'c33', stage:2, name:'Marketing Automation with AI', platform:'HubSpot Academy',
   url:'https://academy.hubspot.com/lessons/marketing-automation-and-artificial-intelligence', hours:'35 min',
   how:'How AI streamlines inbound marketing, data-driven decisions, automation workflows. Quick but dense — the AI layer on top of everything you already know.',
   proof:'Free lesson. HubSpot Academy.'},

  {id:'c34', stage:3, name:'Digital Media Planning and Buying', platform:'HubSpot Academy',
   url:'https://academy.hubspot.com/courses/digital-marketing', hours:'~6h',
   why:'The strategic framework behind media planning — budget allocation, multi-channel planning, campaign optimization, reporting. This is the course that separates a media buyer from a media planner.',
   proof:'Free badge, valid 2 years.'},

  {id:'c35', stage:3, name:'Performance Marketing (Google + Meta)', platform:'LearnTube',
   url:'https://learntube.ai/learn/course/performance-marketing-google-and-meta-ad', hours:'4h, 18 video lessons',
   why:'Free structured course with AI tutor. Covers Google Ads setup, campaign creation, targeting, bidding, and Meta Ads fundamentals. Good supplement to the official certifications.',
   proof:'Free. Optional paid certificate. Recognised by 900+ hiring partners.'},

  {id:'c36', stage:3, name:'Performance Marketing & Media Buying', platform:'Elevify',
   url:'https://www.elevify.com/en/courses/arts-design-and-communication/digital-marketing/performance-marketing-and-media-buying-course-7a3a4', hours:'4-360h (self-paced)',
   why:'Complete performance marketing system — paid search, paid social, programmatic, CRO, tracking infrastructure, analytics, reporting. 8 chapters, 40 lessons. Free tier available.',
   proof:'Free tier. Pro certificate available.'}
];

/* ---------------------------------------------------------------
   DAILY MISSIONS
   Core Daily Anchors + Day-of-Week Thematic Rotations (0-6)
   Addressing Hadi's real bottlenecks: Writing 33 A2, Level 1 Money, BMI 30.5 Health
   --------------------------------------------------------------- */
const DAILY_THEMES = [
  { day: 0, dayName: 'الأحد (Sunday)', title: 'Market Intelligence & Weekly Strategy', titleAr: 'دراسة السوق وتحديد هدف الأسبوع' },
  { day: 1, dayName: 'الإثنين (Monday)', title: 'Technical Tracking & Conversion Deep Dive', titleAr: 'التعمق التقني في التتبع والـ CAPI' },
  { day: 2, dayName: 'الثلاثاء (Tuesday)', title: 'Interview & Spoken Pitch Fluency', titleAr: 'طلاقة المقابلات والعرض بالإنجليزية' },
  { day: 3, dayName: 'الأربعاء (Wednesday)', title: 'Direct Income Action & Freelance Pitch', titleAr: 'عروض العمل الحر والتحصيل المالي' },
  { day: 4, dayName: 'الخميس (Thursday)', title: 'Professional Outreach & Networking', titleAr: 'بناء العلاقات وشبكة المعارف الخليجية' },
  { day: 5, dayName: 'الجمعة (Friday)', title: 'Weekly Performance Audit & Reflection', titleAr: 'مراجعة أداء الأسبوع والتأمل' },
  { day: 6, dayName: 'السبت (Saturday)', title: 'Content Output & Portfolio Proof', titleAr: 'صناعة المحتوى وتوثيق البورتفوليو' }
];

const DAILY = [
  /* ---------- CORE DAILY ANCHORS (Non-negotiables every single day) ---------- */
  {id:'d1', t:1, name:'Fajr on time',              sub:'Faith',      stat:null,      xp:5,
   guide:'Wake for Fajr and pray it on time. Then five minutes of morning adhkar.\n\nThis is the anchor of the whole day. If it holds, everything else holds. If it slips, everything else follows it down.'},

  {id:'d2', t:1, name:'Brush teeth \u2014 morning',  sub:'Health',     stat:'health',  xp:2,
   guide:'Two full minutes, morning. Non-negotiable, every single day.'},

  {id:'d3', t:1, name:'Brush teeth \u2014 night',    sub:'Health',     stat:'health',  xp:2,
   guide:'Two full minutes before sleep. No exceptions, no "I am too tired".'},

  {id:'d4', t:1, name:'Drink 2 litres of water',    sub:'Health',     stat:'health',  xp:2,
   guide:'Fill a 1-litre bottle in the morning and finish it before Dhuhr. Fill it again and finish it before Maghrib.\n\nTwo bottles, done. At 85 kg this is the cheapest change available to you.'},

  {id:'d5', t:1, name:'15-minute home workout',     sub:'Health',     stat:'health',  xp:7,
   guide:'BUILD FROM ZERO \u2014 15 minutes, no equipment, no jumping (knee-friendly at 85 kg).\n\nWarm-up (2 min): 30s arm circles \u00b7 30s marching in place \u00b7 30s hip circles \u00b7 30s slow bodyweight squats.\n\nCircuit \u2014 3 rounds, 40s work / 30s rest:\n  1. Incline push-ups (hands on a chair or wall)\n  2. Chair-assisted squats\n  3. Knee plank (build to full plank)\n  4. Glute bridge\n  5. Dead bug (core, back-safe)\n\nCool-down (3 min): stretch quads, hamstrings, chest, lower back.\n\nWeek 1 you will struggle. Week 3 you will not. Do not skip rest days \u2014 3 to 4 sessions a week, not 7.'},

  {id:'d6', t:1, name:'English Writing & Typing \u2014 50 min', sub:'Self-Development', stat:'selfdev', xp:28,
     guide:'YOUR REAL PROFILE (EF SET 4-skill, measured):\n  Listening 63 \u2014 C1 ADVANCED\n  Speaking  50 \u2014 B1\n  Reading   48 \u2014 B1\n  Writing   33 \u2014 A2 ELEMENTARY  \u2190 THIS IS THE PROBLEM\n\nAverage 49 = B1. B2 needs 51. The whole gap is in WRITING.\n\nTHE MATH: if writing goes from 33 to 43, your average hits 51 and you are B2. One skill. Ten points.\n\n\u2500\u2500\u2500 THE 50 MINUTES \u2500\u2500\u2500\n\n\u2022 30 min \u2014 WRITE AND GET CORRECTED: use writeandimprove.com (free, Cambridge University). Pick a B1/B2 task, write at least 200 words, and the tool returns instant feedback on grammar, spelling and vocabulary plus a CEFR score. Rewrite using the feedback. This is the single highest-value 15 minutes available to you.\n\n\u2022 15 min \u2014 TOUCH TYPING: go to keybr.com and do a full session. It finds the letters you are slow at and drills them automatically. No setup, no account needed. At 25 WPM a 1,000-word report takes 40 minutes; at 60 it takes 16. That is 24 minutes back on every document, forever.\n\n\u2022 5 min \u2014 SPEAK ALOUD: read your corrected text out loud. Speaking is already 50, one point from B2 \u2014 this keeps it there while you fix writing.\n\n\u2500\u2500\u2500 WHY THEY ARE ONE MISSION \u2500\u2500\u2500\n\nWriting and typing are the same skill from two ends. You cannot write well if you are hunting for letters, and typing is worthless if you have nothing to say. Doing them together in one sitting is how both improve.\n\nOnce a week, test yourself on monkeytype.com and write the WPM down. You will be at 60 in about 8 weeks.\n\nWHY NOT MORE LISTENING: you are C1 at listening. Watching more English content is the most comfortable thing to do and the least useful. Do not spend your time there.\n\nYou are not learning English. You are fixing one skill.'},

  {id:'d8', t:1, name:'No phone for the first 30 min', sub:'Discipline', stat:null,   xp:5,
   guide:'From waking until 30 minutes later: no phone. Not for the time, not for messages, not for anything.\n\nPut it across the room before you sleep so you must physically get up to reach it.'},

  {id:'d9', t:1, name:'No phone for the last 30 min',  sub:'Discipline', stat:null,   xp:5,
   guide:'Phone away 30 minutes before sleep. Charge it outside the bedroom if you can.\n\nThis single habit will fix your Fajr more than any alarm will.'},

  {id:'d10',t:1, name:'Phone-free hour',  sub:'Discipline', stat:null,      xp:7,
   guide:'One full hour with the phone completely off or in another room. Not "I will not scroll" \u2014 physically away.\n\nPick a fixed time every day (e.g. 9pm-10pm). During that hour: read, study, walk, or just sit. The goal is to prove to yourself that you can exist without it.\n\nStart with one hour. If that feels easy, extend to two.'},

  {id:'d11',t:1, name:'Log today\'s expenses in Calendar', sub:'Money', stat:'money', xp:5,
   guide:'Every pound you spent today. Open the Money Expenses Calendar and log what, how much, and the category.\n\nAwareness creates financial control. If you spent 0 today, log 0.01 with note "Zero spend".'},

  {id:'d27',t:1, name:'One money action \u2014 15 min', sub:'Money', stat:'money', xp:8,
   guide:'YOUR WEAKEST DOMAIN. Money is at Level 1. That gap is the whole reason you are not stable yet.\n\nThis mission forces one concrete income action:\n\n• Message 1 local business offering a Meta Ads audit or CAPI setup.\n• Submit 1 customized freelance proposal on Mostaql or Upwork.\n• Check job openings on LinkedIn/Wuzzuf and prepare 1 tailored application.\n• Take 1 tangible action to move your financial runway forward.'},

  {id:'d7', t:1, name:'30 minutes of reading',      sub:'Self-Development', stat:'selfdev', xp:5,
   guide:'Aim for 10 pages. Read in English when you can \u2014 it compounds with your writing work.\n\nCheck the Library tab for verified books: As a Man Thinketh, The Richest Man in Babylon, Meditations, and marketing textbooks.'},

  {id:'d21',t:1, name:'Practice a skill for 20 min', sub:'Skills', stat:'skills', xp:8,
   guide:'Spend 20 uninterrupted minutes on ONE skill: touch typing, Excel formulas, presentation design, or CAPI integration.'},

  {id:'d22',t:1, name:'Plan tomorrow\'s top 3', sub:'Discipline', stat:null, xp:2,
   guide:'Before sleeping, write down the 3 most important things to do tomorrow. Clear priorities eliminate morning hesitation.'},

  {id:'d24',t:1, name:'Course work \u2014 20 min', sub:'Self-Development', stat:'selfdev', xp:10,
   guide:'Open the Course Track tab and work on ONE module from Google Ads, GA4, or Meta Media Buying certification tracks.'},

  /* ---------- THEMATIC DAILY ROTATIONS (One dynamic focus per day of week) ---------- */
  {id:'d13',t:1, name:'Sunday: Egypt & Gulf Market Study — 20 min', sub:'Career', stat:'career', xp:10, rotDay:0,
   guide:'SUNDAY FOCUS: Market Intelligence.\n\n• Search Wuzzuf, LinkedIn Jobs, and Bayt for "Media Buyer" and "Performance Marketer" in Egypt and Saudi Arabia.\n• Note salary ranges in EGP / SAR.\n• Identify in-demand keywords (CAPI, ROAS, Advantage+, GA4).\n• Note one gap in your CV to target this week.'},

  {id:'d16',t:1, name:'Monday: Technical Tracking & Course Module', sub:'Skills', stat:'skills', xp:12, rotDay:1,
   guide:'MONDAY FOCUS: Technical Ad Mastery.\n\n• Spend 25 uninterrupted minutes studying Meta Conversions API (CAPI), Pixel deduplication, or Google Ads Search.\n• Complete one quiz or hands-on setup step in the Course Track.\n• High technical competency commands Gulf compensation.'},

  {id:'d14',t:1, name:'Tuesday: English Interview Answers Out Loud', sub:'Career', stat:'career', xp:10, rotDay:2,
   guide:'TUESDAY FOCUS: Spoken Pitch Fluency.\n\n• Practise out loud: "Tell me about yourself and your track record."\n• Speak with conviction in English: 27 programs managed, 11,406 leads, TL 15.06 blended CPL.\n• Record 90 seconds, listen back, and eliminate pauses.'},

  {id:'d12',t:1, name:'Wednesday: Direct Income Action (100 EGP Test)', sub:'Money', stat:'money', xp:10, rotDay:3,
   guide:'WEDNESDAY FOCUS: Monetization Action.\n\n• Find ONE realistic way to bring in income: pitch a paid audit, bid on a Mostaql gig, or sell a tailored service.\n• Send the message or submit the proposal today.\n• Proving you can generate income breaks financial paralysis.'},

  {id:'d26',t:1, name:'Thursday: High-Value Professional Outreach', sub:'Relationships', stat:'relations', xp:8, rotDay:4,
   guide:'THURSDAY FOCUS: Network Expansion.\n\n• Have ONE real professional conversation today: call or voice-note a fellow marketer, mentor, or family member.\n• Engage meaningfully on a post by a senior Gulf agency director or media buyer.\n• Genuine professional relationships unlock unadvertised Gulf opportunities.'},

  {id:'d15',t:1, name:'Friday: English Speaking Fluency Drill — 15 min', sub:'Self-Development', stat:'selfdev', xp:10, rotDay:5,
   guide:'FRIDAY FOCUS: Spoken Fluency & Jumu\'ah Reflection.\n\n• Speak English out loud for 15 minutes: discuss a marketing campaign, summarize a podcast, or talk with an AI voice tutor.\n• Pray Jumu\'ah on time and reflect on your week\'s consistency.'},

  {id:'d17',t:1, name:'Saturday: Content Creation & Portfolio Proof', sub:'Career', stat:'career', xp:10, rotDay:6,
   guide:'SATURDAY FOCUS: Authority & Social Proof.\n\n• Publish 1 short LinkedIn post or add 1 screenshot proof to your portfolio.\n• Share a lesson from your 27 campaigns or how you dropped CPL from 130 to 50.\n• Proof in public builds inbound opportunities.'}
];

/* ---------------------------------------------------------------
   WEEKLY MISSIONS
   Core Weekly Anchors + 4 Evolving Rotational Cycles
   --------------------------------------------------------------- */
const WEEKLY_THEMES = [
  { id: 0, name: 'Proof & Case Studies Evolution', nameAr: 'المرحلة الأولى: هندسة دراسات الحالة والإثبات الرقمي' },
  { id: 1, name: 'Technical Tracking & Conversion Architecture', nameAr: 'المرحلة الثانية: البنية التحتية للتتبع و Conversions API' },
  { id: 2, name: 'Direct Revenue & Market Pitch Execution', nameAr: 'المرحلة الثالثة: العروض المباشرة وتحصيل الدخل المستقل' },
  { id: 3, name: 'Creative Automation & ATS Optimization', nameAr: 'المرحلة الرابعة: الأتمتة الإبداعية وتجهيز السيرة للخليج' }
];

const WEEKLY = [
  /* ---------- CORE WEEKLY ANCHORS (Active every week) ---------- */
  {id:'w7', t:1, name:'Weekly Strategic Review — Sunday', sub:'System', stat:'selfdev', xp:35, unlock:null, cycle:null,
   guide:'Fifteen minutes, every Sunday, 5 non-negotiable questions:\n\n1. How many missions did I complete this week?\n2. What tangible progress was made toward Saudi Arabia?\n3. What failed or stalled, and why — honestly?\n4. What is the ONE single priority that matters most next week?\n5. What specific behavior or system am I changing?\n\nWrite the answers down in your reflections.'},

  {id:'w_audit', t:1, name:'7-Day Expense Audit & Budget Leak Check', sub:'Money', stat:'money', xp:30, unlock:null, cycle:null,
   guide:'Open the Money Expenses Calendar and review every single pound spent over the past 7 days.\n\n• Calculate your total spend for the week.\n• Identify at least ONE unnecessary expense leak.\n• Check your remaining Runway toward the 120,000 EGP Saudi emergency fund.\n\nFinancial discipline creates the runway for your move.'},

  {id:'w_eng', t:1, name:'English Writing Benchmark — 2 Submissions', sub:'Self-Development', stat:'selfdev', xp:40, unlock:null, cycle:null,
   guide:'Complete at least TWO full writing submissions on writeandimprove.com (B2 level).\n\n• Focus on eliminating repetitive grammar errors.\n• Note your CEFR score improvement.\n• Writing is your ONLY sub-B1 skill (currently at 33 A2). This weekly drill pushes you directly toward 43+ to achieve B2 overall.'},

  /* ---------- CYCLE 0: Proof & Case Studies Evolution ---------- */
  {id:'w1', t:1, name:'Publish 1 breakdown case study on LinkedIn', sub:'Career', stat:'career', xp:35, unlock:null, cycle:0,
   guide:'Publish a real campaign recovery breakdown: hook → problem → solution → quantifiable result (e.g. CPL 130.62 to 50.79 or 1,544 leads at TL 4.62). Real numbers attract serious Gulf recruiters.'},

  {id:'w5', t:1, name:'Update portfolio slide with verifiable proof', sub:'Career', stat:'career', xp:30, unlock:null, cycle:0,
   guide:'Add verifiable Ads Manager proof to your portfolio: campaign dashboard screenshot, CPL curve, audience segmentation.'},

  {id:'w_cyc0_3', t:1, name:'Audit 2 competitor ad campaigns in Egypt/KSA', sub:'Skills', stat:'skills', xp:25, unlock:null, cycle:0,
   guide:'Analyze 2 active campaigns in the Meta Ad Library. Note hook angles, creative formats, and offer structures.'},

  {id:'w2', t:1, name:'Reach out to 1 senior media buyer or agency lead', sub:'Relationships', stat:'relations', xp:25, unlock:null, cycle:0,
   guide:'Send a respectful, specific message to a working Gulf or Egypt media buyer. Ask one actionable question about regional campaign challenges.'},

  /* ---------- CYCLE 1: Technical Tracking & Conversion Architecture ---------- */
  {id:'w_cyc1_1', t:1, name:'Meta CAPI & Pixel Event Match Quality audit', sub:'Skills', stat:'skills', xp:40, unlock:null, cycle:1,
   guide:'Inspect Meta Events Manager. Verify Conversions API server-side events, check event deduplication, and ensure Event Match Quality (EMQ) is 7.0 or higher.'},

  {id:'w_cyc1_2', t:1, name:'Build / audit campaign UTM taxonomy sheet', sub:'Skills', stat:'skills', xp:30, unlock:null, cycle:1,
   guide:'Create a structured UTM naming convention sheet for source, medium, campaign, content, and term across Meta and Google.'},

  {id:'w_cyc1_3', t:1, name:'Complete 1 high-value certification module', sub:'Self-Development', stat:'selfdev', xp:30, unlock:null, cycle:1,
   guide:'Complete 1 full module from Google Ads Search, GA4, or Meta Media Buying certification tracks.'},

  {id:'w8', t:1, name:'Send 5 tailored performance marketing applications', sub:'Career', stat:'career', xp:35, unlock:null, cycle:1,
   guide:'Send 5 real, customized applications via Wuzzuf, LinkedIn, or Gulf portals. Tailor the opening pitch to the company requirements.'},

  /* ---------- CYCLE 2: Direct Revenue & Market Pitch Execution ---------- */
  {id:'w9', t:1, name:'Pitch 1 paid audit offer to a local business', sub:'Money', stat:'money', xp:45, unlock:null, cycle:2,
   guide:'Contact 1 local business or e-commerce brand offering a paid Meta Ads account audit with concrete optimization opportunities.'},

  {id:'w_cyc2_2', t:1, name:'Submit 2 customized proposals on Mostaql / Upwork', sub:'Money', stat:'money', xp:35, unlock:null, cycle:2,
   guide:'Submit 2 well-crafted freelance proposals. Quote a specific timeline, clear deliverables, and highlight relevant past results.'},

  {id:'w6', t:1, name:'Deep research on 2 top Saudi marketing agencies', sub:'Career', stat:'career', xp:30, unlock:null, cycle:2,
   guide:'Research 2 marketing agencies in Riyadh or Jeddah: client roster, recent campaigns, leadership team, and current hiring needs.'},

  {id:'w_cyc2_4', t:1, name:'Mock interview technical pitch drill (Spoken English)', sub:'Career', stat:'career', xp:30, unlock:null, cycle:2,
   guide:'Record yourself answering: "Walk me through your campaign management process and how you optimized CPL from 130 to 50." Listen back and refine.'},

  /* ---------- CYCLE 3: Creative Automation & ATS Optimization ---------- */
  {id:'w_cyc3_1', t:1, name:'Produce 1 AI video ad variant in CapCut', sub:'Skills', stat:'skills', xp:35, unlock:null, cycle:3,
   guide:'Combine direct-response script, synthetic voiceover, dynamic auto-captions, and B-roll to create a high-converting 9:16 video ad.'},

  {id:'w_cyc3_2', t:1, name:'Audit CV for Gulf ATS keywords & Riyadh readiness', sub:'Career', stat:'career', xp:30, unlock:null, cycle:3,
   guide:'Review your English CV against Gulf ATS standards: ensure quantifiable metrics, CAPI expertise, and clear readiness for relocation to Saudi Arabia.'},

  {id:'w_cyc3_3', t:1, name:'Build 1 marketing automation workflow (Make / n8n)', sub:'Skills', stat:'skills', xp:35, unlock:null, cycle:3,
   guide:'Create an automated workflow connecting Meta Lead Ads to Google Sheets or CRM with instant notification routing.'},

  {id:'w3', t:1, name:'Call family or meet a friend', sub:'Relationships', stat:'relations', xp:25, unlock:null, cycle:3,
   guide:'A real conversation, not a text. Call your parents. Meet a friend. Sustained progress requires emotional groundedness.'},

  /* ---------- LEGACY PRESERVATION ---------- */
  {id:'w4', t:1, name:'Summarise a book or chapter', sub:'Self-Development', stat:'selfdev', xp:25, unlock:null, cycle:null,
   guide:'Five bullet points on what you read this week, in your own words. Turn those bullets into a LinkedIn post to clear two missions at once.'}
];

/* ---------------------------------------------------------------
   WEEKLY RAID BOSSES (Dynamic Dungeon Gates evolving each week)
   --------------------------------------------------------------- */
const WEEKLY_RAID_BOSSES = [
  {
    id: 'wb1',
    rank: 'B-RANK GATE',
    name: 'Gate of Chaos: Procrastination Monarch',
    titleAr: 'منجم التسويف ومشتتات التركيز (مالاكور)',
    hp: 1000,
    avatar: 'assets/shadows/iron.png',
    lore: 'وحش التسويف يتغذى على تأجيل المهام وتجاهل مراجعة المصروفات. القضاء عليه يفتح تدفق الإنتاجية الصافية.',
    reward: 350,
    phases: [
      { text: 'تسجيل المصروفات يومياً لمدة 5 أيام دون انقطاع (Zero unlogged expenses)', dmg: 250, xp: 75 },
      { text: 'الالتزام بصلاة الفجر في وقتها 7 أيام متتالية (Morning Anchor)', dmg: 250, xp: 75 },
      { text: 'إتمام 5 جلسات كتابة إنجليزية على Write & Improve (كسر حاجز 33 A2)', dmg: 250, xp: 75 },
      { text: 'إنجاز 100% من مهام الأسبوع الأساسية قبل ريسيت الجمعة', dmg: 250, xp: 75 }
    ]
  },
  {
    id: 'wb2',
    rank: 'A-RANK GATE',
    name: 'Gate of Fog: The CAPI Archon',
    titleAr: 'حارس بيانات التتبع والتحويلات الرقمية',
    hp: 1200,
    avatar: 'assets/shadows/tank.png',
    lore: 'حارس غامض يختبر دقتك الهندسية في ربط Meta Conversions API وتتبع الأحداث بدقة تتجاوز 7.0 EMQ.',
    reward: 400,
    phases: [
      { text: 'التحقق من تتبع Meta Pixel و CAPI واختبار Deduplication في Events Manager', dmg: 300, xp: 75 },
      { text: 'مراجعة وتوثيق أحداث التحويل المخصصة (Custom Events) في GA4', dmg: 300, xp: 75 },
      { text: 'بناء شيت متكامل لتوزيع الميزانيات وتوقع الـ CPL و ROAS لكل حملة', dmg: 300, xp: 75 },
      { text: 'نشر دراسة حالة فنية حول حل مشكلات التتبع في الإعلانات الخليجية', dmg: 300, xp: 75 }
    ]
  },
  {
    id: 'wb3',
    rank: 'A-RANK GATE',
    name: 'Gate of Ice: The ATS Dreadnought',
    titleAr: 'فلتر التوظيف الخليجي الصارم (الروبوت الأوتوماتيكي)',
    hp: 1200,
    avatar: 'assets/shadows/tusk.png',
    lore: 'درع رقمي متجمد يستبعد السير الذاتية الضعيفة. يجب أن تثبت جاهزية سيرتك لاختراق أنظمة الفرز في الرياض.',
    reward: 450,
    phases: [
      { text: 'تحديث الـ CV الإنجليزي ومطابقته لكلمات ATS في 3 وظائف بالرياض', dmg: 300, xp: 75 },
      { text: 'إرسال 5 تقديمات مباشرة ومخصصة لشركات ووكالات تسويق في السعودية', dmg: 300, xp: 75 },
      { text: 'ممارسة 3 إجابات للمقابلات باللغة الإنجليزية بصوت عالٍ وتسجيلها', dmg: 300, xp: 75 },
      { text: 'التفاعل وبناء تواصل احترافي مع 3 مديري تسويق خليجيين على LinkedIn', dmg: 300, xp: 75 }
    ]
  },
  {
    id: 'wb4',
    rank: 'S-RANK GATE',
    name: 'Gate of Shadows: The Zero-Income Beast',
    titleAr: 'وحش الركود المالي والمبيعات الصفرية',
    hp: 1500,
    avatar: 'assets/shadows/beru.png',
    lore: 'وحش شرس يحبس قدرتك على تحقيق دخل مستقل. الحل الوحيد هو تقديم عروض حقيقية وجلب أول تدفق مالي.',
    reward: 500,
    phases: [
      { text: 'صياغة وإرسال 3 عروض مراجعة إعلانات (Meta Audit) لبيزنس محلي', dmg: 375, xp: 75 },
      { text: 'نشر خدمة متخصصة واحدة على موقع مستقل أو خمسات مع نماذج سابقة', dmg: 375, xp: 75 },
      { text: 'تحصيل 100 جنيه أو أكثر من أي عمل حر أو استشارة إعلانية سريعة', dmg: 375, xp: 75 },
      { text: 'حساب ميزانية مدرج الطوارئ (Runway) ومصروفات الشهر بدقة في الكالندر', dmg: 375, xp: 75 }
    ]
  },
  {
    id: 'wb5',
    rank: 'A-RANK GATE',
    name: 'Gate of Fire: The Creative Wyrm',
    titleAr: 'تنين التكرار الإعلاني وضعف الابتكار',
    hp: 1200,
    avatar: 'assets/shadows/kaisel.png',
    lore: 'تنين ناري يحرق الميزانيات بالإعلانات التقليدية. التغلب عليه يتطلب زوايا إبداعية مبتكرة وفيديوهات UGC قوية.',
    reward: 400,
    phases: [
      { text: 'كتابة 3 سكريبتات إعلانية بزوايا مختلفة (ألم مباشر، إثبات اجتماعي، عرض محدود)', dmg: 300, xp: 75 },
      { text: 'مونتاج فيديو إعلاني قصير كامل على CapCut مع ترجمة ديناميكية وتأثيرات', dmg: 300, xp: 75 },
      { text: 'تحليل 5 إعلانات ناجحة للمنافسين في مكتبة إعلانات Meta في السوق السعودي', dmg: 300, xp: 75 },
      { text: 'تصميم قالبين كاروسيل (Carousel) تفاعلية قابلة للنشر على Canva Pro', dmg: 300, xp: 75 }
    ]
  },
  {
    id: 'wb6',
    rank: 'S-RANK GATE',
    name: 'Gate of Iron: The Sovereign\'s Discipline',
    titleAr: 'محاكمة السيادة والانضباط الذاتي المطلق',
    hp: 1500,
    avatar: 'assets/shadows/bellion.png',
    lore: 'الاختبار الأسمى لمن يريد حكم جيش الظلال. لا مجال للأعذار: انضباط بدني، ذهني، ومالي كامل.',
    reward: 500,
    phases: [
      { text: 'الالتزام التام بالتمارين المنزلية (4 من 4 جلسات) دون أي تفويت', dmg: 375, xp: 75 },
      { text: 'شرب 2 لتر ماء يومياً لمدة 7 أيام متتالية (تحسين الهيدريشن)', dmg: 375, xp: 75 },
      { text: 'الالتزام بـ 30 دقيقة بدون هاتف بعد الاستيقاظ وقبل النوم طوال الأسبوع', dmg: 375, xp: 75 },
      { text: 'تحقيق معدل إنجاز 100% في جميع المهام الأسبوعية النشطة', dmg: 375, xp: 75 }
    ]
  }
];

/* ---------------------------------------------------------------
   GRAND CAMPAIGN RAIDS — SAUDI ARABIA 2027
   xp     = XP awarded PER STEP (visible before you start)
   reward = what clearing the whole raid gives you on top
   --------------------------------------------------------------- */
const BOSSES = [
  {id:'b1', name:'Proof & Portfolio Architect', desc:'THE FOUNDATION. Build verifiable case studies with real campaign figures (27 programs, 11,406 leads, CPL drop 130 to 50).', xp:150, reward:1500,
   steps:[
     'Rebuild the CV \u2014 English, one page, results with numbers (27 campaigns, 11,400 leads)',
     'Build a portfolio that proves the work with Ads Manager screenshots',
     'Rewrite the LinkedIn profile: headline, about, featured proof',
     'Get the CV reviewed by a working media buyer in Egypt or KSA',
     'Set alerts on LinkedIn and Wuzzuf for "Media Buyer" and "Performance Marketer"',
     'Apply to 20 targeted roles with customized pitches',
     'Apply to 50 targeted roles',
     'Complete 3 mock technical interviews out loud',
     'Reach a final-stage interview with agency leadership',
     'Sign the offer \u2014 establish income stability while preparing Saudi runway']},

  {id:'b2', name:'Reach English B2 & Writing Mastery', desc:'Listening C1 \u00b7 Speaking 50 \u00b7 Reading 48 \u00b7 Writing 33. Writing is the whole gap.', xp:100, reward:1200,
   steps:[
     'Baseline recorded: EF SET 4-skill = 49 (Listening 63, Speaking 50, Reading 48, Writing 33)',
     'Write 30 pieces on Write & Improve and act on every correction',
     'Cut the top 5 grammar errors you repeat \u2014 diagnosed from your own writing',
     'Raise writing from 33 to 43',
     'Raise reading from 48 to 51',
     'Retake the EF SET and cross 51 overall (Achieve Verified B2)']},

  {id:'b3', name:'Clear the Certification Stack & Technical CAPI', desc:'Every high-leverage credential and tracking skill that separates you from ordinary media buyers.', xp:90, reward:1000,
   steps:[
     'Google Ads Search Certification',
     'Google Analytics 4 Certification',
     'TikTok Media Buying Certification',
     'Snapchat Ads Certification',
     'Meta Media Buying study guide completed',
     'HubSpot Digital Advertising Certification',
     'Master Meta Conversions API (CAPI) & Event Match Quality 7.0+']},

  {id:'b4', name:'High-Ticket Saudi Interview Clearance', desc:'The interview clearance raid: passing technical, case-study, and situational interviews with Saudi marketing leadership.', xp:175, reward:2000,
   steps:[
     'Complete deep research on top 10 marketing agencies in Riyadh and Jeddah',
     'Adapt CV to Gulf ATS specifications (no photo, quantifiable ROAS, Riyadh relocation ready)',
     'Master out-loud English presentation of the 130 to 50 CPL recovery case study',
     'Connect directly with 15 marketing directors and agency owners in Saudi Arabia',
     'Pass initial HR screening interview with a Saudi recruiter',
     'Pass comprehensive technical case study assessment',
     'Pass executive interview with managing director or VP',
     'Receive formal written offer letter for a performance marketing role in KSA']},

  {id:'b5', name:'Relocation Runway 120K EGP & Visa Clearance', desc:'Final strategic gate: 120,000 EGP emergency fund saved, medical and visa cleared, landing in Riyadh.', xp:200, reward:2500,
   steps:[
     'Save 30,000 EGP toward relocation runway fund',
     'Save 60,000 EGP toward relocation runway fund',
     'Save 120,000 EGP full emergency 6-month safety runway',
     'Passport and official documentation verified (valid 12+ months)',
     'Complete Saudi medical check and document attestation',
     'Sign employment contract and secure Saudi work visa',
     'Book flight and land in Riyadh — Mission Accomplished']}
];

/* ---------------------------------------------------------------
   HUNTER RANKS
   --------------------------------------------------------------- */
const RANKS = [
  {name:'E-RANK HUNTER', xp:0,       note:'Foundation Stage (Day 1-30). Overcoming inertia and establishing daily discipline.'},
  {name:'D-RANK HUNTER', xp:5000,    note:'Awakened Operator (Months 2-4). Habit locked in; execution driven by systems, not fleeting mood.'},
  {name:'C-RANK HUNTER', xp:25000,   note:'Proven Specialist (~Year 1). Verified case studies, ATS English CV, and automated lead generation engines.'},
  {name:'B-RANK HUNTER', xp:75000,   note:'Senior Regional Operator (~Years 2-3). Authority hire in Riyadh or Dubai commanding premium compensation.'},
  {name:'A-RANK HUNTER', xp:180000,  note:'Enterprise Marketing Director (~Years 4-5). High-impact media architect managing multi-million budgets.'},
  {name:'S-RANK HUNTER', xp:450000,  note:'The Shadow Monarch (~6+ Years of Daily Commitment). Sovereign mastery over career, health, mind, and wealth.'},
  {name:'NATIONAL LEVEL HUNTER', xp:1000000, note:'The Sovereign (Decade of Mastery). Transcended all mortal hunter limitations.'}
];

/* ---------------------------------------------------------------
   HONEST ASSESSMENT — shown in Status. No flattery.
   --------------------------------------------------------------- */
const ASSESSMENT = [
  {title:'What is genuinely strong',
   body:'You are not a beginner pretending to be experienced \u2014 you are experienced and underselling it. TL 171,000 managed, 11,406 leads, 27 concurrent programs, and a documented CPL recovery from 130.62 to 50.79. Most people applying for media buyer roles in Egypt cannot show a recovery case study. You can. Your CV and portfolio are already better than the average applicant\'s.'},
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
  "You asked for a job in Egypt. So why are you on your phone?",
  "The daily quest is not optional. Ask anyone who ignored it.",
  "One more day of discipline and you are stronger than yesterday's version of you.",
  "Motivation is a visitor. Discipline lives here.",
  "You have quit things before. Not this one.",

  /* --- about the long game --- */
  "You are not behind. You are early in a very long game.",
  "The version of you that gets hired is built by the version of you that studies tonight.",
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
  "Someone in Cairo is doing the job you want right now. Why not you?",

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

/* ---------------------------------------------------------------------
   EVENT PHRASES \u2014 Jin-Woo reacts to what just happened.
   Each event has multiple lines; one is picked at random.
   --------------------------------------------------------------------- */
const EVENT_PHRASES = {
  missionDone: [
    "One step closer. The System is watching.",
    "That is how it is done. Again.",
    "You are building something real, one mission at a time.",
    "Discipline is compounding. Keep going.",
    "The weakest hunter just got stronger.",
    "That mission did not complete itself. You did it.",
    "Every cleared mission is a brick in your future.",
    "You are not the same person you were yesterday.",
    "The System acknowledges your effort.",
    "Small wins, big future.",
    "That is the spirit. Next one.",
    "You are proving something to yourself right now.",
    "The gap between you and your goal just got smaller.",
    "Consistency is your superpower.",
    "One more step on the road to your goal.",
    "You are becoming the hunter you were meant to be.",
    "That mission is now part of your story.",
    "The System sees your dedication.",
    "You are building habits that will outlast motivation.",
    "Every mission cleared is evidence of who you are becoming."
  ],
  missionUnchecked: [
    "You undid progress. The System does not forget.",
    "That mission was yours. Now it is not.",
    "Be careful \u2014 every uncheck is a step back.",
    "The System records everything.",
    "You are stronger than this setback.",
    "Do not make unchecking a habit.",
    "That XP was earned. Now it is gone.",
    "The road back is always open. Take it."
  ],
  levelUp: [
    "LEVEL UP. The System recognizes your growth.",
    "You are no longer the hunter you were.",
    "New power. New responsibility.",
    "The System has raised your rank.",
    "You are climbing. Keep climbing.",
    "That level was earned, not given.",
    "The gap between you and your goal just got smaller.",
    "You are becoming dangerous to your own excuses.",
    "The System acknowledges your evolution.",
    "Higher level. Higher stakes. Higher rewards."
  ],
  rankUp: [
    "RANK UP. You have entered a new tier of hunters.",
    "The System has judged you worthy.",
    "Your rank now reflects your discipline.",
    "You are no longer an E-Rank hunter.",
    "The System bows to your growth.",
    "A new rank. A new chapter.",
    "You have proven yourself to the System.",
    "The hunter you were would be proud of the hunter you are."
  ],
  bossStep: [
    "The raid grows weaker. You grow stronger.",
    "One step closer to victory.",
    "The boss is falling. Keep pushing.",
    "Your raid progress is undeniable.",
    "The System sees your determination.",
    "That step was earned through discipline.",
    "The boss cannot withstand your resolve.",
    "You are carving your path through the raid.",
    "Every step brings you closer to the kill.",
    "The System acknowledges your raid progress."
  ],
  bossComplete: [
    "BOSS CLEARED. The System is impressed.",
    "You have slain what once seemed impossible.",
    "The raid is yours. The spoils are yours.",
    "The System bows to your victory.",
    "That boss was strong. You were stronger.",
    "You have proven yourself a true hunter.",
    "The System acknowledges your triumph.",
    "A boss falls. A hunter rises.",
    "You are becoming the stuff of legends.",
    "The System will remember this victory."
  ],
  courseDone: [
    "Knowledge acquired. The System grows stronger.",
    "You are investing in yourself. That is the highest return.",
    "That course is now part of your arsenal.",
    "The System acknowledges your commitment to growth.",
    "You are building skills that will outlast trends.",
    "Education is the weapon that never dulls.",
    "You are becoming more dangerous to your competition.",
    "The System sees your dedication to mastery.",
    "That knowledge is now yours forever.",
    "You are compounding your advantages."
  ],
  streakUp: [
    "The streak grows. So do you.",
    "Consistency is your weapon.",
    "The System acknowledges your discipline.",
    "You are building an unbreakable chain.",
    "Every day is a deposit in your future.",
    "The streak is evidence of your character.",
    "You are proving that you can be trusted with yourself.",
    "The System sees your commitment.",
    "You are becoming the kind of person who does not quit.",
    "The streak is not a number. It is who you are."
  ],
  streakLost: [
    "The streak is broken. But you are not.",
    "One loss does not define you. Your response does.",
    "The System does not judge you by your falls.",
    "Get up. The next streak starts now.",
    "You have had 434-day streaks. You know how to do this.",
    "The System believes in your comeback.",
    "A streak lost is a lesson learned.",
    "The next streak starts with the next mission.",
    "You are not your streak. You are your discipline.",
    "The System waits for your return."
  ],
  eggOpened: [
    "A new shadow joins your army.",
    "The System has chosen a companion for you.",
    "Your shadow army grows stronger.",
    "The egg has revealed its secret.",
    "You are building an army of shadows.",
    "The System acknowledges your growing power.",
    "A new ally. A new strength.",
    "Your collection grows. So does your power.",
    "The System has blessed your hunt.",
    "Another shadow bows to you."
  ],
  vocabLearned: [
    "A new word is now yours.",
    "Your vocabulary grows. So does your power.",
    "The System acknowledges your linguistic growth.",
    "Words are weapons. You just acquired one more.",
    "You are becoming more articulate.",
    "The System sees your dedication to mastery.",
    "That word is now part of your arsenal.",
    "You are building a vocabulary that opens doors.",
    "The System acknowledges your progress.",
    "Every word learned is a step toward fluency."
  ],
  perfectDay: [
    "PERFECT DAY. The System is watching.",
    "You have cleared every mission. This is excellence.",
    "The System acknowledges your perfection.",
    "This is what discipline looks like.",
    "You are becoming unstoppable.",
    "The System bows to your dedication.",
    "A perfect day. A perfect hunter.",
    "You have proven that you can do this.",
    "The System will remember this day.",
    "Perfection is not an accident. It is a habit."
  ],
  freezeUsed: [
    "The freeze has been spent. The streak survives.",
    "The System acknowledges your wisdom in saving the freeze.",
    "A freeze well spent. The streak continues.",
    "You have protected your progress.",
    "The System sees your strategic thinking.",
    "The streak lives on. So does your discipline.",
    "A small price for preserving your progress.",
    "The System acknowledges your sacrifice.",
    "The freeze has done its job.",
    "You are still in the game."
  ],
  prestige: [
    "PRESTIGE. You have awakened again.",
    "The System recognizes your transcendence.",
    "You have reset and grown stronger.",
    "The System bows to your evolution.",
    "A new beginning. A stronger hunter.",
    "You have proven that you can always grow.",
    "The System acknowledges your rebirth.",
    "You are no longer the hunter you were.",
    "The System has raised your multiplier.",
    "You are becoming the legend you were meant to be."
  ],
  paused: [
    "The System is paused. Rest well.",
    "Even hunters need rest. The System understands.",
    "The pause is wisdom, not weakness.",
    "The System will wait for your return.",
    "Rest. Recover. Return stronger.",
    "The System acknowledges your need for balance.",
    "A paused hunter is still a hunter.",
    "The System respects your boundaries.",
    "Take the time you need. The System will be here.",
    "Rest is part of the grind."
  ],
  unpaused: [
    "The System awakens. Welcome back.",
    "You have returned. The System is ready.",
    "The pause is over. The grind resumes.",
    "The System acknowledges your return.",
    "Welcome back, hunter. The System missed you.",
    "The System is active once more.",
    "You are back. The System is watching.",
    "The System has resumed its judgment.",
    "Welcome back to the grind.",
    "The System is ready to grow with you again."
  ]
};

/* ---------------------------------------------------------------------
   GENERAL MOTIVATION \u2014 100+ lines for random rotation.
   --------------------------------------------------------------------- */
const GENERAL_PHRASES = [
  "The System is always watching.",
  "You are the protagonist of your own story.",
  "Every hunter starts at level 1.",
  "The gap between you and your goal is called discipline.",
  "You are not behind. You are on your own path.",
  "The System does not give up on you. Do not give up on yourself.",
  "Your future self is watching you right now.",
  "The hardest part is starting. You already did that.",
  "You are building something that will outlast this moment.",
  "The System sees your potential.",
  "Discipline is choosing what you want most over what you want now.",
  "You are one mission closer to your goal.",
  "The System believes in your growth.",
  "Every expert was once a beginner who refused to quit.",
  "You are not your excuses. You are your actions.",
  "The System acknowledges your effort today.",
  "Small steps every day add up to massive change.",
  "You are becoming the person you needed when you were younger.",
  "The System is impressed by your consistency.",
  "Your only competition is who you were yesterday.",
  "The System sees you showing up. That is what matters.",
  "You are building habits that will serve you for decades.",
  "The System knows you can do this.",
  "Progress is not linear. Keep going.",
  "You are stronger than your circumstances.",
  "The System is on your side.",
  "Every mission cleared is a vote for the person you are becoming.",
  "You are not alone in this. The System is with you.",
  "The System sees your dedication.",
  "You are writing your own legend.",
  "The System acknowledges your discipline.",
  "Your future is built by what you do today.",
  "The System is watching your growth.",
  "You are capable of more than you know.",
  "The System believes in your potential.",
  "Every day is a new chance to become stronger.",
  "The System sees you pushing forward.",
  "You are the author of your own story.",
  "The System acknowledges your commitment.",
  "Discipline is the bridge between goals and accomplishment.",
  "You are building something meaningful.",
  "The System is impressed by your resolve.",
  "Your effort today is your reward tomorrow.",
  "The System sees your determination.",
  "You are becoming unstoppable.",
  "The System acknowledges your perseverance.",
  "Every step forward is a step away from who you were.",
  "The System is rooting for you.",
  "You are proof that discipline beats talent.",
  "The System sees your growth mindset.",
  "Your consistency is your superpower.",
  "The System acknowledges your hard work.",
  "You are building a future worth fighting for.",
  "The System is watching you become great.",
  "Every mission is a deposit in your future.",
  "The System sees your unwavering focus.",
  "You are the hunter the System chose for a reason.",
  "The System acknowledges your dedication to growth.",
  "Your discipline today is your freedom tomorrow.",
  "The System sees you leveling up.",
  "You are becoming the best version of yourself.",
  "The System is proud of your progress.",
  "Every cleared mission is evidence of your character.",
  "The System sees your relentless pursuit of excellence.",
  "You are building a legacy of discipline.",
  "The System acknowledges your commitment to mastery.",
  "Your future self will thank you for today.",
  "The System sees you refusing to quit.",
  "You are the hunter who never gives up.",
  "The System acknowledges your unwavering spirit.",
  "Every day you show up is a victory.",
  "The System sees your dedication to becoming more.",
  "You are proof that consistency conquers all.",
  "The System is watching your transformation.",
  "Your discipline is your greatest weapon.",
  "The System acknowledges your refusal to settle.",
  "You are becoming the hunter you were meant to be.",
  "The System sees your commitment to growth.",
  "Every mission cleared is a step toward your destiny.",
  "The System is impressed by your dedication.",
  "You are building a future that others will admire.",
  "The System acknowledges your relentless effort.",
  "Your consistency is rewriting your story.",
  "The System sees you becoming unstoppable.",
  "You are the hunter who rises every time.",
  "The System acknowledges your unwavering dedication.",
  "Every day is a new opportunity to grow.",
  "The System sees your commitment to excellence.",
  "You are becoming the legend of your own life.",
  "The System is watching your evolution.",
  "Your discipline is your path to greatness.",
  "The System acknowledges your dedication to mastery.",
  "You are building something that will last forever.",
  "The System sees your relentless pursuit of growth.",
  "Every mission is a brick in your future.",
  "The System is impressed by your unwavering focus.",
  "You are becoming the hunter the System always knew you could be.",
  "The System acknowledges your commitment to becoming more.",
  "Your consistency is your greatest strength.",
  "The System sees you leveling up every day."
];

const GUIDE_BY_TIER = {
  1: "Foundation tier. Fajr, water, fifteen minutes of movement, thirty minutes of English, no phone in the morning. Small things, done daily.",
  2: "Hunting tier. Money starts moving and the Egypt market research begins. You are building leverage now, not just habits.",
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
     why:'The best book ever written on the basics: pay yourself first, live below your means, make money work. Told as short parables set in ancient Babylon. This is where your EGYPT FUND comes from.',
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
     why:'Directly targets your weakest skill. How to write reports, proposals, emails and presentations that get read. Every client report you write runs through this.',
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

  {cat:'Performance Marketing & Media \u2014 Your Field', items:[
    {t:'Influence: The Psychology of Persuasion', a:'Robert Cialdini', yr:1984, mins:240, xp:400,
     why:'The six principles that make people say yes. Every ad you write, every landing page you build, every pitch you make \u2014 this is the psychology underneath all of it. Read the chapters on social proof and scarcity twice.',
     read:'https://www.hindawi.org/books/60214065/', src:'Hindawi'},

    {t:'This Is Marketing', a:'Seth Godin', yr:2018, mins:180, xp:350,
     why:'You are not reaching "everyone". Godin explains positioning, trust and the smallest viable audience. Directly changes how you think about your own personal brand and your agency clients.',
     read:'https://www.hindawi.org/books/71990714/', src:'Hindawi'},

    {t:'Ogilvy on Advertising', a:'David Ogilvy', yr:1983, mins:300, xp:450,
     why:'The classic. Headlines, research, how to brief a creative, how to sell. Old but nothing has replaced it. Every rule in modern performance creative traces back to this book.',
     read:'https://www.hindawi.org/books/60629290/', src:'Hindawi'},

    {t:'The 22 Immutable Laws of Marketing', a:'Al Ries & Jack Trout', yr:1993, mins:150, xp:300,
     why:'Short, sharp, and mostly right. The laws of positioning and category. When you launch the agency this is the framework for deciding what you actually sell.',
     read:'https://www.hindawi.org/books/63377176/', src:'Hindawi'}
  ]},

  {cat:'English Novels \u2014 Learn the Language by Reading', items:[
    {t:'The Great Gatsby', a:'F. Scott Fitzgerald', yr:1925, mins:120, xp:250,
     why:'Short, beautiful, and written in clear modern English. The best first novel for a B1/B2 reader. Finish it in a week at 20 pages a day.',
     read:'https://www.gutenberg.org/ebooks/64317', src:'Project Gutenberg'},

    {t:'Animal Farm', a:'George Orwell', yr:1945, mins:120, xp:250,
     why:'Orwell wrote it in deliberately simple English \u2014 every sentence short and clear. Perfect for you. Also teaches you how persuasion works, which is half of marketing.',
     read:'https://www.gutenberg.org/ebooks/16119', src:'Project Gutenberg'},

    {t:'The Adventures of Sherlock Holmes', a:'Arthur Conan Doyle', yr:1892, mins:240, xp:350,
     why:'Twelve short stories, each self-contained. Natural spoken English, rich vocabulary, and you can stop after any one story. Ideal for reading in the 30-minute reading mission.',
     read:'https://www.gutenberg.org/ebooks/1661', src:'Project Gutenberg'},

    {t:'A Christmas Carol', a:'Charles Dickens', yr:1843, mins:120, xp:250,
     why:'Short, familiar, and written to be read aloud. Great for working on rhythm and pronunciation while you follow the story you already know.',
     read:'https://www.gutenberg.org/ebooks/46', src:'Project Gutenberg'},

    {t:'The Time Machine', a:'H. G. Wells', yr:1895, mins:150, xp:300,
     why:'One of the first science fiction novels ever written. Clear English, short chapters, and genuinely gripping \u2014 you will finish it without noticing you are "studying".',
     read:'https://www.gutenberg.org/ebooks/35', src:'Project Gutenberg'},

    {t:'Frankenstein', a:'Mary Shelley', yr:1818, mins:210, xp:350,
     why:'The book that invented science fiction. Longer sentences than the others here, so it stretches you from B1 toward B2 without feeling like a textbook.',
     read:'https://www.gutenberg.org/ebooks/84', src:'Project Gutenberg'},

    {t:'The Prince', a:'Niccol\u00f2 Machiavelli', yr:1532, mins:150, xp:300,
     why:'Short, direct, and brutally practical about power, negotiation and reputation. Read it alongside the negotiation skill \u2014 it is the same subject written 500 years earlier.',
     read:'https://www.gutenberg.org/ebooks/1232', src:'Project Gutenberg'},

    {t:'Walden', a:'Henry David Thoreau', yr:1854, mins:300, xp:400,
     why:'About choosing deliberately how to live and work. Beautiful, slow, and worth it. Read it when you are tired of self-help and want something real.',
     read:'https://www.gutenberg.org/ebooks/205', src:'Project Gutenberg'}
  ]},

  {cat:'Self-Development \u2014 Discipline & Focus', items:[
    {t:'Atomic Habits', a:'James Clear', yr:2018, mins:210, xp:400,
     why:'The modern version of what you are already doing with the System. Read it and compare his method to yours \u2014 then steal the parts he does better.',
     read:'https://www.hindawi.org/books/68210124/', src:'Hindawi'},

    {t:'Deep Work', a:'Cal Newport', yr:2016, mins:240, xp:400,
     why:'Your attention is the only resource that actually matters. This is the argument for long, undistracted work \u2014 and the case against the phone habits you are fighting.',
     read:'https://www.hindawi.org/books/70711014/', src:'Hindawi'},

    {t:'The War of Art', a:'Steven Pressfield', yr:2002, mins:150, xp:300,
     why:'Short and blunt about the thing that stops you every day: Resistance. The book you read when you have skipped three days in a row.',
     read:'https://www.hindawi.org/books/60502010/', src:'Hindawi'},

    {t:'Mindset', a:'Carol Dweck', yr:2006, mins:210, xp:350,
     why:'Fixed vs growth mindset, explained clearly and with evidence. It changes how you interpret every failure \u2014 including the two months without income.',
     read:'https://www.hindawi.org/books/64256191/', src:'Hindawi'},

    {t:'Grit', a:'Angela Duckworth', yr:2016, mins:240, xp:400,
     why:'Talent is not what wins. Sustained effort is. Read this when your streak feels meaningless and you need the research that proves otherwise.',
     read:'https://www.hindawi.org/books/66787173/', src:'Hindawi'},

    {t:'The Richest Engineer', a:'Abhishek Kumar', yr:2021, mins:180, xp:350,
     why:'Written for people starting from nothing. Income, saving, investing and building skills \u2014 practical and unglamorous in the right way.',
     read:'https://www.hindawi.org/books/74807845/', src:'Hindawi'}
  ]},

  {cat:'Career & Work \u2014 Get Hired and Paid', items:[
    {t:'So Good They Cannot Ignore You', a:'Cal Newport', yr:2012, mins:210, xp:350,
     why:'"Follow your passion" is bad advice. Skills create freedom, not the other way round. Read this before you decide what to specialise in.',
     read:'https://www.hindawi.org/books/68796150/', src:'Hindawi'},

    {t:'Never Split the Difference', a:'Chris Voss', yr:2016, mins:240, xp:400,
     why:'Negotiation from a former FBI hostage negotiator. Tactics, mirroring, calibrated questions. You will use this on your salary, your clients and your rent.',
     read:'https://www.hindawi.org/books/67800266/', src:'Hindawi'},

    {t:'The Lean Startup', a:'Eric Ries', yr:2011, mins:240, xp:400,
     why:'Build, measure, learn. The same loop as a media buyer testing creative \u2014 applied to building a business. Read it before you register the agency.',
     read:'https://www.hindawi.org/books/53608103/', src:'Hindawi'},

    {t:'Crushing It!', a:'Gary Vaynerchuk', yr:2018, mins:180, xp:350,
     why:'Personal brand as a business asset, told by someone who actually built one. Read it for the LinkedIn and content strategy, ignore the volume.',
     read:'https://www.hindawi.org/books/65985016/', src:'Hindawi'},

    {t:'The 4-Hour Workweek', a:'Tim Ferriss', yr:2007, mins:210, xp:350,
     why:'Outsourcing, automation and escaping the location trap. The parts about remote work and freelancing are genuinely useful; the lifestyle parts are not for you.',
     read:'https://www.hindawi.org/books/48847073/', src:'Hindawi'}
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
/* EXTRAS kept for backward compatibility — now empty, all skills are in SKILL_TREE */
const EXTRAS = [];

/* ---------------------------------------------------------------------
   SKILL TREE — ordered by importance, with prerequisites.
   Each skill has: priority (1 = most important), requires (skill keys that
   must be completed first), type (skill or course), and learning links.
   --------------------------------------------------------------------- */
const SKILL_TREE = [
  /* ---- TIER 1: FOUNDATION (no prerequisites) ---- */
  {id:'english_writing', n:'English Writing (B2)', type:'course', priority:1, requires:[],
   target:'EF SET Writing 43+ (currently 33)',
   why:'THE gap. Your writing is A2 while everything else is B1/C1. This is the single highest-return skill for your career \u2014 it unlocks better emails, reports, proposals, and client communication.',
   learn:[
     {n:'Write & Improve (Cambridge) \u2014 YOUR #1 TOOL', u:'https://writeandimprove.com/', w:'Free, from Cambridge. Write a task, get instant feedback, rewrite and resubmit. 15 min/day.'},
     {n:'EF SET quick check (15 min)', u:'https://www.efset.org/quick-check/', w:'Fast 20-question practice test. Use it weekly to track progress.'},
     {n:'British Council level test', u:'https://learnenglish.britishcouncil.org/english-levels/online-english-test', w:'Grammar, vocabulary and phrasing. Use it if W&I feedback is not specific enough.'}
   ]},

  {id:'touch_typing', n:'Touch Typing', type:'skill', priority:2, requires:[],
   target:'60 WPM',
   why:'The highest-return skill on this list. A 1,000-word report takes 40 minutes at 25 WPM and 16 minutes at 60. That is 24 minutes back on every document, forever.',
   learn:[
     {n:'Keybr \u2014 start here (YOUR DAILY TOOL)', u:'https://www.keybr.com/', w:'Adaptive drills. It finds your slow letters and trains them. 20 minutes of this is your daily typing mission \u2014 do it here, not on the old Typing tab.'},
     {n:'Monkeytype \u2014 measure weekly', u:'https://monkeytype.com/', w:'The cleanest speed test. One 60-second test a week is enough \u2014 write the number down and watch it climb.'},
     {n:'TypingClub', u:'https://www.typingclub.com/', w:'Full structured course from zero, if you prefer lessons over drills.'},
     {n:'10FastFingers', u:'https://10fastfingers.com/', w:'Quick test plus multi-language practice. Good for a second opinion on your speed.'}
   ]},

  {id:'google_sheets', n:'Google Sheets & Excel', type:'tool', priority:3, requires:[],
   target:'Pivot tables + reporting',
   why:'Every performance marketing role in Egypt and the Gulf tests this. Recruiters assume it, they do not teach it. You already handle TL 171K of spend \u2014 this is how you present it properly.',
   learn:[
     {n:'Google\u2019s official Sheets training', u:'https://support.google.com/a/users/answer/9282959', w:'Free, straight from Google. Covers everything from basics to pivot tables.'},
     {n:'GCFGlobal \u2014 Excel tutorial', u:'https://edu.gcfglobal.org/en/excel/', w:'Gentle, well-made free tutorial. Good if spreadsheets feel intimidating.'},
     {n:'Excel Pivot Tables (Coursera)', u:'https://www.coursera.org/learn/data-analysis-with-excel-pivot-tables', w:'Free to audit. 1 hour, focused on turning raw campaign data into insight.'}
   ]},

  /* ---- TIER 2: COMMUNICATION (requires English Writing) ---- */
  {id:'presentation', n:'Presentation & Slide Design', type:'skill', priority:4, requires:['english_writing'],
   target:'A clean deck in 20 minutes',
   why:'You will pitch to clients. Bad slides kill good campaigns \u2014 the client judges the deck before they judge the numbers. This is a 20-hour skill that pays back on every pitch for the rest of your career.',
   learn:[
     {n:'Google Slides \u2014 official help', u:'https://support.google.com/docs/topic/9054603', w:'Free, complete, from Google. Start with "Get started with Slides".'},
     {n:'Slidesgo School \u2014 free design course', u:'https://slidesgo.com/slidesgo-school', w:'Free course on presentation design. Teaches you why some decks land and others do not.'},
     {n:'Presentation Zen (the idea)', u:'https://www.garrreynolds.com/', w:'Garr Reynolds\u2019 free site. Read his rules on simplicity \u2014 they will change how you build every deck.'},
     {n:'SlidesCarnival \u2014 free templates', u:'https://www.slidescarnival.com/', w:'Free professional templates. Never present on the default theme again.'}
   ]},

  {id:'public_speaking', n:'Public Speaking', type:'skill', priority:5, requires:['english_writing'],
   target:'Present without fear',
   why:'You will present to clients and teams. Speaking in front of people is a skill, not a personality trait \u2014 and it is trainable.',
   learn:[
     {n:'Yoodli \u2014 AI speech coach', u:'https://yoodli.ai/', w:'Free tier. Records you and counts filler words, pacing, eye contact. Practise alone first.'},
     {n:'Toastmasters', u:'https://www.toastmasters.org/find-a-club', w:'The gold standard. Real audiences, real feedback. Guest visits are usually free \u2014 find a club near you and visit once.'},
     {n:'Speaking.io \u2014 public speaking practice', u:'https://speaking.io/', w:'Free, practical, no fluff. Built by people who speak for a living.'}
   ]},

  /* ---- TIER 3: TECHNICAL (requires Google Sheets) ---- */
  {id:'html_landing', n:'Basic HTML & Landing Pages', type:'tech', priority:6, requires:['google_sheets'],
   target:'Fix a broken page yourself',
   why:'You will need to fix a broken landing page at 11pm before a launch. Knowing basic HTML means you fix it in ten minutes instead of losing the client.',
   learn:[
     {n:'MDN \u2014 Learn HTML', u:'https://developer.mozilla.org/en-US/docs/Learn/HTML', w:'The official reference. Start with the "Getting started" modules.'},
     {n:'freeCodeCamp \u2014 Responsive Web Design', u:'https://www.freecodecamp.org/learn/2022/responsive-web-design/', w:'Free, hands-on, certificate at the end. ~20 hours.'}
   ]},

  /* ---- TIER 4: BUSINESS (requires Presentation) ---- */
  {id:'pl_cashflow', n:'Reading a P&L and Cash Flow', type:'business', priority:7, requires:['presentation'],
   target:'Know your own numbers',
   why:'Before you open an agency. An owner who cannot read their own numbers does not stay an owner long. Also feeds the Money domain in your Status.',
   learn:[
     {n:'OpenStax \u2014 Principles of Finance', u:'https://openstax.org/details/books/principles-finance', w:'Free full textbook. Read the cash-flow and budgeting chapters.'},
     {n:'Investopedia \u2014 P&L explained', u:'https://www.investopedia.com/terms/i/incomestatement.asp', w:'Short, clear, and free. Read it before the textbook.'}
   ]},

  {id:'negotiation', n:'Negotiation', type:'skill', priority:8, requires:['public_speaking'],
   target:'A better salary offer',
   why:'Your salary is negotiable. One good conversation can be worth a year of savings. This is the highest hourly rate you will ever earn.',
   learn:[
     {n:'Never Split the Difference \u2014 summary', u:'https://www.blackswanltd.com/never-split-the-difference', w:'Chris Voss\u2019 own site. Free articles on tactical empathy.'},
     {n:'Harvard PON \u2014 free negotiation resources', u:'https://www.pon.harvard.edu/free-reports/', w:'Free reports from Harvard\u2019s Program on Negotiation. Genuinely useful.'},
     {n:'Khan Academy \u2014 Negotiation', u:'https://www.khanacademy.org/economics-finance-domain/core-finance', w:'Free foundation on the economics behind any deal.'}
   ]},

  /* ---- TIER 5: MARKET (requires all above) ---- */
  {id:'saudi_culture', n:'Saudi Business Culture', type:'gulf', priority:9, requires:['negotiation','pl_cashflow'],
   target:'Learn before you land',
   why:'How meetings actually run, how decisions get made, what the hierarchy means, what is expected of you. Learning this before you arrive is worth a month of awkward mistakes.',
   learn:[
     {n:'Expatica \u2014 Saudi business culture', u:'https://www.expatica.com/sa/working/employment-law/saudi-arabia-business-culture-217246/', w:'Practical, honest, free. Read it before your first interview.'},
     {n:'Vision 2030 official site', u:'https://www.vision2030.gov.sa/', w:'The plan driving every major hiring decision in the country. Know it \u2014 it will come up in interviews.'},
     {n:'Saudi Press Agency \u2014 business news', u:'https://www.spa.gov.sa/en', w:'Follow it weekly. Walking into an interview knowing current events is a real edge.'}
   ]},

  {id:'linkedin', n:'LinkedIn & Personal Branding', type:'career', priority:10, requires:['saudi_culture'],
   target:'Be findable',
   why:'You have the profile, the logo and the portfolio. The only missing piece is output. Recruiters search before they post \u2014 being visible is how they find you.',
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
   power:100, img:'assets/shadows/char1.jpg',
   desc:'The original Shadow Monarch. Once the greatest Ruler \u2014 the Most Brilliant Fragment of Light \u2014 he stayed loyal to the Absolute Being when every other Ruler rebelled. Defeated and left for dead, he discovered the power hidden inside him and rose as the King of the Dead. Feared by both sides, betrayed by both, he built the System itself to find one human with the will to finish what he could not. That human was Sung Jin-Woo.',
   ability:'Monarch\u2019s Will \u2014 The System itself answers to you. Massive XP bonus and every boss step costs one less.'},

  /* ---- LEGENDARY ---- */
  {id:'igris', name:'Igris', title:'Red-Blood Commander', icon:'sword', rarity:'legendary',
   power:85, img:'assets/shadows/char2.jpg',
   desc:'The first shadow Jin-Woo ever extracted, from the Red Gate. A towering knight in deep-crimson armour wielding a massive greatsword. Loyal before anything else.',
   ability:'Crimson Slash \u2014 Deals massive damage to the next boss step.'},
  {id:'beru', name:'Beru', title:'Ant King', icon:'ant', rarity:'legendary',
   power:90, img:'assets/shadows/char3.jpg',
   desc:'Originally the terror of the Jeju Island S-Rank gate who nearly killed Cha Hae-In. After extraction he became Jin-Woo\u2019s most loyal and arguably strongest shadow.',
   ability:'Lightning Fast \u2014 2x XP from all sources for one hour.'},
  {id:'bellion', name:'Bellion', title:'Grand Marshal of the Shadow Army', icon:'shield', rarity:'legendary',
   power:95, img:'assets/shadows/char4.jpg',
   desc:'Ashborn\u2019s oldest and most powerful soldier, commander of the Shadow Army long before Jin-Woo existed. He served the first Shadow Monarch for eons and only bent the knee to Jin-Woo after being defeated.',
   ability:'Grand Marshal \u2014 All boss raid steps award double XP for one day.'},
  {id:'kamish', name:'Kamish', title:'Wrath of the Dragon \u00b7 First S-Rank Calamity', icon:'dragon', rarity:'legendary',
   power:94, img:'assets/shadows/char4.jpg',
   desc:'The colossal dragon of humanity\u2019s greatest dungeon break. Though his extraction was fleeting, his terrifying presence embodies the absolute apex of dragon fear.',
   ability:'Dragon\u2019s Fear \u2014 Freezes boss timers and grants +25% XP on the next boss step.'},

  /* ---- EPIC ---- */
  {id:'tank', name:'Tank', title:'Ice Bear', icon:'bear', rarity:'epic',
   power:70, img:'assets/shadows/char5.jpg',
   desc:'The brute-force Ice Bear shadow. Slow to move, impossible to stop. A loyal frontline fighter.',
   ability:'Frozen Shield \u2014 Blocks the next penalty entirely.'},
  {id:'iron', name:'Iron', title:'Fallen Hunter', icon:'shield', rarity:'epic',
   power:65, img:'assets/shadows/char6.jpg',
   desc:'Former A-Rank hunter Kim Chul, transformed into a loyal shadow tank after his death in the Red Gate. Strong defence, unwavering loyalty.',
   ability:'Iron Wall \u2014 Reduces all damage by 25% for one day.'},
  {id:'kaisel', name:'Kaisel', title:'Wyvern Mount', icon:'dragon', rarity:'epic',
   power:68, img:'assets/shadows/char1.jpg',
   desc:'The wyvern Jin-Woo rides into battle. A rare flying shadow, used for speed and aerial advantage.',
   ability:'Flight \u2014 Complete one weekly mission instantly.'},
  {id:'greed', name:'Greed', title:'Shadow Beast', icon:'wolf', rarity:'epic',
   power:62, img:'assets/shadows/char2.jpg',
   desc:'A shadow beast extracted from the demon castle. Fast, vicious and entirely obedient.',
   ability:'Bloodlust \u2014 +15% XP for the rest of the day.'},

  /* ---- RARE ---- */
  {id:'tusk', name:'Tusk', title:'High Orc Shaman', icon:'orb', rarity:'rare',
   power:55, img:'assets/shadows/char3.jpg',
   desc:'A High Orc Shaman with an arcane staff and crimson robes. Provides magical support and unexpected wisdom.',
   ability:'Arcane Wisdom \u2014 +10% XP from courses for one day.'},
  {id:'jima', name:'Jima', title:'Shadow Hunter', icon:'dagger', rarity:'rare',
   power:50, img:'assets/shadows/char4.jpg',
   desc:'A skilled shadow hunter. Fast and agile, built for reconnaissance and quick decisive strikes.',
   ability:'Shadow Step \u2014 Complete two missions in half the time.'},
  {id:'fangs', name:'Fangs', title:'Shadow Wolf', icon:'wolf', rarity:'rare',
   power:48, img:'assets/shadows/char5.jpg',
   desc:'A pack hunter extracted from the instant dungeon. Fights best alongside others.',
   ability:'Pack Instinct \u2014 +10 XP on every mission today.'},

  /* ---- COMMON ---- */
  {id:'soldier', name:'Shadow Soldier', title:'Standard Infantry', icon:'soldier', rarity:'common',
   power:35, img:'assets/shadows/char6.jpg',
   desc:'A basic shadow soldier raised from a fallen hunter. Not the strongest, but the army is built from these.',
   ability:'Arise \u2014 Summons ten shadow soldiers to help.'},
  {id:'knight', name:'Shadow Knight', title:'Elite Soldier', icon:'sword', rarity:'common',
   power:40, img:'assets/shadows/char1.jpg',
   desc:'An elite shadow knight. Well-trained, disciplined and reliable. A solid addition to any army.',
   ability:'Knight\u2019s Oath \u2014 +5% XP from all sources for one day.'},
  {id:'hunter', name:'Shadow Archer', title:'Ranged Unit', icon:'archer', rarity:'common',
   power:38, img:'assets/shadows/char2.jpg',
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
  {id:'v1', icon:'flag', title:'Riyadh', desc:'Live and work in Saudi Arabia \u2014 long-term goal, tracked monthly'},
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
  {id:'ranks',   icon:'crown', name:'S-RANK',           desc:'The Shadow Monarch. Reached through 6+ years of true daily dedication.', test:s=>rankIdx(s.xp)>=5},
  {id:'ranknat', icon:'sparkle', name:'National Level', desc:'The Sovereign. Reached the 1,000,000 XP pinnacle.', test:s=>rankIdx(s.xp)>=6},

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
   w:'Reading and listening only, with a LinkedIn certificate. Optional — you already have both numbers.'}
];

/* ---------------------------------------------------------------
   21-DAY HABIT TRACKER — career-beneficial habits
   Each habit has: name, icon, category, why (description)
   --------------------------------------------------------------- */
const HABITS = [
  {id:'h1', icon:'target', category:'Career', name:'Morning review of top 3 priorities',
   why:'Starting the day with clarity on what matters most prevents reactive work and keeps you focused on high-impact tasks.'},
  {id:'h2', icon:'chart', category:'Career', name:'Read industry news for 10 minutes',
   why:'Staying current with marketing and industry trends keeps your skills relevant and gives you conversation topics for interviews and networking.'},
  {id:'h3', icon:'pen', category:'Career', name:'Write one LinkedIn post or comment',
   why:'Consistent LinkedIn activity builds your personal brand, attracts recruiters, and positions you as a thought leader in your field.'},
  {id:'h4', icon:'globe', category:'Learning', name:'Practice English for 15 minutes',
   why:'Your writing is at A2 while listening is C1. Daily practice closes this gap, which is critical for interviews and client communication.'},
  {id:'h5', icon:'arrowUp', category:'Career', name:'Review and update CV/portfolio',
   why:'A living CV means you are always ready for opportunities. Regular updates ensure you never lose track of achievements and skills.'},
  {id:'h6', icon:'users', category:'Career', name:'Network with one person',
   why:'One meaningful connection per day compounds into a powerful network. Most jobs are filled through referrals, not applications.'},
  {id:'h7', icon:'book', category:'Learning', name:'Read a business/marketing book for 20 minutes',
   why:'Books provide depth that articles cannot. Regular reading builds strategic thinking and gives you frameworks to apply in your work.'},
  {id:'h8', icon:'bolt', category:'Learning', name:'Practice a new skill for 15 minutes',
   why:'Deliberate practice compounds. Whether it is Excel, copywriting, or a new tool, 15 minutes daily creates real skill growth over 21 days.'},
  {id:'h9', icon:'moon', category:'Mindset', name:'Evening review of the day',
   why:'Reflection consolidates learning and helps you identify what worked and what did not. Without review, you repeat the same mistakes.'},
  {id:'h10', icon:'calendar', category:'Mindset', name:"Plan tomorrow's tasks",
   why:'Planning tomorrow tonight reduces decision fatigue in the morning and lets you start the day with momentum instead of uncertainty.'}
];


/* =====================================================================
   SOLO LEVELING: PERSONAL LIFE OS DATA ARCHITECTURE
   Unified Central Strategic Direction: Saudi Arabia Relocation & Career
   ===================================================================== */

/* 1. UNIFIED SAUDI ARABIA STRATEGIC ROADMAP MILESTONES */
const SAUDI_MILESTONES = [
  {
    id: 'm1_proof',
    name: 'Milestone 1 — Documented Proof & Hero Case Studies',
    status: 'CURRENT FOCUS',
    timeframe: 'Q4 2026 (By Dec 15)',
    targetDate: '2026-12-15',
    progress: 75,
    xpReward: 500,
    desc: 'Transform 14 months of verified performance marketing at IRA Academy (27 programs, TL 171K spend, 11,406 leads, TL 15.06 CPL) and ADLab into 3 deep, visually compelling case studies.',
    icon: 'award',
    projects: ['prj_hero_phd', 'prj_hero_recovery', 'prj_hero_diploma'],
    objectives: [
      'Document 14 months of verified performance marketing data into 3 deep case studies.',
      'Quantify 11,406 leads, TL 171K spend, and TL 15.06 blended CPL proof.',
      'Build before/after CPL recovery framework from TL 130 to TL 50.'
    ],
    deliverables: [
      'PhD Political Science campaign breakdown (1,544 leads @ TL 4.62 CPL)',
      'AI & Cybersecurity CPL recovery playbook (130 TL -> 50 TL)',
      'Intelligence Studies premium diploma campaign breakdown ($1,000 offer)'
    ]
  },
  {
    id: 'm2_brand',
    name: 'Milestone 2 — ATS English CV & Regional Personal Brand',
    status: 'IN PROGRESS',
    timeframe: 'Q1 2027 (By Jan 30)',
    targetDate: '2027-01-30',
    progress: 55,
    xpReward: 400,
    desc: 'Establish top-tier positioning among Saudi media buying agencies and Gulf hiring managers.',
    icon: 'user',
    projects: ['prj_ats_cv', 'prj_portfolio', 'prj_linkedin_saudi'],
    objectives: [
      'Draft 100% ATS-compliant 1-page English resume matching Gulf agency standards.',
      'Launch online portfolio showcasing hero case studies and live analytics.',
      'Establish weekly LinkedIn authority posting targeting Riyadh/Jeddah agencies.'
    ],
    deliverables: [
      '100% ATS-friendly 1-page English CV focusing on ROI & scale',
      'Interactive online portfolio showcasing hero case studies',
      'Optimized LinkedIn profile with weekly performance marketing insights'
    ]
  },
  {
    id: 'm3_tech',
    name: 'Milestone 3 — Advanced Media Buying & AI Arsenal',
    status: 'IN PROGRESS',
    timeframe: 'Q1 2027 (By Mar 31)',
    targetDate: '2027-03-31',
    progress: 40,
    xpReward: 400,
    desc: 'Master technical infrastructure that differentiates top 1% media buyers in the Gulf.',
    icon: 'cpu',
    projects: ['prj_tech_capi', 'prj_ai_video_ads', 'prj_google_analytics'],
    objectives: [
      'Master server-side Meta Conversions API (CAPI) and event deduplication.',
      'Implement GA4 custom lead conversion event funnels and cross-channel attribution.',
      'Automate multimodal AI video ad creative production (ElevenLabs + HeyGen + CapCut).'
    ],
    deliverables: [
      'Server-side Meta Conversions API (CAPI) & Pixel deduplication mastery',
      'Google Analytics 4 custom lead event tracking & funnel analysis',
      'Multimodal AI video ads production pipeline (ElevenLabs + HeyGen + CapCut)'
    ]
  },
  {
    id: 'm4_interview',
    name: 'Milestone 4 — High-Ticket Gulf Interview Mastery & English Fluency',
    status: 'UPCOMING',
    timeframe: 'Q2 2027 (By May 31)',
    targetDate: '2027-05-31',
    progress: 35,
    xpReward: 350,
    desc: 'Deliver effortless English presentations defending campaign decisions, budget allocation, and ROAS optimization.',
    icon: 'mic',
    projects: ['prj_interview_pitch', 'prj_english_drills', 'prj_proposal_writing'],
    objectives: [
      'Deliver confident 90-second executive elevator pitch in English with zero filler words.',
      'Conduct mock campaign defense drills explaining ROAS optimization to agency leadership.',
      'Draft commercial freelance proposals and client presentation decks.'
    ],
    deliverables: [
      '90-second executive elevator pitch with zero filler words',
      'Live campaign defense drills explaining ROAS drop recovery in English',
      'Commercial client proposal and contract presentation deck'
    ]
  },
  {
    id: 'm5_finance',
    name: 'Milestone 5 — Financial Runway & Relocation Capital Buffer',
    status: 'UPCOMING',
    timeframe: 'Q3 2027 (By Jul 31)',
    targetDate: '2027-07-31',
    progress: 25,
    xpReward: 350,
    desc: 'Accumulate a dedicated relocation runway (flight, visa, initial living buffer) through expense discipline and freelance revenue.',
    icon: 'dollar',
    projects: ['prj_relocation_fund', 'prj_freelance_retainers'],
    objectives: [
      'Accumulate dedicated 120,000 EGP relocation runway fund ($2,500 buffer).',
      'Maintain 30-day itemized expense discipline with zero unaccounted spending.',
      'Establish steady dollar freelance retainers on Upwork/Mostaql or direct clients.'
    ],
    deliverables: [
      '120,000 EGP dedicated Saudi relocation and emergency reserve',
      '30-day itemized expense discipline (zero unaccounted spending)',
      'Established dollar freelance retainers (Upwork / Mostaql / direct)'
    ]
  }
];

/* 2. NOTION-STYLE LIFE OS PROJECTS */
const LIFE_OS_PROJECTS = [
  {
    id: 'prj_hero_phd',
    title: 'Hero Case Study: PhD Political Science (1,544 Leads @ TL 4.62)',
    name: 'Hero Case Study: PhD Political Science (1,544 Leads @ TL 4.62)',
    milestoneId: 'm1_proof',
    category: 'Portfolio',
    status: 'in_progress',
    progress: 75,
    deadline: '2026-11-20',
    targetDate: '2026-11-20',
    objective: 'Write and design a comprehensive case study documenting the lowest CPL educational campaign in account history.',
    desc: 'Write and design a comprehensive case study documenting the lowest CPL educational campaign in account history.',
    outcome: 'Polished 3-page PDF and web case study ready to send to Saudi recruiters.',
    tasks: [
      { id: 't_phd_1', text: 'Extract raw Meta Ads Manager export for PhD campaign', name: 'Extract raw Meta Ads Manager export for PhD campaign', done: true },
      { id: 't_phd_2', text: 'Draft Problem & Challenge statement (niche target audience in Arab world)', name: 'Draft Problem & Challenge statement (niche target audience in Arab world)', done: true },
      { id: 't_phd_3', text: 'Detail Audience Strategy: Custom/Lookalike layering & Advantage+ budget', name: 'Detail Audience Strategy: Custom/Lookalike layering & Advantage+ budget', done: true },
      { id: 't_phd_4', text: 'Format results visual: 1,544 leads, TL 4.62 CPL vs TL 15.06 average', name: 'Format results visual: 1,544 leads, TL 4.62 CPL vs TL 15.06 average', done: false },
      { id: 't_phd_5', text: 'Export high-res PDF and embed in portfolio', name: 'Export high-res PDF and embed in portfolio', done: false }
    ],
    subtasks: [
      { id: 't_phd_1', text: 'Extract raw Meta Ads Manager export for PhD campaign', name: 'Extract raw Meta Ads Manager export for PhD campaign', done: true },
      { id: 't_phd_2', text: 'Draft Problem & Challenge statement (niche target audience in Arab world)', name: 'Draft Problem & Challenge statement (niche target audience in Arab world)', done: true },
      { id: 't_phd_3', text: 'Detail Audience Strategy: Custom/Lookalike layering & Advantage+ budget', name: 'Detail Audience Strategy: Custom/Lookalike layering & Advantage+ budget', done: true },
      { id: 't_phd_4', text: 'Format results visual: 1,544 leads, TL 4.62 CPL vs TL 15.06 average', name: 'Format results visual: 1,544 leads, TL 4.62 CPL vs TL 15.06 average', done: false },
      { id: 't_phd_5', text: 'Export high-res PDF and embed in portfolio', name: 'Export high-res PDF and embed in portfolio', done: false }
    ],
    notes: 'Primary proof point for high-volume lead generation efficiency.'
  },
  {
    id: 'prj_hero_recovery',
    title: 'Hero Case Study: Delivery Volatility & CPL Recovery (130 -> 50 TL)',
    name: 'Hero Case Study: Delivery Volatility & CPL Recovery (130 -> 50 TL)',
    milestoneId: 'm1_proof',
    category: 'Portfolio',
    status: 'in_progress',
    progress: 50,
    deadline: '2026-11-30',
    targetDate: '2026-11-30',
    objective: 'Document the exact systematic protocol used to recover an AI & Cyber campaign from 130 TL to 50 TL CPL.',
    desc: 'Document the exact systematic protocol used to recover an AI & Cyber campaign from 130 TL to 50 TL CPL.',
    outcome: 'Demonstrates deep troubleshooting, learning phase reset tactics, and algorithmic understanding.',
    tasks: [
      { id: 't_rec_1', text: 'Structure the 4-step diagnostic protocol', name: 'Structure the 4-step diagnostic protocol', done: true },
      { id: 't_rec_2', text: 'Write the campaign duplication and learning phase reset rationale', name: 'Write the campaign duplication and learning phase reset rationale', done: true },
      { id: 't_rec_3', text: 'Document creative fatigue indicators and copy adjustments', name: 'Document creative fatigue indicators and copy adjustments', done: false },
      { id: 't_rec_4', text: 'Create before/after CPL comparison chart', name: 'Create before/after CPL comparison chart', done: false }
    ],
    subtasks: [
      { id: 't_rec_1', text: 'Structure the 4-step diagnostic protocol', name: 'Structure the 4-step diagnostic protocol', done: true },
      { id: 't_rec_2', text: 'Write the campaign duplication and learning phase reset rationale', name: 'Write the campaign duplication and learning phase reset rationale', done: true },
      { id: 't_rec_3', text: 'Document creative fatigue indicators and copy adjustments', name: 'Document creative fatigue indicators and copy adjustments', done: false },
      { id: 't_rec_4', text: 'Create before/after CPL comparison chart', name: 'Create before/after CPL comparison chart', done: false }
    ],
    notes: 'Recruiters value candidates who know what to do when campaigns break.'
  },
  {
    id: 'prj_ats_cv',
    title: 'ATS-Optimized 1-Page English CV for Saudi Media Agencies',
    name: 'ATS-Optimized 1-Page English CV for Saudi Media Agencies',
    milestoneId: 'm2_brand',
    category: 'Career',
    status: 'active',
    progress: 60,
    deadline: '2026-12-05',
    targetDate: '2026-12-05',
    objective: 'Build an ultra-clean, high-converting English resume passing all applicant tracking systems with a 95%+ match score.',
    desc: 'Build an ultra-clean, high-converting English resume passing all applicant tracking systems with a 95%+ match score.',
    outcome: 'ATS-compliant PDF resume emphasizing 27 campaigns, 11,406 leads, and TL 171K spend.',
    tasks: [
      { id: 't_cv_1', text: 'Quantify all IRA Academy bullet points with verified numbers', name: 'Quantify all IRA Academy bullet points with verified numbers', done: true },
      { id: 't_cv_2', text: 'Highlight ADLab media planning experience (Audi, Lynk & Co)', name: 'Highlight ADLab media planning experience (Audi, Lynk & Co)', done: true },
      { id: 't_cv_3', text: 'Incorporate Saudi/Gulf job keyword matrix (Advantage+, CAPI, CAC/ROAS, Attribution)', name: 'Incorporate Saudi/Gulf job keyword matrix (Advantage+, CAPI, CAC/ROAS, Attribution)', done: false },
      { id: 't_cv_4', text: 'Run through Jobscan ATS simulator and score above 90%', name: 'Run through Jobscan ATS simulator and score above 90%', done: false }
    ],
    subtasks: [
      { id: 't_cv_1', text: 'Quantify all IRA Academy bullet points with verified numbers', name: 'Quantify all IRA Academy bullet points with verified numbers', done: true },
      { id: 't_cv_2', text: 'Highlight ADLab media planning experience (Audi, Lynk & Co)', name: 'Highlight ADLab media planning experience (Audi, Lynk & Co)', done: true },
      { id: 't_cv_3', text: 'Incorporate Saudi/Gulf job keyword matrix (Advantage+, CAPI, CAC/ROAS, Attribution)', name: 'Incorporate Saudi/Gulf job keyword matrix (Advantage+, CAPI, CAC/ROAS, Attribution)', done: false },
      { id: 't_cv_4', text: 'Run through Jobscan ATS simulator and score above 90%', name: 'Run through Jobscan ATS simulator and score above 90%', done: false }
    ],
    notes: 'Never list generic duties; always state Action + Metric + Result.'
  },
  {
    id: 'prj_linkedin_saudi',
    title: 'LinkedIn Authority & Saudi Recruiter Outreach Pipeline',
    name: 'LinkedIn Authority & Saudi Recruiter Outreach Pipeline',
    milestoneId: 'm2_brand',
    category: 'Career',
    status: 'active',
    progress: 40,
    deadline: '2026-12-20',
    targetDate: '2026-12-20',
    objective: 'Transform LinkedIn into an inbound recruiter magnet targeting Riyadh/Jeddah agencies and brands.',
    desc: 'Transform LinkedIn into an inbound recruiter magnet targeting Riyadh/Jeddah agencies and brands.',
    outcome: 'Weekly inbound messages from regional agency recruiters.',
    tasks: [
      { id: 't_li_1', text: 'Update Headline: Performance Marketing Specialist | Meta Ads & Lead Gen | $171K+ Spend Managed', name: 'Update Headline: Performance Marketing Specialist | Meta Ads & Lead Gen | $171K+ Spend Managed', done: true },
      { id: 't_li_2', text: 'Publish Case Study 1 as a LinkedIn carousel', name: 'Publish Case Study 1 as a LinkedIn carousel', done: false },
      { id: 't_li_3', text: 'Connect with 15 Saudi media directors and talent acquisition leads per week', name: 'Connect with 15 Saudi media directors and talent acquisition leads per week', done: false },
      { id: 't_li_4', text: 'Engage thoughtfully on top 5 Saudi marketing agency posts daily', name: 'Engage thoughtfully on top 5 Saudi marketing agency posts daily', done: false }
    ],
    subtasks: [
      { id: 't_li_1', text: 'Update Headline: Performance Marketing Specialist | Meta Ads & Lead Gen | $171K+ Spend Managed', name: 'Update Headline: Performance Marketing Specialist | Meta Ads & Lead Gen | $171K+ Spend Managed', done: true },
      { id: 't_li_2', text: 'Publish Case Study 1 as a LinkedIn carousel', name: 'Publish Case Study 1 as a LinkedIn carousel', done: false },
      { id: 't_li_3', text: 'Connect with 15 Saudi media directors and talent acquisition leads per week', name: 'Connect with 15 Saudi media directors and talent acquisition leads per week', done: false },
      { id: 't_li_4', text: 'Engage thoughtfully on top 5 Saudi marketing agency posts daily', name: 'Engage thoughtfully on top 5 Saudi marketing agency posts daily', done: false }
    ],
    notes: 'Position as a ROI-driven practitioner, not a generic content creator.'
  },
  {
    id: 'prj_tech_capi',
    title: 'Meta Conversions API (CAPI) & GA4 Advanced Tracking Mastery',
    name: 'Meta Conversions API (CAPI) & GA4 Advanced Tracking Mastery',
    milestoneId: 'm3_tech',
    category: 'Technical',
    status: 'active',
    progress: 35,
    deadline: '2027-01-15',
    targetDate: '2027-01-15',
    objective: 'Acquire practical, end-to-end server-side tracking and attribution skills demanded by modern media buyers.',
    desc: 'Acquire practical, end-to-end server-side tracking and attribution skills demanded by modern media buyers.',
    outcome: 'Ability to set up CAPI gateway, event deduplication, and custom GA4 conversion funnels.',
    tasks: [
      { id: 't_cap_1', text: 'Complete Meta CAPI Gateway walkthrough', name: 'Complete Meta CAPI Gateway walkthrough', done: true },
      { id: 't_cap_2', text: 'Test event deduplication between browser pixel and server event', name: 'Test event deduplication between browser pixel and server event', done: false },
      { id: 't_cap_3', text: 'Configure custom lead qualification events in GA4', name: 'Configure custom lead qualification events in GA4', done: false },
      { id: 't_cap_4', text: 'Write step-by-step CAPI setup guide for Knowledge Base', name: 'Write step-by-step CAPI setup guide for Knowledge Base', done: false }
    ],
    subtasks: [
      { id: 't_cap_1', text: 'Complete Meta CAPI Gateway walkthrough', name: 'Complete Meta CAPI Gateway walkthrough', done: true },
      { id: 't_cap_2', text: 'Test event deduplication between browser pixel and server event', name: 'Test event deduplication between browser pixel and server event', done: false },
      { id: 't_cap_3', text: 'Configure custom lead qualification events in GA4', name: 'Configure custom lead qualification events in GA4', done: false },
      { id: 't_cap_4', text: 'Write step-by-step CAPI setup guide for Knowledge Base', name: 'Write step-by-step CAPI setup guide for Knowledge Base', done: false }
    ],
    notes: 'Highest-leverage technical moat against ordinary media buyers.'
  },
  {
    id: 'prj_ai_video_ads',
    title: 'Automated AI Video Ad Production Pipeline',
    name: 'Automated AI Video Ad Production Pipeline',
    milestoneId: 'm3_tech',
    category: 'AI & Automation',
    status: 'active',
    progress: 45,
    deadline: '2027-02-15',
    targetDate: '2027-02-15',
    objective: 'Build an automated pipeline to produce direct-response UGC-style video ads using AI tools.',
    desc: 'Build an automated pipeline to produce direct-response UGC-style video ads using AI tools.',
    outcome: 'Produce 3 variation video creatives in under 20 minutes.',
    tasks: [
      { id: 't_ai_1', text: 'Draft 3 direct-response Arabic hook formulas for Gulf audience', name: 'Draft 3 direct-response Arabic hook formulas for Gulf audience', done: true },
      { id: 't_ai_2', text: 'Generate natural Arabic voiceover narration in ElevenLabs', name: 'Generate natural Arabic voiceover narration in ElevenLabs', done: true },
      { id: 't_ai_3', text: 'Assemble avatar presenter and overlay B-roll in CapCut', name: 'Assemble avatar presenter and overlay B-roll in CapCut', done: false },
      { id: 't_ai_4', text: 'Document end-to-end SOP in Knowledge Base', name: 'Document end-to-end SOP in Knowledge Base', done: false }
    ],
    subtasks: [
      { id: 't_ai_1', text: 'Draft 3 direct-response Arabic hook formulas for Gulf audience', name: 'Draft 3 direct-response Arabic hook formulas for Gulf audience', done: true },
      { id: 't_ai_2', text: 'Generate natural Arabic voiceover narration in ElevenLabs', name: 'Generate natural Arabic voiceover narration in ElevenLabs', done: true },
      { id: 't_ai_3', text: 'Assemble avatar presenter and overlay B-roll in CapCut', name: 'Assemble avatar presenter and overlay B-roll in CapCut', done: false },
      { id: 't_ai_4', text: 'Document end-to-end SOP in Knowledge Base', name: 'Document end-to-end SOP in Knowledge Base', done: false }
    ],
    notes: 'Crucial for rapid creative testing without high studio production costs.'
  },
  {
    id: 'prj_interview_pitch',
    title: '90-Second Executive Pitch & English Interview Mastery',
    name: '90-Second Executive Pitch & English Interview Mastery',
    milestoneId: 'm4_interview',
    category: 'English & Communication',
    status: 'active',
    progress: 30,
    deadline: '2027-03-15',
    targetDate: '2027-03-15',
    objective: 'Achieve total fluency and confidence presenting past campaign results in English interviews.',
    desc: 'Achieve total fluency and confidence presenting past campaign results in English interviews.',
    outcome: 'Recorded flawless answers for the top 5 Gulf media buyer interview questions.',
    tasks: [
      { id: 't_int_1', text: 'Master 90-second "Tell me about yourself" with 27-campaign proof', name: 'Master 90-second "Tell me about yourself" with 27-campaign proof', done: true },
      { id: 't_int_2', text: 'Record answer for "How do you handle ad fatigue and rising CPL?"', name: 'Record answer for "How do you handle ad fatigue and rising CPL?"', done: false },
      { id: 't_int_3', text: 'Record answer for "Explain your Advantage+ budget scaling strategy"', name: 'Record answer for "Explain your Advantage+ budget scaling strategy"', done: false },
      { id: 't_int_4', text: 'Complete 3 mock interviews with an AI conversation partner', name: 'Complete 3 mock interviews with an AI conversation partner', done: false }
    ],
    subtasks: [
      { id: 't_int_1', text: 'Master 90-second "Tell me about yourself" with 27-campaign proof', name: 'Master 90-second "Tell me about yourself" with 27-campaign proof', done: true },
      { id: 't_int_2', text: 'Record answer for "How do you handle ad fatigue and rising CPL?"', name: 'Record answer for "How do you handle ad fatigue and rising CPL?"', done: false },
      { id: 't_int_3', text: 'Record answer for "Explain your Advantage+ budget scaling strategy"', name: 'Record answer for "Explain your Advantage+ budget scaling strategy"', done: false },
      { id: 't_int_4', text: 'Complete 3 mock interviews with an AI conversation partner', name: 'Complete 3 mock interviews with an AI conversation partner', done: false }
    ],
    notes: 'Speaking is 50 (B1) — one point from B2. Consistent drills will bridge the gap.'
  },
  {
    id: 'prj_relocation_fund',
    title: 'Saudi Relocation Runway & Emergency Capital Buffer',
    name: 'Saudi Relocation Runway & Emergency Capital Buffer',
    milestoneId: 'm5_finance',
    category: 'Finance',
    status: 'active',
    progress: 25,
    deadline: '2027-06-30',
    targetDate: '2027-06-30',
    objective: 'Accumulate a dedicated 120,000 EGP relocation and emergency runway through expense control and freelance income.',
    desc: 'Accumulate a dedicated 120,000 EGP relocation runway through expense control and freelance income.',
    outcome: 'Financial peace of mind and flexibility when transitioning to Saudi Arabia.',
    tasks: [
      { id: 't_fin_1', text: 'Track daily itemized expenses consistently for 30 days', name: 'Track daily itemized expenses consistently for 30 days', done: true },
      { id: 't_fin_2', text: 'Identify and eliminate bottom 15% non-essential monthly expenses', name: 'Identify and eliminate bottom 15% non-essential monthly expenses', done: true },
      { id: 't_fin_3', text: 'Set up dedicated relocation savings ledger', name: 'Set up dedicated relocation savings ledger', done: false },
      { id: 't_fin_4', text: 'Generate first 10,000 EGP in freelance retainers', name: 'Generate first 10,000 EGP in freelance retainers', done: false }
    ],
    subtasks: [
      { id: 't_fin_1', text: 'Track daily itemized expenses consistently for 30 days', name: 'Track daily itemized expenses consistently for 30 days', done: true },
      { id: 't_fin_2', text: 'Identify and eliminate bottom 15% non-essential monthly expenses', name: 'Identify and eliminate bottom 15% non-essential monthly expenses', done: true },
      { id: 't_fin_3', text: 'Set up dedicated relocation savings ledger', name: 'Set up dedicated relocation savings ledger', done: false },
      { id: 't_fin_4', text: 'Generate first 10,000 EGP in freelance retainers', name: 'Generate first 10,000 EGP in freelance retainers', done: false }
    ],
    notes: 'Financial discipline buys career choices and eliminates desperation.'
  }
];

/* 3. KNOWLEDGE BASE ARTICLES & MARKETING FRAMEWORKS */
const KNOWLEDGE_BASE_DATA = [
  {
    id: 'kb_volatility_recovery',
    title: 'Meta Ads Delivery Volatility Recovery Playbook',
    category: 'Performance Marketing',
    tags: ['Meta Ads', 'CPL Optimization', 'Troubleshooting', 'Troubleshooting Playbook'],
    readTime: '4 min',
    summary: 'Systematic 4-step emergency diagnosis and recovery protocol when CPL spikes due to platform algorithmic volatility.',
    content: `### 1. Diagnosis Phase (The 24-Hour Rule)
- Never panic-edit an active ad set within the first 4 hours of a cost spike.
- Compare Day-over-Day CPM vs Frequency:
  - If CPM spiked without ad changes -> Platform delivery auction congestion.
  - If Frequency is > 2.5 on cold audience -> Creative fatigue.
  - If CTR dropped > 35% -> Creative exhaustion or negative comment storm.

### 2. The Duplicate & Relaunch Reset
- Step 1: Export campaign historical metrics for baseline.
- Step 2: Pause the corrupted ad set (do not delete).
- Step 3: Duplicate the ad set at original stable budget. This resets the learning phase cleanly without historical algorithmic baggage.
- Step 4: Keep winning creatives; introduce ONE new hook variation.

### 3. Real Proof from Account History
- Applied during the IRA Academy AI & Cybersecurity diploma campaign:
  - Runaway initial CPL: TL 130.62.
  - After duplication and audience re-clustering: TL 50.79 (61% CPL reduction).`
  },
  {
    id: 'kb_lead_qualification',
    title: 'High-Ticket Lead Gen & Instant Form Qualification Framework',
    category: 'Performance Marketing',
    tags: ['Lead Gen', 'Instant Forms', 'CPL vs Quality', 'CRM'],
    readTime: '5 min',
    summary: 'How to balance low Cost Per Lead (CPL) with high sales team qualification rates using Meta Instant Forms.',
    content: `### 1. The Friction Paradox
- Zero friction = cheap leads that never answer the phone.
- Excessive friction = prohibitive CPL with high drop-off rates.
- Sweet Spot: The "Higher Intent" form type with 2 custom qualification hurdles.

### 2. The 3-Step Qualification Question Architecture
- **Question 1 (Commitment Filter):** Multiple-choice verifying current employment or field background.
- **Question 2 (Timeline/Readiness):** "When do you plan to start?" (Immediate / Next Month / Researching).
- **Question 3 (Contact Verification):** Explicitly require active WhatsApp number with country code.

### 3. Proof Benchmark from IRA Academy
- 11,406 qualified leads generated across 27 programs at a blended TL 15.06 CPL.
- Sales closing rate increased by 28% when switching from More Volume to Higher Intent forms.`
  },
  {
    id: 'kb_saudi_market',
    title: 'Saudi Advertising Market & Media Buying Intelligence',
    category: 'Saudi Market',
    tags: ['Saudi Arabia', 'KSA', 'Consumer Behavior', 'Media Planning'],
    readTime: '6 min',
    summary: 'Essential platform dynamics, consumer preferences, and advertising regulations in the Kingdom of Saudi Arabia.',
    content: `### 1. Platform Power Hierarchy in KSA
- **Snapchat:** Unrivaled penetration among Saudi nationals. Mandatory for mass awareness and local retail/app campaigns.
- **TikTok:** Highest engagement growth; excellent for direct-response UGC and e-commerce.
- **Meta (Instagram & Facebook):** Instagram remains high-trust for lifestyle, fashion, B2B, and professional services. Facebook drives strong expat traffic.
- **X (Twitter):** Primary channel for news, public relations, and governmental announcements.

### 2. Cultural & Creative Guidelines
- **Dialect Matters:** Use white Saudi Arabic (اللهجة البيضاء) for mass audience; Modern Standard Arabic for formal, governmental, or premium luxury.
- **Visual Sensitivity:** Respect conservative cultural norms in imagery and video. Family-oriented visuals convert substantially higher.
- **Payment Preferences:** Mada card, Apple Pay, and Tabby/Tamara (BNPL) are non-negotiable payment signals.

### 3. Key Seasons & Budget Spikes
- Ramadan & Eid: Highest ad spend and highest e-commerce conversion rates.
- Saudi National Day (September 23) & Founding Day (February 22): Massive discount campaigns and patriotic marketing themes.`
  },
  {
    id: 'kb_ai_video_pipeline',
    title: 'End-to-End AI Video Ad Production SOP',
    category: 'AI & Automation',
    tags: ['AI Workflows', 'Video Ads', 'ElevenLabs', 'CapCut', 'HeyGen'],
    readTime: '4 min',
    summary: 'Step-by-step SOP for generating high-converting Arabic video creatives in under 20 minutes.',
    content: `### 1. Scripting (Direct-Response Formula)
- **Seconds 0-3 (The Hook):** Visual surprise + problem callout ("بتصرف ميزانية إعلاناتك ومش بتشوف مبيعات حقيقية؟").
- **Seconds 4-15 (Agitation & Insight):** Explain why ordinary tactics fail (algorithm changes, high CPL).
- **Seconds 16-35 (The Solution & Proof):** Introduce the offer, show verified dashboard numbers.
- **Seconds 36-45 (Call to Action):** Low-friction command ("اضغط على الرابط وسجل الآن").

### 2. Audio & Avatar Assembly
- Voice: ElevenLabs Arabic model (Deep, confident, natural inflection).
- Presenter: HeyGen custom digital avatar with natural gestures.
- B-Roll & Pacing: CapCut with bold text captions (Yellow/Cyan), sound effects on text popups, and 1.2x pacing.`
  },
  {
    id: 'kb_interview_90s',
    title: 'The 90-Second Performance Marketer Executive Pitch',
    category: 'Career & Interview',
    tags: ['Interview', 'Elevator Pitch', 'English B2', 'Executive Presence'],
    readTime: '3 min',
    summary: 'The battle-tested script to answer "Tell me about yourself" in marketing interviews with total authority.',
    content: `### Structure: Who -> Specialization -> Verified Numbers -> Why This Role

**English Script:**
"I am Hadi Essam, a Performance Marketing and Social Media Specialist with over 14 months of hands-on paid media experience managing cross-channel campaigns.

In my recent tenure at IRA Academy, I had full operational responsibility for managing paid advertising across 27 distinct educational programs. During that period, I managed over 171,000 Turkish Liras in ad spend, delivering 11,406 qualified leads at an exceptionally lean blended Cost Per Lead of 15.06 TL across 5 brand pages.

My core edge is combining technical attribution—like server-side CAPI and GA4 funnel tracking—with creative direct-response copy that converts cold Arab audiences.

I am looking to bring this exact data-driven execution and budget efficiency to high-growth brands and media agencies in Saudi Arabia."`
  },
  {
    id: 'kb_leadgen_funnel',
    title: 'High-Ticket Education & B2B Funnel Architecture',
    category: 'Performance Marketing',
    tags: ['Funnel Architecture', 'B2B', 'Education', 'ROAS'],
    readTime: '5 min',
    summary: 'The TOFU / MOFU / BOFU structure used to sell premium $1,000 diplomas and graduate programs.',
    content: `### 1. Top of Funnel (TOFU) — Problem Awareness
- Content: Short video carousels detailing career breakthroughs in international relations, cybersecurity, or diplomacy.
- KPI: 3-second video views & cost per landing page visit.

### 2. Middle of Funnel (MOFU) — Proof & Syllabus Breakdown
- Offer: Free introductory masterclass, detailed curriculum PDF, or faculty credential sheet.
- Lead Capture: Meta Instant Form (Higher Intent).

### 3. Bottom of Funnel (BOFU) — Direct Sales Closing
- Retargeting: Social proof ads showing past alumni testimonials and employment placement.
- Direct WhatsApp automated handoff to academic advisor team within 15 minutes of lead capture.`
  }
];

/* 4. EXPANDED PRACTICAL ENGLISH & MARKETING VOCABULARY BANK */
const EXPANDED_VOCAB_DATA = [
  {
    w: 'Attribution',
    word: 'Attribution',
    pos: 'noun',
    ipa: '/ˌæt.rɪˈbjuː.ʃən/',
    ar: 'إسناد الإعلانات / تحديد مصدر التحويل',
    arabic: 'إسناد الإعلانات / تحديد مصدر التحويل',
    ex: 'Multi-touch attribution models help us identify which ad touchpoint drove the final purchase.',
    example: 'Multi-touch attribution models help us identify which ad touchpoint drove the final purchase.',
    ctx: 'Performance Marketing Analytics',
    def: 'Performance Marketing Analytics: identifying which ad touchpoint drove the final conversion',
    cat: 'Marketing',
    category: 'Marketing'
  },
  {
    w: 'Deliverable',
    word: 'Deliverable',
    pos: 'noun',
    ipa: '/dɪˈlɪv.ər.ə.bəl/',
    ar: 'مُخرَج العمل / التسليمات المتفق عليها',
    arabic: 'مُخرَج العمل / التسليمات المتفق عليها',
    ex: 'Our primary deliverables for Q1 are three hero case studies and an updated portfolio.',
    example: 'Our primary deliverables for Q1 are three hero case studies and an updated portfolio.',
    ctx: 'Agency & Client Management',
    def: 'Agency & Client Management: measurable output or asset provided to a client',
    cat: 'Business',
    category: 'Business'
  },
  {
    w: 'Deduplication',
    word: 'Deduplication',
    pos: 'noun',
    ipa: '/diːˌdjuː.plɪˈkeɪ.ʃən/',
    ar: 'إزالة التكرار (للبيانات أو الأحداث الإعلانية)',
    arabic: 'إزالة التكرار (للبيانات أو الأحداث الإعلانية)',
    ex: 'Event deduplication ensures Meta does not count the browser pixel and server CAPI event twice.',
    example: 'Event deduplication ensures Meta does not count the browser pixel and server CAPI event twice.',
    ctx: 'Technical Tracking & CAPI',
    def: 'Technical Tracking & CAPI: eliminating redundant identical events across browser and server',
    cat: 'Marketing',
    category: 'Marketing'
  },
  {
    w: 'Retainer',
    word: 'Retainer',
    pos: 'noun',
    ipa: '/rɪˈteɪ.nər/',
    ar: 'عقد أتعاب دوري / اشتراك شهري ثابت للعميل',
    arabic: 'عقد أتعاب دوري / اشتراك شهري ثابت للعميل',
    ex: 'We transitioned the client from a one-off campaign fee to a monthly retainer of $1,500.',
    example: 'We transitioned the client from a one-off campaign fee to a monthly retainer of $1,500.',
    ctx: 'Freelancing & Agency Contracts',
    def: 'Freelancing & Agency Contracts: fixed recurring periodic fee for ongoing marketing services',
    cat: 'Business',
    category: 'Business'
  },
  {
    w: 'Runway',
    word: 'Runway',
    pos: 'noun',
    ipa: '/ˈrʌn.weɪ/',
    ar: 'فترة الأمان المالي / المدة التي تكفيها المدخرات',
    arabic: 'فترة الأمان المالي / المدة التي تكفيها المدخرات',
    ex: 'Having six months of living runway allows you to negotiate higher salaries without desperation.',
    example: 'Having six months of living runway allows you to negotiate higher salaries without desperation.',
    ctx: 'Financial Planning & Relocation',
    def: 'Financial Planning & Relocation: number of months living expenses covered by reserves',
    cat: 'Finance',
    category: 'Finance'
  },
  {
    w: 'Scalability',
    word: 'Scalability',
    pos: 'noun',
    ipa: '/ˌskeɪ.ləˈbɪl.ə.ti/',
    ar: 'قابلية التوسع / زيادة الميزانية دون انهيار العائد',
    arabic: 'قابلية التوسع / زيادة الميزانية دون انهيار العائد',
    ex: 'We verified the campaign scalability by increasing budget by 20% every 48 hours.',
    example: 'We verified the campaign scalability by increasing budget by 20% every 48 hours.',
    ctx: 'Meta Ads Optimization',
    def: 'Meta Ads Optimization: ability to expand ad spend efficiently without diminishing returns',
    cat: 'Marketing',
    category: 'Marketing'
  },
  {
    w: 'Benchmarking',
    word: 'Benchmarking',
    pos: 'noun',
    ipa: '/ˈbentʃ.mɑː.kɪŋ/',
    ar: 'المقارنة المعيارية بالسوق والمنافسين',
    arabic: 'المقارنة المعيارية بالسوق والمنافسين',
    ex: 'Our Saudi salary benchmarking indicates media buyer roles range between 8,000 to 14,000 SAR.',
    example: 'Our Saudi salary benchmarking indicates media buyer roles range between 8,000 to 14,000 SAR.',
    ctx: 'Market Research & Careers',
    def: 'Market Research & Careers: comparing operational performance metrics against industry peers',
    cat: 'Career',
    category: 'Career'
  },
  {
    w: 'Leverage',
    word: 'Leverage',
    pos: 'noun / verb',
    ipa: '/ˈliː.vər.ɪdʒ/',
    ar: 'استغلال أمثل / نقطة قوة تضاعف النتائج',
    arabic: 'استغلال أمثل / نقطة قوة تضاعف النتائج',
    ex: 'We leveraged AI video tools to test 15 creative variations in three days.',
    example: 'We leveraged AI video tools to test 15 creative variations in three days.',
    ctx: 'Strategic Management',
    def: 'Strategic Management: using a strategic capability or tool to multiply operational impact',
    cat: 'Business',
    category: 'Business'
  },
  {
    w: 'Feasibility',
    word: 'Feasibility',
    pos: 'noun',
    ipa: '/ˌfiː.zəˈbɪl.ə.ti/',
    ar: 'الجدوى وقابلية التطبيق الواقعي',
    arabic: 'الجدوى وقابلية التطبيق الواقعي',
    ex: 'Before launching the new course, we conducted a feasibility study on expected ad costs.',
    example: 'Before launching the new course, we conducted a feasibility study on expected ad costs.',
    ctx: 'Project Planning',
    def: 'Project Planning: the practical viability and likelihood of project success',
    cat: 'Business',
    category: 'Business'
  },
  {
    w: 'Discrepancy',
    word: 'Discrepancy',
    pos: 'noun',
    ipa: '/dɪˈskrep.ən.si/',
    ar: 'فرق أو تعارض غير متوقع في الأرقام',
    arabic: 'فرق أو تعارض غير متوقع في الأرقام',
    ex: 'We investigated the 15% discrepancy between Meta Ads Manager leads and CRM entries.',
    example: 'We investigated the 15% discrepancy between Meta Ads Manager leads and CRM entries.',
    ctx: 'Analytics & Reporting',
    def: 'Analytics & Reporting: an unexpected variance or mismatch between data sources',
    cat: 'Marketing',
    category: 'Marketing'
  }
];

/* 5. ACTIVE HIGH-IMPACT DAILY TASKS POOL (Strict Max 10 Rules, Target 5-8) */
const ACTIVE_DAILY_TASKS_DEF = [
  {
    id: 'q_case_study',
    legacyId: 'd6',
    name: 'Draft Case Study Section (IRA Academy Hero Campaign)',
    sub: 'Career & Proof',
    stat: 'career',
    xp: 25,
    duration: '35 min',
    priority: 'high',
    project: 'prj_hero_phd',
    why: 'Documented proof with verified numbers is the single highest-leverage asset for Saudi recruiters.',
    action: 'Write the Problem, Strategy, and Budget Optimization section for the PhD Political Science campaign (1,544 leads @ TL 4.62).',
    criteria: 'A finished 300-word written section with exact metrics and bullet points ready for design.',
    outcome: 'One core hero case study section completed.'
  },
  {
    id: 'q_english_speaking',
    legacyId: 'd15',
    name: 'Record 2-Minute English Campaign Defense Drill',
    sub: 'English Fluency',
    stat: 'selfdev',
    xp: 20,
    duration: '20 min',
    priority: 'high',
    project: 'prj_interview_pitch',
    why: 'Interviewers in Riyadh evaluate executive presence and technical fluency under pressure.',
    action: 'Speak out loud for 2 minutes answering: "Explain how you managed ad delivery volatility and stabilized CPL at IRA Academy." Record it on phone, listen back, and eliminate pauses.',
    criteria: 'One completed 2-minute voice recording with clean pacing and zero filler words.',
    outcome: 'Confidence and fluency on a core technical interview question.'
  },
  {
    id: 'q_ats_cv_refine',
    legacyId: 'd14',
    name: 'Refine 3 ATS Bullet Points with Verified Metrics',
    sub: 'Career & Brand',
    stat: 'career',
    xp: 15,
    duration: '20 min',
    priority: 'high',
    project: 'prj_ats_cv',
    why: 'ATS algorithms screen resumes based on quantified business impact, not generic job descriptions.',
    action: 'Rewrite 3 work experience bullets using the formula: Action Verb + Context + Quantitative Metric + Result (e.g. TL 171K spend, 11,406 leads).',
    criteria: '3 polished bullet points added to English CV draft.',
    outcome: 'Stronger resume match score for Saudi agency openings.'
  },
  {
    id: 'q_workout',
    legacyId: 'd5',
    name: '15-Minute Home Functional Workout',
    sub: 'Health & Energy',
    stat: 'health',
    xp: 10,
    duration: '15 min',
    priority: 'medium',
    project: null,
    why: 'Physical discipline and stamina directly fuel cognitive endurance and emotional resilience.',
    action: '3 rounds: Incline push-ups (12), Chair-assisted squats (15), Knee plank (35s), Glute bridge (15), Dead bug (12). Stretch 3 min.',
    criteria: '3 rounds completed with proper form.',
    outcome: 'Physical energy boosted and health streak maintained.'
  },
  {
    id: 'q_reading_marketing',
    legacyId: 'd7',
    name: 'Read 10 Pages of Marketing Strategy / Business Book',
    sub: 'Knowledge & Craft',
    stat: 'selfdev',
    xp: 10,
    duration: '25 min',
    priority: 'medium',
    project: null,
    why: 'Reading builds deep mental models that separate strategic marketing managers from basic operators.',
    action: 'Read 10 pages in English from Principles of Marketing or Influence by Cialdini. Write down 1 actionable takeaway.',
    criteria: '10 pages read and 1 insight noted in Knowledge Base.',
    outcome: 'Broader strategic vocabulary and marketing insight.'
  },
  {
    id: 'q_linkedin_authority',
    legacyId: 'd17',
    name: 'Publish or Engage with 3 Saudi Agency Leads on LinkedIn',
    sub: 'Networking & Authority',
    stat: 'career',
    xp: 15,
    duration: '20 min',
    priority: 'medium',
    project: 'prj_linkedin_saudi',
    why: 'Consistent professional visibility brings inbound inquiries from Gulf marketing directors.',
    action: 'Leave 2 substantive, value-additive comments on posts by Saudi agency founders, and connect with 3 media buyers in Riyadh.',
    criteria: '2 thoughtful comments posted and 3 personalized connection requests sent.',
    outcome: 'Expanded professional footprint in the Saudi market.'
  },
  {
    id: 'q_ai_workflow_test',
    legacyId: 'd21',
    name: 'Test 1 AI Marketing Workflow (Ad Copy / Creative)',
    sub: 'Technical Skills',
    stat: 'skills',
    xp: 15,
    duration: '25 min',
    priority: 'normal',
    project: 'prj_ai_video_ads',
    why: 'AI automation multiplies your output, allowing you to operate with the leverage of an entire creative team.',
    action: 'Use Gemini / ChatGPT to generate 3 distinct direct-response ad angles (Fear of Missing Out, Data Proof, Story Hook) for a test campaign.',
    criteria: '3 structured ad copy variants generated and reviewed.',
    outcome: 'Practical AI workflow documented in Knowledge Base.'
  }
];

/* 6. ESTABLISHED HABIT ROUTINES (Graduated from Daily Quests, Tracked in Habits) */
const HABIT_ROUTINES_DEF = [
  {
    id: 'd1',
    name: 'Fajr on time & Morning Adhkar',
    category: 'Morning Routine',
    time: 'Morning',
    timeOfDay: 'morning',
    target: 'Every Day',
    icon: 'compass',
    why: 'The spiritual and psychological anchor of the entire day.'
  },
  {
    id: 'd2',
    name: 'Morning Dental & Personal Care',
    category: 'Morning Routine',
    time: 'Morning',
    timeOfDay: 'morning',
    target: 'Every Day',
    icon: 'smile',
    why: 'Non-negotiable morning hygiene routine.'
  },
  {
    id: 'd8',
    name: 'No Phone for First 30 Minutes',
    category: 'Morning Routine',
    time: 'Morning',
    timeOfDay: 'morning',
    target: 'Every Day',
    icon: 'shield',
    why: 'Protects morning mental clarity from reactive dopamine scrolling.'
  },
  {
    id: 'd4',
    name: 'Hydration: 2 Litres of Water',
    category: 'Daytime Routine',
    time: 'Day',
    timeOfDay: 'day',
    target: 'Every Day',
    icon: 'droplet',
    why: 'Maintains sustained mental focus and metabolic health.'
  },
  {
    id: 'd10',
    name: '1 Hour Screen-Free Deep Focus / Disconnect',
    category: 'Daytime Routine',
    time: 'Day',
    timeOfDay: 'day',
    target: 'Every Day',
    icon: 'eyeOff',
    why: 'Rebuilds deep attention span and trains dopamine control.'
  },
  {
    id: 'd14',
    name: 'Daily Spoken English Interview Drill',
    category: 'Professional Discipline',
    time: 'Day',
    timeOfDay: 'day',
    target: 'Every Day',
    icon: 'mic',
    why: 'Maintains spoken fluency and conversational agility for Gulf interviews.'
  },
  {
    id: 'd11',
    name: 'Log Itemized Daily Expenses',
    category: 'Evening Routine',
    time: 'Night',
    timeOfDay: 'evening',
    target: 'Every Day',
    icon: 'dollar',
    why: 'Ensures absolute financial awareness and spending discipline.'
  },
  {
    id: 'd22',
    name: 'Plan Tomorrow\'s Top 3 Priorities',
    category: 'Evening Routine',
    time: 'Night',
    timeOfDay: 'evening',
    target: 'Every Day',
    icon: 'list',
    why: 'Eliminates morning decision fatigue; allows immediate focused execution.'
  },
  {
    id: 'd9',
    name: 'No Phone 30 Minutes Before Sleep',
    category: 'Evening Routine',
    time: 'Night',
    timeOfDay: 'evening',
    target: 'Every Day',
    icon: 'moon',
    why: 'Protects sleep architecture and circadian rhythm.'
  },
  {
    id: 'd3',
    name: 'Night Dental Care',
    category: 'Evening Routine',
    time: 'Night',
    timeOfDay: 'evening',
    target: 'Every Day',
    icon: 'smile',
    why: 'Non-negotiable nighttime health routine.'
  }
];

/* 7. COMPETENCY & SKILLS MATRIX */
const SKILL_MATRIX_DEF = [
  { id: 'sk_meta', name: 'Meta Ads & Advantage+ Ecosystem', current: 85, target: 95, cat: 'Paid Media', domain: 'Paid Media', proof: 'Managed 27 programs & $171K+ spend at IRA Academy', action: 'Managed 27 programs & $171K+ spend at IRA Academy' },
  { id: 'sk_leadgen', name: 'Instant Forms & Lead Gen Optimization', current: 80, target: 90, cat: 'Conversion', domain: 'Conversion', proof: '11,406 leads generated at TL 15.06 blended CPL', action: '11,406 leads generated at TL 15.06 blended CPL' },
  { id: 'sk_capi', name: 'Meta Conversions API & Tracking Diagnostics', current: 55, target: 85, cat: 'Technical', domain: 'Technical', proof: 'Server-side CAPI implementation & event deduplication', action: 'Server-side CAPI implementation & event deduplication' },
  { id: 'sk_ga4', name: 'Google Analytics 4 & Tag Manager', current: 60, target: 80, cat: 'Analytics', domain: 'Analytics', proof: 'Custom lead event triggers and conversion funnel tracking', action: 'Custom lead event triggers and conversion funnel tracking' },
  { id: 'sk_cro', name: 'Landing Page CRO & Ad Copywriting', current: 75, target: 85, cat: 'Creative', domain: 'Creative', proof: 'High-converting Arabic direct-response frameworks', action: 'High-converting Arabic direct-response frameworks' },
  { id: 'sk_ai_video', name: 'AI Video Ad Automation (ElevenLabs/CapCut)', current: 65, target: 85, cat: 'Creative', domain: 'Creative', proof: 'Multimodal Arabic UGC ad generation in under 20 mins', action: 'Multimodal Arabic UGC ad generation in under 20 mins' },
  { id: 'sk_english', name: 'Business English Fluency & Pitch Delivery', current: 50, target: 75, cat: 'Communication', domain: 'Communication', proof: 'EF SET Speaking 50 (B1) -> Targeted B2/C1 interview ready', action: 'EF SET Speaking 50 (B1) -> Targeted B2/C1 interview ready' },
  { id: 'sk_typing', name: 'Touch Typing & Execution Speed', current: 35, target: 60, cat: 'Discipline', domain: 'Discipline', proof: '35 WPM on keybr/monkeytype -> Target 60 WPM', action: '35 WPM on keybr/monkeytype -> Target 60 WPM' }
];

/* 8. SAUDI RELOCATION RUNWAY CONFIGURATION */
const RELOCATION_BUFFER_CONFIG = {
  currency: 'EGP',
  targetTotal: 120000,
  breakdown: [
    { label: 'Visa, Attestations & Medical Processing', amount: 25000 },
    { label: 'Round-trip Flight & Initial Baggage', amount: 20000 },
    { label: 'First Month Housing Deposit in Riyadh/Jeddah', amount: 45000 },
    { label: '60-Day Emergency Buffer & Living Runway', amount: 30000 }
  ]
};
