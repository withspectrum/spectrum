// @flow
require('now-env');
import AWS from 'aws-sdk';
import shortid from 'shortid';
const IS_PROD = process.env.NODE_ENV === 'production';

import type { FileUpload } from 'shared/types';
type EntityTypes = 'communities' | 'channels' | 'users' | 'threads';

let S3_TOKEN = process.env.S3_TOKEN;
let S3_SECRET = process.env.S3_SECRET;

if (!IS_PROD) {
  S3_TOKEN = S3_TOKEN || 'asdf123';
  S3_SECRET = S3_SECRET || 'asdf123';
}

AWS.config.update({
  accessKeyId: S3_TOKEN,
  secretAccessKey: S3_SECRET,
  apiVersions: {
    s3: 'latest',
  },
});
const s3 = new AWS.S3();

const generateImageUrl = path => {
  // remove the bucket name from the path
  const newPath = path.replace('spectrum-chat/', '');

  // this is the default source for our imgix account, which starts
  // at the bucket root, thus we remove the bucket from the path
  const imgixBase = 'https://spectrum.imgix.net';

  // return a new url to update the user object
  return imgixBase + '/' + newPath;
};

export const uploadImage = async (
  file: FileUpload,
  entity: EntityTypes,
  id: string
): Promise<string> => {
  const result = await file;
  const { filename, stream } = result;
  return new Promise(res => {
    const path = `spectrum-chat/${entity}/${id}`;
    const fileKey = `${shortid.generate()}-${filename}`;
    return s3.upload(
      {
        Bucket: path,
        Key: fileKey,
        Body: stream,
        ACL: 'public-read',
      },
      (err, data) => {
        if (err) throw new Error(err);
        if (!data || !data.Key) throw new Error('Image upload failed.');
        const url = generateImageUrl(data.Key);
        res(encodeURI(url));
      }
    );
  });
};
