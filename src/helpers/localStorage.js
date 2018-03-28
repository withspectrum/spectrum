export const clearStorage = () => localStorage.clear();

export const getItemFromStorage = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (err) {
    console.error(`Error getting item ${key} from localStoragee`, err);
  }
};

export const storeItem = (key: string, item: any) => {
  try {
    return localStorage.setItem(key, JSON.stringify(item));
  } catch (err) {
    console.error(`Error storing item ${key} to localStoragee`, err);
  }
};

export const removeItemFromStorage = (key: string) => {
  try {
    return localStorage.removeItem(key);
  } catch (err) {
    console.error(`Error removing item ${key} from localStoragee`, err);
  }
};
