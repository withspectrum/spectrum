// @flow
import * as React from 'react';
import Badge from '../../../components/badges';
import Reputation from '../../../components/reputation';
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
    profilePhoto: string,
    username: string,
    name: string,
    isOnline: boolean,
    isPro: boolean,
    contextPermissions: {
      reputation: number,
      isOwner: boolean,
      isModeratoer: boolean,
    },
  },
};
class ThreadByline extends React.Component<Props> {
  render() {
    const { creator } = this.props;

    return (
      <Byline>
        <AuthorAvatar
          user={creator}
          size={40}
          radius={40}
          isOnline={creator.isOnline}
          src={creator.profilePhoto}
          link={creator.username ? `/users/${creator.username}` : false}
        />
        <BylineMeta>
          {creator.username ? (
            <AuthorNameLink to={`/users/${creator.username}`}>
              <AuthorName>{creator.name}</AuthorName>
              <AuthorUsername>· @{creator.username}</AuthorUsername>
              {creator &&
                creator.contextPermissions &&
                creator.contextPermissions.isOwner && <Badge type="admin" />}
            </AuthorNameLink>
          ) : (
            <AuthorNameNoLink>
              <AuthorName>{creator.name}</AuthorName>
              {creator &&
                creator.contextPermissions &&
                creator.contextPermissions.isOwner && <Badge type="admin" />}
            </AuthorNameNoLink>
          )}

          <ReputationRow>
            {creator &&
              creator.contextPermissions &&
              creator.contextPermissions.reputation > 0 && (
                <Reputation
                  reputation={creator.contextPermissions.reputation}
                />
              )}
          </ReputationRow>
        </BylineMeta>
      </Byline>
    );
  }
}

export default ThreadByline;
