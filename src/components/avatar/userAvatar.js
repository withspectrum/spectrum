// @flow
import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { optimize } from 'src/helpers/images';
import {
  getUserByUsernameQuery,
  type GetUserType,
} from 'shared/graphql/queries/user/getUser';
import { UserHoverProfile } from 'src/components/hoverProfile';
import AvatarImage from './image';
import { Status, AvatarLink, AvatarNoLink } from './style';
import ConditionalWrap from 'src/components/conditionalWrap';

type LinkHandlerProps = {
  user: GetUserType,
  clickable: boolean,
  children: any,
};

const LinkHandler = (props: LinkHandlerProps) => {
  if (props.user.username && props.clickable) {
    return (
      <AvatarLink to={`/users/${props.user.username}`}>
        {props.children}
      </AvatarLink>
    );
  } else {
    return <AvatarNoLink>{props.children}</AvatarNoLink>;
  }
};

type HandlerProps = {|
  user?: GetUserType,
  username?: string,
  size?: number,
  mobileSize?: number,
  onlineSize?: 'small' | 'large',
  style?: Object,
  showHoverProfile?: boolean,
  showOnlineStatus?: boolean,
  clickable?: boolean,
|};

const GetUserByUsername = (props: HandlerProps) => {
  const { username, showHoverProfile = true } = props;
  return (
    <Query variables={{ username }} query={getUserByUsernameQuery}>
      {({ data }) => {
        if (!data.user) return null;
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

export default class AvatarHandler extends Component<HandlerProps> {
  render() {
    const { showHoverProfile = true, clickable } = this.props;

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
          clickable={clickable}
        />
      );
    }

    return null;
  }
}

type AvatarProps = {
  ...$Exact<HandlerProps>,
  user: GetUserType,
};

class Avatar extends Component<AvatarProps> {
  render() {
    const {
      user,
      size = 32,
      mobileSize,
      onlineSize = 'large',
      style,
      showOnlineStatus = false,
      clickable = true,
    } = this.props;

    const src = user.profilePhoto;

    const optimizedAvatar =
      src &&
      optimize(src, {
        w: size.toString(),
        dpr: '2',
        format: 'png',
      });
    const userFallback = '/img/default_avatar.svg';
    const source = [optimizedAvatar, userFallback];

    return (
      <Status
        size={size}
        mobileSize={mobileSize}
        isOnline={showOnlineStatus && user.isOnline}
        onlineSize={onlineSize}
        style={style}
        type={'user'}
      >
        <LinkHandler user={user} clickable={clickable}>
          <AvatarImage
            src={source}
            size={size}
            mobileSize={mobileSize}
            type={'user'}
          />
        </LinkHandler>
      </Status>
    );
  }
}
