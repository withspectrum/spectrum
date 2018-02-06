// @flow
import * as React from 'react';
import Badge from '../../../components/badges';
import Reputation from '../../../components/reputation';
import type { ThreadParticipantType } from 'shared/graphql/fragments/thread/threadParticipant';
import {
  Byline,
  AuthorAvatar,
  BylineMeta,
  AuthorName,
  AuthorNameLink,
  AuthorNameNoLink,
  AuthorUsername,
  ReputationRow,
} from '../style';

type Props = {
  creator: {
    ...$Exact<ThreadParticipantType>,
  },
};
class ThreadByline extends React.Component<Props> {
  render() {
    const { creator } = this.props;
    const { user, reputation, roles } = creator;

    return (
      <Byline>
        <AuthorAvatar
          user={user}
          size={40}
          radius={40}
          isOnline={user.isOnline}
          src={user.profilePhoto}
          link={user.username ? `/users/${user.username}` : false}
        />
        <BylineMeta>
          {user.username ? (
            <AuthorNameLink to={`/users/${user.username}`}>
              <AuthorName>{user.name}</AuthorName>
              <AuthorUsername>@{user.username}</AuthorUsername>
              {roles.map((role, index) => <Badge type={role} key={index} />)}
            </AuthorNameLink>
          ) : (
            <AuthorNameNoLink>
              <AuthorName>{user.name}</AuthorName>
              {roles.map((role, index) => <Badge type={role} key={index} />)}
            </AuthorNameNoLink>
          )}

          <ReputationRow>
            {reputation > 0 && <Reputation reputation={reputation} />}
          </ReputationRow>
        </BylineMeta>
      </Byline>
    );
  }
}

export default ThreadByline;
