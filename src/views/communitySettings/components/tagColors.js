// @flow
import { theme } from 'shared/theme';

const colors = [
  theme.brand.default,
  theme.brand.alt,
  theme.brand.dark,
  theme.social.facebook.default,
  theme.social.facebook.alt,
  theme.social.twitter.default,
  theme.social.twitter.alt,
  theme.social.google.default,
  theme.space.default,
  theme.space.alt,
  theme.space.dark,
  theme.space.border,
  theme.special.default,
  theme.special.alt,
  theme.special.dark,
  theme.special.border,
  theme.warn.default,
  theme.warn.alt,
  theme.warn.dark,
  theme.warn.border,
  theme.success.default,
  theme.success.alt,
  theme.success.dark,
  theme.success.border,
  ...Object.keys(theme.ios).map(key => theme.ios[key]),
];

export const getRandomHex = () =>
  colors[Math.floor(Math.random() * colors.length)];
