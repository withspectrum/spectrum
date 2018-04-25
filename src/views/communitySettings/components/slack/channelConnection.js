// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import getCommunityChannelsSlackSettingsQuery, {
  type GetCommunityChannelsSlackSettings,
} from 'shared/graphql/queries/community/getCommunityChannelsSlackSettings';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';
import { Button } from 'src/components/buttons';
import updateChannelSlackSettingsMutation from 'shared/graphql/mutations/channel/updateSlackSettings';
import { addToastWithTimeout } from 'src/actions/toasts';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import { Loading } from 'src/components/loading';
import ViewError from 'src/components/viewError';

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  data: {
    community: GetCommunityChannelsSlackSettings,
  },
  updateChannelSlackSettings: Function,
  dispatch: Function,
};

class SlackChannelConnection extends React.Component<Props> {
  render() {
    const { data, isLoading } = this.props;
    console.log(data);
    if (data.community) {
      return <SectionCard>Got data!</SectionCard>;
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return (
      <SectionCard>
        <ViewError />
      </SectionCard>
    );
  }
}

export default compose(
  connect(),
  updateChannelSlackSettingsMutation,
  getCommunityChannelsSlackSettingsQuery,
  viewNetworkHandler
)(SlackChannelConnection);
