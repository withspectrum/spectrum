const isAdmin = (id: string) => {
  const admins = [
    'gVk5mYwccUOEKiN5vtOouqroGKo1',
    '01p2A7kDCWUjGj6zQLlMQUOSQL42',
    'VToKcde16dREgDkXcDl3hhcrFN33',
  ];
  return admins.indexOf(id) > -1;
};

const COMMUNITY_SLUG_BLACKLIST = [
  'everything',
  'notifications',
  'login',
  'logout',
  'discover',
  'explore',
  'admin',
  'dashboard',
  'home',
  'pro',
  'share',
  'undefined',
  'null',
  'legal',
  'terms',
  'privacy',
  'cookies',
  'team',
  'about',
  'contact',
  'help',
  'jobs',
  'upgrade',
  'pricing',
  'business',
  'blog',
  'apps',
  'developers',
  'status',
  'copyright',
  'downgrade',
  'faq',
  'help',
  'security',
  'api',
  'shop',
  'new',
  'auth',
];

const slugIsBlacklisted = slug => {
  return COMMUNITY_SLUG_BLACKLIST.indexOf(slug) > -1;
};

module.exports = {
  isAdmin,
  slugIsBlacklisted,
};
