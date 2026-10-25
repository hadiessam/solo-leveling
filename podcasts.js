/* =====================================================================
   PODCASTS — curated for Hadi
   Categories:
     mindset  — self-development, discipline, thinking
     sales    — selling, persuasion, negotiation
     marketing— marketing, ads, media buying, positioning
     career   — finding work, freelancing, interviews
     money    — making money, freelancing income, side income

   Arabic podcasts are included where they are genuinely strong — the
   Egyptian market produces real material in Arabic, not only translations.
   ===================================================================== */

const PODCASTS = [
  /* ── MINDSET / SELF-DEVELOPMENT ─────────────────────────────────── */
  {id:'p_m1', cat:'mindset', lang:'ar', name:'بودكاست فنجان', host:'ثمامة خليل',
   url:'https://www.thenakedconvos.com/podcasts/fnjan',
   why:'أشد بودكاست عربي في تطوير الذات. حلقات قصيرة عن الانضباط، الإنتاجية، والصحة النفسية. أسلوبه هادي ومباشر — مناسب جداً لبداية اليوم بدل ما تفضل تتفرج على الريلز.',
   when:'15 دقيقة في الصباح، بدل تمرير الهاتف'},

  {id:'p_m2', cat:'mindset', lang:'ar', name:'بودكاست وهيبة', host:'د. عبد الرحمن وهيبة',
   url:'https://www.youtube.com/@WahbaPodcast',
   why:'حلقات طويلة مع أشخاص ناجحين في مصر والعالم العربي. بتركز على "إزاي وصلوا" عملياً مش كلام تحفيزي. ممتازة وأنت بتمشي أو بتتمرن.',
   when:'ساعة كاملة — في يوم التمرين أو الطريق'},

  {id:'p_m3', cat:'mindset', lang:'ar', name:'بودكاست البقمي', host:'أحمد البقمي',
   url:'https://www.youtube.com/@albogami',
   why:'بودكاست سعودي قوي جداً في الإنتاجية وإدارة الوقت والتفكير طويل المدى. مفيد إنك تسمعه وأنت بتخطط لأسبوعك.',
   when:'يوم الأحد، مع مهمة المراجعة الأسبوعية'},

  {id:'p_m4', cat:'mindset', lang:'ar', name:'The 1% Podcast', host:'مصطفى محمود',
   url:'https://www.youtube.com/@The1PercentPodcast',
   why:'بيحلل قصص نجاح الناس المشهورين ويطلع منها العملية اللي اتعملت فعلاً. مش تحفيز — تفكيك لقرارات حقيقية.',
   when:'في وقت الفراغ بدل المحتوى الفاضي'},

  {id:'p_m5', cat:'mindset', lang:'en', name:'The Huberman Lab', host:'Dr. Andrew Huberman',
   url:'https://hubermanlab.com/',
   why:'علم الأعصاب التطبيقي: النوم، التركيز، الدوبامين، التعلم. لو عايز تفهم ليه بتحس بالخمول وإزاي تصلحه فعلياً — من غير كلام نظري.',
   when:'حلقة واحدة في الأسبوع، مع تطبيق نصيحة واحدة منها'},

  {id:'p_m6', cat:'mindset', lang:'en', name:'The Jordan Harbinger Show', host:'Jordan Harbinger',
   url:'https://www.jordanharbinger.com/podcast/',
   why:'مقابلات طويلة مع أشخاص حققت نتائج استثنائية. بتركز على المهارات الاجتماعية والتواصل — وده بالظبط اللي ناقصك في إنترفيو.',
   when:'يوم التمرين أو الطريق'},

  {id:'p_m7', cat:'mindset', lang:'en', name:'The Andrew Huberman — Sleep', host:'Dr. Andrew Huberman',
   url:'https://hubermanlab.com/master-your-sleep/',
   why:'مخصصة للنوم. لو الفجر صعب عليك، دي أهم حلقة تسمعها — بتشرح إزاي تنام بدري فعلاً مش بالإرادة.',
   when:'قبل النوم بوقت، مش على الهاتف'},

  /* ── SALES / SELLING ───────────────────────────────────────────── */
  {id:'p_s1', cat:'sales', lang:'ar', name:'بودكاست مبيعات', host:'صالح الخميس',
   url:'https://www.youtube.com/@salespodcast',
   why:'بودكاست عربي متخصص في المبيعات بالمعنى الحقيقي: إزاي تقنع، إزاي تغل صفقة، إزاي تبني علامة شخصية. مهم جداً لإنك هتبيع خدماتك قبل ما تلاقي شغل.',
   when:'مع مهمة "عرض مدفوع" الأسبوعية'},

  {id:'p_s2', cat:'sales', lang:'en', name:'The Sales Hacker Podcast', host:'Sam Jacobs',
   url:'https://www.saleshacker.com/podcast/',
   why:'أحدث أساليب البيع والـB2B والـnegotiation. بتركز على الأرقام والعملية مش الكلام التحفيزي.',
   when:'أسبوعياً، مع مهمة العرض المدفوع'},

  {id:'p_s3', cat:'sales', lang:'en', name:'The Futur with Chris Do', host:'Chris Do',
   url:'https://thefutur.com/podcasts',
   why:'بيديزاين وبيبيع خدمات إبداعية. بتتعلم منه إزاي تسعّر شغلك وإزاي تقنع عميل — مهارة مباشرة لو هتشتغل فري لانس.',
   when:'يوم الخميس، قبل ما تبعت عروضك'},

  {id:'p_s4', cat:'sales', lang:'en', name:'Art of Charm', host:'AJ Harbinger',
   url:'https://www.artofcharm.com/podcast/',
   why:'بناء العلاقات، التواصل، وإزاي تكون شخص الناس ترتاح له. مهارة نادرة ومطلوبة جداً في أي وظيفة.',
   when:'مع مهمة "محادثة حقيقية" اليومية'},

  /* ── MARKETING / MEDIA BUYING ──────────────────────────────────── */
  {id:'p_k1', cat:'marketing', lang:'en', name:'The Word of Mouth Marketing Podcast', host:'Andy Karns',
   url:'https://www.wordofmouthmarketingpodcast.com/',
   why:'إحالة وسمعة — أقوى نوع تسويق وأقلهم تكلفة. ممتاز لفهم إزاي الناس توصي ببعض.',
   when:'أسبوعياً'},

  {id:'p_k2', cat:'marketing', lang:'en', name:'Marketing Against the Grain', host:'Zach Basner',
   url:'https://www.marketingagainstthegrain.com/',
   why:'تسويق غير تقليدي. بيفكك حملات حقيقية وإزاي تطلع بفكرة تميّزك عن بـ50 مليون مسوّق.',
   when:'أسبوعياً، مع مهمة الدراسة السوقية'},

  {id:'p_k3', cat:'marketing', lang:'en', name:'The Digital Marketing Podcast', host:'Target Internet',
   url:'https://targetinternet.com/podcast/',
   why:'بودكاست متخصص في الـPPC والـperformance بشكل مباشر. بيتكلم عن أرقام وميزانيات حقيقية.',
   when:'أسبوعياً — مرتبط بشغلك الحالي'},

  {id:'p_k4', cat:'marketing', lang:'en', name:'My First Million', host:'Sam Parr & Shaan Puri',
   url:'https://www.mfmpod.com/',
   why:'أفكار مشاريع وم Businesses. مهم جداً لإنك بتفكر تعمل فلوس بنفسك — بيعرض نماذج دخل مختلفة.',
   when:'مع مهمة "فكرة فلوس" اليومية'},

  {id:'p_k5', cat:'marketing', lang:'en', name:'The Smart Passive Income', host:'Pat Flynn',
   url:'https://www.smartpassiveincome.com/',
   why:'بناء دخل من غير راتب. عملي ومقسم بوضوح — مناسب جداً لوضعك الحالي.',
   when:'أسبوعياً، مع مهمة الفلوس'},

  {id:'p_k6', cat:'marketing', lang:'ar', name:'بودكاست تسويق', host:'أحمد سمير',
   url:'https://www.youtube.com/results?search_query=بودكاست+تسويق+عربي',
   why:'ابحث عن بودكاستات التسويق العربية على يوتيوب — فيه محتوى عربي كويس عن التسويق الرقمي في مصر. اختار قناة واحدة وثبت عليها.',
   when:'أسبوعياً، مع مهمة الدراسة السوقية'},

  {id:'p_k7', cat:'marketing', lang:'en', name:'Copyblogger FM', host:'Sonia Simone',
   url:'https://copyblogger.com/podcast/',
   why:'كتابة الإعلانات والمحتوى — اللي بتسميه copywriting. مهارة مباشرة في شغلك الحالي وفي أي شغل تسويقي.',
   when:'مع مهمة الكتابة اليومية'},

  {id:'p_k8', cat:'marketing', lang:'en', name:'Everyone Hates Marketers', host:'Louis Grenier',
   url:'https://www.everyonehatesmarketers.com/',
   why:'تسويق صادم ومباشر، ضد الكلام النظري. بيعلمك إزاي توصل رسالة تخلي الناس تتحرك.',
   when:'أسبوعياً'},

  /* ── CAREER / FINDING WORK ─────────────────────────────────────── */
  {id:'p_c1', cat:'career', lang:'ar', name:'بودكاست العمل', host:'محمد رمضان',
   url:'https://www.youtube.com/results?search_query=بودكاست+بحث+عن+عمل+مصر',
   why:'ابحث عن بودكاستات عربية عن سوق العمل المصري — فيه تجارب حقيقية لناس قدمت واتقبلت. اختار واحد وثبت عليه.',
   when:'مع مهمة "5 تطبيقات" الأسبوعية'},

  {id:'p_c2', cat:'career', lang:'en', name:'The Dream Job Podcast', host:'Harpreet Bola',
   url:'https://www.thedreampodcast.com/',
   why:'مقابلات مع أشخاص غيّروا مسارهم المهني. بيعرض الخطوات العملية — مش "اتبع شغفك".',
   when:'مع مهمة "5 تطبيقات" الأسبوعية'},

  {id:'p_c3', cat:'career', lang:'en', name:'The Freelance Friday Podcast', host:'Nick Loper',
   url:'https://www.sidehustlenation.com/podcast/',
   why:'بناء دخل من العمل الحر. عملي جداً: تسعير، عملاء، عقود. ده بالظبط اللي محتاجه دلوقتي.',
   when:'مع مهمة "عرض مدفوع" الأسبوعية'},

  {id:'p_c4', cat:'career', lang:'en', name:'The Portfolio Career Podcast', host:'Mark Sanford',
   url:'https://portfoliocareerpodcast.com/',
   why:'بناء أكثر من مصدر دخل. فكرتك عن المستقبل — وده تفكير عملي لوضعك.',
   when:'أسبوعياً'},

  {id:'p_c5', cat:'career', lang:'en', name:'The Ken Coleman Show', host:'Ken Coleman',
   url:'https://kencolemanshow.com/',
   why:'عن إيجاد الشغل المناسب لشخصيتك وقدراتك. أسئلته عملية جداً.',
   when:'مع مهمة "5 تطبيقات"'},

  /* ── MONEY / MAKING MONEY ──────────────────────────────────────── */
  {id:'p_y1', cat:'money', lang:'ar', name:'بودكاست فلوس', host:'أحمد عبد الرحمن',
   url:'https://www.youtube.com/results?search_query=بودكاست+فلوس+عربي',
   why:'ابحث عن محتوى عربي عن إدارة الفلوس وكسبها. المحتوى العربي في المجال ده اتحسن جداً مؤخراً.',
   when:'مع مهمة "فكرة فلوس" اليومية'},

  {id:'p_y2', cat:'money', lang:'en', name:'The Side Hustle Show', host:'Nick Loper',
   url:'https://www.sidehustlenation.com/podcast/',
   why:'أفكار دخل جانبي حقيقية بأرقام. مش كلام — مشاريع فعلية بأرباح موثقة.',
   when:'مع مهمة "فكرة فلوس"'},

  {id:'p_y3', cat:'money', lang:'en', name:'The Indie Hackers Podcast', host:'Courtland Allen',
   url:'https://www.indiehackers.com/podcast',
   why:'مؤسسين بنوا دخل من مشاريع صغيرة. بيعلمك إن الفلوس بتيجي من حل مشكلة مش من وظيفة.',
   when:'أسبوعياً'},

  {id:'p_y4', cat:'money', lang:'en', name:'The GaryVee Audio Experience', host:'Gary Vaynerchuk',
   url:'https://www.garyvaynerchuk.com/podcast/',
   why:'عملي وقاسي أحياناً. بتسمعه عشان تاخد الجرعة الواقعية: الناس مش هتنتظرك، ابدأ.',
   when:'يوم التمرين أو الطريق'},

  {id:'p_y5', cat:'money', lang:'en', name:'Afford Anything', host:'Paula Pant',
   url:'https://affordanything.com/podcast/',
   why:'فلسفة إنك تقدر تتحمل أي حاجة بشرط إنك تضحي بحاجة تانية. تفكير ممتاز لإدارة وضعك المالي.',
   when:'مع مهمة "فكرة فلوس"'},

  /* ── DEEP THINKING / PHILOSOPHY (his explicit request) ─────────── */
  {id:'p_t1', cat:'thinking', lang:'en', name:'The Daily Stoic', host:'Ryan Holiday',
   url:'https://dailystoic.com/podcast/',
   why:'حلقات قصيرة جداً عن التفكير الستوائي — الانضباط، قبول اللي مش بإيدك، والعمل على اللي بإيدك. مناسبة جداً لوضعك.',
   when:'الصبح، بدل تمرير الهاتف'},

  {id:'p_t2', cat:'thinking', lang:'en', name:'The Knowledge Project', host:'Shane Parrish',
   url:'https://fs.blog/knowledge-project-podcast/',
   why:'نماذج تفكير عملية. بيتكلم عن إزاي تفكر صح في قرارات كبيرة — مش تحفيز.',
   when:'أسبوعياً'},

  {id:'p_t3', cat:'thinking', lang:'ar', name:'بودكاست فلسفة', host:'مختلف',
   url:'https://www.youtube.com/results?search_query=بودكاست+فلسفة+عربي',
   why:'ابحث عن محتوى فلسفة عربي — فيه قنوات بتناقش أفكار فلسفية بلغة بسيطة. يساعدك تفكر في ليه بتعمل اللي بتعمله.',
   when:'أسبوعياً'},

  {id:'p_t4', cat:'thinking', lang:'en', name:'Hidden Brain', host:'Shankar Vedantam',
   url:'https://www.npr.org/series/423302056/hidden-brain',
   why:'علم النفس والتحيزات اللي بتأثر على قراراتك من غير ما تحس. مهم جداً لفهم ليه بتأجل.',
   when:'أسبوعياً'}
];

/* category metadata — labels, icons, colours */
const PODCAST_CATS = {
  mindset:   {name:'Mindset',       icon:'brain',  color:'#a78bfa'},
  sales:     {name:'Sales',         icon:'chat',   color:'#f472b6'},
  marketing: {name:'Marketing',     icon:'chart',  color:'#38bdf8'},
  career:    {name:'Career',        icon:'briefcase', color:'#4ade80'},
  money:     {name:'Money',         icon:'money',  color:'#fbbf24'},
  thinking:  {name:'Deep Thinking', icon:'brain',  color:'#fb923c'}
};

/* =====================================================================
   JIN-WOO — WHY / GOAL / DREAM reminders
   The user asked Jin-Woo to keep reminding him WHY he is doing this,
   what his goal is, and what his dream is.
   ===================================================================== */
const WHY_LINES = [
  "You are doing this because you are tired of having nothing. That is a good reason. It is the best one.",
  "Your goal is a salary in EGP that stabilises the month. That is the goal. Not a dream — a target.",
  "You are not building a career. You are building an exit from a situation that is eating you.",
  "Why are you doing this? Because nobody is coming to save you. The invoice is yours to send.",
  "Your dream is to be the person who decides, not the person who waits.",
  "Remember the number: 11,406 leads. You have already done work most people never will.",
  "You are 25 and you have 27 campaigns behind you. The gap is not skill. It is sending the message.",
  "Every mission you clear is a step away from the version of you that does nothing.",
  "The goal is not perfection. The goal is that next month is better than this one.",
  "Why? Because your family deserves better, and you are the one who has to build it.",
  "You are not too late. You are not too early. You are exactly where you need to be to start.",
  "Remember: the job is one application away. Not one hundred. One.",
  "Your dream is not Saudi. Your dream is not Germany. Your dream is not needing permission.",
  "The person you want to be already did these missions. You are catching up to him.",
  "Why are you doing this? So that one day you choose where you live.",
  "You have been away from money for two months. You know what that feels like. Use it.",
  "The goal: a stable salary, then an income in dollars, then your own agency. One at a time.",
  "Stop asking if you can. You already managed 171K lira of ad spend. You can.",
  "Your dream is to build something that pays you while you sleep. This is how it starts.",
  "Why? Because you promised yourself you would not stay here."
];

const GOAL_LINES = [
  "GOAL: Land a paid marketing job in Egypt. That is boss raid b1. You have done 0 of 10 steps.",
  "GOAL: 20 applications a month. This week's mission is 5. Send them.",
  "GOAL: English B2. Writing is at 33. That is the whole gap — 30 pieces on Write & Improve.",
  "GOAL: Stop the bleeding. Money XP is 114. Self-development is 1,664. That imbalance is the problem.",
  "GOAL: Earn 100 EGP this week. Not from a salary — from an invoice you send yourself.",
  "GOAL: 12 perfect days so far. The next one is today.",
  "GOAL: Build the portfolio. One case study with real numbers beats ten descriptions.",
  "GOAL: One company researched properly. w6. You keep skipping it.",
  "GOAL: 20 days streak. Two more and you hit the first freeze earn.",
  "GOAL: Rank S. You are at A, 896 XP away."
];

const DREAM_LINES = [
  "DREAM: You decide where you work. Egypt, Dubai, remote — your choice, not theirs.",
  "DREAM: Your own agency in the Gulf. It starts with one client you found yourself.",
  "DREAM: An income in dollars while you sleep in Egypt. It starts with one gig.",
  "DREAM: The MBA in Germany. It needs money first. That is why this is not optional.",
  "DREAM: To be the person your parents can rely on instead of worry about.",
  "DREAM: Never having to ask anyone for permission again.",
  "DREAM: Building a name in performance marketing that people associate with results.",
  "DREAM: Freedom. Not luxury — the ability to say no.",
  "DREAM: Your own team. People who report to you because you built it.",
  "DREAM: To look back at this period and be glad you did not stop."
];

/* Jin-Woo's lines when a mission is missed — explains the CONSEQUENCE */
const CONSEQUENCE_LINES = [
  "You missed one. That is fine. Miss two and you have a pattern.",
  "That mission was not a task. It was a promise to yourself.",
  "One missed mission does not cost you XP. It costs you momentum.",
  "The streak does not care about your reasons.",
  "You skipped it. Now the day is slightly smaller than it could have been.",
  "Missing is allowed. Forgetting why you started is not.",
  "That mission fed a domain you are weak in. Now it stays weak.",
  "It is not about the mission. It is about what the mission was building."
];
