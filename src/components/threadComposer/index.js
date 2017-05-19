// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import renderComponent from 'recompose/renderComponent';
// $FlowFixMe
import branch from 'recompose/branch';
// $FlowFixMe
import Textarea from 'react-textarea-autosize';
// $FlowFixMe
import { withRouter } from 'react-router';
import { Button } from '../buttons';
import Icon from '../icons';
import { LoadingCard } from '../loading';
import { getComposerCommunitiesAndChannels } from './queries';
import { publishThread } from './mutations';
import {
  Container,
  Composer,
  Overlay,
  Placeholder,
  PlaceholderLabel,
  ThreadDescription,
  ThreadTitle,
  ContentContainer,
  Actions,
  Dropdowns,
} from './style';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

class ThreadComposerWithData extends Component {
  // prop types
  state: {
    isOpen: boolean,
    title: string,
    body: string,
    availableCommunities: Array<any>,
    availableChannels: Array<any>,
    activeCommunity: string,
    activeChannel: string,
    isPublishing: boolean,
  };

  constructor(props) {
    super(props);

    /*
      Create a new array of communities only containing the `node` data from
      graphQL. Then filter the resulting channel to remove any communities
      that don't have any channels yet

      TODO: Ideally we don't have any communities with no channel. If we
      can guarantee this, we can remove the extra filter here
    */
    const availableCommunities = props.data.user.communityConnection.edges
      .map(edge => edge.node)
      .filter(community => community.channelConnection.edges.length > 0);

    /*
      Iterate through each of our community nodes to construct a new array
      of possible channels

      returns an array of array, where each parent array represents a community
      and each child array represents the channels within that parent
      community
    */
    const availableChannels = availableCommunities.map(community => {
      const arr = [];
      community.channelConnection.edges.map(edge => arr.push(edge.node));
      return arr;
    });

    /*
      If a user is viewing a communit or channel, we use the url as a prop
      to set a default activeCommunity and activeChannel

      If no defaults are set, we use the first available community, and then
      find the first available channel within that available community
    */
    const activeCommunity = props.activeCommunity
      ? availableCommunities.filter(community => {
          return community.slug === props.activeCommunity;
        })[0].id
      : availableCommunities[0].id;
    const activeChannel = props.activeChannel
      ? availableChannels
          .filter(
            // get the channels for the proper community
            channels => channels[0].community.id === activeCommunity
          )
          .map(channels =>
            // get the correct channel based on the slug
            channels.find(channel => channel.slug === props.activeChannel)
          )[0].id
      : availableChannels.filter(
          // get the channels for the proper community
          channels => channels[0].community.id === activeCommunity
        )[0][0].id; // and select the first one in the list

    this.state = {
      isOpen: false,
      title: '',
      body: '',
      availableCommunities,
      availableChannels,
      activeCommunity,
      activeChannel,
      isPublishing: false,
    };
  }

  changeTitle = e => {
    const title = e.target.value;
    this.setState({
      title,
    });
  };

  changeBody = e => {
    const body = e.target.value;
    this.setState({
      body,
    });
  };

  handleOpenComposer = () => {
    // strange construction here in order to guarantee that we focus the title
    // input whenever the composer is opened
    const isOpen = this.state.isOpen;
    if (!isOpen) {
      this.setState({ isOpen: true });
      this.refs.titleTextarea.focus();
    }
  };

  closeComposer = () => {
    this.setState({
      isOpen: false,
    });
  };

  setActiveCommunity = e => {
    const newActiveCommunity = e.target.value;
    const newActiveChannel = this.state.availableChannels.filter(
      channel => channel[0].community.id === newActiveCommunity
    )[0][0].id;

    this.setState({
      activeCommunity: newActiveCommunity,
      activeChannel: newActiveChannel,
    });
  };

  setActiveChannel = e => {
    const activeChannel = e.target.value;

    this.setState({
      activeChannel,
    });
  };

  publishThread = () => {
    console.log(
      'attemping to publish thread in ',
      this.state.activeChannel,
      this.state.activeCommunity
    );
    // if no title and no channel is set, don't allow a thread to be published
    if (!this.state.title || !this.state.activeChannel) {
      return;
    }

    // isPublishing will change the publish button to a loading spinner
    this.setState({
      isPublishing: true,
    });

    // define new constants in order to construct the proper shape of the
    // input for the publishThread mutation
    const { activeChannel, activeCommunity, title, body } = this.state;
    const channelId = activeChannel;
    const communityId = activeCommunity;
    const content = {
      title,
      body,
    };

    // this.props.mutate comes from a higher order component defined at the
    // bottom of this file
    this.props
      .mutate({
        variables: {
          thread: {
            channelId,
            communityId,
            content,
          },
        },
      })
      // after the mutation occurs, it will either return an error or the new
      // thread that was published
      .then(({ data }) => {
        // get the thread id to redirect the user
        console.log('data', data);
        const id = data.publishThread.id;

        // stop the loading spinner on the publish button
        this.setState({
          isPublishing: false,
        });

        // redirect the user to the thread
        this.props.history.push(`/thread/${id}`);
      })
      .catch(error => {
        // TODO add some kind of dispatch here to show an error to the user
        console.log('error publishing thread', error);
      });
  };

  render() {
    const {
      isOpen,
      title,
      availableChannels,
      availableCommunities,
      activeCommunity,
      activeChannel,
      isPublishing,
    } = this.state;

    return (
      <Container isOpen={isOpen}>
        <Overlay isOpen={isOpen} onClick={this.closeComposer} />
        <Composer isOpen={isOpen} onClick={this.handleOpenComposer}>

          <Placeholder isOpen={isOpen}>
            <Icon glyph="post" />
            <PlaceholderLabel>
              Start a new thread with your friends...
            </PlaceholderLabel>
          </Placeholder>

          <ContentContainer isOpen={isOpen}>
            <Textarea
              onChange={this.changeTitle}
              style={ThreadTitle}
              value={this.state.title}
              placeholder={'A title for your thread...'}
              ref="titleTextarea"
              autoFocus
            />

            <Textarea
              onChange={this.changeBody}
              value={this.state.body}
              style={ThreadDescription}
              ref="bodyTextarea"
              placeholder={
                'Write more thoughts here, add photos, and anything else!'
              }
            />

            <Actions>
              <Dropdowns>
                <select
                  onChange={this.setActiveCommunity}
                  defaultValue={activeCommunity}
                >
                  {availableCommunities.map(community => {
                    return (
                      <option key={community.id} value={community.id}>
                        {community.name}
                      </option>
                    );
                  })}
                </select>

                <select
                  onChange={this.setActiveChannel}
                  defaultValue={activeChannel}
                >
                  {availableChannels
                    .filter(
                      channel => channel[0].community.id === activeCommunity
                    )
                    .map((channel, i) => {
                      return channel.map(e => {
                        return (
                          <option key={e.id} value={e.id}>{e.name}</option>
                        );
                      });
                    })}
                </select>
              </Dropdowns>

              <Button
                onClick={this.publishThread}
                loading={isPublishing}
                disabled={!title || isPublishing}
                color={'brand'}
              >
                Publish
              </Button>
            </Actions>
          </ContentContainer>

        </Composer>
      </Container>
    );
  }
}

export const ThreadComposer = compose(
  getComposerCommunitiesAndChannels, // query to get data
  publishThread, // mutation to publish a thread
  displayLoadingState, // handle loading state while query is fetching
  withRouter, // needed to use history.push() as a post-publish action
  pure
)(ThreadComposerWithData);

export default ThreadComposer;
