import { getNotifications } from '../models/notification';
import createLoader from './create-loader';
import type { Loader } from './types';

const FIVE_SECONDS = 5000;

export const __createNotificationLoader = createLoader(
  notifications => getNotifications(notifications),
  { cacheExpiryTime: FIVE_SECONDS }
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
