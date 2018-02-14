// @flow
import {
  communityCreated,
  communityDeleted,
  communityEdited,
  communityAdministratorEmailChanged,
  communityAdministratorEmailCreated,
} from './community';

import { moderatorChanged } from './moderator';

import {
  privateChannelCreated,
  privateChannelDeleted,
  privateChannelArchived,
  channelPrivacyChanged,
} from './privateChannel';

import { analyticsChanged } from './analytics';

import { supportChanged } from './support';

export default () => {
  communityCreated();
  communityDeleted();
  communityEdited();
  communityAdministratorEmailChanged();
  communityAdministratorEmailCreated();

  moderatorChanged();

  privateChannelCreated();
  privateChannelDeleted();
  privateChannelArchived();
  channelPrivacyChanged();

  analyticsChanged();

  supportChanged();
};
