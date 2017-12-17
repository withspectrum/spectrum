/**
 * This file is shared between server and client.
 * ⚠️ DON'T PUT ANY NODE.JS OR BROWSER-SPECIFIC CODE IN HERE ⚠️
 */

var COMMUNITY_SLUG_BLACKLIST = [
  'about',
  'admin',
  'api',
  'apps',
  'blog',
  'business',
  'contact',
  'cookies',
  'copyright',
  'dashboard',
  'developers',
  'discover',
  'downgrade',
  'everything',
  'explore',
  'faq',
  'help',
  'home',
  'jobs',
  'legal',
  'login',
  'logout',
  'new',
  'notifications',
  'null',
  'pricing',
  'privacy',
  'pro',
  'security',
  'share',
  'shop',
  'status',
  'support',
  'team',
  'terms',
  'undefined',
  'upgrade',
];

var CHANNEL_SLUG_BLACKLIST = ['feed', 'members', 'settings'];

module.exports = {
  COMMUNITY_SLUG_BLACKLIST: COMMUNITY_SLUG_BLACKLIST,
  CHANNEL_SLUG_BLACKLIST: CHANNEL_SLUG_BLACKLIST,
};
