export const clearStorage = () => localStorage.clear();

export const getItemFromStorage = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (err) {
    console.log(`Error getting item ${key} from localStoragee`, err);
  }
};

export const storeItem = (key: string, item: any) => {
  try {
    return localStorage.setItem(key, JSON.stringify(item));
  } catch (err) {
    console.log(`Error storing item ${item} to localStoragee`, err);
  }
};

export const removeItemFromStorage = (key: string) => {
  try {
    return localStorage.removeItem(key);
  } catch (err) {
    console.log(`Error removing item ${key} from localStoragee`, err);
  }
};
