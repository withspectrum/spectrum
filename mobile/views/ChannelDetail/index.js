// @flow
import * as React from 'react';
import { Share } from 'react-native';
import compose from 'recompose/compose';
import {
  getChannelById,
  type GetChannelType,
} from '../../../shared/graphql/queries/channel/getChannel';
import toggleChannelSubscription, {
  type ToggleChannelSubscriptionProps,
} from '../../../shared/graphql/mutations/channel/toggleChannelSubscription';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import Loading from '../../components/Loading';
import { FullscreenNullState } from '../../components/NullStates';
import { Wrapper } from './style';
import {
  ListItemWithButton,
  ListSection,
  ListSectionDivider,
} from '../../components/Lists';
import MutationWrapper from '../../components/MutationWrapper';
import type { NavigationProps } from 'react-navigation';
import ModeratorList from '../CommunityDetail/ModeratorList';

type Props = {
  isLoading: boolean,
  hasError: boolean,
  navigation: NavigationProps,
  data: { channel?: GetChannelType },
  ...$Exact<ToggleChannelSubscriptionProps>,
};

class ChannelDetail extends React.Component<Props> {
  shareChannel = () => {
    const { channel } = this.props.data;

    if (!channel) return;

    return Share.share(
      {
        url: `https://spectrum.chat/${channel.community.slug}/${channel.slug}`,
        title: `${channel.name} channel`,
      },
      {
        subject: `${channel.name} community`,
      }
    );
  };

  render() {
    const { data: { channel }, isLoading, hasError } = this.props;

    if (channel && channel.id) {
      const variables = { channelId: channel.id };
      const { channelPermissions } = channel;

      return (
        <Wrapper>
          <ListSectionDivider title={'Team'} />

          <ListSection>
            <ModeratorList
              id={channel.community.id}
              first={20}
              filter={{ isModerator: true, isOwner: true }}
            />
          </ListSection>

          <ListSectionDivider />

          <ListSection>
            <ListItemWithButton
              onPressHandler={this.shareChannel}
              title={'Share'}
              divider={false}
            />
          </ListSection>

          <ListSectionDivider />

          <ListSection>
            {channelPermissions.isMember && (
              <MutationWrapper
                mutation={this.props.toggleChannelSubscription}
                variables={variables}
                render={({ onPressHandler, isLoading }) => (
                  <ListItemWithButton
                    isLoading={isLoading}
                    onPressHandler={onPressHandler}
                    title={`Leave channel`}
                    divider={false}
                    type={'destructive'}
                  />
                )}
              />
            )}

            {!channelPermissions.isMember &&
              !channelPermissions.isBlocked && (
                <MutationWrapper
                  mutation={this.props.toggleChannelSubscription}
                  variables={variables}
                  render={({ isLoading, onPressHandler }) => (
                    <ListItemWithButton
                      isLoading={isLoading}
                      onPressHandler={onPressHandler}
                      title={`Join channel`}
                      divider={false}
                    />
                  )}
                />
              )}
          </ListSection>

          <ListSectionDivider />
          <ListSectionDivider />
        </Wrapper>
      );
    }

    if (isLoading) {
      return (
        <Wrapper>
          <Loading />
        </Wrapper>
      );
    }

    if (hasError) {
      return <FullscreenNullState />;
    }

    return null;
  }
}

export default compose(
  getChannelById,
  toggleChannelSubscription,
  ViewNetworkHandler
)(ChannelDetail);
