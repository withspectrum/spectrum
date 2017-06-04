//@flow

/**
 * Open the gallery at a certain image
 */
export const openGallery = (threadId: string, messageId: string) => {
  return {
    type: 'SHOW_GALLERY',
    isOpen: true,
    threadId,
    messageId,
  };
};

export const closeGallery = () => {
  return {
    type: 'HIDE_GALLERY',
  };
};
