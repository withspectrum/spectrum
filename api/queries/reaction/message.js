// @flow
import type { DBReaction } from 'shared/types';
import { getMessage } from '../../models/message';

export default ({ messageId }: DBReaction) => getMessage(messageId);
