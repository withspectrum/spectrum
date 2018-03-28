// @flow
const constants = require('./constants');
const { DATE, SPECTRUM_COMMUNITY_ID, PAYMENTS_COMMUNITY_ID } = constants;

module.exports = [
  {
    id: SPECTRUM_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: 'Spectrum',
    description: 'The future of communities',
    website: 'https://spectrum.chat',
    profilePhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Profile.png.0.6225566835336693',
    coverPhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Header.png.0.3303118636071434',
    slug: 'spectrum',
  },
  {
    id: PAYMENTS_COMMUNITY_ID,
    createdAt: new Date(DATE),
    name: 'Payments',
    description: 'Where payments are tested',
    website: 'https://spectrum.chat',
    profilePhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Profile.png.0.6225566835336693',
    coverPhoto:
      'https://spectrum.imgix.net/communities/-Kh6RfPYjmSaIWbkck8i/Twitter Header.png.0.3303118636071434',
    slug: 'payments',
  },
];
