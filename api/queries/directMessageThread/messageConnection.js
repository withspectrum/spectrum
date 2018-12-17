// @flow
import type { PaginationOptions } from '../../utils/paginate-arrays';
import type { GraphQLContext } from '../../';
import { canViewDMThread } from '../../utils/permissions';
import { encode, decode } from '../../utils/base64';
import { getMessages } from '../../models/message';

export default async (
  { id }: { id: string },
  { first, after }: PaginationOptions,
  { user, loaders }: GraphQLContext
) => {
  if (!user || !user.id) return null;

  const canViewThread = await canViewDMThread(user.id, id, loaders);
  if (!canViewThread) return null;

  const cursor = parseInt(decode(after), 10);
  const messages = await getMessages(id, {
    // NOTE(@mxstbr): We used to use first/after for reverse DM pagination
    // so we have to keep it that way for backwards compat, but really this
    // should be last/before since it's in the other way of time
    last: first || 30,
    before: cursor,
  });

  return {
    pageInfo: {
      hasNextPage: messages && messages.length >= first,
      // NOTE(@mxstbr): For DM threads we just assume there to be a previous page
      // if the user provided a cursor and there were at least some messages
      // That way they might get a false positive here if they request the messages before the last message
      // but since that query returns no messages this will be false and all will be well
      // (so it essentially just takes 1 “unnecessary” request to figure out whether or not there is a previous page)
      hasPreviousPage: messages && messages.length > 0 && !!cursor,
    },
    edges: messages.map(message => ({
      cursor: encode(message.timestamp.getTime().toString()),
      node: message,
    })),
  };
};
