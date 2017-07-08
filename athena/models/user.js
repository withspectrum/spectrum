// @flow
const { db } = require('./db');

export const getUserById = (id: string): Promise<Object> => {
  return db.table('users').get(id).run();
};

export const getUserByEmail = (email: string): Promise<any> => {
  return db.table('users').getAll(email, { index: 'email' }).then(data => {
    if (!data || data.length === 0) return null;
    return data[0];
  });
};
