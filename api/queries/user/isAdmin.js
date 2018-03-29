// @flow
import type { DBUser } from 'shared/types';
import { isAdmin } from '../../utils/permissions';

export default ({ id }: DBUser) => isAdmin(id);
