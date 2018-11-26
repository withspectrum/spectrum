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
    profilePhoto: `/default_images/profile-${color}.png`,
    coverPhoto: `/default_images/cover-${color}.svg`,
  };
};
