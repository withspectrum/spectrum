// @flow
import hostValidation from 'host-validation';

const trusted = [
  process.env.NOW_URL,
  'https://spectrum.chat/',
  'https://alpha.spectrum.chat/',
].filter(Boolean);

export default hostValidation({
  hosts: trusted,
  referer: trusted,
  mode: 'either',
});
