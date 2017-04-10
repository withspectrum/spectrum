//@flow
export const getPermission = (user: string, obj: Object): string => {
  return obj.users[user].permission;
};
