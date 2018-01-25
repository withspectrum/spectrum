// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import Textarea from 'react-textarea-autosize';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { track } from '../../../helpers/events';
import { closeComposer } from '../../../actions/composer';
import { changeActiveThread } from '../../../actions/dashboardFeed';
import { addToastWithTimeout } from '../../../actions/toasts';
import Editor from '../../draftjs-editor';
import { toPlainText, fromPlainText, toJSON } from 'shared/draft-utils';
import getComposerCommunitiesAndChannels from 'shared/graphql/queries/composer/getComposerCommunitiesAndChannels';
import type { GetComposerType } from 'shared/graphql/queries/composer/getComposerCommunitiesAndChannels';
import publishThread from 'shared/graphql/mutations/thread/publishThread';
import { getLinkPreviewFromUrl } from '../../../helpers/utils';
import isURL from 'validator/lib/isURL';
import { URLS, ENDS_IN_WHITESPACE } from '../../../helpers/regexps';
import { TextButton, Button } from '../../buttons';
import { FlexRow } from '../../../components/globals';
import { LoadingComposer } from '../../loading';
import viewNetworkHandler from '../../viewNetworkHandler';
import type { PublishThreadType } from 'shared/graphql/mutations/thread/publishThread';
import {
  Container,
  Composer,
  Overlay,
  ThreadDescription,
  ThreadTitle,
  ContentContainer,
  Actions,
  Dropdowns,
} from '../style';

type Props = {
  title: string,
  body: Object,
  isOpen: boolean,
  dispatch: Function,
  isLoading: boolean,
  activeChannel?: string,
  activeCommunity?: string,
  isInbox: boolean,
  mutate: Function,
  history: Object,
  publishThread: Function,
  data: {
    refetch: Function,
    user: GetComposerType,
  },
};

type State = {
  isMounted: boolean,
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
  postWasPublished: boolean,
};
class ThreadComposerWithData extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      isMounted: true,
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
      postWasPublished: false,
    };
  }

  handleIncomingProps = props => {
    const { isMounted } = this.state;
    if (!isMounted) return;
    /*
      Create a new array of communities only containing the `node` data from
      graphQL. Then filter the resulting channel to remove any communities
      that don't have any channels yet
    */

    // if the user doesn't exist, bust outta here
    if (!props.data.user || props.data.user === undefined) return;

    const availableCommunities = props.data.user.communityConnection.edges
      .map(edge => edge && edge.node)
      .filter(
        community =>
          community &&
          (community.communityPermissions.isMember ||
            community.communityPermissions.isOwner)
      )
      .sort((a, b) => {
        const bc = b && parseInt(b.communityPermissions.reputation, 10);
        const ac = a && parseInt(a.communityPermissions.reputation, 10);
        return bc && ac && bc <= ac ? -1 : 1;
      });

    /*
      Iterate through each of our community nodes to construct a new array
      of possible channels

      returns an array of array, where each parent array represents a community
      and each child array represents the channels within that parent
      community
    */
    const availableChannels = props.data.user.channelConnection.edges
      .map(edge => edge && edge.node)
      .filter(
        channel =>
          channel &&
          (channel.channelPermissions.isMember ||
            channel.channelPermissions.isOwner)
      )
      .filter(channel => {
        if (!channel) return null;
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
            if (!community) return null;
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
    const { isMounted } = this.state;
    if (!isMounted) return;
    // get the channels for the proper community
    const activeCommunityChannels = availableChannels.filter(
      channel => channel && channel.community.id === activeCommunity
    );
    let activeChannel = [];

    // Get the active channel if there is one
    if (props.activeChannel) {
      activeChannel = activeCommunityChannels.filter(
        channel =>
          channel &&
          channel.slug.toLowerCase() === props.activeChannel.toLowerCase()
      );
    } else {
      // Try and get the default channel for the active community
      activeChannel = activeCommunityChannels.filter(
        channel => channel && channel.isDefault
      );
      // If there is no default channel capitulate and take the first one
      if (activeChannel.length === 0) {
        activeChannel = activeCommunityChannels;
      } else if (activeChannel.length > 1) {
        const generalChannel = activeChannel.filter(
          channel => channel && channel.slug === 'general'
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
    this.setState({ isMounted: true });
    this.props.data
      .refetch()
      .then(result => {
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
        return this.handleIncomingProps(newProps);
      })
      .catch(err =>
        this.props.dispatch(addToastWithTimeout('error', err.message))
      );

    this.refs.titleTextarea.focus();
  }

  componentWillUpdate(nextProps) {
    const { isOpen } = nextProps;
    if (isOpen) {
      // $FlowIssue
      document.addEventListener('keydown', this.handleKeyPress, false);
    } else {
      // $FlowIssue
      document.removeEventListener('keydown', this.handleKeyPress, false);
    }
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
    // $FlowIssue
    document.removeEventListener('keydown', this.handleKeyPress, false);
    const { postWasPublished } = this.state;

    // if a post was published, in this session, clear redux so that the next
    // composer open will start fresh
    if (postWasPublished) return this.closeComposer('clear');

    // otherwise, clear the composer normally and save the state
    return this.closeComposer();
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
    const curr = this.props;
    const { isMounted } = this.state;
    if (!isMounted) return;
    if (prevProps.isLoading && !curr.isLoading)
      return this.handleIncomingProps(this.props);

    const { availableCommunities, availableChannels } = this.state;
    let activeCommunity;

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

  closeComposer = (clear?: string) => {
    // we will clear the composer if it unmounts as a result of a post
    // being published, that way the next composer open will start fresh
    if (clear) return this.props.dispatch(closeComposer('', ''));

    // otherwise, we will save the editor state to rehydrate the title and
    // body if the user reopens the composer in the same session
    const { title, body } = this.state;
    this.props.dispatch(closeComposer(title, body));
  };

  setActiveCommunity = e => {
    const newActiveCommunity = e.target.value;
    const activeCommunityChannels = this.state.availableChannels.filter(
      channel => channel && channel.community.id === newActiveCommunity
    );
    const newActiveCommunityData = this.state.availableCommunities.find(
      community => community && community.id === newActiveCommunity
    );
    const newActiveChannel =
      activeCommunityChannels.find(channel => {
        if (channel) return null;
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
      .filter(
        key =>
          jsonBody.entityMap[key].type === 'image' &&
          jsonBody.entityMap[key].data.file &&
          jsonBody.entityMap[key].data.file.constructor === File
      )
      .map(key => jsonBody.entityMap[key].data.file);

    // this.props.mutate comes from a higher order component defined at the
    // bottom of this file
    const thread = {
      channelId,
      communityId,
      type: 'DRAFTJS',
      content,
      attachments,
      filesToUpload,
    };

    this.props
      .publishThread(thread)
      // after the mutation occurs, it will either return an error or the new
      // thread that was published
      .then(({ data }: PublishThreadType) => {
        // get the thread id to redirect the user
        const id = data.publishThread.id;

        track('thread', 'published', null);

        // stop the loading spinner on the publish button
        this.setState({
          postWasPublished: true,
          isPublishing: false,
        });

        // redirect the user to the thread
        // if they are in the inbox, select it
        this.props.isInbox
          ? this.props.dispatch(changeActiveThread(id))
          : this.props.history.push(`?thread=${id}`);

        this.props.dispatch(
          addToastWithTimeout('success', 'Thread published!')
        );

        this.props.dispatch(closeComposer('', ''));

        return;
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

      if (!/^https?:\/\//i.test(urlToCheck)) {
        urlToCheck = 'https://' + urlToCheck;
      }

      if (!isURL(urlToCheck)) return;
      this.setState({ fetchingLinkPreview: true });

      getLinkPreviewFromUrl(urlToCheck)
        .then(data =>
          this.setState(prevState => ({
            linkPreview: { ...data, trueUrl: urlToCheck },
            linkPreviewTrueUrl: urlToCheck,
            linkPreviewLength: prevState.linkPreviewLength + 1,
            fetchingLinkPreview: false,
            error: null,
          }))
        )
        .catch(() => {
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

    const { isOpen, isLoading, isInbox } = this.props;

    if (availableCommunities && availableChannels) {
      return (
        <Container isOpen={isOpen} isInbox={isInbox}>
          <Overlay
            isOpen={isOpen}
            onClick={this.closeComposer}
            isInbox={isInbox}
          />
          <Composer isOpen={isOpen} isInbox={isInbox}>
            <ContentContainer isOpen={isOpen}>
              <Textarea
                onChange={this.changeTitle}
                style={ThreadTitle}
                value={this.state.title}
                placeholder={'A title for your conversation...'}
                ref="titleTextarea"
                autoFocus
              />

              <Editor
                onChange={this.changeBody}
                state={this.state.body}
                style={ThreadDescription}
                editorRef={editor => (this.bodyEditor = editor)}
                editorKey="thread-composer"
                placeholder="Write more thoughts here..."
                className={'threadComposer'}
                showLinkPreview={true}
                linkPreview={{
                  loading: fetchingLinkPreview,
                  remove: this.removeLinkPreview,
                  trueUrl: linkPreviewTrueUrl,
                  data: linkPreview,
                }}
              />

              <Actions>
                <FlexRow>
                  <Dropdowns>
                    <select
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
                    </select>
                    <select
                      onChange={this.setActiveChannel}
                      value={activeChannel}
                    >
                      {availableChannels
                        .filter(
                          channel => channel.community.id === activeCommunity
                        )
                        .map((channel, i) => {
                          return (
                            <option key={channel.id} value={channel.id}>
                              {channel.name}
                            </option>
                          );
                        })}
                    </select>
                  </Dropdowns>
                </FlexRow>
                <FlexRow>
                  <TextButton
                    hoverColor="warn.alt"
                    onClick={this.closeComposer}
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
            </ContentContainer>
          </Composer>
        </Container>
      );
    }

    if (isLoading) {
      return <LoadingComposer />;
    }

    return null;
  }
}

const map = state => ({
  isOpen: state.composer.isOpen,
  title: state.composer.title,
  body: state.composer.body,
});
export default compose(
  // $FlowIssue
  connect(map),
  getComposerCommunitiesAndChannels,
  publishThread,
  viewNetworkHandler,
  withRouter
)(ThreadComposerWithData);
