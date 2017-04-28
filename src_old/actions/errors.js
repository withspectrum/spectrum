export const throwError = (err, { stopLoading = false } = {}) => ({
  type: 'THROW_ERROR',
  stopLoading,
  err,
});
