// @flow
import type { GraphQLContext } from '../../';

export default ({ attachments }: { attachments: Array<any> }) =>
  attachments &&
  attachments.map(attachment => {
    return {
      attachmentType: attachment.attachmentType,
      data: JSON.stringify(attachment.data),
    };
  });
