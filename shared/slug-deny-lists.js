/**
 * This file is shared between server and client.
 * ⚠️ DON'T PUT ANY NODE.JS OR BROWSER-SPECIFIC CODE IN HERE ⚠️
 */

var COMMUNITY_SLUG_DENY_LIST = [
  'about',
  'admin',
  'api',
  'apps',
  'blog',
  'business',
  'code-of-conduct',
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
  'features',
  'help',
  'home',
  'jobs',
  'legal',
  'login',
  'logout',
  'messages',
  'new',
  'notifications',
  'null',
  'pages',
  'pricing',
  'privacy',
  'pro',
  'profile',
  'search',
  'security',
  'settings',
  'share',
  'shop',
  'status',
  'support',
  'team',
  'terms',
  'thread',
  'undefined',
  'upgrade',
  'user',
  'users',
  'me',
];

var CHANNEL_SLUG_DENY_LIST = ['feed', 'members', 'settings'];

module.exports = {
  COMMUNITY_SLUG_DENY_LIST: COMMUNITY_SLUG_DENY_LIST,
  CHANNEL_SLUG_DENY_LIST: CHANNEL_SLUG_DENY_LIST,
};
