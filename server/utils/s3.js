const Uploader = require('s3-image-uploader');
const env = require('node-env-file');
const IS_PROD = process.env.NODE_ENV === 'production';
const path = require('path');
if (!IS_PROD) {
  env(path.resolve(__dirname, '../.env'));
}

const uploader = new Uploader({
  aws: {
    key: process.env.S3_TOKEN,
    secret: process.env.S3_SECRET,
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

const generateFileName = file => {
  const timestamp = Date.now();
  const fileName = `${file.name}.${timestamp}`;
  return fileName;
};

const uploadCommunityPhoto = (file, { id }, cb) => {
  const fileName = generateFileName(file);

  return uploader.upload(
    {
      fileId: fileName,
      bucket: `spectrum-chat/communities/${id}`,
      source: file.path,
      name: fileName,
    },
    data => {
      cb(data);
    },
    (errMsg, errObject) => {
      // TODO: Figure out error handling in the backend if image upload fails
      console.error('unable to upload: ' + errMsg + ':', errObject);
    }
  );
};

const photoToS3 = (file, user, cb) => {
  // handle duplicate filenames
  const timestamp = Date.now();
  const fileName = `${file.name}.${timestamp}`;

  return uploader.upload(
    {
      fileId: fileName,
      bucket: `spectrum-chat/users/${user.uid}`,
      source: file.path,
      name: fileName,
    },
    data => {
      // success
      console.log('upload success:', data);
      cb(data);
    },
    (errMsg, errObject) => {
      //error
      console.error('unable to upload: ' + errMsg + ':', errObject);
      // execute error code
    }
  );
};

module.exports = {
  generateImageUrl,
  uploadCommunityPhoto,
  photoToS3,
};
