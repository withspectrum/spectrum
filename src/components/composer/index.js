import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import Textarea from 'react-textarea-autosize';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import { connect } from 'react-redux';

import { track } from '../../helpers/events';
import { openComposer, closeComposer } from '../../actions/composer';
import { changeActiveThread } from '../../actions/dashboardFeed';
import { addToastWithTimeout } from '../../actions/toasts';
import Editor from '../draftjs-editor';
import { toPlainText, fromPlainText, toJSON } from 'shared/draft-utils';
import { getComposerCommunitiesAndChannels } from './queries';
import { publishThread } from './mutations';
import { getLinkPreviewFromUrl } from '../../helpers/utils';
import { URLS } from '../../helpers/regexps';
import { TextButton, Button } from '../buttons';
import { FlexRow } from '../../components/globals';
import { LoadingSelect } from '../loading';
import Titlebar from '../../views/titlebar';
import {
  Container,
  ThreadDescription,
  ThreadTitle,
  ThreadInputs,
  Actions,
  Dropdowns,
  RequiredSelector,
} from './style';

const ENDS_IN_WHITESPACE = /(\s|\n)$/;

class ComposerWithData extends Component {
  // prop types
  state: {
    title: string,
    body: Object,
    availableCommunities: Array<any>,
    availableChannels: Array<any>,
    activeCommunity: ?string,
    activeChannel: ?string,
    isPublishing: boolean,
    linkPreview: ?Object,
    linkPreviewTrueUrl: ?string,
    linkPreviewLength: number,
    fetchingLinkPreview: boolean,
  };

  constructor(props) {
    super(props);

    this.state = {
      title: props.title || '',
      body: props.body || fromPlainText(''),
      availableCommunities: [],
      availableChannels: [],
      activeCommunity: '',
      activeChannel: '',
      isPublishing: false,
      linkPreview: null,
      linkPreviewTrueUrl: '',
      linkPreviewLength: 0,
      fetchingLinkPreview: false,
    };
  }

  handleIncomingProps = props => {
    /*
      Create a new array of communities only containing the `node` data from
      graphQL. Then filter the resulting channel to remove any communities
      that don't have any channels yet
    */

    // if the user doesn't exist, bust outta here
    console.log('1', props);
    if (!props.data.user || props.data.user === undefined) return;
    console.log('2', props);
    const availableCommunities = props.data.user.communityConnection.edges
      .map(edge => edge.node)
      .filter(
        community =>
          community.communityPermissions.isMember ||
          community.communityPermissions.isOwner
      )
      .sort((a, b) => {
        const bc = parseInt(b.communityPermissions.reputation, 10);
        const ac = parseInt(a.communityPermissions.reputation, 10);
        return bc <= ac ? -1 : 1;
      });

    /*
      Iterate through each of our community nodes to construct a new array
      of possible channels

      returns an array of array, where each parent array represents a community
      and each child array represents the channels within that parent
      community
    */
    const availableChannels = props.data.user.channelConnection.edges
      .map(edge => edge.node)
      .filter(
        channel =>
          channel.channelPermissions.isMember ||
          channel.channelPermissions.isOwner
      )
      .filter(channel => {
        if (!channel.isPrivate) return channel;
        if (!channel.community.isPro) return null;
        return channel;
      });

    /*
      If a user is viewing a communit or channel, we use the url as a prop
      to set a default activeCommunity and activeChannel

      If no defaults are set, we use the first available community, and then
      find the first available channel within that available community
    */
    const activeCommunityFromPropsOrState =
      props.activeCommunity || this.state.activeCommunity;

    let activeCommunity =
      availableCommunities &&
      (activeCommunityFromPropsOrState
        ? availableCommunities.filter(community => {
            return (
              community.slug.toLowerCase() ===
              activeCommunityFromPropsOrState.toLowerCase()
            );
          })
        : availableCommunities);

    activeCommunity =
      activeCommunity && activeCommunity.length > 0
        ? activeCommunity[0].id
        : null;

    if (!activeCommunity) {
      return props.data.refetch();
    } else {
      this.setActiveStuff(
        availableCommunities,
        availableChannels,
        activeCommunity
      );
    }
  };

  setActiveStuff = (
    availableCommunities,
    availableChannels,
    activeCommunity
  ) => {
    const props = this.props;

    // get the channels for the proper community
    const activeCommunityChannels = availableChannels.filter(
      channel => channel.community.id === activeCommunity
    );
    let activeChannel = [];

    // Get the active channel if there is one
    if (props.activeChannel) {
      activeChannel = activeCommunityChannels.filter(
        channel =>
          channel.slug.toLowerCase() === props.activeChannel.toLowerCase()
      );
    } else {
      // Try and get the default channel for the active community
      activeChannel = activeCommunityChannels.filter(
        channel => channel.isDefault
      );
      // If there is no default channel capitulate and take the first one
      if (activeChannel.length === 0) {
        activeChannel = activeCommunityChannels;
      } else if (activeChannel.length > 1) {
        const generalChannel = activeChannel.filter(
          channel => channel.slug === 'general'
        );
        if (generalChannel.length > 0) activeChannel = generalChannel;
      }
    }

    // ensure that if no items were found for some reason, we don't crash the app
    // and instead just set null values on the composer
    activeChannel = activeChannel.length > 0 ? activeChannel[0].id : null;

    this.setState({
      title: props.title || '',
      body: props.body || fromPlainText(''),
      availableCommunities,
      availableChannels,
      activeCommunity,
      activeChannel,
      isPublishing: false,
      linkPreview: null,
      linkPreviewTrueUrl: '',
      linkPreviewLength: 0,
      fetchingLinkPreview: false,
    });
  };

  componentDidMount() {
    this.handleIncomingProps(this.props);
  }

  componentWillUpdate(nextProps) {
    const { isOpen } = nextProps;
    if (isOpen) {
      document.addEventListener('keydown', this.handleKeyPress, false);
    } else {
      document.removeEventListener('keydown', this.handleKeyPress, false);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  handleKeyPress = e => {
    // if person taps esc, close the dialog
    if (e.keyCode === 27) {
      this.closeComposer();
    }
  };

  changeTitle = e => {
    const title = e.target.value;
    if (/\n$/g.test(title)) {
      this.bodyEditor.focus();
      return;
    }
    this.setState({
      title,
    });
  };

  changeBody = body => {
    this.listenForUrl(body);
    this.setState({
      body,
    });
  };

  componentDidUpdate(prevProps) {
    const { availableCommunities, availableChannels } = this.state;
    let activeCommunity;

    if (!prevProps.data.user && this.props.data.user) {
      this.handleIncomingProps(this.props);
    }

    if (prevProps.activeCommunity !== this.props.activeCommunity) {
      activeCommunity = this.props.activeCommunity
        ? availableCommunities.filter(community => {
            return community.slug === this.props.activeCommunity;
          })[0].id
        : availableCommunities[0].id;

      this.setState({
        activeCommunity,
      });
    }

    if (prevProps.activeChannel !== this.props.activeChannel) {
      const activeCommunityChannels = availableChannels.filter(
        channel => channel.community.id === activeCommunity
      );
      let activeChannel = [];

      // Get the active channel if there is one
      if (this.props.activeChannel) {
        activeChannel = activeCommunityChannels.filter(
          channel => channel.slug === this.props.activeChannel
        );
      } else {
        // Try and get the default channel for the active community
        activeChannel = activeCommunityChannels.filter(
          channel => channel.isDefault
        );
        // If there is no default channel capitulate and take the first one
        if (activeChannel.length === 0) {
          activeChannel = activeCommunityChannels;
          // If there are more than one default ones, try and choose the "General" one if it exists
        } else if (activeChannel.length > 1) {
          const generalChannel = activeChannel.filter(
            channel => channel.slug === 'general'
          );
          if (generalChannel.length > 0) activeChannel = generalChannel;
        }
      }

      // ensure that if no items were found for some reason, we don't crash the app
      // and instead just set null values on the composer
      activeChannel = activeChannel.length > 0 ? activeChannel[0].id : null;

      this.setState({
        activeChannel,
      });
    }
  }

  handleOpenComposer = () => {
    // strange construction here in order to guarantee that we focus the title
    // input whenever the composer is opened
    const isOpen = this.props.isOpen;
    if (!isOpen) {
      this.props.dispatch(openComposer());
      this.props.data.refetch().then(result => {
        // we have to rebuild a new props object to pass to `this.handleIncomingProps`
        // in order to retain all the previous props passed in from the parent
        // component and the initial data functions provided by apollo
        const newProps = Object.assign({}, this.props, {
          ...this.props,
          data: {
            ...this.props.data,
            user: {
              ...this.props.data.user,
              ...result.data.user,
            },
          },
        });
        this.handleIncomingProps(newProps);
      });
      this.refs.titleTextarea.focus();
    }
  };

  closeComposer = () => {
    const { title, body } = this.state;
    this.props.dispatch(closeComposer(title, body));
  };

  setActiveCommunity = e => {
    const newActiveCommunity = e.target.value;
    const activeCommunityChannels = this.state.availableChannels.filter(
      channel => channel.community.id === newActiveCommunity
    );
    const newActiveCommunityData = this.state.availableCommunities.find(
      community => community.id === newActiveCommunity
    );
    const newActiveChannel =
      activeCommunityChannels.find(channel => {
        // If there is an active channel and we're switching back to the currently open community
        // select that channel
        if (
          this.props.activeChannel &&
          this.props.activeCommunity === newActiveCommunityData.slug
        ) {
          return channel.slug === this.props.activeChannel;
        }
        // Otherwise select the default one
        return channel.isDefault;
        // Default to the first channel if no default one can be found
      }) || activeCommunityChannels[0];

    this.setState({
      activeCommunity: newActiveCommunity,
      activeChannel: newActiveChannel.id,
    });
  };

  setActiveChannel = e => {
    const activeChannel = e.target.value;

    this.setState({
      activeChannel,
    });
  };

  publishThread = () => {
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
    const {
      activeChannel,
      activeCommunity,
      title,
      body,
      linkPreview,
      linkPreviewTrueUrl,
    } = this.state;
    const channelId = activeChannel;
    const communityId = activeCommunity;
    const jsonBody = toJSON(body);

    const content = {
      title,
      body: JSON.stringify(jsonBody),
    };

    const attachments = [];
    if (linkPreview) {
      const attachmentData = JSON.stringify({
        ...linkPreview,
        trueUrl: linkPreviewTrueUrl,
      });
      attachments.push({
        attachmentType: 'linkPreview',
        data: attachmentData,
      });
    }

    // Get the images
    const filesToUpload = Object.keys(jsonBody.entityMap)
      .filter(key => jsonBody.entityMap[key].type === 'image')
      .map(key => jsonBody.entityMap[key].data.file);

    // this.props.mutate comes from a higher order component defined at the
    // bottom of this file
    this.props
      .mutate({
        variables: {
          thread: {
            channelId,
            communityId,
            type: 'DRAFTJS',
            content,
            attachments,
            filesToUpload,
          },
        },
      })
      // after the mutation occurs, it will either return an error or the new
      // thread that was published
      .then(({ data }) => {
        // get the thread id to redirect the user
        const id = data.publishThread.id;

        track('thread', 'published', null);

        // stop the loading spinner on the publish button
        this.setState({
          isPublishing: false,
        });

        // redirect the user to the thread
        // if they are in the inbox, select it
        this.props.dispatch(changeActiveThread(id));

        this.props.dispatch(
          addToastWithTimeout('success', 'Thread published!')
        );

        this.props.dispatch(closeComposer('', ''));
      })
      .catch(err => {
        this.setState({
          isPublishing: false,
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  listenForUrl = state => {
    const { linkPreview, linkPreviewLength } = this.state;
    if (linkPreview !== null) return;

    const lastChangeType = state.getLastChangeType();
    if (
      lastChangeType !== 'backspace-character' &&
      lastChangeType !== 'insert-characters'
    ) {
      return;
    }

    const text = toPlainText(state);

    if (!ENDS_IN_WHITESPACE.test(text)) return;

    const toCheck = text.match(URLS);

    if (toCheck) {
      const len = toCheck.length;
      if (linkPreviewLength === len) return; // no new links, don't recheck

      let urlToCheck = toCheck[len - 1].trim();

      this.setState({ fetchingLinkPreview: true });

      if (!/^https?:\/\//i.test(urlToCheck)) {
        urlToCheck = 'https://' + urlToCheck;
      }

      getLinkPreviewFromUrl(urlToCheck)
        .then(data => {
          // this.props.dispatch(stopLoading());

          this.setState(prevState => ({
            linkPreview: data,
            linkPreviewTrueUrl: urlToCheck,
            linkPreviewLength: prevState.linkPreviewLength + 1,
            fetchingLinkPreview: false,
            error: null,
          }));

          const linkPreview = {};
          linkPreview['data'] = data;
          linkPreview['trueUrl'] = urlToCheck;

          // this.props.dispatch(addLinkPreview(linkPreview));
        })
        .catch(err => {
          this.setState({
            error:
              "Oops, that URL didn't seem to want to work. You can still publish your story anyways 👍",
            fetchingLinkPreview: false,
          });
        });
    }
  };

  removeLinkPreview = () => {
    this.setState({
      linkPreview: null,
      linkPreviewTrueUrl: null,
    });
  };

  render() {
    const {
      title,
      availableChannels,
      availableCommunities,
      activeCommunity,
      activeChannel,
      isPublishing,
      linkPreview,
      linkPreviewTrueUrl,
      fetchingLinkPreview,
    } = this.state;

    console.log('component props', this.props);
    console.log('component state', this.state);

    const { data: { user } } = this.props;
    const dataExists = user && availableCommunities && availableChannels;

    console.log(
      availableCommunities,
      activeCommunity,
      availableChannels,
      activeChannel
    );

    return (
      <Container>
        <Titlebar />
        <Dropdowns>
          <span>To:</span>
          {!dataExists ? (
            <LoadingSelect />
          ) : (
            <RequiredSelector
              onChange={this.setActiveCommunity}
              value={activeCommunity}
            >
              {availableCommunities.map(community => {
                return (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                );
              })}
            </RequiredSelector>
          )}
          {!dataExists ? (
            <LoadingSelect />
          ) : (
            <RequiredSelector
              onChange={this.setActiveChannel}
              value={activeChannel}
            >
              {availableChannels
                .filter(channel => channel.community.id === activeCommunity)
                .map((channel, i) => {
                  return (
                    <option key={channel.id} value={channel.id}>
                      {channel.name}
                    </option>
                  );
                })}
            </RequiredSelector>
          )}
        </Dropdowns>
        <ThreadInputs>
          <Textarea
            onChange={this.changeTitle}
            style={ThreadTitle}
            value={this.state.title}
            placeholder={`What's up?`}
            ref="titleTextarea"
            autoFocus
          />

          <Editor
            version={2}
            onChange={this.changeBody}
            state={this.state.body}
            style={ThreadDescription}
            editorRef={editor => (this.bodyEditor = editor)}
            editorKey="thread-composer"
            placeholder={`Write more thoughts here, add photos, and anything else!`}
            className={'threadComposer'}
            showLinkPreview={true}
            linkPreview={{
              loading: fetchingLinkPreview,
              remove: this.removeLinkPreview,
              trueUrl: linkPreviewTrueUrl,
              data: linkPreview,
            }}
          />
        </ThreadInputs>
        <Actions>
          <FlexRow>
            <TextButton
              hoverColor="warn.alt"
              onClick={() => this.props.dispatch(changeActiveThread(null))}
            >
              Cancel
            </TextButton>
            <Button
              onClick={this.publishThread}
              loading={isPublishing}
              disabled={!title || isPublishing}
              color={'brand'}
            >
              Publish
            </Button>
          </FlexRow>
        </Actions>
      </Container>
    );
  }
}

export const ThreadComposer = compose(
  getComposerCommunitiesAndChannels, // query to get data
  publishThread, // mutation to publish a thread
  withRouter, // needed to use history.push() as a post-publish action
  pure
)(ComposerWithData);

const mapStateToProps = state => ({
  isOpen: state.composer.isOpen,
  title: state.composer.title,
  body: state.composer.body,
});

const Composer = connect(mapStateToProps)(ThreadComposer);
export default Composer;
