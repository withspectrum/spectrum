// @flow
import type { DBMessage } from 'shared/types';
import { getThread } from '../../models/thread';

export default ({ threadId }: DBMessage) => getThread(threadId);
