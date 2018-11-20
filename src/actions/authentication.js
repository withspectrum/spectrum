import { setUser, unsetUser } from 'src/helpers/analytics';

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

export const setRavenUserContext = (id: string) => {
  // logs the user id to Sentry
  // if Raven hasn't loaded yet, try every 5s until it's loaded
  if (window.Raven) {
    console.log('Raven setUserContext!');
    return window.Raven.setUserContext({ id });
  } else {
    console.log('No Raven :( Try again in 5s');
    const interval = setInterval(() => {
      console.log('Raven?');
      if (window.Raven) {
        console.log('Yes! setUserContext');
        window.Raven.setUserContext({ id });
        clearInterval(interval);
        return;
      }
      console.log('No :( Try again in 5s');
    }, 5000);
  }
};
