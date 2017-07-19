// @flow
type QueryParams = {
  [key: string]: string,
};

/**
 * Optimize an image
 */
export const optimize = (src: string, params?: QueryParams = {}): string => {
  if (src.indexOf('spectrum.imgix.net') < 0) return src;
  const queryparams = Object.keys(params).reduce((string, key) => {
    return `${string}&${key}=${params[key]}`;
  }, '');
  return `${src}?auto=compress${queryparams}`;
};

export const FREE_USER_MAX_IMAGE_SIZE_BYTES = 3000000;
export const PRO_USER_MAX_IMAGE_SIZE_BYTES = 25000000;
export const FREE_USER_MAX_IMAGE_SIZE_STRING = `${Math.floor(
  FREE_USER_MAX_IMAGE_SIZE_BYTES / 1000000
)}mb`;
export const PRO_USER_MAX_IMAGE_SIZE_STRING = `${Math.floor(
  PRO_USER_MAX_IMAGE_SIZE_BYTES / 1000000
)}mb`;
