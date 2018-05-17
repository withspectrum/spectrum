// @flow
export const IS_PROD = process.env.NODE_ENV === 'production';

export const SERVER_URL = IS_PROD
  ? // In production we want to redirect to /whatever
    ``
  : // In development we gotta redirect to localhost:3001/whatever tho
    'http://localhost:3001';

export const CLIENT_URL = IS_PROD
  ? `${window.location.protocol}//${window.location.host}`
  : 'http://localhost:3000';

export const PUBLIC_STRIPE_KEY = IS_PROD
  ? 'pk_live_viV7X5XXD1sw8aN2NgQjiff6'
  : 'pk_test_sXi0YoSKMnTkLSDdso2tJOvh';
