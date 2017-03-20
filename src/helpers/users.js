import { setLastActivity } from '../db/users';
import { throttle } from './utils';

const TEN_SECONDS = 10000;
let activityHappened = () => {};
let running = false;

// Ping the server when the user is active, at most every 10 seconds
export const monitorUser = uid => {
  if (running) return;
  activityHappened = throttle(() => setLastActivity(uid), TEN_SECONDS);

  document.addEventListener('mousemove', activityHappened, false);
  document.addEventListener('keypress', activityHappened, false);
  document.addEventListener('load', activityHappened, false);
  document.addEventListener('mousemove', activityHappened, false);
  document.addEventListener('mousedown', activityHappened, false);
  document.addEventListener('touchstart', activityHappened, false);
  document.addEventListener('click', activityHappened, false);
  document.addEventListener('scroll', activityHappened, false);
  document.addEventListener('keypress', activityHappened, false);
  running = true;
};

export const stopUserMonitor = () => {
  document.removeEventListener('mousemove', activityHappened, false);
  document.removeEventListener('keypress', activityHappened, false);
  document.removeEventListener('load', activityHappened, false);
  document.removeEventListener('mousemove', activityHappened, false);
  document.removeEventListener('mousedown', activityHappened, false);
  document.removeEventListener('touchstart', activityHappened, false);
  document.removeEventListener('click', activityHappened, false);
  document.removeEventListener('scroll', activityHappened, false);
  document.removeEventListener('keypress', activityHappened, false);
  running = false;
};
