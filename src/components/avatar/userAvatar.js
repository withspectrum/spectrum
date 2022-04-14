// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import {
  getUserByUsernameQuery,
  type GetUserType,
} from 'shared/graphql/queries/user/getUser';
import { UserHoverProfile } from 'src/components/hoverProfile';
import AvatarImage from './image';
import { Container, AvatarLink, OnlineIndicator } from './style';
import ConditionalWrap from 'src/components/conditionalWrap';

type HandlerProps = {
  user?: GetUserType,
  username?: string,
  size?: number,
  mobilesize?: number,
  style?: Object,
  showHoverProfile?: boolean,
  showOnlineStatus?: boolean,
  isClickable?: boolean,
  dataCy?: string,
  onlineBorderColor?: ?Function,
};

type AvatarProps = {
  ...$Exact<HandlerProps>,
  user: GetUserType,
};

const GetUserByUsername = (props: HandlerProps) => {
  const { username, showHoverProfile = true } = props;
  return (
    <Query variables={{ username }} query={getUserByUsernameQuery}>
      {({ data }) => {
        if (!data || !data.user) return null;
        return (
          <ConditionalWrap
            condition={showHoverProfile}
            wrap={() => (
              <UserHoverProfile username={props.username}>
                <Avatar user={data.user} {...props} />
              </UserHoverProfile>
            )}
          >
            <Avatar user={data.user} {...props} />
          </ConditionalWrap>
        );
      }}
    </Query>
  );
};

class Avatar extends React.Component<AvatarProps> {
  render() {
    const {
      user,
      dataCy,
      size = 32,
      mobilesize,
      style,
      showOnlineStatus = true,
      isClickable = true,
      onlineBorderColor = null,
    } = this.props;

    const src = user.profilePhoto;

    const userFallback = '/img/default_avatar.svg';
    const source = [src, userFallback];

    return (
      <Container
        style={style}
        type={'user'}
        data-cy={dataCy}
        size={size}
        mobileSize={mobilesize}
      >
        {showOnlineStatus && user.isOnline && (
          <OnlineIndicator onlineBorderColor={onlineBorderColor} />
        )}
        <ConditionalWrap
          condition={!!user.username && isClickable}
          wrap={() => (
            <AvatarLink to={`/users/${user.username}`}>
              <AvatarImage
                src={source}
                size={size}
                mobilesize={mobilesize}
                type={'user'}
                alt={user.name || user.username}
              />
            </AvatarLink>
          )}
        >
          <AvatarImage
            src={source}
            size={size}
            mobilesize={mobilesize}
            type={'user'}
            alt={user.name || user.username}
          />
        </ConditionalWrap>
      </Container>
    );
  }
}

class AvatarHandler extends React.Component<HandlerProps> {
  render() {
    const { showHoverProfile = true, isClickable } = this.props;

    if (this.props.user) {
      const user = this.props.user;
      return (
        <ConditionalWrap
          condition={showHoverProfile}
          wrap={() => (
            <UserHoverProfile username={user.username}>
              <Avatar {...this.props} />
            </UserHoverProfile>
          )}
        >
          <Avatar {...this.props} />
        </ConditionalWrap>
      );
    }

    if (!this.props.user && this.props.username) {
      return (
        <GetUserByUsername
          username={this.props.username}
          isClickable={isClickable}
        />
      );
    }

    return null;
  }
}

export default AvatarHandler;
