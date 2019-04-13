// @flow

import * as channel from '../channel';

const queries = channel.__forQueryTests;

import {
  BRIAN_ID,
  MAX_ID,
  SPECTRUM_COMMUNITY_ID,
  SPECTRUM_GENERAL_CHANNEL_ID,
  SPECTRUM_PRIVATE_CHANNEL_ID,
  DELETED_COMMUNITY_DELETED_CHANNEL_ID,
} from 'api/migrations/seed/default/constants';

describe('models/channel', () => {
  describe('channelsByCommunitiesQuery', () => {
    it('excludes deleted channels', async () => {
      const channels = await queries
        .channelsByCommunitiesQuery(SPECTRUM_COMMUNITY_ID)
        .run();
      expect(
        channels.filter(channel => channel.deletedAt !== undefined)
      ).toEqual([]);
    });
  });

  describe('channelsByIdsQuery', () => {
    it('excludes deleted channels', async () => {
      const channels = await queries
        .channelsByIdsQuery(
          SPECTRUM_GENERAL_CHANNEL_ID,
          DELETED_COMMUNITY_DELETED_CHANNEL_ID
        )
        .run();
      expect(
        channels.filter(channel => channel.deletedAt !== undefined)
      ).toEqual([]);
    });
  });

  describe('threadsByChannelsQuery', () => {
    it('excludes deleted channels', async () => {
      const threads = await queries
        .threadsByChannelsQuery(DELETED_COMMUNITY_DELETED_CHANNEL_ID)
        .run();
      expect(threads).toEqual([]);
    });

    it('excludes deleted threads', async () => {
      const threads = await queries
        .threadsByChannelsQuery(SPECTRUM_GENERAL_CHANNEL_ID)
        .run();
      expect(threads.filter(thread => thread.deletedAt !== undefined)).toEqual(
        []
      );
    });
  });

  describe('membersByChannelsQuery', () => {
    it('excludes deleted channels', async () => {
      const members = await queries
        .membersByChannelsQuery(DELETED_COMMUNITY_DELETED_CHANNEL_ID)
        .run();
      expect(members).toEqual([]);
    });

    it('excludes removed members', async () => {
      const members = await queries
        .membersByChannelsQuery(SPECTRUM_GENERAL_CHANNEL_ID)
        .run();
      expect(members.filter(member => !member.isMember)).toEqual([]);
    });
  });

  describe('getChannelsByCommunity', () => {
    it('returns correct set of channels', async () => {
      expect(
        await channel.getChannelsByCommunity(SPECTRUM_COMMUNITY_ID)
      ).toMatchSnapshot();
    });
  });

  describe('getPublicChannelsByCommunity', () => {
    it('returns correct set of channels', async () => {
      expect(
        await channel.getPublicChannelsByCommunity(SPECTRUM_COMMUNITY_ID)
      ).toMatchSnapshot();
    });
  });

  describe('getChannelsByUserAndCommunity', () => {
    it('returns correct set of channels', async () => {
      expect(
        await channel.getChannelsByUserAndCommunity(
          SPECTRUM_COMMUNITY_ID,
          MAX_ID
        )
      ).toMatchSnapshot();
    });
  });

  describe('getChannelsByUser', () => {
    it('returns correct set of channels', async () => {
      expect(await channel.getChannelsByUser(BRIAN_ID)).toMatchSnapshot();
    });
  });

  describe('getChannelBySlug', () => {
    it('excludes deleted channels', async () => {
      expect(await channel.getChannelBySlug('deleted', 'spectrum')).toEqual(
        null
      );
    });
  });

  describe('getChannelById', () => {
    it('excludes deleted channels', async () => {
      expect(
        await channel.getChannelById(DELETED_COMMUNITY_DELETED_CHANNEL_ID)
      ).toEqual(null);
    });
  });

  describe('getChannels', () => {
    it('excludes deleted channels', async () => {
      expect(
        await channel.getChannels([
          SPECTRUM_GENERAL_CHANNEL_ID,
          DELETED_COMMUNITY_DELETED_CHANNEL_ID,
        ])
      ).toMatchSnapshot();
    });
  });

  describe('getChannelsThreadCounts', () => {
    it('excludes deleted channels', async () => {
      expect(
        await channel.getChannelsThreadCounts([
          SPECTRUM_GENERAL_CHANNEL_ID,
          DELETED_COMMUNITY_DELETED_CHANNEL_ID,
        ])
      ).toMatchSnapshot();
    });

    it('excludes deleted threads', async () => {
      expect(
        await channel.getChannelsThreadCounts([
          SPECTRUM_GENERAL_CHANNEL_ID,
          SPECTRUM_PRIVATE_CHANNEL_ID,
        ])
      ).toMatchSnapshot();
    });
  });

  describe('getChannelsMemberCounts', () => {
    it('excludes deleted channels', async () => {
      expect(
        await channel.getChannelsMemberCounts([
          SPECTRUM_GENERAL_CHANNEL_ID,
          DELETED_COMMUNITY_DELETED_CHANNEL_ID,
        ])
      ).toMatchSnapshot();
    });

    it('excludes non-members', async () => {
      expect(
        await channel.getChannelsMemberCounts([
          SPECTRUM_GENERAL_CHANNEL_ID,
          SPECTRUM_PRIVATE_CHANNEL_ID,
        ])
      ).toMatchSnapshot();
    });
  });
});
