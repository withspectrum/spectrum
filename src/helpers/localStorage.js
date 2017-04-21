// @flow
export const clearStorage = () => localStorage.clear();
export const getItemFromStorage = (item: string) => localStorage.getItem(item);
export const removeItemFromStorage = (item: string) =>
  localStorage.removeItem(item);
