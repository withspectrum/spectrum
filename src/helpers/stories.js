//@flow
export const isStoryCreator = (story: Object, user: Object) => {
  if (!user || !story) {
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

export const getStoryPermission = (
  story: Object,
  user: Object,
  frequency: Object,
) => {
  if (!user.uid || !story) return;
  return frequency.users[user.uid] && frequency.users[user.uid].permission;
};
