// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Card } from 'src/components/card';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import AvatarImage from 'src/components/avatar/image';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import type { Dispatch } from 'redux';
import {
  CoverLink,
  CoverPhoto,
  CoverTitle,
} from 'src/components/profile/style';
import { HoverWrapper } from './style';
import { CoverSubtitle } from '../profile/style';

type ProfileProps = {
  channel: GetChannelType,
  dispatch: Dispatch<Object>,
  currentUser: ?Object,
  innerRef: (?HTMLElement) => void,
  style: CSSStyleDeclaration,
};

class HoverProfile extends Component<ProfileProps> {
  initMessage = (dispatch, user) => {
    dispatch(initNewThreadWithUser(user));
  };

  render() {
    const { channel, innerRef, style } = this.props;

    return (
      <HoverWrapper popperStyle={style} innerRef={innerRef}>
        <Card
          style={{
            boxShadow: '0 4px 8px rgba(18, 22, 23, .25)',
            borderRadius: '16px',
          }}
        >
          <CoverPhoto url={channel.community.coverPhoto} />
          <CoverLink to={`/${channel.community.slug}/${channel.slug}`}>
            <AvatarImage
              src={channel.community.profilePhoto}
              size="64"
              style={{ boxShadow: '0 0 0 2px white', zIndex: '2' }}
            />
            <CoverTitle>{channel.name}</CoverTitle>
            <CoverSubtitle>{channel.community.name}</CoverSubtitle>
          </CoverLink>
        </Card>
      </HoverWrapper>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
//$FlowFixMe
export default compose(connect(map), withRouter)(HoverProfile);
