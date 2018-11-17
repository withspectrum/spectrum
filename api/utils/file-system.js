// @flow
import uuidv4 from 'uuid/v4';
import fs from 'fs';

import type { FileUpload, EntityTypes } from 'shared/types';

const STORAGE_DIR = 'public/uploads';
const READ_WRITE_MODE = 0o777;

const dirExists = (path: string): Promise<boolean> =>
  new Promise(res => fs.access(path, fs.constants.F_OK, err => res(!!!err)));

const createUploadsDir = (path: string): Promise<void> =>
  new Promise(res =>
    fs.mkdir(path, READ_WRITE_MODE, err => {
      if (err) throw new Error(err);
      res();
    })
  );

export const uploadImage = async (
  file: FileUpload,
  entity: EntityTypes,
  id: string
): Promise<string> => {
  const result = await file;

  if (!(await dirExists(STORAGE_DIR))) {
    await createUploadsDir(STORAGE_DIR);
  }

  return new Promise(res => {
    const filePath = `${uuidv4()}-${entity}-${id}`;
    const { stream } = result;
    stream.pipe(fs.createWriteStream(`${STORAGE_DIR}/${filePath}`));
    stream.on('end', () => {
      res(encodeURI(`/uploads/${filePath}`));
    });
  });
};
