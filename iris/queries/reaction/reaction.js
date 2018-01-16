// @flow
import { getReaction } from '../../models/reaction';
export default (_: any, { id }: { id: string }) => getReaction(id);
