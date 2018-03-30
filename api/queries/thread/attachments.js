// @flow
import type { DBThread } from 'shared/types';

export default ({ attachments }: DBThread) =>
  attachments &&
  attachments.map(attachment => {
    return {
      attachmentType: attachment.attachmentType,
      data: JSON.stringify(attachment.data),
    };
  });
