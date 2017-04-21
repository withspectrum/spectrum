import { initializeApp } from 'firebase';

export const initializeDatabase = config => {
  return initializeApp(config);
};
