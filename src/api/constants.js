export const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? `${window.location.protocol}//${window.location.host}`
    : 'http://localhost:3001';

export const PUBLIC_STRIPE_KEY =
  process.env.NODE_ENV === 'production'
    ? 'pk_live_viV7X5XXD1sw8aN2NgQjiff6'
    : 'pk_test_8aqk2JeScufGk1zAMe5GxaRq';
