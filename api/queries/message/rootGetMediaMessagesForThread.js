// @flow
import { getMediaMessagesForThread } from '../../models/message';

export default (_: any, { threadId }: { threadId: string }) =>
  getMediaMessagesForThread(threadId);
