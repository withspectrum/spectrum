import React, { Component } from 'react';
import { connect } from 'react-redux';

import DirectMessagesContainer from './DirectMessagesContainer';

import { Link } from 'react-router-dom';
import { subscribeFrequency } from '../../actions/frequencies';
import { isStoryCreator, getStoryPermission } from '../../helpers/stories';
import { getCurrentFrequency } from '../../helpers/frequencies';
import { login } from '../../actions/user';
import history from '../../helpers/history';
import Icon from '../../shared/Icons';
import { Button, H4 } from '../../shared/Globals';
import Story from './Story';
import ActionBar from './Story/ActionBar';
import Chat from './Chat';
import ChatInput from './ChatInput';
import Composer from './Composer';
import Explore from './Explore';

import {
  ViewContainer,
  NullContainer,
  Footer,
  StoryChatContainer,
  BackArrow,
  LoginWrapper,
  Name,
  SubText,
  Heading,
  Spacer,
} from './style';

class RightColumn extends Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    // only update the right column if the top level navigation changes
    if (nextProps.activeCommunity !== this.props.activeCommunity) {
      return true;
    }
  };
  // componentWillMount = () => {
  //   const { messageGroups: { active } } = this.props;
  //   if (active) {
  //     this.forceScrollToBottom();
  //   }
  // };
  //
  // componentDidMount = () => {
  //   const { messageGroups: { active } } = this.props;
  //   // if user is viewing a message group, scroll to bottom
  //   if (active) {
  //     this.forceScrollToBottom();
  //   }
  // };
  //
  // componentDidUpdate = (prevProps, prevState) => {
  //   const { messageGroups: { active } } = this.props;
  //
  //   if (active !== prevProps.messageGroups.active) {
  //     this.forceScrollToBottom();
  //   }
  // };
  //
  // getActiveStory = () => {
  //   const { stories: { stories, active } } = this.props;
  //   if (!stories || stories.length === 0) return;
  //
  //   return stories.find(story => story.id === active);
  // };
  //
  // getActiveMessageGroup = () => {
  //   const { messageGroups: { messageGroups, active } } = this.props;
  //   if (!messageGroups || messageGroups.length === 0) return;
  //
  //   return messageGroups.find(group => group.id === active);
  // };
  //
  // // if the user is at the bottom of the chat view and another user sends a message, scroll the view
  // contextualScrollToBottom = () => {
  //   if (!this.comp) return;
  //   let node = this.comp;
  //   if (node.scrollHeight - node.clientHeight < node.scrollTop + 140) {
  //     node.scrollTop = node.scrollHeight - node.clientHeight;
  //   }
  // };
  //
  // // if the current user sends a message, scroll the view
  // forceScrollToBottom = () => {
  //   if (!this.comp) return;
  //   let node = this.comp;
  //
  //   node.scrollTop = node.scrollHeight - node.clientHeight;
  // };
  //
  // subscribeFrequency = () => {
  //   this.props.dispatch(
  //     subscribeFrequency(
  //       {
  //         frequencySlug: this.props.frequencies.active,
  //         communitySlug: this.props.activeCommunity,
  //       },
  //       false,
  //     ),
  //   );
  // };
  //
  // login = () => {
  //   this.props.dispatch(login());
  // };
  //
  // // used on mobile when closing the story view
  // clearActiveStory = () => {
  //   this.props.dispatch({
  //     type: 'CLEAR_ACTIVE_STORY',
  //   });
  // };

  render() {
    const { activeCommunity } = this.props;

    if (activeCommunity === 'messages') {
      return <DirectMessagesContainer />;
    } else if (activeCommunity === 'explore') {
      return <Explore />;
    } else {
      return <StoryChatContainer />;
    }

    // if (activeCommunity === 'messages') {
    //   let messageGroup = this.getActiveMessageGroup();
    //   if (messageGroup && !messageComposer.isOpen) {
    //     // all participants in the chat
    //     const userIds = Object.keys(messageGroup.users);
    //     // everyone except currently viewing user
    //     const otherUsers = userIds.filter(userId => userId !== user.uid);
    //     const otherName = user.list[otherUsers[0]].displayName;
    //
    //     return (
    //       <ViewContainer>
    //         <Link to={`/messages`}>
    //           <BackArrow onClick={this.clearActiveStory}>
    //             <Icon icon="back" />
    //             <Heading>
    //               <SubText>Message with</SubText>
    //               <Name>{otherName}</Name>
    //             </Heading>
    //             <Spacer />
    //           </BackArrow>
    //         </Link>
    //
    //         <StoryChatContainer innerRef={comp => this.comp = comp}>
    //           <MessageGroupHeader messageGroup={messageGroup} />
    //           <Chat
    //             forceScrollToBottom={this.forceScrollToBottom}
    //             contextualScrollToBottom={this.contextualScrollToBottom}
    //             messageGroup={messageGroup}
    //             shouldScrollToBottomOnRender
    //           />
    //         </StoryChatContainer>
    //
    //         <Footer>
    //           {user.uid &&
    //             <ChatInput forceScrollToBottom={this.forceScrollToBottom} />}
    //         </Footer>
    //       </ViewContainer>
    //     );
    //   } else if (messageComposer.isOpen) {
    //     return (
    //       <ViewContainer>
    //         <MessageComposer />
    //         <StoryChatContainer />
    //         <Footer>
    //           {user.uid &&
    //             <ChatInput forceScrollToBottom={this.forceScrollToBottom} />}
    //         </Footer>
    //       </ViewContainer>
    //     );
    //   } else {
    //     return (
    //       <ViewContainer>
    //         <NullContainer />
    //       </ViewContainer>
    //     );
    //   }
    // }

    // let story = this.getActiveStory();
    // const communitySlug = activeCommunity;
    // let role, creator, locked, storyFrequency, returnUrl;
    // if (story !== undefined) {
    //   if (story.deleted) {
    //     // a user has landed on an old url, boot them back to the story's community or everything
    //     history.push(`/${`${communitySlug}/${active}` || 'everything'}`);
    //     story = null;
    //   }
    //
    //   creator = isStoryCreator(story, user);
    //   role = getStoryPermission(story, user, frequencies);
    //   locked = story && story.locked ? story.locked : false;
    //
    //   storyFrequency = story &&
    //     getCurrentFrequency(story.frequencyId, frequencies);
    //
    //   returnUrl = communitySlug === 'everything'
    //     ? 'everything'
    //     : `${communitySlug}/`;
    //
    //   returnUrl = active === 'explore' ? 'explore' : returnUrl;
    // }
    //
    // if (story && !composer.isOpen && !messageGroups.active) {
    //   const storyHref = storyFrequency
    //     ? `/${communitySlug}/~${storyFrequency.slug}/${story.id}`
    //     : `/everything/${story.id}`;
    //   return (
    //     <ViewContainer>
    //       <Link to={`/${returnUrl}`}>
    //         <BackArrow onClick={this.clearActiveStory}>
    //           <Icon icon="back" />
    //         </BackArrow>
    //       </Link>
    //
    //       <StoryChatContainer
    //         innerRef={comp => this.comp = comp}
    //         locked={story.locked}
    //         onScroll={this.onScroll}
    //       >
    //         <Story story={story} frequency={storyFrequency} active={active} />
    //         <ActionBar
    //           locked={locked}
    //           moderator={role}
    //           creator={creator}
    //           story={story}
    //           shareUrl={`https://spectrum.chat${storyHref}`}
    //         />
    //         <Chat
    //           forceScrollToBottom={this.forceScrollToBottom}
    //           contextualScrollToBottom={this.contextualScrollToBottom}
    //           story={story}
    //         />
    //       </StoryChatContainer>
    //
    //       {!story.locked &&
    //         <Footer centered={!role}>
    //           {user.uid &&
    //             role &&
    //             <ChatInput forceScrollToBottom={this.forceScrollToBottom} />}
    //
    //           {!user.uid &&
    //             <LoginWrapper center>
    //               <H4>Feel like weighing in?</H4>
    //               <Button onClick={this.login}>Sign in with Twitter</Button>
    //             </LoginWrapper>}
    //
    //           {user.uid &&
    //             !role &&
    //             <LoginWrapper center>
    //               <H4>Feel like weighing in?</H4>
    //               <Button onClick={this.subscribeFrequency}>
    //                 Join ~{this.props.frequencies.active}
    //               </Button>
    //             </LoginWrapper>}
    //         </Footer>}
    //     </ViewContainer>
    //   );
    // } else if (composer.isOpen) {
    //   return (
    //     <ViewContainer>
    //       <Composer />
    //     </ViewContainer>
    //   );
    // } else if (communitySlug === 'explore') {
    //   return (
    //     <ViewContainer>
    //       <Link to={`/everything`}>
    //         <BackArrow onClick={this.clearActiveStory}>
    //           <Icon icon="back" />
    //         </BackArrow>
    //       </Link>
    //       <Explore />
    //     </ViewContainer>
    //   );
    // } else {
    //   return (
    //     <ViewContainer>
    //       <NullContainer />
    //     </ViewContainer>
    //   );
    // }
  }
}

const mapStateToProps = state => ({
  activeCommunity: state.communities.active,
});

export default connect(mapStateToProps)(RightColumn);
