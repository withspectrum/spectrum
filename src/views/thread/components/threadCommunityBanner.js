// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Link from 'src/components/link';
import { LikeButton } from 'src/components/threadLikes';
import Icon from '../../../components/icons';
import { Button } from '../../../components/buttons';
import toggleChannelSubscriptionMutation from 'shared/graphql/mutations/channel/toggleChannelSubscription';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import { addToastWithTimeout } from '../../../actions/toasts';
import Avatar from '../../../components/avatar';
import { CLIENT_URL } from 'src/api/constants';
import type { Dispatch } from 'redux';
import {
  CommunityHeader,
  CommunityHeaderName,
  CommunityHeaderLink,
  CommunityHeaderMeta,
  CommunityHeaderSubtitle,
  CommunityHeaderMetaCol,
  PillLink,
  PillLabel,
  Lock,
} from '../style';

type Props = {
  dispatch: Dispatch<Object>,
  toggleChannelSubscription: Function,
  currentUser: Object,
  hide: boolean,
  watercooler: boolean,
  thread: GetThreadType,
};
type State = {
  isLoading: boolean,
};
class ThreadCommunityBanner extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = { isLoading: false };
  }

  joinChannel = () => {
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
          str = `Your request to join the ${
            toggleChannelSubscription.name
          } channel in ${
            toggleChannelSubscription.community.name
          } has been sent.`;
        }

        if (!isPending && isMember) {
          str = `Joined the ${
            toggleChannelSubscription.community.name
          } community!`;
        }

        if (!isPending && !isMember) {
          str = `Left the channel ${toggleChannelSubscription.name} in ${
            toggleChannelSubscription.community.name
          }.`;
        }

        const type = isMember || isPending ? 'success' : 'neutral';
        return dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const {
      thread: { channel, community, watercooler, id },
      thread,
      currentUser,
      hide,
    } = this.props;
    const { isLoading } = this.state;

    const loginUrl = community.brandedLogin.isEnabled
      ? `/${community.slug}/login?r=${CLIENT_URL}/thread/${id}`
      : `/login?r=${CLIENT_URL}/${community.slug}/thread/${id}`;

    return (
      <CommunityHeader hide={hide}>
        <CommunityHeaderMeta>
          <CommunityHeaderLink to={`/${community.slug}`}>
            <Avatar src={community.profilePhoto} community size={32} />
          </CommunityHeaderLink>
          <CommunityHeaderMetaCol>
            <CommunityHeaderName>
              {watercooler
                ? `${community.name} watercooler`
                : thread.content.title}
            </CommunityHeaderName>
            <CommunityHeaderLink to={`/${community.slug}`}>
              <CommunityHeaderSubtitle>
                {`${community.name}`}
                {channel.slug !== 'general' && (
                  <span>{` (${channel.name})`}</span>
                )}
                <span>{` · ${thread.timestamp}`}</span>
              </CommunityHeaderSubtitle>
            </CommunityHeaderLink>
          </CommunityHeaderMetaCol>
        </CommunityHeaderMeta>

        {channel.channelPermissions.isMember ? (
          <LikeButton thread={thread} />
        ) : currentUser ? (
          <Button
            gradientTheme={'success'}
            onClick={this.joinChannel}
            loading={isLoading}
          >
            Join channel
          </Button>
        ) : (
          <Link to={loginUrl}>
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
