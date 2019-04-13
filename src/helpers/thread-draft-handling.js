// @flow
const LS_BODY_KEY = 'last-plaintext-thread-composer-body';
const LS_TITLE_KEY = 'last-plaintext-thread-composer-title';
const LS_COMPOSER_EXPIRE = 'last-plaintext-thread-composer-expire';

const ONE_DAY = (): string => {
  const time = new Date().getTime() + 60 * 60 * 24 * 1000;
  return time.toString();
};

export const getDraftThread = (): { title?: string, body?: string } => {
  if (!localStorage) return {};

  try {
    const expireTime = localStorage.getItem(LS_COMPOSER_EXPIRE);
    const currTime = new Date().getTime().toString();

    if (expireTime && currTime > expireTime) {
      clearDraftThread();
      return {};
    }

    return {
      body: localStorage.getItem(LS_BODY_KEY) || '',
      title: localStorage.getItem(LS_TITLE_KEY) || '',
    };
  } catch (err) {
    console.error(err);
    return {};
  }
};

export const clearDraftThread = (): void => {
  if (!localStorage) return;

  try {
    localStorage.removeItem(LS_BODY_KEY);
    localStorage.removeItem(LS_TITLE_KEY);
    localStorage.removeItem(LS_COMPOSER_EXPIRE);
  } catch (err) {
    console.error(err);
  }
};

export const storeDraftThread = (input: ?{ title?: string, body?: string }) => {
  if (!input || !localStorage) return;
  try {
    if (typeof input.title === 'string')
      localStorage.setItem(LS_TITLE_KEY, input.title);
    if (typeof input.body === 'string')
      localStorage.setItem(LS_BODY_KEY, input.body);
    localStorage.setItem(LS_COMPOSER_EXPIRE, ONE_DAY());
  } catch (err) {
    console.error(err);
  }
};
