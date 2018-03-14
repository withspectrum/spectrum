// @flow
require('now-env');
const Uploader = require('s3-image-uploader');
import mkdirp from 'mkdirp';
import shortid from 'shortid';
import fs from 'fs';
const IS_PROD = process.env.NODE_ENV === 'production';

import type { FileUpload } from 'shared/types';
type EntityTypes = 'communities' | 'channels' | 'users' | 'threads';

let S3_TOKEN = process.env.S3_TOKEN;
let S3_SECRET = process.env.S3_SECRET;

if (!IS_PROD) {
  // In development or testing default the tokens to some garbage
  // so that the s3-image-uploader doesn't throw an error
  S3_TOKEN = S3_TOKEN || 'asdf123';
  S3_SECRET = S3_SECRET || 'asdf123';
}

const uploader = new Uploader({
  aws: {
    key: S3_TOKEN,
    secret: S3_SECRET,
  },
  websockets: false,
});

const uploadDir = './uploads';
mkdirp.sync(uploadDir);

const removeFS = path => {
  return fs.unlinkSync(path);
};

const storeFS = ({ stream, filename }) => {
  const path = `${uploadDir}/${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on('error', error => {
        if (stream.truncated)
          // Delete the truncated file
          fs.unlinkSync(path);
        reject(error);
      })
      .on('end', () => resolve({ path }))
      .pipe(fs.createWriteStream(path))
  );
};

const getPath = async file => {
  const { stream, filename } = await file;
  const name = `${filename}-${shortid.generate()}`;
  const { path } = await storeFS({ stream, filename: name });
  return { path, name };
};

const generateImageUrl = path => {
  // remove the bucket name from the path
  const newPath = path.replace('/spectrum-chat', '');

  // this is the default source for our imgix account, which starts
  // at the bucket root, thus we remove the bucket from the path
  const imgixBase = 'https://spectrum.imgix.net';

  // return a new url to update the user object
  return imgixBase + newPath;
};

const upload = (file: FileUpload, entity: EntityTypes, id: string) =>
  new Promise(async (resolve, reject) => {
    const { path, name } = await getPath(file);

    return await uploader.upload(
      {
        fileId: name,
        bucket: `spectrum-chat/${entity}/${id}`,
        source: path,
        name: name,
      },
      data => {
        const url = generateImageUrl(data.path);
        return resolve({
          path: path,
          url: encodeURI(url),
        });
      },
      (errMsg, errObject) => {
        console.error('unable to upload: ' + errMsg + ':', errObject);
        return reject(errMsg);
      }
    );
  });

export const uploadImage = async (
  file: FileUpload,
  entity: EntityTypes,
  id: string
) => {
  return await upload(file, entity, id)
    .then(({ url, path }) => {
      removeFS(path);
      return url;
    })
    .catch(err => err);
};
