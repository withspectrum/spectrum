let fbConfig;

if (process.env.NODE_ENV !== 'development') {
  console.log('DEVELOPMENT');
  fbConfig = {
    API_KEY: 'AIzaSyDInfEkjxBnHpXKrP-ex7rxaGdTFVW3AJY',
    AUTH_DOMAIN: 'spectrum-staging.firebaseapp.com',
    DB_URL: 'https://spectrum-staging.firebaseio.com',
    STORAGE_BUCKET: 'spectrum-staging.appspot.com',
    MESSAGING_SENDER_ID: '429000087733',
  };
} else {
  fbConfig = {
    API_KEY: 'AIzaSyD2zlDhnisczzgluIzUvXY9-mZnSOe-XFg',
    AUTH_DOMAIN: 'specfm-spectrum.firebaseapp.com',
    DB_URL: 'https://specfm-spectrum.firebaseio.com',
    STORAGE_BUCKET: 'specfm-spectrum.appspot.com',
    MESSAGING_SENDER_ID: '245132756307',
  };
}

export { fbConfig };

export default fbConfig;
