// @flow
const Uploader = require('s3-image-uploader');
const env = require('node-env-file');
const IS_PROD = process.env.NODE_ENV === 'production';
const path = require('path');
if (!IS_PROD) {
  env(path.resolve(__dirname, '../.env'), { raise: false });
}

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

const generateImageUrl = path => {
  // remove the bucket name from the path
  let newPath = path.replace('/spectrum-chat', '');

  // this is the default source for our imgix account, which starts
  // at the bucket root, thus we remove the bucket from the path
  let imgixBase = 'https://spectrum.imgix.net';

  // return a new url to update the user object
  return imgixBase + newPath;
};

/*
  Adds random number to filename to avoid conflicts
*/
const generateFileName = (name: string) => {
  const num = Math.random();
  const fileName = `${name}.${num}`;
  return fileName;
};

type EntityTypes = 'communities' | 'channels' | 'users' | 'threads';

const uploadImage = (
  file: Object,
  entity: EntityTypes,
  id: string,
  cb: Function
) => {
  const fileName = generateFileName(file.name);

  return uploader.upload(
    {
      fileId: fileName,
      bucket: `spectrum-chat/${entity}/${id}`,
      source: file.path,
      name: fileName,
    },
    data => {
      const url = generateImageUrl(data.path);
      return cb(url);
    },
    (errMsg, errObject) => {
      // TODO: Figure out error handling in the backend if image upload fails
      console.error('unable to upload: ' + errMsg + ':', errObject);
    }
  );
};

module.exports = {
  uploadImage,
};
