export const isStoryCreator = (story, user) => {
  if (!user) {
    return;
  }

  let uid = user.uid;
  let creator = story.creator.uid;

  if (uid === creator) {
    return true;
  } else {
    return false;
  }
};

export const getStoryPermission = (story, user, frequencies) => {
  if (!user.uid || !story) return;

  let uid = user.uid;
  let frequency = frequencies &&
    frequencies.find(freq => freq.id === story.frequencyId);

  if (!frequency) return;

  return frequency.users[uid] && frequency.users[uid].permission;
};
