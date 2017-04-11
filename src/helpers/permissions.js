//@flow
export const getPermission = (user: string, obj: Object): string => {
  if (!obj.users[user]) return;
  return obj.users[user].permission;
};
