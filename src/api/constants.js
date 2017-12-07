export const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? // In production we want to redirect to /whatever
      ``
    : // In development we gotta redirect to localhost:3001/whatever tho
      'http://localhost:3001';

export const CLIENT_URL =
  process.env.NODE_ENV === 'production'
    ? `${window.location.protocol}//${window.location.host}`
    : 'http://localhost:3000';

export const PUBLIC_STRIPE_KEY =
  process.env.NODE_ENV === 'production'
    ? 'pk_live_viV7X5XXD1sw8aN2NgQjiff6'
    : 'pk_test_8aqk2JeScufGk1zAMe5GxaRq';
