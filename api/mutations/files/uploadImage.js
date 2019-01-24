// @flow
import { isAuthedResolver } from '../../utils/permissions';
import { uploadImage } from '../../utils/file-storage';
import type { EntityTypes } from 'shared/types';
import type { GraphQLContext } from '../';
import type { FileUpload } from 'shared/types';

type Args = {
  image: FileUpload,
  type: EntityTypes,
  id?: string,
};

export default isAuthedResolver(
  (_: void, { image, type, id }: Args, { loaders }: GraphQLContext) => {
    console.log('wat');
    return uploadImage(image, type, id || 'draft').then(res => {
      console.log(res);
      return res;
    });
  }
);
