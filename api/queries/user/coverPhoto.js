// @flow
import type { DBUser } from 'shared/types';
import ImgixClient from 'imgix-core-js';
let imgix = new ImgixClient({
  host: 'spectrum-imgp.imgix.net',
  secureURLToken: 'asGmuMn5yq73B3cH',
});

export default ({ coverPhoto }: DBUser) => {
  // if the image is not being served from our S3 imgix source, serve it from our web proxy
  if (coverPhoto && coverPhoto.indexOf('spectrum.imgix.net') < 0) {
    return imgix.buildURL(coverPhoto, { w: 640, h: 192 });
  }
  // if the image is being served from the S3 imgix source, return that url
  return coverPhoto;
};
