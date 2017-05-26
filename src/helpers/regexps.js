// Regex to match "~channel-slug" in text
export const CHANNELS = /(^|\s)(~[A-Z0-9\-]+)/gi;
// Regex to match ">spectrum.chat/~channel</a>"
export const CHANNEL_ANCHORS = />spectrum\.chat\/[A-Z0-9\-]+\/(~[A-Z0-9\-]+)<\/a>/gi;
// Prevent community slugs from being created
export const COMMUNITY_SLUG_BLACKLIST = [
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
];

export const URLS = /(^|\s)(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
