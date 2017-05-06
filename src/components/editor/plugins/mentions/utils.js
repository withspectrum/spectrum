import { FIRST_MENTION } from './constants';

export const currentlyInMention = (state: Object) =>
  state.marks.some(mark => mark.type === 'mention');

// Find the index of the nearest "@" going backwards in text from end index
export const nearestAt = (text: string, end: number) => {
  // -> "Test @mxstbr| @brian" -> 5 (| = cursor)
  // -> "Test @mxstbr @brian|" -> 13
  return text.lastIndexOf('@', end);
};

export const findNearestMention = (text: string, end: number) => {
  // -> "Test @mxstbr| @brian" -> "@mxstbr @brian"
  // -> "Test @mxstbr @brian|" -> "@brian"
  const textAfterAt = text.slice(nearestAt(text, end));

  // -> "@mxstbr @brian" -> "@mxstbr"
  // -> "@brian" -> "@brian"
  const name = textAfterAt.match(FIRST_MENTION);

  return !!name && name[1];
};
