import { setlastSeen } from '../db/users';
import { throttle } from './utils';

const TEN_SECONDS = 10000;
let interval;

// Ping the server every 10 seconds when the user is active
export const monitorUser = uid => {
  if (interval) return;
  interval = setInterval(
    () => {
      setlastSeen(uid);
    },
    TEN_SECONDS,
  );
};

export const stopUserMonitor = () => {
  if (interval) clearInterval(interval);
};
