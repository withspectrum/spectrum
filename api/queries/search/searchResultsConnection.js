// @flow
import { encode } from '../../utils/base64';

export default (results: Array<any>) => {
  return {
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
    },
    edges: results.map(
      result =>
        result && {
          cursor: encode(result.id),
          node: result,
        }
    ),
  };
};
