// @flow
export const validateRawContentState = (input: any) => {
  if (
    !input ||
    !input.blocks ||
    !Array.isArray(input.blocks) ||
    !input.entityMap
  ) {
    return false;
  }

  return true;
};
