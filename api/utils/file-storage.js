// @flow
require('now-env');

import type { FileUpload, EntityTypes } from 'shared/types';

const { FILE_STORAGE } = process.env;

const getUploadImageFn = () => {
  switch (FILE_STORAGE) {
    case 'local':
      return require('./file-system').uploadImage;
    case 's3':
    default:
      return require('./s3').uploadImage;
  }
};

const uploadImageFn = getUploadImageFn();

export const uploadImage = (
  file: FileUpload,
  entity: EntityTypes,
  id: string
): Promise<string> =>
  uploadImageFn(file, entity, id).catch(err => {
    throw new Error(err);
  });
