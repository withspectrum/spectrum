// @flow
import { createWriteQuery, db } from 'shared/db';
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
