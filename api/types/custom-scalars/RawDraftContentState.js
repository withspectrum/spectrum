// @flow
import { GraphQLScalarType, Kind } from 'graphql';
import UserError from '../../utils/UserError';

const isRawDraftContentState = (contentState: mixed) => true;

const RawDraftContentState = new GraphQLScalarType({
  name: 'RawDraftContentState',
  description: 'Returns all strings in lower case',

  // Input validation
  parseValue(value) {
    if (isRawDraftContentState(value)) return JSON.parse(value);
    throw new UserError('Please provide raw DraftJS ContentState as input.');
  },
  parseLiteral(ast) {
    // Extract the value from the AST
    if (ast.kind === Kind.STRING && isRawDraftContentState(ast.value)) {
      return ast.value;
    }
    throw new UserError('Please provide raw DraftJS ContentState as input.');
  },

  // Output conversion
  serialize(value) {
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  },
});

export default RawDraftContentState;
