// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
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
import MutationWrapper from '../../components/MutationWrapper';
import { addToast } from '../../actions/toasts';

type Props = {
  ...$Exact<AddCommunityMemberProps>,
  ...$Exact<RemoveCommunityMemberProps>,
  community: GetCommunityType,
  dispatch: Dispatch<Object>,
};

type State = {
  joinedDuringSession: boolean,
};

class JoinButton extends React.Component<Props, State> {
  state = {
    joinedDuringSession: false,
  };

  onJoin = () => {
    this.setState({
      joinedDuringSession: true,
    });
  };

  onLeave = () => {
    this.setState({
      joinedDuringSession: false,
    });
  };

  onError = (err: any) => {
    return this.props.dispatch(
      addToast({
        type: 'error',
        message: err.message,
      })
    );
  };

  render() {
    const { community } = this.props;
    const { joinedDuringSession } = this.state;
    const variables = { input: { communityId: community.id } };
    const { isMember } = community.communityPermissions;

    if (joinedDuringSession) {
      return (
        <JoinButtonWrapper>
          <MutationWrapper
            mutation={this.props.removeCommunityMember}
            variables={variables}
            onComplete={this.onLeave}
            onError={this.onError}
            render={({ isLoading, onPressHandler }) => (
              <Button
                onPress={onPressHandler}
                state={isLoading ? 'loading' : null}
                icon={'member-remove'}
                title={'Leave community'}
              />
            )}
          />
        </JoinButtonWrapper>
      );
    }

    if (isMember) return null;

    return (
      <JoinButtonWrapper>
        <MutationWrapper
          mutation={this.props.addCommunityMember}
          variables={variables}
          onComplete={this.onJoin}
          onError={this.onError}
          render={({ isLoading, onPressHandler }) => (
            <Button
              onPress={onPressHandler}
              state={isLoading ? 'loading' : null}
              icon={'member-add'}
              title={'Join community'}
            />
          )}
        />
      </JoinButtonWrapper>
    );
  }
}

export default compose(connect(), addCommunityMember, removeCommunityMember)(
  JoinButton
);
