var Uploader = require('s3-image-uploader');
var uploader = new Uploader({
  aws: {
    key: 'foo',
    secret: 'bar',
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
    function(data) {
      // success
      console.log('upload success:', data);
      cb(data);
    },
    function(errMsg, errObject) {
      //error
      console.error('unable to upload: ' + errMsg + ':', errObject);
      // execute error code
    }
  );
  console.log('in uploader ', file);
};

module.exports = photoToS3;
