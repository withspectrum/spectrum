// @flow
const debug = require('debug')('api:types:custom-scalars');
import { GraphQLScalarType, Kind } from 'graphql';
import UserError from '../../utils/UserError';

// Pretty dumb manual check to make sure a value is actual raw draft content state
const isRawDraftContentState = (contentState: string) => {
  let parsed;
  try {
    parsed = JSON.parse(contentState);
  } catch (err) {
    debug('error parsing raw draft content state');
    return false;
  }
  if (!parsed.blocks || !Array.isArray(parsed.blocks) || !parsed.entityMap) {
    debug('invalid raw draft content state');
    return false;
  }
  return true;
};

const RawDraftContentState = new GraphQLScalarType({
  name: 'RawDraftContentState',
  description: 'Returns all strings in lower case',

  // Input validation
  parseValue(value) {
    if (isRawDraftContentState(value)) return value;
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
