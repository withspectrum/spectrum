import {
  COMMUNITY_SLUG_BLACKLIST,
  CHANNEL_SLUG_BLACKLIST,
} from 'shared/slug-blacklists';

const isAdmin = (id: string) => {
  const admins = [
    'gVk5mYwccUOEKiN5vtOouqroGKo1',
    '01p2A7kDCWUjGj6zQLlMQUOSQL42',
    'VToKcde16dREgDkXcDl3hhcrFN33',
  ];
  return admins.indexOf(id) > -1;
};

const communitySlugIsBlacklisted = slug => {
  return COMMUNITY_SLUG_BLACKLIST.indexOf(slug) > -1;
};

const channelSlugIsBlacklisted = slug => {
  return CHANNEL_SLUG_BLACKLIST.indexOf(slug) > -1;
};

module.exports = {
  isAdmin,
  communitySlugIsBlacklisted,
  channelSlugIsBlacklisted,
};
