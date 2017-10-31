// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../../components/avatar';
import Badge from '../../../components/badges';
import Reputation from '../../../components/reputation';
import {
  Byline,
  AuthorAvatar,
  BylineMeta,
  AuthorName,
  AuthorUsername,
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
    const { isOwner, reputation } = creator.contextPermissions;

    return (
      <Byline>
        <AuthorAvatar
          size={40}
          radius={40}
          isOnline={creator.isOnline}
          src={creator.profilePhoto}
          link={creator.username ? `/users/${creator.username}` : null}
        />
        <BylineMeta>
          <Link to={`/users/${creator.username}`}>
            <AuthorName>{creator.name}</AuthorName>
          </Link>

          <AuthorUsername>
            {creator &&
              creator.contextPermissions &&
              creator.contextPermissions.reputation > 0 && (
                <Reputation reputation={reputation} />
              )}
          </AuthorUsername>
        </BylineMeta>
      </Byline>
    );
  }
}

export default ThreadByline;
