// @flow
import * as React from 'react';
import { Share } from 'react-native';
import compose from 'recompose/compose';
import { getCommunityById } from '../../../shared/graphql/queries/community/getCommunity';
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
import type { GetCommunityType } from '../../../shared/graphql/queries/community/getCommunity';
import type { NavigationProps } from 'react-navigation';
import addCommunityMember from '../../../shared/graphql/mutations/communityMember/addCommunityMember';
import removeCommunityMember from '../../../shared/graphql/mutations/communityMember/removeCommunityMember';
import ModeratorList from './ModeratorList';
import ChannelList from './ChannelList';

type Props = {
  isLoading: boolean,
  hasError: boolean,
  navigation: NavigationProps,
  data: { community?: GetCommunityType },
  addCommunityMember: Function,
  removeCommunityMember: Function,
};

class CommunityDetail extends React.Component<Props> {
  shareCommunity = () => {
    const { community } = this.props.data;

    if (!community) return;

    return Share.share(
      {
        url: `https://spectrum.chat/${community.slug}`,
        title: `${community.name} community`,
      },
      {
        subject: `${community.name} community`,
      }
    );
  };

  render() {
    const { data: { community }, isLoading, hasError } = this.props;

    if (community && community.id) {
      const variables = { input: { communityId: community.id } };
      const { communityPermissions } = community;

      return (
        <Wrapper>
          <ListSectionDivider title={'Team'} />

          <ListSection>
            <ModeratorList
              id={community.id}
              first={20}
              filter={{ isModerator: true, isOwner: true }}
            />
          </ListSection>

          <ListSectionDivider title={'Channels'} />

          <ListSection>
            <ChannelList id={community.id} communitySlug={community.slug} />
          </ListSection>

          <ListSectionDivider />

          <ListSection>
            <ListItemWithButton
              onPressHandler={this.shareCommunity}
              title={'Share'}
              divider={false}
            />
          </ListSection>

          <ListSectionDivider />

          <ListSection>
            {communityPermissions.isMember &&
              !communityPermissions.isOwner &&
              !communityPermissions.isModerator && (
                <MutationWrapper
                  mutation={this.props.removeCommunityMember}
                  variables={variables}
                  render={({ onPressHandler, isLoading }) => (
                    <ListItemWithButton
                      isLoading={isLoading}
                      onPressHandler={onPressHandler}
                      title={`Leave community`}
                      divider={false}
                      type={'destructive'}
                    />
                  )}
                />
              )}

            {!communityPermissions.isMember &&
              !communityPermissions.isBlocked && (
                <MutationWrapper
                  mutation={this.props.addCommunityMember}
                  variables={variables}
                  render={({ onPressHandler, isLoading }) => (
                    <ListItemWithButton
                      isLoading={isLoading}
                      onPressHandler={onPressHandler}
                      title={`Join ${community.name}`}
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
  getCommunityById,
  addCommunityMember,
  removeCommunityMember,
  ViewNetworkHandler
)(CommunityDetail);
