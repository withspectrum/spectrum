// @flow
const constants = require('./constants');
const {
  DATE,
  SPECTRUM_COMMUNITY_ID,
  PAYMENTS_COMMUNITY_ID,
  DELETED_COMMUNITY_ID,
  PRIVATE_COMMUNITY_ID,
  SINGLE_CHANNEL_COMMUNITY_ID,
  PRIVATE_COMMUNITY_WITH_JOIN_TOKEN_ID,
} = constants;

module.exports = [
  {
    id: SPECTRUM_COMMUNITY_ID,
    createdAt: new Date(DATE),
    isPrivate: false,
    name: 'Spectrum',
    description: 'The future of communities',
    website: 'https://spectrum.chat',
    profilePhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Profile.png.0.6225566835336693',
    coverPhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Header.png.0.3303118636071434',
    slug: 'spectrum',
    memberCount: 4,
  },
  {
    id: PAYMENTS_COMMUNITY_ID,
    createdAt: new Date(DATE),
    isPrivate: false,
    name: 'Payments',
    description: 'Where payments are tested',
    website: 'https://spectrum.chat',
    profilePhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Profile.png.0.6225566835336693',
    coverPhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Header.png.0.3303118636071434',
    slug: 'payments',
    memberCount: 5,
  },
  {
    id: DELETED_COMMUNITY_ID,
    createdAt: new Date(DATE),
    deletedAt: new Date(DATE),
    isPrivate: false,
    name: 'Deleted',
    description: 'Things didnt work out',
    website: 'https://spectrum.chat',
    profilePhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Profile.png.0.6225566835336693',
    coverPhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Header.png.0.3303118636071434',
    slug: 'deleted',
    memberCount: 0,
  },
  {
    id: PRIVATE_COMMUNITY_ID,
    createdAt: new Date(DATE),
    isPrivate: true,
    name: 'Private community',
    description: 'Private community',
    website: 'https://spectrum.chat',
    profilePhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Profile.png.0.6225566835336693',
    coverPhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Header.png.0.3303118636071434',
    slug: 'private',
    memberCount: 1,
  },
  {
    id: SINGLE_CHANNEL_COMMUNITY_ID,
    createdAt: new Date(DATE),
    isPrivate: false,
    name: 'Single channel community',
    description: 'Single channel community',
    website: 'https://spectrum.chat',
    profilePhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Profile.png.0.6225566835336693',
    coverPhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Header.png.0.3303118636071434',
    slug: 'single',
    memberCount: 1,
  },
  {
    id: PRIVATE_COMMUNITY_WITH_JOIN_TOKEN_ID,
    createdAt: new Date(DATE),
    isPrivate: true,
    name: 'private community with join token',
    description: 'private community with join token',
    website: 'https://spectrum.chat',
    profilePhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Profile.png.0.6225566835336693',
    coverPhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Header.png.0.3303118636071434',
    slug: 'private-join',
    memberCount: 1,
  },
];
