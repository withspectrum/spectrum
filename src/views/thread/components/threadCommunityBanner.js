// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import Icon from '../../../components/icons';
import { Button, OutlineButton } from '../../../components/buttons';
import { toggleChannelSubscriptionMutation } from '../../../api/channel';
import { addToastWithTimeout } from '../../../actions/toasts';
import Avatar from '../../../components/avatar';
import { track } from '../../../helpers/events';
import {
  CommunityHeader,
  CommunityHeaderName,
  CommunityHeaderChannelTag,
  CommunityHeaderLink,
  CommunityHeaderMeta,
  PillLink,
  PillLabel,
  PinIcon,
  Lock,
  PillLinkPinned,
} from '../style';

type Props = {
  dispatch: Function,
  toggleChannelSubscription: Function,
  thread: {
    id: string,
    community: {
      name: string,
      slug: string,
      profilePhoto: string,
      pinnedThreadId: string,
      id: string,
    },
    channel: {
      id: string,
      slug: string,
      name: string,
      isPrivate: boolean,
      channelPermissions: {
        isMember: boolean,
      },
    },
  },
};
type State = {
  isLoading: boolean,
};
class ThreadCommunityBanner extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = { isLoading: false };
  }

  joinCommunity = () => {
    const {
      thread: { channel },
      dispatch,
      toggleChannelSubscription,
    } = this.props;

    this.setState({
      isLoading: true,
    });

    toggleChannelSubscription({ channelId: channel.id })
      .then(({ data: { toggleChannelSubscription } }) => {
        this.setState({
          isLoading: false,
        });

        const {
          isMember,
          isPending,
        } = toggleChannelSubscription.channelPermissions;

        let str = '';
        if (isPending) {
          track('channel', 'requested to join', null);
          str = `Your request to join the ${toggleChannelSubscription.name} channel in ${toggleChannelSubscription
            .community.name} has been sent.`;
        }

        if (!isPending && isMember) {
          track('channel', 'joined', null);
          str = `Joined the ${toggleChannelSubscription.community
            .name} community!`;
        }

        if (!isPending && !isMember) {
          track('channel', 'unjoined', null);
          str = `Left the channel ${toggleChannelSubscription.name} in ${toggleChannelSubscription
            .community.name}.`;
        }

        const type = isMember || isPending ? 'success' : 'neutral';
        dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        console.log(err);
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { thread: { channel, community, id } } = this.props;
    const { isLoading } = this.state;
    const isPinned = id === community.pinnedThreadId;

    return (
      <CommunityHeader>
        <CommunityHeaderMeta>
          <CommunityHeaderLink to={`/${community.slug}`}>
            <Avatar src={community.profilePhoto} community size={32} />
            <CommunityHeaderName>{community.name}</CommunityHeaderName>
          </CommunityHeaderLink>

          {channel.slug !== 'general' && (
            <PillLink to={`/${community.slug}/${channel.slug}`}>
              {channel.isPrivate && (
                <Lock>
                  <Icon glyph="private" size={12} />
                </Lock>
              )}
              <PillLabel isPrivate={channel.isPrivate}>
                {channel.name}
              </PillLabel>
            </PillLink>
          )}

          {isPinned && (
            <PillLinkPinned>
              <PinIcon>
                <Icon glyph="pin-fill" size={12} />
              </PinIcon>
              <PillLabel>Pinned</PillLabel>
            </PillLinkPinned>
          )}
        </CommunityHeaderMeta>

        {channel.channelPermissions.isMember ? (
          <Link to={`/${community.slug}`}>
            <OutlineButton>View Community</OutlineButton>
          </Link>
        ) : (
          <Button onClick={this.joinCommunity} loading={isLoading}>
            Join Community
          </Button>
        )}
      </CommunityHeader>
    );
  }
}
const map = state => ({ currentUser: state.users.currentUser });
export default compose(connect(map), toggleChannelSubscriptionMutation)(
  ThreadCommunityBanner
);
