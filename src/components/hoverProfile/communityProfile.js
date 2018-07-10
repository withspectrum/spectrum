// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Icon from 'src/components/icons';
import addProtocolToString from 'shared/normalize-url';
import { Card } from 'src/components/card';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import AvatarImage from 'src/components/avatar/image';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import type { Dispatch } from 'redux';
import {
  CoverLink,
  CoverPhoto,
  CoverTitle,
  CoverDescription,
  ExtLink,
} from 'src/components/profile/style';
import { HoverWrapper } from './style';

type ProfileProps = {
  community: GetCommunityType,
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
    const { community, innerRef, style } = this.props;

    return (
      <HoverWrapper popperStyle={style} innerRef={innerRef}>
        <Card
          style={{
            boxShadow: '0 4px 8px rgba(18, 22, 23, .25)',
            borderRadius: '16px',
          }}
        >
          <CoverPhoto url={community.coverPhoto} />
          <CoverLink to={`/${community.slug}`}>
            <AvatarImage
              src={community.profilePhoto}
              size="64"
              style={{ boxShadow: '0 0 0 2px white', zIndex: '2' }}
            />
            <CoverTitle>{community.name}</CoverTitle>
          </CoverLink>

          {(community.description || community.website) && (
            <CoverDescription>
              {community.description && <p>{community.description}</p>}
              {community.website && (
                <ExtLink>
                  <Icon glyph="link" size={24} />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={addProtocolToString(community.website)}
                  >
                    {community.website}
                  </a>
                </ExtLink>
              )}
            </CoverDescription>
          )}
        </Card>
      </HoverWrapper>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
//$FlowFixMe
export default compose(connect(map), withRouter)(HoverProfile);
