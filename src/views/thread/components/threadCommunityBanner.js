// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import {
  CommunityHoverProfile,
  ChannelHoverProfile,
} from 'src/components/hoverProfile';
import { LikeButton } from 'src/components/threadLikes';
import { convertTimestampToDate } from 'shared/time-formatting';
import { Button } from 'src/components/buttons';
import toggleChannelSubscriptionMutation from 'shared/graphql/mutations/channel/toggleChannelSubscription';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import { addToastWithTimeout } from 'src/actions/toasts';
import { CommunityAvatar } from 'src/components/avatar';
import { CLIENT_URL } from 'src/api/constants';
import getThreadLink from 'src/helpers/get-thread-link';
import type { Dispatch } from 'redux';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  CommunityHeader,
  CommunityHeaderName,
  CommunityHeaderMeta,
  CommunityHeaderSubtitle,
  CommunityHeaderMetaCol,
  AnimatedContainer,
} from '../style';

type Props = {
  dispatch: Dispatch<Object>,
  toggleChannelSubscription: Function,
  currentUser: Object,
  hide: boolean,
  watercooler: boolean,
  thread: GetThreadType,
  isVisible: boolean,
  forceScrollToTop: Function,
};
type State = {
  isLoading: boolean,
};
class ThreadCommunityBanner extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = { isLoading: false };
  }

  render() {
    const {
      thread: { channel, community, watercooler },
      thread,
      currentUser,
      isVisible,
      forceScrollToTop,
    } = this.props;
    const { isLoading } = this.state;

    const loginUrl = community.brandedLogin.isEnabled
      ? `/${community.slug}/login?r=${CLIENT_URL}/${getThreadLink(thread)}`
      : `/login?r=${CLIENT_URL}/${getThreadLink(thread)}`;

    const createdAt = new Date(thread.createdAt).getTime();
    const timestamp = convertTimestampToDate(createdAt);

    return (
      <AnimatedContainer isVisible={isVisible}>
        <CommunityHeader>
          <CommunityHeaderMeta>
            <CommunityAvatar community={community} size={32} />
            <CommunityHeaderMetaCol>
              <CommunityHeaderName onClick={forceScrollToTop}>
                {watercooler
                  ? `${community.name} watercooler`
                  : thread.content.title}
              </CommunityHeaderName>
              <CommunityHeaderSubtitle>
                <CommunityHoverProfile id={community.id}>
                  <Link to={`/${community.slug}`}>{community.name}</Link>
                </CommunityHoverProfile>
                <span>/</span>
                <ChannelHoverProfile id={channel.id}>
                  <Link to={`/${community.slug}/${channel.slug}`}>
                    {channel.name}
                  </Link>
                </ChannelHoverProfile>
                <Link to={'/' + getThreadLink(thread)}>
                  &nbsp;
                  {`· ${timestamp}`}
                </Link>
              </CommunityHeaderSubtitle>
            </CommunityHeaderMetaCol>
          </CommunityHeaderMeta>

          {channel.channelPermissions.isMember && (
            <LikeButton thread={thread} />
          )}
        </CommunityHeader>
      </AnimatedContainer>
    );
  }
}
export default compose(
  withCurrentUser,
  toggleChannelSubscriptionMutation,
  connect()
)(ThreadCommunityBanner);
