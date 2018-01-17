// @flow
import { getMessage } from '../../models/message';

export default (_: any, { id }: { id: string }) => getMessage(id);
