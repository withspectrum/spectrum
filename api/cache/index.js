// @flow
import RedisConfig from './redis';
const Redis = RedisConfig();

export const get = (key: string) => {
  return Redis.get(key).catch(err => {
    console.error(err);
    return null;
  });
};

type SetType = {
  key: string,
  value: string,
  expiration: ?number, // seconds
};

export const set = (input: SetType) => {
  const { key, value, expiration } = input;

  return Redis.set(key, value, 'EX', expiration || 86400)
    .get(key)
    .catch(err => {
      console.error(err);
      return false;
    });
};
