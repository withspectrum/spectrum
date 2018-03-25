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
  privateChannelRestored,
} from './privateChannel';

import { analyticsChanged } from './analytics';

import { supportChanged } from './support';

import {
  openSourceStatusActivated,
  openSourceStatusChanged,
} from './openSourceStatus';

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
  privateChannelRestored();

  analyticsChanged();

  // supportChanged();

  openSourceStatusActivated();
  openSourceStatusChanged();
};
