// @flow
const random = require('faker/lib/random');

// Helper function to get a random profile and cover photo
const PALETTE = [
  'blue',
  'blush',
  'cool',
  'green',
  'orange',
  'peach',
  'pink',
  'red',
  'teal',
  'violet',
];
export default () => {
  const color = random.arrayElement(PALETTE);
  return {
    profilePhoto: `https://s3.amazonaws.com/spectrum-chat/default_images/profile-${color}.png`,
    coverPhoto: `https://s3.amazonaws.com/spectrum-chat/default_images/cover-${color}.svg`,
  };
};
