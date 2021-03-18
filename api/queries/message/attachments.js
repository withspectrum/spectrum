// @flow
import type { DBMessage } from 'shared/types';

export default ({ attachments }: DBMessage) => {
  return attachments || [];
};
