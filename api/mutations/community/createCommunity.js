// @flow
import type { GraphQLContext } from '../../';
import type { CreateCommunityInput } from '../../models/community';
import UserError from '../../utils/UserError';
import { communitySlugIsDenyListed } from '../../utils/permissions';
import {
  getCommunitiesBySlug,
  createCommunity,
  setCommunityWatercoolerId,
} from '../../models/community';
import { createOwnerInCommunity } from '../../models/usersCommunities';
import { createGeneralChannel } from '../../models/channel';
import { createOwnerInChannel } from '../../models/usersChannels';
import { publishThread } from '../../models/thread';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import Raven from 'shared/raven';

export default requireAuth(
  async (_: any, args: CreateCommunityInput, { user }: GraphQLContext) => {
    if (!user.email) {
      return new UserError(
        'You must have a working email address to create communities. Add an email address in your settings.'
      );
    }

    if (!args.input.slug || args.input.slug.length === 0) {
      return new UserError(
        'Communities must have a valid url so people can find it!'
      );
    }

    // replace any non alpha-num characters to prevent bad community slugs
    // (/[\W_]/g, "-") => replace non-alphanum with hyphens
    // (/-{2,}/g, '-') => replace multiple hyphens in a row with one hyphen
    const sanitizedSlug = args.input.slug
      .replace(/[\W_]/g, '-')
      .replace(/-{2,}/g, '-');
    const sanitizedArgs = Object.assign(
      {},
      {
        ...args,
        input: {
          ...args.input,
          slug: sanitizedSlug,
        },
      }
    );

    if (communitySlugIsDenyListed(sanitizedSlug)) {
      return new UserError(
        `This url is already taken - feel free to change it if
        you're set on the name ${args.input.name}!`
      );
    }

    // get communities with the input slug to check for duplicates
    const communities = await getCommunitiesBySlug([sanitizedSlug]);

    // if a community with this slug already exists
    if (communities.length > 0) {
      return new UserError('A community with this slug already exists.');
    }

    // all checks passed
    const community = await createCommunity(sanitizedArgs, user);

    // create a new relationship with the community
    await createOwnerInCommunity(community.id, user.id);

    // create a default 'general' channel
    const generalChannel = await createGeneralChannel(community.id, user.id);

    // create a new relationship with the general channel
    await createOwnerInChannel(generalChannel.id, user.id);

    try {
      const watercooler = await publishThread(
        {
          channelId: generalChannel.id,
          communityId: community.id,
          content: {
            title: `${community.name} watercooler`,
          },
          type: 'DRAFTJS',
          watercooler: true,
        },
        user.id
      );

      return setCommunityWatercoolerId(community.id, watercooler.id);
      // Do not fail community creation if the watercooler creation does not work out
    } catch (err) {
      Raven.captureException(err);
      return community;
    }
  }
);
