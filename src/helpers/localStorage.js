export const clearStorage = () => localStorage.clear();

export const getItemFromStorage = (key: string) => {
  try {
    JSON.parse(localStorage.getItem(key));
  } catch (err) {
    console.log(`Error getting item ${item} from localStoragee`, err);
  }
};

export const storeItem = (key: string, item: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (err) {
    console.log(`Error storing item ${item} to localStoragee`, err);
  }
};

export const removeItemFromStorage = (item: string) => {
  try {
    localStorage.removeItem(item);
  } catch (err) {
    console.log(`Error removing item ${item} from localStoragee`, err);
  }
};
