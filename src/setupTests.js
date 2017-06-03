const { db } = require('../server/test/db');

afterAll(() => {
  db.getPoolMaster().drain();
});
