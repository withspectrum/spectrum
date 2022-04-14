import { getNotifications } from '../models/notification';
import createLoader from './create-loader';
import type { Loader } from './types';

export const __createNotificationLoader = createLoader(notifications =>
  getNotifications(notifications)
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
