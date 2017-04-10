//@flow
import React, { Component } from 'react';
//$FlowFixMe
import deepEqual from 'deep-eql';
//$FlowFixMe
import { connect } from 'react-redux';
import { login } from '../../../../actions/user';
import { subscribeFrequency } from '../../../../actions/frequencies';
import { getPermission } from '../../../../helpers/permissions';
import { Container, ScrollBody, Footer, Text } from './style';
import Story from './Story';
import StoryActions from './StoryActions';
import Chat from './Chat';
import ChatInput from '../../ChatInput';
import { Button } from '../../../../shared/Globals';

class StoryChat extends Component {
  static defaultProps = {
    story: React.PropTypes.object.isRequired,
    community: React.PropTypes.object,
    frequency: React.PropTypes.object,
    messages: React.PropTypes.array,
  };

  shouldComponentUpdate = (nextProps: Object) => {
    return !deepEqual(nextProps, this.props);
  };

  subscribeFrequency = () => {
    const { community, frequency } = this.props;

    this.props.dispatch(
      subscribeFrequency(
        {
          frequencySlug: frequency.slug,
          communitySlug: community.slug,
        },
        false,
      ),
    );
  };

  login = () => {
    this.props.dispatch(login());
  };

  render = () => {
    const state = this.context.store.getState();
    const { community, frequency, story, messages } = this.props;
    const usersList = state.user.list;
    const currentUser = state.user;
    const frequencyRole = currentUser.uid &&
      frequency &&
      getPermission(currentUser.uid, frequency);
    const communityRole = currentUser.uid &&
      community &&
      getPermission(currentUser.uid, community);
    console.log('roles are: ', frequencyRole, communityRole);

    return (
      <Container ref={'container'}>
        <ScrollBody>
          <Story story={story} frequency={frequency} community={community} />
          <StoryActions story={story} role={communityRole} />
          <Chat
            messages={messages}
            usersList={usersList}
            currentUser={currentUser}
          />
        </ScrollBody>

        {currentUser.uid &&
          frequencyRole && //signed in and joined this frequency
          <ChatInput />}

        {currentUser.uid &&
          !frequencyRole && // signed in, hasn't joined frequency
          <Footer>
            <Text>Feel like weighing in?</Text>
            <Button onClick={this.subscribeFrequency}>
              Join ~{frequency.name}
            </Button>
          </Footer>}

        {!currentUser.uid && // not signed in
          <Footer>
            <Text>Feel like weighing in?</Text>
            <Button onClick={this.login}>Sign in with Twitter</Button>
          </Footer>}
      </Container>
    );
  };
}

StoryChat.contextTypes = {
  store: React.PropTypes.object.isRequired,
};

export default connect()(StoryChat);
