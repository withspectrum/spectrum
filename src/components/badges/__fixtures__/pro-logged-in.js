// @flow
import Badge from '..';

// TODO: Create utils for generate state
const currentUser = {
  id: 'fde20b69-448d-4c5d-855b-bba365020b06',
  profilePhoto:
    'https://spectrum-imgp.imgix.net/https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F765553915022696448%2FEoJoKCnQ_normal.jpg?w=128&h=128&ixlib=js-1.1.1&s=86d0aa5c119b85fa14a25a53b8fa9ef4',
  coverPhoto: null,
  name: 'Ovidiu',
  firstName: null,
  description: 'Building user interfaces and making UI development fun.',
  website: 'https://ovidiu.ch',
  username: 'skidding',
  isOnline: true,
  timezone: 120,
  isPro: false,
  totalReputation: 139,
};

export default {
  component: Badge,

  props: {
    type: 'pro',
  },

  reduxState: {
    users: {
      currentUser,
    },
  },
};
