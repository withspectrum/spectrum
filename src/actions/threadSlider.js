// @flow

export const openThreadSlider = (threadId: string) => {
  return {
    type: 'OPEN_SLIDER',
    threadId,
  };
};

export const closeThreadSlider = () => ({
  type: 'CLOSE_SLIDER',
});
