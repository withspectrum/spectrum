// @flow
import { createWriteQuery, createReadQuery, db } from 'shared/db';
import type { DBThreadTag } from 'shared/types';

export const addThreadTag = createWriteQuery(
  (tag: { title: string, hex: string }, communityId: string) => ({
    query: db
      .table('threadTags')
      .insert({
        ...tag,
        communityId,
        createdAt: new Date(),
      })
      .run(),
    invalidateTags: (tag: DBThreadTag) => communityId,
  })
);

export const getThreadTagsByCommunity = createReadQuery(
  (communityId: string) => ({
    query: db
      .table('threadTags')
      .getAll(communityId, { index: 'communityId' })
      .orderBy(db.desc('createdAt')),
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

type EditInput = {
  tagId: string,
  title: string,
  hex: string,
};

export const editThreadTag = createWriteQuery(
  ({ tagId, title, hex }: EditInput) => ({
    query: db
      .table('threadTags')
      .get(tagId)
      .update(
        {
          title,
          hex,
        },
        { returnChanges: 'always' }
      )
      .run()
      .then(res => res.changes[0].new_val || res.changes[0].old_val),
    invalidateTags: () => tagId,
  })
);
