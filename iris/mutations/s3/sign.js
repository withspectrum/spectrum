// @flow
const aws = require('aws-sdk');
const uuidv4 = require('uuid/v4');

const IS_PROD = process.env.NODE_ENV === 'production';

type InputType = {
  objectName: string,
  contentType: string,
  id: string,
  entityType: string,
};

let S3_TOKEN = process.env.S3_TOKEN;
let S3_SECRET = process.env.S3_SECRET;

if (!IS_PROD) {
  // In development or testing default the tokens to some garbage
  // so that the s3-image-uploader doesn't throw an error
  S3_TOKEN = S3_TOKEN || 'asdf123';
  S3_SECRET = S3_SECRET || 'asdf123';
}

export default (input: InputType) => {
  const options = {
    accessKeyId: S3_TOKEN,
    secretAccessKey: S3_SECRET,
    bucket: `spectrum-chat/${input.entityType}/${input.id}`,
    region: 'us-west-1',
    signatureVersion: 'v4',
    ACL: 'public-read',
  };

  const s3 = new aws.S3(options);

  const originalFilename = input.objectName;

  // custom filename using random uuid + file extension
  const fileExtension = originalFilename.split('.').pop();
  const filename = `${uuidv4()}.${fileExtension}`;

  const params = {
    Bucket: options.bucket,
    Key: filename,
    Expires: 60,
    ContentType: input.contentType,
    ACL: options.ACL,
  };

  const signedUrl = s3.getSignedUrl('putObject', params);
  console.log('GOT SIGNED URL', signedUrl);
  if (signedUrl) {
    // you may also simply return the signed url, i.e. `return { signedUrl }`
    return {
      signedUrl,
      filename,
      originalFilename,
      publicUrl: signedUrl.split('?').shift(),
    };
  } else {
    throw new Error('Cannot create S3 signed URL');
  }
};
