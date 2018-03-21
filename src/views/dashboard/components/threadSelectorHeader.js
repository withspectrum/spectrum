// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { changeActiveThread } from '../../../actions/dashboardFeed';
import {
  HeaderWrapper,
  NarrowOnly,
  HeaderActiveViewTitle,
  HeaderActiveViewSubtitle,
  ContextHeaderContainer,
  ContextHeaderActions,
} from '../style';
import { IconButton } from '../../../components/buttons';
import ThreadSearch from './threadSearch';
import Menu from '../../../components/menu';
import CommunityList from './communityList';
import Link from 'src/components/link';
import Icon from 'src/components/icons';

type Props = {
  dispatch: Function,
  filter: Object,
  communities: Array<Object>,
  user: Object,
  activeCommunity: ?string,
  activeChannel: ?string,
  activeCommunityObject: ?Object,
  activeChannelObject: ?Object,
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

          {(activeChannelObject.channelPermissions.isOwner ||
            activeCommunityObject.communityPermissions.isOwner) && (
            <ContextHeaderActions>
              <Link
                to={`/${activeCommunityObject.slug}/${
                  activeChannelObject.slug
                }`}
              >
                <HeaderActiveViewSubtitle>
                  <Icon glyph={'link'} size={24} />
                  View channel
                </HeaderActiveViewSubtitle>
              </Link>

              <Link
                to={`/${activeCommunityObject.slug}/${
                  activeChannelObject.slug
                }/settings}`}
              >
                <HeaderActiveViewSubtitle>
                  <Icon glyph={'settings'} size={24} />
                  Channel settings
                </HeaderActiveViewSubtitle>
              </Link>
            </ContextHeaderActions>
          )}
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
      dispatch,
      filter,
      communities,
      user,
      activeCommunity,
      activeChannel,
    } = this.props;

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
          <IconButton
            data-e2e-id="inbox-view-post-button"
            glyph={'post'}
            onClick={() => dispatch(changeActiveThread('new'))}
            tipText={'New conversation'}
            tipLocation={'bottom-left'}
          />
        </HeaderWrapper>
      </React.Fragment>
    );
  }
}

export default connect()(Header);
