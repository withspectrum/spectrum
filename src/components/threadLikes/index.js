import React from 'react';
import { IconButton } from 'src/components/buttons';
import Icon from 'src/components/icons';
import { LikeWrapper, CurrentCount } from './style';

/*

1. We will have a field on the Thread type for:
- likeCount: Int
- currentUserHasLiked: Boolean

2. We just render the like count and set the liked status to 'true' if currentUserHasLiked

3. We will have 2 mutations:
- like thread
- unlike thread

Payload should probably be:
{
  input: {
    threadId: String
  }
}

If we support ultiple reaction types it'd be
{
  input: {
    threadId: String
    type: enum...
  }
}

Both of these mutations will return a Thread type object from the server which
will automatically have the latest likeCounts and currentUserHasLiked status - this
response will be processed by the Apollo cache to update all instances of the
thread in the app


** I will help with this**
4. When either of those mutations is updated, we fire off an optimistic update
that will update the like status and count while the mutation is in-flight

5. Eventually you can add a new field to get the users who have liked the Thread. Maybe something
like 'likeUsers' which returns an array of User types.

Backend data model is probably:

type ThreadLike = {
  userId*: String
  threadId*: String
  createdAt: Date
}

If you want to eventually support multiple reaction types it would be

type ThreadLike = {
  userId*: String
  threadId*: String
  createdAt: Date
  type: enum 'like' | 'laugh' | etc...
}

Asterisks indicate what fields the table will be indexed on.

So, in the backend to get the likeCount of a thread we can just do:

db.table('threadLikes')
.getAll(threadId, { index: 'threadId' })
.count()

And to see if the currentUserHasLiked you would do
db.table('threadLikes')
.getAll(userId, { index: 'userId' })
.filter(row => row('threadId').eq(threadId).and(row.hasFields('deletedAt').not()))

Adding a thread like would be:
db.table('threadLikes')
.insert(payload)

And removing it would be:
db.table('threadLikes')
.getAll(threadId, {index: 'threadId'})
.filter({ userId })
.update({ deletedAt: new Date() })

Other considerations:
- what do likes do for reputation?
- can a thread author like their own thread?
- do likes create notifications for the thread author?

Other backend notes:
- needs amplitude tracking
- needs reputation filtering

This lets us easily add a view to show all the threads a user has liked by simply doing
db.table('threadLikes').getAll(userId, { index:'userId'})


*/

export const LikeButton = props => {
  const { hasReacted } = props;

  return (
    <LikeWrapper hasReacted={hasReacted}>
      <IconButton
        glyph={'thumbs-up-fill'}
        tipText={hasReacted ? 'Unlike thread' : 'Like thread'}
        tipLocation={'bottom-left'}
      />
      <CurrentCount>12</CurrentCount>
    </LikeWrapper>
  );
};

export const LikeCount = () => {
  return (
    <LikeWrapper>
      <Icon glyph={'thumbs-up-fill'} size={24} />
      <CurrentCount>12</CurrentCount>
    </LikeWrapper>
  );
};
