// @flow
import type { DBMessage } from 'shared/types';
import body from './content/body';

export default (message: DBMessage) => ({
  body: body(message),
});
