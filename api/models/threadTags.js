// @flow
import { createWriteQuery, createReadQuery, db } from 'shared/db';
import type { DBThreadTag } from 'shared/types';

export const addThreadTag = createWriteQuery(
  (tag: { title: string }, communityId: string) => ({
    query: db
      .table('threadTags')
      .insert({
        ...tag,
        communityId,
      })
      .run(),
    invalidateTags: (tag: DBThreadTag) => communityId,
  })
);

export const getThreadTagsByCommunity = createReadQuery(
  (communityId: string) => ({
    query: db.table('threadTags').getAll(communityId, { index: 'communityId' }),
    tags: (tags: ?Array<DBThreadTag>) => [
      communityId,
      ...(tags || []).map(({ id }) => id),
    ],
  })
);

export const getThreadTags = createReadQuery((tagIds: [string]) => ({
  query: db.table('threadTags').getAll(...tagIds),
  tags: (tags: ?Array<DBThreadTag>) => (tags || []).map(({ id }) => id),
}));

export const deleteThreadTags = createWriteQuery((tagIds: [string]) => ({
  query: db
    .table('threadTags')
    .getAll(...tagIds)
    .delete()
    .run(),
  invalidateTags: () => tagIds,
}));
