// @flow
export const isViewingMarketingPage = (
  history: Object,
  currentUser: ?Object
) => {
  const viewing = history.location.pathname;
  const isRoot = viewing === '/';

  if (isRoot && (!currentUser || !currentUser.id)) return true;

  return viewing === '/code-of-conduct';
};
