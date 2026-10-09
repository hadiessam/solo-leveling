/* =====================================================================
   SOLO LEVELING — UP TO DATE
   Social platform news tracker and XP actions.
   ===================================================================== */

const PLATFORMS = [
  {
    id: 'meta', name: 'Meta', category: 'meta', icon: 'users', color: '#0082FB',
    url: 'https://about.fb.com/news/',
    recentUpdates: [
      { id: 'meta_1', title: 'Meta AI rolls out across consumer apps', date: '2025', summary: 'AI assistants are being expanded across Facebook, Instagram, WhatsApp and Messenger.', implications: 'Builds more personalized surfaces for Discovery+ and conversational commerce.' },
      { id: 'meta_2', title: 'Advantage+ campaign controls expand', date: '2025', summary: 'Meta continues expanding automated campaign and creative optimization controls.', implications: 'Reduces manual testing and rewards audience-led optimization.' }
    ],
    upcomingFeatures: ['Deeper AI campaign controls', 'More cross-app creative optimization', 'Expanded business messaging tools'],
    marketingImplications: 'Prioritize first-party data, creative variation and measurement that survives signal loss.'
  },
  {
    id: 'tiktok', name: 'TikTok', category: 'tiktok', icon: 'bolt', color: '#00f2ea',
    url: 'https://newsroom.tiktok.com/',
    recentUpdates: [
      { id: 'tiktok_1', title: 'Commerce and creator collaboration mature', date: '2025', summary: 'TikTok is expanding shopping tools and structured creator-brand collaboration.', implications: 'Short-form commerce rewards useful, native creator content over interruptive ads.' },
      { id: 'tiktok_2', title: 'Measurement and brand-safety controls evolve', date: '2024', summary: 'Platforms are adding more transparency and campaign verification options.', implications: 'Makes creative quality and verifiable outcomes more valuable.' }
    ],
    upcomingFeatures: ['AI-assisted creative production', 'More commerce checkout paths', 'Stronger advertiser verification'],
    marketingImplications: 'Plan for rapid creative iteration and native creator partnerships.'
  },
  {
    id: 'x', name: 'X', category: 'x', icon: 'x', color: '#000000',
    url: 'https://business.x.com/en/blog',
    recentUpdates: [
      { id: 'x_1', title: 'X invests in video, creator and commerce features', date: '2025', summary: 'X is expanding premium content, creator tools and product discovery features.', implications: 'Adds more options for live conversation and creator-led launches.' },
      { id: 'x_2', title: 'Premium audiences become more important', date: '2024', summary: 'Subscription tiers and ad products are creating a more segmented audience.', implications: 'Reach may be narrower, so relevance and creative quality matter more.' }
    ],
    upcomingFeatures: ['Enhanced creator revenue tools', 'Expanded video products', 'More commerce discovery'],
    marketingImplications: 'Use X for real-time cultural moments and direct creator distribution.'
  },
  {
    id: 'linkedin', name: 'LinkedIn', category: 'linkedin', icon: 'career', color: '#0a66c2',
    url: 'https://www.linkedin.com/blog/',
    recentUpdates: [
      { id: 'linkedin_1', title: 'LinkedIn expands professional AI tools', date: '2025', summary: 'AI is being used for matching, content suggestions and campaign recommendations.', implications: 'Clearer buyer intent can improve B2B targeting and sales alignment.' },
      { id: 'linkedin_2', title: 'Professional content surfaces evolve', date: '2024', summary: 'Newsletters, creator mode and curated professional feeds are receiving investment.', implications: 'Authoritative practitioner content can support demand creation.' }
    ],
    upcomingFeatures: ['AI-assisted campaign recommendations', 'More creator-led formats', 'Deeper sales integrations'],
    marketingImplications: 'Align LinkedIn content with the full funnel: awareness, education and pipeline.'
  },
  {
    id: 'youtube', name: 'YouTube', category: 'youtube', icon: 'play', color: '#ff0033',
    url: 'https://blog.youtube/',
    recentUpdates: [
      { id: 'youtube_1', title: 'Shorts and AI tools reshape discovery', date: '2025', summary: 'YouTube is investing in Shorts discovery, AI-assisted production and creator workflows.', implications: 'Video demand rises across short-form and long-form intent.' },
      { id: 'youtube_2', title: 'Advertiser controls extend across formats', date: '2024', summary: 'Campaign tools are expanding across Shorts, Connected TV and performance buying.', implications: 'Planning should connect reach, consideration and conversion outcomes.' }
    ],
    upcomingFeatures: ['More AI-assisted editing', 'Expanded Shorts placement', 'Improved conversion measurement'],
    marketingImplications: 'Build a full video system instead of isolated Shorts or search campaigns.'
  },
  {
    id: 'snapchat', name: 'Snapchat', category: 'other', icon: 'smile', color: '#fffc00',
    url: 'https://newsroom.snap.com/',
    recentUpdates: [
      { id: 'snap_1', title: 'Snap expands AR and AI experiences', date: '2025', summary: 'Snapchat is developing new AR lenses, discovery experiences and AI-assisted features.', implications: 'AR can make campaigns more interactive and measurable.' },
      { id: 'snap_2', title: 'Snapchat+ grows premium ad surfaces', date: '2024', summary: 'Subscription growth and creator content are expanding ways to reach engaged users.', implications: 'Younger audiences need native, socially relevant creative.' }
    ],
    upcomingFeatures: ['More branded AR experiences', 'AI-powered recommendations', 'Expanded commerce tools'],
    marketingImplications: 'Test Snapchat for social proof, AR trial and younger demographic reach.'
  },
  {
    id: 'pinterest', name: 'Pinterest', category: 'other', icon: 'star', color: '#e60023',
    url: 'https://newsroom.pinterest.com/',
    recentUpdates: [
      { id: 'pinterest_1', title: 'Performance+ extends AI optimization', date: '2025', summary: 'Pinterest is expanding AI-driven campaign optimization and shopping outcomes.', implications: 'Visual discovery can carry users closer to purchase.' },
      { id: 'pinterest_2', title: 'Shopping and creator formats expand', date: '2024', summary: 'Pinterest is adding product pins, creator partnerships and commerce APIs.', implications: 'Product feeds and shoppable creative become more important.' }
    ],
    upcomingFeatures: ['AI creative recommendations', 'Deeper retail integrations', 'More visual search'],
    marketingImplications: 'Treat Pinterest as a visual consideration channel with strong shopping intent.'
  },
  {
    id: 'reddit', name: 'Reddit', category: 'other', icon: 'users', color: '#ff4500',
    url: 'https://www.redditinc.com/news',
    recentUpdates: [
      { id: 'reddit_1', title: 'Reddit expands AI-assisted discovery', date: '2025', summary: 'Reddit is investing in search, moderation and recommendation features.', implications: 'Community context may help brands participate more precisely.' },
      { id: 'reddit_2', title: 'Advertising tools mature', date: '2024', summary: 'Reddit is expanding targeting, formats and measurement for advertisers.', implications: 'Use niche communities for credible conversations, not broad interruption.' }
    ],
    upcomingFeatures: ['Improved community targeting', 'AI-assisted search', 'More commerce integrations'],
    marketingImplications: 'Reddit is best for insight, education and trusted community participation.'
  },
  {
    id: 'discord', name: 'Discord', category: 'other', icon: 'cloud', color: '#5865f2',
    url: 'https://discord.com/blog',
    recentUpdates: [
      { id: 'discord_1', title: 'Discord expands server monetization', date: '2025', summary: 'More servers can offer subscriptions, digital goods and premium community experiences.', implications: 'Communities can become a recurring owned channel.' },
      { id: 'discord_2', title: 'Discovery and AI features evolve', date: '2024', summary: 'Discord is improving discovery, moderation and AI-powered server tools.', implications: 'Use Discord for ongoing engagement, not one-off campaign pushes.' }
    ],
    upcomingFeatures: ['More server subscriptions', 'AI moderation', 'Expanded server shop'],
    marketingImplications: 'Build valuable communities with consistent access, support and recognition.'
  },
  {
    id: 'threads', name: 'Threads', category: 'other', icon: 'layers', color: '#000000',
    url: 'https://www.threads.com/blog',
    recentUpdates: [
      { id: 'threads_1', title: 'Threads expands discovery and API access', date: '2025', summary: 'Threads is investing in feeds, search, public conversations and developer access.', implications: 'Text-led real-time conversation can support launches and listening.' },
      { id: 'threads_2', title: 'Early commerce and creator experiments begin', date: '2024', summary: 'The platform is beginning to experiment with creator and commerce surfaces.', implications: 'Early presence may require testing with modest expectations.' }
    ],
    upcomingFeatures: ['More feed controls', 'Expanded search', 'New creator monetization tests'],
    marketingImplications: 'Use Threads as a real-time brand voice and conversation-testing surface.'
  }
];

let UTD_FILTER = 'all';

function getPlatformNews(platformId) {
  const platform = PLATFORMS.find(item => item.id === platformId);
  return platform ? platform.recentUpdates : [];
}

function getPlatformUnreadCount(platformId) {
  return getPlatformNews(platformId).filter(item => !S.uptodate.readNews.includes(item.id)).length;
}

function getUnreadCount() {
  return PLATFORMS.reduce((total, platform) => total + getPlatformUnreadCount(platform.id), 0);
}

function markAsRead(newsId) {
  if (!newsId || S.uptodate.readNews.includes(newsId)) return;
  const platform = PLATFORMS.find(item => item.recentUpdates.some(news => news.id === newsId));
  if (!platform) return;

  S.uptodate.readNews.push(newsId);
  addXP(5, null, false, 'uptodate');
  log('NEWS', 'Marked <b>' + esc(platform.name) + '</b> update as read.');
  sfx('success');

  if (getPlatformUnreadCount(platform.id) === 0) {
    addXP(10, null, false, 'uptodate_bonus');
    log('NEWS', 'Completed <b>' + esc(platform.name) + '</b> briefing bonus.');
    sfx('levelup');
  }
  save();
  renderAll();
}

function drawUpToDate() {
  const container = document.getElementById('uptodateList');
  if (!container) return;
  const filters = ['all', 'meta', 'tiktok', 'x', 'linkedin', 'youtube', 'other'];
  const visible = UTD_FILTER === 'all' ? PLATFORMS : PLATFORMS.filter(platform => platform.category === UTD_FILTER);
  const unread = getUnreadCount();

  container.innerHTML = '<div class="panel"><div class="st"><h2>Platform Intelligence</h2><span class="tag">' + unread + ' UNREAD</span></div>'
    + '<div class="hint">Track the changes that affect how audiences discover, evaluate and buy. Mark an update to earn <b>+5 XP</b>; complete a platform for <b>+10 XP</b>.</div>'
    + '<div class="utd-filters">' + filters.map(filter => '<button class="btn' + (UTD_FILTER === filter ? ' warn' : '') + '" data-utd-filter="' + filter + '">' + (filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)) + '</button>').join('') + '</div>'
    + '<div class="utd-grid">' + visible.map(function (platform) {
      const platformUnread = getPlatformUnreadCount(platform.id);
      return '<article class="utd-card" style="--platform:' + esc(platform.color) + '">'
        + '<div class="utd-card-head"><div class="utd-icon">' + ic(platform.icon, 22) + '</div><div><h3>' + esc(platform.name) + '</h3><span class="utd-category">' + esc(platform.category) + '</span></div><span class="utd-unread' + (platformUnread ? '' : ' is-read') + '">' + (platformUnread ? platformUnread + ' new' : 'Read') + '</span></div>'
        + '<h4>Recent updates</h4>' + platform.recentUpdates.map(function (news) {
          const read = S.uptodate.readNews.includes(news.id);
          return '<div class="utd-news' + (read ? ' is-read' : '') + '" data-news-id="' + esc(news.id) + '"><div class="utd-news-title"><span>' + esc(news.title) + '</span><i class="utd-dot"></i></div><small>' + esc(news.date) + '</small><p>' + esc(news.summary) + '</p><b>' + esc(news.implications) + '</b></div>';
        }).join('')
        + '<h4>Upcoming features</h4><ul>' + platform.upcomingFeatures.map(feature => '<li>' + esc(feature) + '</li>').join('') + '</ul>'
        + '<h4>Marketing implications</h4><p>' + esc(platform.marketingImplications) + '</p>'
        + '<a class="utd-link" href="' + esc(platform.url) + '" target="_blank" rel="noopener noreferrer">Read more <span aria-hidden="true">&rarr;</span></a>'
        + '</article>';
    }).join('') + '</div></div>';

  container.querySelectorAll('[data-utd-filter]').forEach(button => button.addEventListener('click', function () {
    UTD_FILTER = this.dataset.utdFilter;
    drawUpToDate();
  }));
  container.querySelectorAll('[data-news-id]').forEach(item => item.addEventListener('click', function (event) {
    if (event.target.closest('a')) return;
    markAsRead(this.dataset.newsId);
  }));
}
