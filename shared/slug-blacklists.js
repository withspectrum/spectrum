/**
 * This file is shared between server and client.
 * ⚠️ DON'T PUT ANY NODE.JS OR BROWSER-SPECIFIC CODE IN HERE ⚠️
 */

var COMMUNITY_SLUG_BLACKLIST = [
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
];

var CHANNEL_SLUG_BLACKLIST = ['feed', 'settings', 'members'];

module.exports = {
  COMMUNITY_SLUG_BLACKLIST: COMMUNITY_SLUG_BLACKLIST,
  CHANNEL_SLUG_BLACKLIST: CHANNEL_SLUG_BLACKLIST,
};
