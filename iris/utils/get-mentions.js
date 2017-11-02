// @flow
import { MENTIONS } from 'shared/regexps';

export default (text: string): Array<string> => {
  return text.match(MENTIONS) || [];
};
