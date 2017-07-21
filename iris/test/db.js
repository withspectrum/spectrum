/**
 * Use a mock database
 */
const mockDb = require('rethinkdbdash')({
  db: 'testing',
});

jest.mock('../models/db', () => ({
  db: mockDb,
}));

export const db = mockDb;
