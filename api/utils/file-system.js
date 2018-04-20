// @flow
import shortid from 'shortid';
import fs from 'fs';

const STORAGE_DIR = 'public/uploads';

const dirExists = (path: string): Promise<boolean> =>
  new Promise(res => fs.access(path, err => res(!!!err)));

const createUploadsDir = (path: string): Promise<void> =>
  new Promise(res =>
    fs.mkdir(path, err => {
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

  if (!await dirExists(STORAGE_DIR)) {
    await createUploadsDir(STORAGE_DIR);
  }

  return new Promise(res => {
    const filePath = `${shortid.generate()}-${entity}-${id}`;
    const { stream } = result;
    stream.pipe(fs.createWriteStream(`${STORAGE_DIR}/${filePath}`));
    stream.on('end', () => {
      res(encodeURI(`/uploads/${filePath}`));
    });
  });
};
