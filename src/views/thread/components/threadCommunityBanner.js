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
  CommunityHeaderMetaCol,
  PillLink,
  PillLabel,
  Lock,
} from '../style';

type Props = {
  dispatch: Function,
  toggleChannelSubscription: Function,
  currentUser: Object,
  hide: boolean,
  thread: {
    id: string,
    community: {
      name: string,
      slug: string,
      profilePhoto: string,
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
    const {
      thread: { channel, community, id },
      currentUser,
      hide,
    } = this.props;
    const { isLoading } = this.state;

    return (
      <CommunityHeader hide={hide}>
        <CommunityHeaderMeta>
          <CommunityHeaderLink to={`/${community.slug}`}>
            <Avatar src={community.profilePhoto} community size={32} />
            <CommunityHeaderMetaCol>
              <CommunityHeaderName>{community.name}</CommunityHeaderName>

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
            </CommunityHeaderMetaCol>
          </CommunityHeaderLink>
        </CommunityHeaderMeta>

        {channel.channelPermissions.isMember ? (
          <span />
        ) : currentUser ? (
          <Button
            gradientTheme={'success'}
            onClick={this.joinCommunity}
            loading={isLoading}
          >
            Join Community
          </Button>
        ) : (
          <Link to={`/login?r=${window.location}`}>
            <Button gradientTheme={'success'}>Join Community</Button>
          </Link>
        )}
      </CommunityHeader>
    );
  }
}
const map = state => ({ currentUser: state.users.currentUser });
// $FlowIssue
export default compose(connect(map), toggleChannelSubscriptionMutation)(
  ThreadCommunityBanner
);
