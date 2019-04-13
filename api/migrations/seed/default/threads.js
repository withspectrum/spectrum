// @flow
const { fromPlainText, toJSON } = require('../../../../shared/draft-utils');
const constants = require('./constants');
const {
  DATE,
  BRIAN_ID,
  MAX_ID,
  BRYN_ID,
  SPECTRUM_GENERAL_CHANNEL_ID,
  PRIVATE_GENERAL_CHANNEL_ID,
  SPECTRUM_PRIVATE_CHANNEL_ID,
  DELETED_COMMUNITY_DELETED_CHANNEL_ID,
  MODERATOR_CREATED_CHANNEL_ID,
  DELETED_COMMUNITY_ID,
  SPECTRUM_COMMUNITY_ID,
  PRIVATE_COMMUNITY_ID,
  SPECTRUM_ARCHIVED_CHANNEL_ID,
} = constants;

module.exports = [
  {
    id: 'thread-1',
    createdAt: new Date(DATE),
    creatorId: BRIAN_ID,
    channelId: SPECTRUM_GENERAL_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'The first thread! 🎉',
      body: JSON.stringify(
        toJSON(fromPlainText('This is it, we got a thread here'))
      ),
    },
    edits: [
      {
        timestamp: new Date(DATE),
        content: {
          title: 'The first thread! 🎉',
          body: JSON.stringify(
            toJSON(fromPlainText('This is it, we got a thread here'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE),
    lastActive: new Date(DATE),
    messageCount: 4,
    reactionCount: 0,
  },
  {
    id: 'thread-2',
    createdAt: new Date(DATE + 1),
    creatorId: MAX_ID,
    channelId: SPECTRUM_GENERAL_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'Another thread',
      body: JSON.stringify(
        toJSON(fromPlainText('This is just another thread'))
      ),
    },
    edits: [
      {
        timestamp: new Date(DATE + 1),
        content: {
          title: 'Another thread',
          body: JSON.stringify(
            toJSON(fromPlainText('This is just another thread'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE + 1),
    lastActive: new Date(DATE + 1),
    messageCount: 4,
    reactionCount: 0,
  },
  {
    id: 'thread-3',
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: SPECTRUM_GENERAL_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'Yet another thread',
      body: JSON.stringify(
        toJSON(fromPlainText('This is just another thread'))
      ),
    },
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: 'Yet another thread',
          body: JSON.stringify(
            toJSON(fromPlainText('This is just another thread'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2),
    messageCount: 0,
    reactionCount: 0,
  },

  {
    id: 'thread-4',
    createdAt: new Date(DATE),
    creatorId: BRIAN_ID,
    channelId: SPECTRUM_PRIVATE_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'The first thread! 🎉',
      body: JSON.stringify(
        toJSON(fromPlainText('This is it, we got a thread here'))
      ),
    },
    edits: [
      {
        timestamp: new Date(DATE),
        content: {
          title: 'The first thread! 🎉',
          body: JSON.stringify(
            toJSON(fromPlainText('This is it, we got a thread here'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE),
    lastActive: new Date(DATE),
    messageCount: 0,
    reactionCount: 0,
  },
  {
    id: 'thread-5',
    createdAt: new Date(DATE + 1),
    creatorId: MAX_ID,
    channelId: SPECTRUM_PRIVATE_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'Another thread',
      body: JSON.stringify(
        toJSON(fromPlainText('This is just another thread'))
      ),
    },
    edits: [
      {
        timestamp: new Date(DATE + 1),
        content: {
          title: 'Another thread',
          body: JSON.stringify(
            toJSON(fromPlainText('This is just another thread'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE + 1),
    lastActive: new Date(DATE + 1),
    messageCount: 0,
    reactionCount: 0,
  },
  {
    id: 'thread-6',
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: SPECTRUM_PRIVATE_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'Yet another thread',
      body: JSON.stringify(
        toJSON(fromPlainText('This is just another thread'))
      ),
    },
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: 'Yet another thread',
          body: JSON.stringify(
            toJSON(fromPlainText('This is just another thread'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2),
    messageCount: 0,
    reactionCount: 0,
  },
  {
    id: 'thread-7',
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: DELETED_COMMUNITY_DELETED_CHANNEL_ID,
    communityId: DELETED_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'Yet another thread',
      body: JSON.stringify(
        toJSON(fromPlainText('This is just another thread'))
      ),
    },
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: 'Yet another thread',
          body: JSON.stringify(
            toJSON(fromPlainText('This is just another thread'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2),
    deletedAt: new Date(DATE + 3),
    messageCount: 0,
    reactionCount: 0,
  },
  {
    id: 'thread-8',
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: SPECTRUM_ARCHIVED_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'Yet another thread',
      body: JSON.stringify(
        toJSON(fromPlainText('This is just another thread'))
      ),
    },
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: 'Yet another thread',
          body: JSON.stringify(
            toJSON(fromPlainText('This is just another thread'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2),
    messageCount: 0,
    reactionCount: 0,
  },
  {
    id: 'thread-9',
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: SPECTRUM_GENERAL_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: true,
    type: 'DRAFTJS',
    content: {
      title: 'Yet another thread',
      body: JSON.stringify(
        toJSON(fromPlainText('This is just another thread'))
      ),
    },
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: 'Yet another thread',
          body: JSON.stringify(
            toJSON(fromPlainText('This is just another thread'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2),
  },

  {
    id: 'thread-10',
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: MODERATOR_CREATED_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'Yet another thread',
      body: JSON.stringify(
        toJSON(fromPlainText('This is just another thread'))
      ),
    },
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: 'Yet another thread',
          body: JSON.stringify(
            toJSON(fromPlainText('This is just another thread'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2),
    messageCount: 0,
    reactionCount: 0,
  },
  {
    id: 'thread-11',
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: SPECTRUM_GENERAL_CHANNEL_ID,
    communityId: SPECTRUM_COMMUNITY_ID,
    isPublished: true,
    isLocked: true,
    type: 'DRAFTJS',
    content: {
      title: 'Deleted thread',
      body: JSON.stringify(toJSON(fromPlainText('This is a deleted thread'))),
    },
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: 'Deleted thread',
          body: JSON.stringify(
            toJSON(fromPlainText('This is a deleted thread'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2),
    deletedAt: new Date(DATE + 3),
    messageCount: 0,
    reactionCount: 0,
  },

  {
    id: 'thread-12',
    createdAt: new Date(DATE + 2),
    creatorId: BRYN_ID,
    channelId: DELETED_COMMUNITY_DELETED_CHANNEL_ID,
    communityId: DELETED_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'Yet another thread',
      body: JSON.stringify(
        toJSON(fromPlainText('This is just another thread'))
      ),
    },
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: 'Yet another thread',
          body: JSON.stringify(
            toJSON(fromPlainText('This is just another thread'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2),
    deletedAt: new Date(DATE),
    messageCount: 0,
    reactionCount: 0,
  },

  {
    id: 'thread-13',
    createdAt: new Date(DATE + 2),
    creatorId: MAX_ID,
    channelId: PRIVATE_GENERAL_CHANNEL_ID,
    communityId: PRIVATE_COMMUNITY_ID,
    isPublished: true,
    isLocked: false,
    type: 'DRAFTJS',
    content: {
      title: 'Yet another thread',
      body: JSON.stringify(
        toJSON(fromPlainText('This is just another thread'))
      ),
    },
    edits: [
      {
        timestamp: new Date(DATE + 2),
        content: {
          title: 'Yet another thread',
          body: JSON.stringify(
            toJSON(fromPlainText('This is just another thread'))
          ),
        },
      },
    ],
    modifiedAt: new Date(DATE + 2),
    lastActive: new Date(DATE + 2),
    messageCount: 0,
    reactionCount: 0,
  },
];
