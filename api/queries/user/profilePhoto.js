// @flow
import type { DBUser } from 'shared/types';
import ImgixClient from 'imgix-core-js';
let imgix = new ImgixClient({
  host: 'spectrum-imgp.imgix.net',
  secureURLToken: 'asGmuMn5yq73B3cH',
});

export default ({ profilePhoto }: DBUser) => {
  // if the image is not being served from our S3 imgix source, serve it from our web proxy
  if (profilePhoto && profilePhoto.indexOf('spectrum.imgix.net') < 0) {
    return imgix.buildURL(profilePhoto, { w: 128, h: 128 });
  }
  // if the image is being served from the S3 imgix source, return that url
  return profilePhoto;
};
