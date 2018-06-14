// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { Button } from '../../components/Button';
import compose from 'recompose/compose';
import { addCommunityMemberMutation } from '../../../shared/graphql/mutations/communityMember/addCommunityMember';
import { removeCommunityMemberMutation } from '../../../shared/graphql/mutations/communityMember/removeCommunityMember';
import { type GetCommunityType } from '../../../shared/graphql/queries/community/getCommunity';
import { JoinButtonWrapper } from './style';
import { addToast } from '../../actions/toasts';
import { Mutation } from 'react-apollo';

type Props = {
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
          <Mutation
            mutation={removeCommunityMemberMutation}
            variables={variables}
            onCompleted={this.onLeave}
            onError={this.onError}
          >
            {(mutate, { data }) => (
              <Button
                onPress={mutate}
                state={data && data.loading ? 'loading' : null}
                icon={'member-remove'}
                title={'Leave community'}
              />
            )}
          </Mutation>
        </JoinButtonWrapper>
      );
    }

    if (isMember) return null;

    return (
      <JoinButtonWrapper>
        <Mutation
          mutation={addCommunityMemberMutation}
          variables={variables}
          onCompleted={this.onJoin}
          onError={this.onError}
        >
          {(mutate, { data }) => (
            <Button
              onPress={mutate}
              state={data && data.loading ? 'loading' : null}
              icon={'member-add'}
              title={'Join community'}
            />
          )}
        </Mutation>
      </JoinButtonWrapper>
    );
  }
}

export default compose(connect())(JoinButton);
