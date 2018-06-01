// @flow
export const isViewingMarketingPage = (
  history: Object,
  currentUser: ?Object
) => {
  const viewing = history.location.pathname;
  const isRoot = viewing === '/';

  if (isRoot && (!currentUser || !currentUser.id)) return true;

  return (
    viewing === '/home' ||
    viewing === '/about' ||
    viewing === '/code-of-conduct' ||
    viewing === '/contact' ||
    viewing === '/pricing' ||
    viewing === '/privacy' ||
    viewing === '/privacy.html' ||
    viewing === '/support' ||
    viewing === '/terms' ||
    viewing === '/terms.html' ||
    viewing === '/faq' ||
    viewing === '/features' ||
    viewing === '/apps'
  );
};
