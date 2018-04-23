// @flow
type QueryParams = {
  [key: string]: string,
};

type ImgixImageParams = {
  imageText: string,
  imageHeight: number,
  imageWidth: number,
  txtsize: number,
  txtpad: number,
  txtalign: string,
  txtcolor: string,
  txtfont: string,
  imageSrc: string,
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

export const generateImageFromImgix = (
  {
    imageText,
    imageSrc,
    imageHeight,
    imageWidth,
    txtsize,
    txtpad,
    txtalign,
    txtcolor,
    txtfont,
  }: ImgixImageParams = {
    imageText: '',
    imageHeight: 144,
    imageWidth: 144,
    txtsize: 12,
    txtpad: 12,
    txtalign: 'center,middle',
    txtcolor: 'ffffff',
    txtfont: 'Helvetica,Bold',
    imageSrc: 'http://spectrum.imgix.net/default_images/twitter-share-card.png',
  }
): string =>
  `${imageSrc}?txtfit=max&txtcolor=${txtcolor}&txtpad=${txtpad}&h=${imageHeight}&w=${imageWidth}&txtsize=${txtsize}&txtalign=${txtalign}&txtfont=${txtfont}&txt=${imageText}`;
