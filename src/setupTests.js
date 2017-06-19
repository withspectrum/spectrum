const { setup, teardown } = require('../iris/test/db');

beforeAll(setup);
afterAll(teardown);
