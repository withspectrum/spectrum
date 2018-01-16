// @flow

import { getChannelMemberCount } from '../../models/channel';

export default ({ id }: { id: string }) => getChannelMemberCount(id);
