// @flow
import {
  COMMUNITY_SLUG_BLACKLIST,
  CHANNEL_SLUG_BLACKLIST,
} from 'shared/slug-blacklists';

export const isAdmin = (id: string): boolean => {
  const admins = [
    'gVk5mYwccUOEKiN5vtOouqroGKo1',
    '01p2A7kDCWUjGj6zQLlMQUOSQL42',
    'VToKcde16dREgDkXcDl3hhcrFN33',
  ];
  return admins.indexOf(id) > -1;
};

export const communitySlugIsBlacklisted = (slug: string): boolean => {
  return COMMUNITY_SLUG_BLACKLIST.indexOf(slug) > -1;
};

export const channelSlugIsBlacklisted = (slug: string): boolean => {
  return CHANNEL_SLUG_BLACKLIST.indexOf(slug) > -1;
};
