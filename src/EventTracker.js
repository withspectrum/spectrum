const ga = window.ga;

export const set = uid => {
  console.log('user set in ga: ', uid);
  ga('set', 'userId', uid); // Set the user ID using signed-in user_id.
};

export const track = (category, action, label) => {
  console.log('event tracked: ', category, action, label);
  ga('send', 'event', category, action, label);
};
