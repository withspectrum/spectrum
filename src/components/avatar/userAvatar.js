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
import { Status, AvatarLink } from './style';
import ConditionalWrap from 'src/components/conditionalWrap';

type HandlerProps = {
  user?: GetUserType,
  username?: string,
  size?: number,
  mobilesize?: number,
  onlineSize?: 'small' | 'large',
  style?: Object,
  showHoverProfile?: boolean,
  showOnlineStatus?: boolean,
  clickable?: boolean,
  dataCy?: string,
};

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
      dataCy,
      size = 32,
      mobilesize,
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
        mobilesize={mobilesize}
        isOnline={showOnlineStatus && user.isOnline}
        onlineSize={onlineSize}
        style={style}
        type={'user'}
        data-cy={dataCy}
      >
        <ConditionalWrap
          condition={!!user.username && clickable}
          wrap={() => (
            <AvatarLink to={`/users/${user.username}`}>
              <AvatarImage
                src={source}
                size={size}
                mobilesize={mobilesize}
                type={'user'}
              />
            </AvatarLink>
          )}
        >
          <AvatarImage
            src={source}
            size={size}
            mobilesize={mobilesize}
            type={'user'}
          />
        </ConditionalWrap>
      </Status>
    );
  }
}
