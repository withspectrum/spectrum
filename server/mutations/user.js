// @flow
import { uploadPhoto } from '../models/user';

module.exports = {
  Mutation: {
    uploadProfilePhoto: (_: any, { file }, { user }) => uploadPhoto(file, user),
  },
};
