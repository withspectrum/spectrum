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
  console.log('in uploader ', file);
};

module.exports = photoToS3;
