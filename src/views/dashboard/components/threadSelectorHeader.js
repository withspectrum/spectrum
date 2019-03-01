// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { History } from 'react-router';
import {
  HeaderWrapper,
  NarrowOnly,
  HeaderActiveViewTitle,
  HeaderActiveViewSubtitle,
  ContextHeaderContainer,
} from '../style';
import { IconButton } from 'src/components/buttons';
import ThreadSearch from './threadSearch';
import Menu from 'src/components/menu';
import CommunityList from './communityList';
import { Link } from 'react-router-dom';
import type { Dispatch } from 'redux';
import getComposerLink from 'src/helpers/get-composer-link';

type Props = {
  dispatch: Dispatch<Object>,
  filter: Object,
  communities: Array<?Object>,
  user: Object,
  activeCommunity: ?string,
  activeChannel: ?string,
  activeCommunityObject: ?Object,
  activeChannelObject: ?Object,
  history: History,
};

class Header extends React.Component<Props> {
  renderContext = () => {
    const {
      activeCommunity,
      activeChannel,
      activeCommunityObject,
      activeChannelObject,
    } = this.props;

    if (activeChannel && activeChannelObject && activeCommunityObject) {
      return (
        <React.Fragment>
          <ContextHeaderContainer>
            <Link to={`/${activeCommunityObject.slug}`}>
              <HeaderActiveViewSubtitle>
                {activeCommunityObject.name}
              </HeaderActiveViewSubtitle>
            </Link>
            <Link
              to={`/${activeCommunityObject.slug}/${activeChannelObject.slug}`}
            >
              <HeaderActiveViewTitle>
                {activeChannelObject.name}
              </HeaderActiveViewTitle>
            </Link>
          </ContextHeaderContainer>
        </React.Fragment>
      );
    }

    if (activeCommunity && activeCommunityObject) {
      return (
        <ContextHeaderContainer>
          <Link to={`/${activeCommunityObject.slug}`}>
            <HeaderActiveViewTitle>
              {activeCommunityObject.name}
            </HeaderActiveViewTitle>
          </Link>
        </ContextHeaderContainer>
      );
    }

    return null;
  };

  render() {
    const {
      filter,
      communities,
      user,
      activeCommunity,
      activeChannel,
    } = this.props;

    const { pathname, search } = getComposerLink({
      communityId: activeCommunity,
      channelId: activeChannel,
    });

    return (
      <React.Fragment>
        {this.renderContext()}

        <HeaderWrapper>
          <NarrowOnly>
            <Menu hasNavBar>
              <CommunityList
                communities={communities}
                user={user}
                activeCommunity={activeCommunity}
                activeChannel={activeChannel}
              />
            </Menu>
          </NarrowOnly>
          <ThreadSearch filter={filter} />
          <Link
            to={{
              pathname,
              search,
              state: { modal: true },
            }}
          >
            <IconButton
              dataCy="inbox-view-post-button"
              glyph={'post'}
              tipText={'New conversation'}
              tipLocation={'bottom-left'}
            />
          </Link>
        </HeaderWrapper>
      </React.Fragment>
    );
  }
}

export default compose(
  withRouter,
  connect()
)(Header);
