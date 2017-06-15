const { setup, teardown } = require('../server/test/db');

beforeAll(setup);
afterAll(teardown);
