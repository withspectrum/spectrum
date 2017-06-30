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
