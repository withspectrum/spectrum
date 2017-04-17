// @flow

export type PaginationOptions = {
  first: number,
  after?: string,
};

type Input = any;

type Output = {
  list: Array<Input>,
  hasMoreItems: Boolean,
};

/**
 * Paginate an array of simple values
 */
export default (
  arr: Array<Input>,
  { first, after }: PaginationOptions
): Output => {
  const cursor = arr.indexOf(after);
  const begin = cursor > -1 ? cursor + 1 : 0;
  const length = cursor > -1 ? first + 1 : first;
  return {
    list: arr.slice(begin, length),
    hasMoreItems: arr.length > begin + length ? true : false,
  };
};
