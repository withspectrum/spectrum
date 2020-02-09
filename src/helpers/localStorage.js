export const clearStorage = () => localStorage.clear();

export const getItemFromStorage = (key: string) => {
  if (!localStorage) return;

  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (err) {
    console.error(`Error getting item ${key} from localStorage`, err);
  }
};

export const storeItem = (key: string, item: any) => {
  if (!localStorage) return;

  try {
    return localStorage.setItem(key, JSON.stringify(item));
  } catch (err) {
    console.error(`Error storing item ${key} to localStorage`, err);
  }
};

export const removeItemFromStorage = (key: string) => {
  if (!localStorage) return;

  try {
    return localStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing item ${key} from localStorage`, err);
  }
};
