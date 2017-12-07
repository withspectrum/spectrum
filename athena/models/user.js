// @flow
const { db } = require('./db');
import type { DBUser } from 'shared/types';

export const getUsers = (ids: Array<string>): Promise<Array<DBUser>> => {
  return db
    .table('users')
    .getAll(...ids)
    .run();
};

export const getUserById = (id: string): Promise<DBUser> => {
  return db
    .table('users')
    .get(id)
    .run();
};

export const getUserByEmail = (email: string): Promise<?DBUser> => {
  return db
    .table('users')
    .getAll(email, { index: 'email' })
    .then(data => {
      if (!data || data.length === 0) return null;
      return data[0];
    });
};

export const getUserByUsername = (username: string): Promise<?DBUser> => {
  return db
    .table('users')
    .getAll(username, { index: 'username' })
    .then(data => {
      if (!data || data.length === 0) return null;
      return data[0];
    });
};
