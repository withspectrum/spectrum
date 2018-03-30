const mockDb = require('./db');

// Wait for 15s before timing out, this is useful for e2e tests which have a tendency to time out
jest.setTimeout(30000);

// Mock the database
jest.mock('api/models/db', () => ({
  db: mockDb,
}));
