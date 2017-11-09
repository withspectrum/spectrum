// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import Textarea from 'react-textarea-autosize';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import isURL from 'validator/lib/isURL';
import { KeyBindingUtil } from 'draft-js';
import { URLS } from '../../helpers/regexps';
import { track } from '../../helpers/events';
import { closeComposer } from '../../actions/composer';
import { changeActiveThread } from '../../actions/dashboardFeed';
import { addToastWithTimeout } from '../../actions/toasts';
import Editor from '../draftjs-editor';
import { toPlainText, fromPlainText, toJSON } from 'shared/draft-utils';
import { getComposerCommunitiesAndChannels } from './queries';
import { publishThread } from './mutations';
import { getLinkPreviewFromUrl } from '../../helpers/utils';
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
import {
  sortCommunities,
  sortChannels,
  getDefaultActiveChannel,
} from './utils';

const ENDS_IN_WHITESPACE = /(\s|\n)$/;

type State = {
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

type Props = {
  data: Object, // TODO(@mxstbr): Maybe Apollo Client exports flow types?
  isOpen: boolean,
  dispatch: Function,
  mutate: Function,
  history: Object,
  location: Object,
  activeCommunity?: string,
  activeChannel?: string,
  threadSliderIsOpen?: boolean,
};

class ComposerWithData extends Component<Props, State> {
  bodyEditor: any;

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
    const { user } = props.data;
    // if the user doesn't exist, bust outta here
    if (!user || !user.id) return;

    const communities = sortCommunities(
      user.communityConnection.edges.map(edge => edge.node)
    );

    const channels = sortChannels(
      user.channelConnection.edges.map(edge => edge.node)
    );

    const activeSlug = props.activeCommunity || this.state.activeCommunity;
    let community;

    // User is viewing a community/channel? Use the community from the URL
    if (activeSlug) {
      community = communities.find(
        community => community.slug.toLowerCase() === activeSlug.toLowerCase()
      );
    } else {
      community = communities && communities.length > 0 ? communities[0] : null;
    }

    if (!community || !community.id) return props.data.refetch();

    // get the channels for the active community
    const communityChannels = channels.filter(
      // $FlowIssue
      channel => channel.community.id === community.id
    );

    const activeChannel = getDefaultActiveChannel(
      communityChannels,
      props.activeChannel
    );

    this.setState({
      availableCommunities: communities,
      availableChannels: channels,
      activeCommunity: community ? community.id : null,
      activeChannel: activeChannel ? activeChannel.id : null,
    });
  };

  componentDidMount() {
    this.handleIncomingProps(this.props);
    // $FlowIssue
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    // $FlowIssue
    document.removeEventListener('keydown', this.handleKeyPress, false);
    this.closeComposer();
  }

  handleKeyPress = e => {
    const esc = e.keyCode === 27;
    const cmdEnter = e.keyCode === 13 && KeyBindingUtil.hasCommandModifier(e);

    if (esc) {
      // Community/channel view
      this.closeComposer();
      // Dashboard
      this.props.dispatch(changeActiveThread(null));
      return;
    }

    if (cmdEnter) return this.publishThread();
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

  componentWillUpdate(next) {
    const currChannelLength =
      this.props.data.user &&
      this.props.data.user.channelConnection.edges.length;
    const nextChannelLength =
      next.data.user && next.data.user.channelConnection.edges.length;
    const currCommunityLength =
      this.props.data.user &&
      this.props.data.user.communityConnection.edges.length;
    const nextCommunityLength =
      next.data.user && next.data.user.communityConnection.edges.length;

    if (
      (this.props.data.loading && !next.data.loading) ||
      currChannelLength !== nextChannelLength ||
      currCommunityLength !== nextCommunityLength
    ) {
      this.handleIncomingProps(next);
    }
  }

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
    const isActiveCommunity =
      newActiveCommunityData &&
      this.props.activeCommunity === newActiveCommunityData.slug;
    const newActiveChannel = getDefaultActiveChannel(
      activeCommunityChannels,
      isActiveCommunity ? this.props.activeChannel : ''
    );

    this.setState({
      activeCommunity: newActiveCommunity,
      activeChannel: newActiveChannel && newActiveChannel.id,
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
      title: title.trim(),
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
        this.props.dispatch(
          addToastWithTimeout('success', 'Thread published!')
        );
        if (this.props.isInbox) {
          this.props.history.replace(`/?t=${id}`);
          this.props.dispatch(changeActiveThread(id));
        } else if (this.props.location.pathname === '/new/thread') {
          this.props.history.replace(`/?thread=${id}`);
        } else {
          this.props.history.push(`?thread=${id}`);
          this.props.dispatch(changeActiveThread(null));
        }
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
        .then(data => {
          this.setState(prevState => ({
            linkPreview: { ...data, trueUrl: urlToCheck },
            linkPreviewTrueUrl: urlToCheck,
            linkPreviewLength: prevState.linkPreviewLength + 1,
            fetchingLinkPreview: false,
          }));
        })
        .catch(err => {
          this.setState({
            fetchingLinkPreview: false,
          });
          this.props.dispatch(
            addToastWithTimeout(
              'error',
              `Oops, we couldn't fetch a preview for ${urlToCheck}. You can publish your story anyways though! 👍`
            )
          );
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

    const { data: { user }, threadSliderIsOpen } = this.props;
    const dataExists = user && availableCommunities && availableChannels;

    return (
      <Container>
        <Titlebar provideBack title={`New conversation`} noComposer />
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
            autoFocus={!threadSliderIsOpen}
          />

          <Editor
            version={2}
            onChange={this.changeBody}
            state={this.state.body}
            style={ThreadDescription}
            editorRef={editor => (this.bodyEditor = editor)}
            editorKey="thread-composer"
            placeholder={`Write more thoughts here...`}
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
              disabled={!title || title.trim().length === 0 || isPublishing}
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
  withRouter // needed to use history.push() as a post-publish action
)(ComposerWithData);

const mapStateToProps = state => ({
  isOpen: state.composer.isOpen,
  title: state.composer.title,
  body: state.composer.body,
  threadSliderIsOpen: state.threadSlider.isOpen,
});

// $FlowIssue
const Composer = connect(mapStateToProps)(ThreadComposer);
export default Composer;
