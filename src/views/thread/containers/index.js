// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { track } from '../../../helpers/events';
import generateMetaInfo from '../../../../server/shared/generate-meta-info';
import { toggleChannelSubscriptionMutation } from '../../../api/channel';
import { addToastWithTimeout } from '../../../actions/toasts';
import Titlebar from '../../../views/titlebar';
import ThreadDetail from '../components/threadDetail';
import Messages from '../components/messages';
import Head from '../../../components/head';
import ChatInput from '../../../components/chatInput';
import { Column } from '../../../components/column';
import AppViewWrapper from '../../../components/appViewWrapper';
import { getThread } from '../queries';
import { displayLoadingScreen } from '../../../components/loading';
import { FlexCol } from '../../../components/globals';
import {
  Container,
  ChatInputWrapper,
  DetailViewWrapper,
  DetailColumn,
} from '../style';
import {
  UpsellSignIn,
  UpsellRequestToJoinChannel,
  UpsellJoinChannel,
  Upsell404Thread,
} from '../../../components/upsell';

class ThreadContainerPure extends Component {
  state: {
    isLoading: boolean,
  };

  constructor() {
    super();

    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {
    track('thread', 'viewed', null);
  }

  forceScrollToBottom = () => {
    if (!this.scrollBody) return;

    let node = this.scrollBody;
    node.scrollTop = node.scrollHeight - node.clientHeight;
  };

  contextualScrollToBottom = () => {
    if (!this.scrollBody) return;
    let node = this.scrollBody;
    if (node.scrollHeight - node.clientHeight < node.scrollTop + 140) {
      node.scrollTop = node.scrollHeight - node.clientHeight;
    }
  };

  toggleSubscription = channelId => {
    this.setState({
      isLoading: true,
    });

    this.props
      .toggleChannelSubscription({ channelId })
      .then(({ data: { toggleChannelSubscription } }) => {
        this.setState({
          isLoading: false,
        });

        const isMember = toggleChannelSubscription.channelPermissions.isMember;
        const isPending =
          toggleChannelSubscription.channelPermissions.isPending;
        let str;
        if (isPending) {
          track('channel', 'requested to join', null);
          str = `Requested to join ${toggleChannelSubscription.name} in ${toggleChannelSubscription.community.name}`;
        }

        if (!isPending && isMember) {
          track('channel', 'joined', null);
          str = `Joined ${toggleChannelSubscription.name} in ${toggleChannelSubscription.community.name}!`;
        }

        if (!isPending && !isMember) {
          track('channel', 'unjoined', null);
          str = `Left the channel ${toggleChannelSubscription.name} in ${toggleChannelSubscription.community.name}.`;
        }

        const type = isMember || isPending ? 'success' : 'neutral';
        this.props.dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });

        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { data: { thread, error }, currentUser } = this.props;
    const { isLoading } = this.state;

    if (error) {
      return (
        <FlexCol style={{ flex: '1 1 auto' }}>
          <Titlebar
            title={'Thread not found'}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <AppViewWrapper>
            <Column type="primary">
              <Upsell404Thread />
            </Column>
          </AppViewWrapper>
        </FlexCol>
      );
    }

    if (!thread || thread.deleted) {
      return (
        <FlexCol style={{ flex: '1 1 auto' }}>
          <Titlebar
            title={'Thread not found'}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <AppViewWrapper>
            <Column type="primary">
              <Upsell404Thread />
            </Column>
          </AppViewWrapper>
        </FlexCol>
      );
    }

    if (
      thread.channel.isPrivate && !thread.channel.channelPermissions.isMember
    ) {
      return (
        <FlexCol style={{ flex: '1 1 auto' }}>
          <Titlebar
            title={'Private Thread'}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <AppViewWrapper>
            <Column type="primary">
              <UpsellRequestToJoinChannel
                channel={thread.channel}
                community={thread.channel.community.slug}
                isPending={thread.channel.channelPermissions.isPending}
                subscribe={() => this.toggleSubscription(thread.channel.id)}
                currentUser={currentUser}
              />
            </Column>
          </AppViewWrapper>
        </FlexCol>
      );
    }

    const { title, description } = generateMetaInfo({
      type: 'thread',
      data: {
        title: thread.content.title,
        body: thread.content.body,
        type: thread.type,
        channelName: thread.channel.name,
      },
    });

    // create an array of participant Ids and the creator Id
    // which gets passed into the <Messages> component - if the current
    // user is a participant or the thread creator, we will trigger
    // a forceScrollToBottom on mount
    const participantIds =
      thread.participants && thread.participants.map(user => user.id);
    // add checks to make sure that participantIds has ids in it. if there
    // are no participants yet, only pass the creator id to the forceScrollToBottom
    // method
    const participantsAndCreator = participantIds.length > 0
      ? [...participantIds, thread.creator.id]
      : [thread.creator.id];

    return (
      <FlexCol style={{ flex: '1 1 auto' }}>
        <Titlebar
          title={thread.content.title}
          subtitle={`${thread.channel.community.name} / ${thread.channel.name}`}
          provideBack={true}
          backRoute={`/${thread.channel.community.slug}/${thread.channel.slug}`}
          noComposer
        />
        <DetailViewWrapper>
          <Head title={title} description={description} />

          <DetailColumn type="half">
            <Container innerRef={scrollBody => this.scrollBody = scrollBody}>
              {!currentUser && <UpsellSignIn />}
              <ThreadDetail thread={thread} />
              <Messages
                id={thread.id}
                participants={participantsAndCreator}
                currentUser={currentUser}
                forceScrollToBottom={this.forceScrollToBottom}
                contextualScrollToBottom={this.contextualScrollToBottom}
              />

              {// if the user exists but isn't a subscriber to the channel,
              // show an upsell to join the channel
              currentUser &&
                !thread.isLocked &&
                !thread.channel.channelPermissions.isMember &&
                <UpsellJoinChannel
                  channel={thread.channel}
                  subscribe={this.toggleSubscription}
                  loading={isLoading}
                />}
            </Container>
            {// if user exists, and is either the thread creator or a subscriber
            // of the channel the thread was posted in, the user can see the
            // chat input
            currentUser &&
              !thread.isLocked &&
              (thread.isCreator ||
                thread.channel.channelPermissions.isMember) &&
              <ChatInputWrapper>
                <ChatInput
                  threadType="story"
                  thread={thread.id}
                  currentUser={currentUser}
                  forceScrollToBottom={this.forceScrollToBottom}
                />
              </ChatInputWrapper>}
          </DetailColumn>
        </DetailViewWrapper>
      </FlexCol>
    );
  }
}

const ThreadContainer = compose(
  toggleChannelSubscriptionMutation,
  getThread,
  displayLoadingScreen,
  pure
)(ThreadContainerPure);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default connect(mapStateToProps)(ThreadContainer);
