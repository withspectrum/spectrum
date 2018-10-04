// @flow
import type { DBChannel } from 'shared/types';

export default ({ memberCount }: DBChannel) => memberCount || 1;
