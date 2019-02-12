// @flow
import { isAuthedResolver } from '../../utils/permissions';
import { uploadImage } from '../../utils/file-storage';
import type { EntityTypes } from 'shared/types';
import type { GraphQLContext } from '../../';
import type { FileUpload } from 'shared/types';
import { signImageUrl } from 'shared/imgix';

type Args = {
  input: {
    image: FileUpload,
    type: EntityTypes,
    id?: string,
  },
};

export default isAuthedResolver(
  async (_: void, { input }: Args, { loaders }: GraphQLContext) => {
    const { image, type, id } = input;
    const url = await uploadImage(image, type, id || 'draft');
    return await signImageUrl(url);
  }
);
