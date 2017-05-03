import { FIRST_MENTION } from './constants';

export const currentlyInMention = (state: Object) =>
  state.marks.some(mark => mark.type === 'mention');

export const findNearestMention = (text: string, end: number) => {
  // Find the index of the nearest "@" going backwards in text from end index
  // -> "Test @mxstbr| @brian" -> 5 (| = cursor)
  // -> "Test @mxstbr @brian|" -> 13
  const at = text.lastIndexOf('@', end);

  // -> "Test @mxstbr| @brian" -> "@mxstbr @brian"
  // -> "Test @mxstbr @brian|" -> "@brian"
  const textAfterAt = text.slice(at);

  // -> "@mxstbr @brian" -> "@mxstbr"
  // -> "@brian" -> "@brian"
  const name = textAfterAt.match(FIRST_MENTION);

  return !!name && name[1];
};
