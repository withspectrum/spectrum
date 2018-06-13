// @flow
import * as React from 'react';
import { Button } from '../../components/Button';
import compose from 'recompose/compose';
import addCommunityMember, {
  type AddCommunityMemberProps,
} from '../../../shared/graphql/mutations/communityMember/addCommunityMember';
import removeCommunityMember, {
  type RemoveCommunityMemberProps,
} from '../../../shared/graphql/mutations/communityMember/removeCommunityMember';
import { type GetCommunityType } from '../../../shared/graphql/queries/community/getCommunity';
import { JoinButtonWrapper } from './style';

type Props = {
  ...$Exact<AddCommunityMemberProps>,
  ...$Exact<RemoveCommunityMemberProps>,
  community: GetCommunityType,
};

type State = {
  joinedDuringSession: boolean,
  isLoading: boolean,
};

class JoinButton extends React.Component<Props, State> {
  state = {
    isLoading: false,
    joinedDuringSession: false,
  };

  toggleMembership = () => {
    const { community, removeCommunityMember, addCommunityMember } = this.props;

    if (!community || !community.id) return;

    this.setState({
      isLoading: true,
    });

    if (community.communityPermissions.isMember) {
      removeCommunityMember({ input: { communityId: community.id } })
        .then(() => {
          this.setState({
            isLoading: false,
            joinedDuringSession: false,
          });
        })
        .catch(err => {
          this.setState({
            isLoading: false,
          });
        });
    } else {
      addCommunityMember({ input: { communityId: community.id } })
        .then(() => {
          this.setState({
            isLoading: false,
            joinedDuringSession: true,
          });
        })
        .catch(err => {
          this.setState({
            isLoading: false,
          });
        });
    }
  };

  render() {
    const { community } = this.props;
    const { joinedDuringSession, isLoading } = this.state;

    if (joinedDuringSession) {
      return (
        <JoinButtonWrapper>
          <Button
            onPress={this.toggleMembership}
            state={isLoading ? 'loading' : null}
            icon={'member-remove'}
            title={'Leave'}
          />
        </JoinButtonWrapper>
      );
    }

    if (community.communityPermissions.isMember) return null;

    return (
      <JoinButtonWrapper>
        <Button
          onPress={this.toggleMembership}
          state={isLoading ? 'loading' : null}
          icon={'member-add'}
          title={'Join'}
        />
      </JoinButtonWrapper>
    );
  }
}

export default compose(addCommunityMember, removeCommunityMember)(JoinButton);
