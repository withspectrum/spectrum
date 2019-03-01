// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withRouter, type History, type Location } from 'react-router';
import { connect } from 'react-redux';
import debounce from 'debounce';
import queryString from 'query-string';
import Icon from '../icons';
import getThreadLink from 'src/helpers/get-thread-link';
import { changeActiveThread } from 'src/actions/dashboardFeed';
import { addToastWithTimeout } from 'src/actions/toasts';
import getComposerCommunitiesAndChannels from 'shared/graphql/queries/composer/getComposerCommunitiesAndChannels';
import type { GetComposerType } from 'shared/graphql/queries/composer/getComposerCommunitiesAndChannels';
import publishThread from 'shared/graphql/mutations/thread/publishThread';
import uploadImage, {
  type UploadImageInput,
  type UploadImageType,
} from 'shared/graphql/mutations/uploadImage';
import { TextButton, Button } from '../buttons';
import {
  MediaLabel,
  MediaInput,
} from 'src/components/chatInput/components/style';
import Titlebar from 'src/views/titlebar';
import type { Dispatch } from 'redux';
import {
  Overlay,
  Container,
  Actions,
  DisabledWarning,
  InputHints,
  DesktopLink,
  ButtonRow,
} from './style';
import { events, track } from 'src/helpers/analytics';
import { ESC, ENTER } from 'src/helpers/keycodes';
import Inputs from './inputs';
import ComposerLocationSelectors from './LocationSelectors';

type State = {
  title: string,
  body: string,
  isLoading: boolean,
  postWasPublished: boolean,
  preview: boolean,
  selectedChannelId: ?string,
  selectedCommunityId: ?string,
};

type Props = {
  data: {
    user: GetComposerType,
    refetch: Function,
    loading: boolean,
  },
  uploadImage: (input: UploadImageInput) => Promise<UploadImageType>,
  dispatch: Dispatch<Object>,
  publishThread: Function,
  history: History,
  location: Location,
  isInbox: boolean,
  websocketConnection: string,
  networkOnline: boolean,
  isEditing: boolean,
  slider?: boolean,
};

const LS_BODY_KEY = 'last-plaintext-thread-composer-body';
const LS_TITLE_KEY = 'last-plaintext-thread-composer-title';
const LS_COMPOSER_EXPIRE = 'last-plaintext-thread-composer-expire';

const ONE_DAY = (): string => {
  const time = new Date().getTime() + 60 * 60 * 24 * 1000;
  return time.toString();
};

// We persist the body and title to localStorage
// so in case the app crashes users don't loose content
class ComposerWithData extends React.Component<Props, State> {
  bodyEditor: any;

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      body: '',
      isLoading: false,
      postWasPublished: false,
      preview: false,
      selectedChannelId: '',
      selectedCommunityId: '',
    };

    this.persistBodyToLocalStorageWithDebounce = debounce(
      this.persistBodyToLocalStorageWithDebounce,
      500
    );
    this.persistTitleToLocalStorageWithDebounce = debounce(
      this.persistTitleToLocalStorageWithDebounce,
      500
    );
  }

  removeStorage = () => {
    localStorage.removeItem(LS_BODY_KEY);
    localStorage.removeItem(LS_TITLE_KEY);
    localStorage.removeItem(LS_COMPOSER_EXPIRE);
  };

  getTitleAndBody = () => {
    let storedBody;
    let storedTitle;

    if (localStorage) {
      try {
        const expireTime = localStorage.getItem(LS_COMPOSER_EXPIRE);
        const currTime = new Date().getTime().toString();
        /////if current time is greater than valid till of text then please expire title/body back to ''
        if (expireTime && currTime > expireTime) {
          this.removeStorage();
        } else {
          storedBody = localStorage.getItem(LS_BODY_KEY) || '';
          storedTitle = localStorage.getItem(LS_TITLE_KEY) || '';
        }
      } catch (err) {
        this.removeStorage();
      }
    }
    return {
      storedBody,
      storedTitle,
    };
  };

  componentWillMount() {
    let { storedBody, storedTitle } = this.getTitleAndBody();
    this.setState({
      title: this.state.title || storedTitle || '',
      body: this.state.body || storedBody || '',
    });
  }

  componentDidMount() {
    track(events.THREAD_CREATED_INITED);
    // $FlowIssue
    document.addEventListener('keydown', this.handleGlobalKeyPress, false);
  }

  componentWillUnmount() {
    // $FlowIssue
    document.removeEventListener('keydown', this.handleGlobalKeyPress, false);
    const { postWasPublished } = this.state;

    // if a post was published, in this session, clear redux so that the next
    // composer open will start fresh
    if (postWasPublished) return;

    // otherwise, clear the composer normally and save the state
    return;
  }

  handleGlobalKeyPress = e => {
    const esc = e && e.keyCode === ESC;

    if (esc) {
      e.stopPropagation();
      this.closeComposer();
      this.activateLastThread();
      return;
    }
  };

  handleKeyPress = e => {
    const cmdEnter = e.keyCode === ENTER && e.metaKey;
    if (cmdEnter) return this.publishThread();
  };

  activateLastThread = () => {
    // we get the last thread id from the query params and dispatch it
    // as the active thread.
    const { location } = this.props;
    const { t: threadId } = queryString.parse(location.search);

    this.props.dispatch(changeActiveThread(threadId));
  };

  changeTitle = e => {
    const title = e.target.value;
    this.persistTitleToLocalStorageWithDebounce(title);
    if (/\n$/g.test(title)) {
      this.bodyEditor.focus && this.bodyEditor.focus();
      return;
    }
    this.setState({
      title,
    });
  };

  changeBody = evt => {
    const body = evt.target.value;
    this.persistBodyToLocalStorageWithDebounce(body);
    this.setState({
      body,
    });
  };

  closeComposer = (clear?: string) => {
    this.persistBodyToLocalStorage(this.state.body);
    this.persistTitleToLocalStorage(this.state.title);

    // we will clear the composer if it unmounts as a result of a post
    // being published, that way the next composer open will start fresh
    if (clear) {
      this.clearEditorStateAfterPublish();
    }

    this.props.history.goBack();
    return;
  };

  clearEditorStateAfterPublish = () => {
    try {
      this.removeStorage();
    } catch (err) {
      console.error(err);
    }
  };

  handleTitleBodyChange = titleOrBody => {
    if (titleOrBody === 'body') {
      localStorage.setItem(LS_BODY_KEY, this.state.body);
    } else {
      localStorage.setItem(LS_TITLE_KEY, this.state.title);
    }
    localStorage.setItem(LS_COMPOSER_EXPIRE, ONE_DAY());
  };

  persistBodyToLocalStorageWithDebounce = body => {
    if (!localStorage) return;
    this.handleTitleBodyChange('body');
  };

  persistTitleToLocalStorageWithDebounce = title => {
    if (!localStorage) return;
    this.handleTitleBodyChange('title');
  };

  persistTitleToLocalStorage = title => {
    if (!localStorage) return;
    this.handleTitleBodyChange('title');
  };

  persistBodyToLocalStorage = body => {
    if (!localStorage) return;
    this.handleTitleBodyChange('body');
  };

  uploadFile = evt => {
    this.uploadFiles(evt.target.files);
  };

  uploadFiles = files => {
    const uploading = `![Uploading ${files[0].name}...]()`;
    let caretPos = this.bodyEditor.selectionStart;

    this.setState(
      ({ body }) => ({
        isLoading: true,
        body:
          body.substring(0, caretPos) +
          uploading +
          body.substring(this.bodyEditor.selectionEnd, this.state.body.length),
      }),
      () => {
        caretPos = caretPos + uploading.length;
        this.bodyEditor.selectionStart = caretPos;
        this.bodyEditor.selectionEnd = caretPos;
        this.bodyEditor.focus();
      }
    );

    return this.props
      .uploadImage({
        image: files[0],
        type: 'threads',
      })
      .then(({ data }) => {
        this.setState({
          isLoading: false,
        });
        this.changeBody({
          target: {
            value: this.state.body.replace(
              uploading,
              `![${files[0].name}](${data.uploadImage})`
            ),
          },
        });
      })
      .catch(err => {
        console.error({ err });
      });
  };

  publishThread = () => {
    // if no title and no channel is set, don't allow a thread to be published
    if (
      !this.state.title ||
      !this.state.selectedCommunityId ||
      !this.state.selectedChannelId
    ) {
      return;
    }

    // isLoading will change the publish button to a loading spinner
    this.setState({
      isLoading: true,
    });

    const { dispatch, networkOnline, websocketConnection } = this.props;

    if (!networkOnline) {
      return dispatch(
        addToastWithTimeout(
          'error',
          'Not connected to the internet - check your internet connection or try again'
        )
      );
    }

    if (
      websocketConnection !== 'connected' &&
      websocketConnection !== 'reconnected'
    ) {
      return dispatch(
        addToastWithTimeout(
          'error',
          'Error connecting to the server - hang tight while we try to reconnect'
        )
      );
    }

    // define new constants in order to construct the proper shape of the
    // input for the publishThread mutation
    const { selectedChannelId, selectedCommunityId, title, body } = this.state;
    const channelId = selectedChannelId;
    const communityId = selectedCommunityId;

    const content = {
      title: title.trim(),
      // workaround react-mentions bug by replacing @[username] with @username
      // @see withspectrum/spectrum#4587
      body: body.replace(/@\[([a-z0-9_-]+)\]/g, '@$1'),
    };

    // this.props.mutate comes from a higher order component defined at the
    // bottom of this file
    const thread = {
      channelId,
      communityId,
      // NOTE(@mxstbr): On android we send plain text content
      // which is parsed as markdown to draftjs on the server
      type: 'TEXT',
      content,
      // filesToUpload,
    };

    // one last save to localstorage
    this.persistBodyToLocalStorage(this.state.body);
    this.persistTitleToLocalStorage(this.state.title);

    this.props
      .publishThread(thread)
      // after the mutation occurs, it will either return an error or the new
      // thread that was published
      .then(({ data }) => {
        // get the thread id to redirect the user
        const id = data.publishThread.id;

        this.clearEditorStateAfterPublish();

        // stop the loading spinner on the publish button
        this.setState({
          isLoading: false,
          postWasPublished: true,
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
          this.props.history.replace(`/${getThreadLink(data.publishThread)}`);
        } else {
          this.props.history.push(`/${getThreadLink(data.publishThread)}`);
          this.props.dispatch(changeActiveThread(null));
        }
        return;
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  setSelectedCommunity = (id: string) => {
    return this.setState({ selectedCommunityId: id });
  };

  setSelectedChannel = (id: string) => {
    return this.setState({ selectedChannelId: id });
  };

  render() {
    const {
      title,
      isLoading,
      selectedChannelId,
      selectedCommunityId,
    } = this.state;

    const {
      networkOnline,
      websocketConnection,
      isEditing,
      slider,
    } = this.props;

    const networkDisabled =
      !networkOnline ||
      (websocketConnection !== 'connected' &&
        websocketConnection !== 'reconnected');

    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
        }}
        data-cy="thread-composer-wrapper"
      >
        <Overlay
          slider={slider}
          onClick={this.closeComposer}
          data-cy="thread-composer-overlay"
        />

        <Container data-cy="thread-composer" slider={slider}>
          <Titlebar provideBack title={'New conversation'} noComposer />

          <ComposerLocationSelectors
            selectedChannelId={selectedChannelId}
            selectedCommunityId={selectedCommunityId}
            onCommunitySelectionChanged={this.setSelectedCommunity}
            onChannelSelectionChanged={this.setSelectedChannel}
          />

          <Inputs
            title={this.state.title}
            body={this.state.body}
            changeBody={this.changeBody}
            changeTitle={this.changeTitle}
            uploadFiles={this.uploadFiles}
            autoFocus={true}
            bodyRef={ref => (this.bodyEditor = ref)}
            onKeyDown={this.handleKeyPress}
            isEditing={isEditing}
          />

          {networkDisabled && (
            <DisabledWarning>
              Lost connection to the internet or server...
            </DisabledWarning>
          )}
          <Actions>
            <InputHints>
              <MediaLabel>
                <MediaInput
                  type="file"
                  accept={'.png, .jpg, .jpeg, .gif, .mp4'}
                  multiple={false}
                  onChange={this.uploadFile}
                />
                <Icon
                  glyph="photo"
                  tipLocation={'top-right'}
                  tipText="Upload photo"
                />
              </MediaLabel>
              <DesktopLink
                target="_blank"
                href="https://guides.github.com/features/mastering-markdown/"
              >
                <Icon
                  tipText="Style with Markdown"
                  tipLocation="top-right"
                  glyph="markdown"
                />
              </DesktopLink>
            </InputHints>
            <ButtonRow>
              <TextButton
                data-cy="composer-cancel-button"
                hoverColor="warn.alt"
                onClick={this.closeComposer}
              >
                Cancel
              </TextButton>
              <Button
                data-cy="composer-publish-button"
                onClick={this.publishThread}
                loading={isLoading}
                disabled={
                  !title ||
                  title.trim().length === 0 ||
                  isLoading ||
                  networkDisabled ||
                  !selectedChannelId ||
                  !selectedCommunityId
                }
                color={'brand'}
              >
                Publish
              </Button>
            </ButtonRow>
          </Actions>
        </Container>
      </div>
    );
  }
}

// $FlowIssue
const mapStateToProps = state => ({
  websocketConnection: state.connectionStatus.websocketConnection,
  networkOnline: state.connectionStatus.networkOnline,
});

export default compose(
  uploadImage,
  getComposerCommunitiesAndChannels, // query to get data
  publishThread, // mutation to publish a thread
  withRouter, // needed to use history.push() as a post-publish action
  connect(mapStateToProps)
)(ComposerWithData);
