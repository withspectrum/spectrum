// @flow
import { signImageUrl, stripLegacyPrefix, hasLegacyPrefix } from './sign';
import { signCommunity } from './signCommunity';
import { signThread } from './signThread';
import { signUser } from './signUser';
import { signMessage } from './signMessage';

export {
  stripLegacyPrefix,
  hasLegacyPrefix,
  signImageUrl,
  signCommunity,
  signThread,
  signUser,
  signMessage,
};

export default signImageUrl;
