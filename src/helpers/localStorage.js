export const clearStorage = () => localStorage.clear();

export const getItemFromStorage = (key: string) =>
  JSON.parse(localStorage.getItem(key));

export const storeItem = (key: string, item: any) =>
  localStorage.setItem(key, JSON.stringify(item));

export const removeItemFromStorage = (item: string) =>
  localStorage.removeItem(item);
