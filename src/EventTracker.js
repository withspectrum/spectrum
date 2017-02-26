export default class EventTracker {
  constructor(ga) {
    this.ga = ga;
  }

  set = uid => {
    console.log('user set in ga: ', uid);
    this.ga('set', 'userId', uid); // Set the user ID using signed-in user_id.
  };

  track = (category, action, label) => {
    console.log('event tracked: ', category, action, label);
    this.ga('send', 'event', category, action, label);
  };
}
