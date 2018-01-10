// @flow
import type { PaginationOptions } from '../../utils/paginate-arrays';
import { getThreadsByChannel } from '../../models/thread';
import { encode, decode } from '../../utils/base64';

export default (
  { id }: { id: string },
  { first, after }: PaginationOptions
) => {
  return getThreadsByChannel(id, {
    first,
    after: after && parseInt(decode(after), 10),
  }).then(threads => ({
    pageInfo: {
      hasNextPage: threads.length >= first,
    },
    edges: threads.map(thread => ({
      cursor: encode(String(thread.lastActive.getTime())),
      node: thread,
    })),
  }));
};
