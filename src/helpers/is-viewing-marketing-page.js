// @flow
export const isViewingMarketingPage = (history: Object) => {
  const viewing = history.location.pathname;

  return (
    viewing === '/' ||
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
    viewing === '/features'
  );
};
