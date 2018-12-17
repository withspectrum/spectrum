// @flow
require('now-env');
import AWS from 'aws-sdk';
import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import Raven from 'shared/raven';
import sanitize from 'sanitize-filename';
import UserError from './UserError';

const IS_PROD = process.env.NODE_ENV === 'production';

import type { FileUpload, EntityTypes } from 'shared/types';

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

// remove the bucket name from the url
// the bucket name is not required since it is automatically bound
// to our imgix source
const generateImageUrl = path => path.replace('spectrum-chat/', '');

export const uploadImage = async (
  file: FileUpload,
  entity: EntityTypes,
  id: string
): Promise<string> => {
  const result = await file;
  const { filename, stream, mimetype } = result;
  const sanitized = sanitize(filename);
  const encoded = encodeURIComponent(sanitized);
  const validMediaTypes = ['image/gif', 'image/jpeg', 'image/png', 'video/mp4'];
  return new Promise(res => {
    // mimetype not in the validMediaType collection
    if (_.indexOf(validMediaTypes, _.toLower(mimetype)) < 0) {
      const unsupportedMediaTypeError = new UserError(
        `We aren’t able to support uploads with the type ${mimetype}. Try uploading another image.`
      );
      Raven.captureException(unsupportedMediaTypeError);
      throw unsupportedMediaTypeError;
    }

    const path = `spectrum-chat/${entity}/${id}`;
    const fileKey = `${uuidv4()}-${encoded}`;
    return s3.upload(
      {
        Bucket: path,
        Key: fileKey,
        Body: stream,
      },
      (err, data) => {
        if (err) throw new Error(err);
        if (!data || !data.Key)
          throw new UserError('Image upload failed. Please try again.');
        const url = generateImageUrl(data.Key);
        res(url);
      }
    );
  });
};
