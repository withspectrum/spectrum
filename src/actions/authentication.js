import { setUser, unsetUser } from 'src/helpers/analytics';
import Raven from 'raven-js';

export const logout = () => {
  // no longer track analytics
  unsetUser();

  import('shared/graphql')
    .then(module => module.clearApolloStore)
    .then(clearApolloStore => {
      // clear Apollo's query cache
      clearApolloStore();
      // redirect to home page
      window.location.href =
        process.env.NODE_ENV === 'production'
          ? '/auth/logout'
          : 'http://localhost:3001/auth/logout';
    });
};

export const setTrackingContexts = async (user: ?GetUserType) => {
  if (!user || !user.id) return logout();

  // get an anonymized userId for Sentry and Amplitude
  const response = await fetch(
    `https://micro-anonymizomatic-woewfxwpkp.now.sh?text=${user.id}`
  );
  const { text: id } = await response.json();
  return Promise.all([setAmplitudeUserContext(id), setRavenUserContext(id)]);
};
export const setAmplitudeUserContext = (id: string) => setUser(id);
export const setRavenUserContext = (id: string) => Raven.setUserContext({ id });
