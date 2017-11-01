// Make sure Jest mocks the db
import { db } from '../iris/test/db';

// Wait for 15s max, this is useful for e2e tests which might time out
jest.setTimeout(15000);
