//@flow
/**
 * Direct Message Group mutation resolvers
 */
const { addDirectMessageGroup } = require('../models/directMessageGroup');
import type { DirectMessageGroupProps } from '../models/directMessageGroup';

module.exports = {
  Mutation: {
    addDirectMessageGroup: (
      _: any,
      { directMessageGroup }: { directMessageGroup: DirectMessageGroupProps }
    ) => addDirectMessageGroup(directMessageGroup),
  },
};
