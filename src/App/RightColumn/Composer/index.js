import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { track } from '../../../EventTracker';
import {
  updateTitle,
  updateBody,
  addLinkPreview,
  removeLinkPreview,
  addMediaList,
  removeImageFromStory,
} from '../../../actions/composer';
import { publishStory, initStory } from '../../../actions/stories';
import { loading, stopLoading } from '../../../actions/loading';
import {
  getCurrentFrequency,
  linkFreqsInMd,
} from '../../../helpers/frequencies';
import { uploadMultipleMedia } from '../../../db/stories';
import Textarea from 'react-textarea-autosize';
import Markdown from '../../../shared/Markdown';
import LinkPreview from '../../../shared/LinkPreview';
import { getLinkPreviewFromUrl } from '../../../helpers/utils';

import {
  ScrollBody,
  ContentView,
  Header,
  StoryTitle,
  StoryTitlePreview,
  PreviewWrapper,
  FlexColumn,
  Byline,
  TextBody,
  Alert,
  Select,
  Submit,
  SubmitContainer,
  MediaInput,
  MediaLabel,
  BackArrow,
  MiniGallery,
  MiniImageContainer,
  Image,
  Delete,
  EmbedInput,
  LinkPreviewSkeleton,
  AnimatedBackground,
  CoverTop,
  CoverMiddle,
  CoverMiddleMiddle,
  CoverMiddleTopRight,
  CoverLeft,
  CoverMiddleBottomRight,
  CoverBottom,
  CoverMiddleMiddleBottomRight,
} from './style';

const URLS = /(^|\s)(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

class Composer extends Component {
  constructor(props) {
    super(props);

    let { user, composer: { metadata } } = props;
    let userFreqs = Object.keys(user.frequencies);

    this.state = {
      error: null,
      frequencyPicker: userFreqs ? userFreqs[0] : '',
      loading: false,
      placeholder: '+ Embed',
      embedUrl: '',
      metadata: metadata,
      creating: true,
      linkPreview: null,
      linkPreviewLength: 0,
      fetchingLinkPreview: false,
    };
  }

  componentDidMount() {
    // if a draft already exists, no need to init another
    if (this.props.composer.newStoryKey) return;
    // otherwise init a new draft
    this.props.dispatch(initStory(this.state.frequencyPicker));
  }

  changeTitle = e => {
    this.props.dispatch(updateTitle(e.target.value));
  };

  changeBody = e => {
    this.props.dispatch(updateBody(e.target.value));

    if (!e.target.value && !this.state.linkPreview) {
      this.setState({
        linkPreviewLength: 0,
      });
    }
  };

  selectFrequencyFromDropdown = e => {
    this.setState({
      frequencyPicker: e.target.value,
    });
  };

  uploadMedia = e => {
    let user = this.props.user;
    let files = e.target.files;
    let body = this.props.composer.body;
    let story = this.props.composer.newStoryKey;

    // disable the submit button until uploads are done
    this.setState({ loading: true });

    uploadMultipleMedia(files, story, user)
      .then(filesArr => {
        track('media', 'multiple uploaded', null);
        for (let file of filesArr) {
          body = `${body}\n![](${file.url})\n`;
          track('media', 'uploaded', null);
          this.props.dispatch(addMediaList(file));
          this.props.dispatch(updateBody(body));
        }

        this.setState({
          loading: false,
        });

        findDOMNode(this.refs.descriptionTextarea).focus();
      })
      .catch(e => {
        this.props.dispatch({
          type: 'SET_COMPOSER_ERROR',
          error: e,
          loading: false,
        });
      });
  };

  publishStory = e => {
    e.preventDefault();
    const title = this.props.composer.title;
    const description = this.props.composer.body;
    const metadata = this.props.composer.metadata;
    // if we pass in a custom frequency, it means the user is in 'all' and has selected a frequency from the dropdown
    // if the user isn't in all, we'll send the currently active frequency via the redux state
    const frequency = this.props.frequencies.active === 'everything'
      ? this.state.frequencyPicker
      : this.props.frequencies.active;

    const frequencyId = getCurrentFrequency(
      frequency,
      this.props.frequencies.frequencies,
    ).id;

    if (frequency && title) {
      // if everything is filled out
      this.props.dispatch(
        publishStory({
          frequencyId,
          title,
          description,
          metadata,
        }),
      );
    } else if (!frequency && title) {
      // if no frequency is chosen
      this.props.dispatch({
        type: 'SET_COMPOSER_ERROR',
        error: 'Choose a frequency to share this story to!',
      });
    } else if (!title) {
      // missing a title
      this.props.dispatch({
        type: 'SET_COMPOSER_ERROR',
        error: 'Be sure to type a title!',
      });
    } else {
      // something else went wrong...
      this.props.dispatch({
        type: 'SET_COMPOSER_ERROR',
        error: 'Oops, something went wrong!',
      });
    }
  };

  removeImage = e => {
    let key = e.target.id;
    let story = this.props.composer.newStoryKey;
    this.props.dispatch(removeImageFromStory(key, story));
  };

  handleKeyPress = e => {
    // if person taps enter, add the url in an iframe to the body
    if (e.keyCode === 13) {
      e.preventDefault();
      track('composer', 'embed created', null);

      let body = this.props.composer.body;
      body = `${body}\n<iframe src='${this.state.embedUrl}'></iframe>\n`;
      this.props.dispatch(updateBody(body));

      this.setState({
        placeholder: 'Paste another URL here...',
        embedUrl: '',
      });
    }
  };

  handleChange = e => {
    // if there are no characters, don't attach the event listener
    if (e.target.value.length === 0) return;
    document.addEventListener('keydown', this.handleKeyPress, false);
    this.setState({
      embedUrl: e.target.value,
    });
  };

  handleFocus = () => {
    this.setState({
      placeholder: 'Paste a URL here...',
    });
  };

  handleBlur = () => {
    document.removeEventListener('keydown', this.handleKeyPress, false);

    this.setState({
      placeholder: '+ Embed',
    });
  };

  closeComposer = () => {
    this.props.dispatch({
      type: 'CLOSE_COMPOSER',
    });
  };

  setCreating = () => {
    this.setState({
      creating: true,
    });
  };

  setPreviewing = () => {
    track('composer', 'previewed', null);

    this.setState({
      creating: false,
    });
  };

  listenForUrl = e => {
    if (
      e.keyCode !== 8 &&
      e.keyCode !== 9 &&
      e.keyCode !== 13 &&
      e.keyCode !== 32 &&
      e.keyCode !== 46
    ) {
      // Return if backspace, tab, enter, space or delete was not pressed.
      return;
    }

    // also don't check if we already have a url in the linkPreview state
    if (this.state.linkPreview !== null) return;

    const toCheck = e.target.value.match(URLS);

    if (toCheck) {
      const len = toCheck.length;
      if (this.state.linkPreviewLength === len) return; // no new links, don't recheck

      let urlToCheck = toCheck[len - 1].trim();

      this.setState({ fetchingLinkPreview: true });

      if (!/^https?:\/\//i.test(urlToCheck)) {
        urlToCheck = 'https://' + urlToCheck;
      }

      return getLinkPreviewFromUrl(urlToCheck)
        .then(data => {
          this.props.dispatch(stopLoading());

          this.setState(prevState => ({
            linkPreview: data,
            trueUrl: urlToCheck,
            linkPreviewLength: prevState.linkPreviewLength + 1,
            fetchingLinkPreview: false,
            error: null,
          }));

          const linkPreview = {};
          linkPreview['data'] = data;
          linkPreview['trueUrl'] = urlToCheck;

          this.props.dispatch(addLinkPreview(linkPreview));
        })
        .catch(err => {
          this.setState({
            error: "Oops, that URL didn't seem to want to work. You can still publish your story anyways 👍",
            fetchingLinkPreview: false,
          });
        });
    }
  };

  removeLinkPreview = () => {
    findDOMNode(this.refs.descriptionTextarea).focus();

    this.props.dispatch(removeLinkPreview());

    this.setState({
      linkPreview: null,
      trueUrl: null,
    });
  };

  render() {
    let { frequencies, composer } = this.props;
    let activeFrequency = frequencies.active;
    let currentFrequency = frequencies.frequencies.filter(freq => {
      return freq.slug === activeFrequency;
    });
    let media = composer.mediaList;

    let byline = activeFrequency === 'everything'
      ? <span>
          <Byline hasContent={true}>
            New story in
            <Select
              onChange={this.selectFrequencyFromDropdown}
              defaultValue={frequencies.frequencies[0].id}
            >

              {frequencies.frequencies.map((frequency, i) => {
                return (
                  <option key={i} value={frequency.id}>
                    {frequency.name}
                  </option>
                );
              })}

            </Select>
          </Byline>
        </span>
      : <Byline hasContent={true}>
          New story in {currentFrequency[0].name}
        </Byline>;

    return (
      <ScrollBody>
        <BackArrow onClick={this.closeComposer}>←</BackArrow>

        <ContentView>
          <Header>
            <FlexColumn>
              <form onSubmit={this.publishStory} encType="multipart/form-data">
                <Byline
                  onClick={this.setCreating}
                  hasContent={true}
                  active={this.state.creating}
                >
                  Create
                </Byline>
                <Byline
                  onClick={this.setPreviewing}
                  active={!this.state.creating}
                  hasContent={
                    composer.title.length > 0 && composer.body.length > 0
                  }
                >
                  Preview
                </Byline>

                {this.state.creating
                  ? <div>
                      <Textarea
                        onChange={this.changeTitle}
                        style={StoryTitle}
                        value={composer.title}
                        placeholder={"What's new?"}
                        autoFocus
                      />

                      <Textarea
                        onChange={this.changeBody}
                        value={composer.body}
                        style={TextBody}
                        onKeyUp={this.listenForUrl}
                        ref="descriptionTextarea"
                        placeholder={
                          'Say more about this post, add an image, embed an iframe, or anything else!'
                        }
                      />

                      {this.state.linkPreview &&
                        <LinkPreview
                          data={this.state.linkPreview}
                          size={'large'}
                          remove={this.removeLinkPreview}
                          editable={true}
                          trueUrl={this.state.trueUrl}
                        />}

                      {this.state.fetchingLinkPreview &&
                        <LinkPreviewSkeleton>
                          <AnimatedBackground />
                          <CoverLeft />
                          <CoverTop />
                          <CoverMiddle />
                          <CoverMiddleMiddle />
                          <CoverMiddleTopRight />
                          <CoverMiddleBottomRight />
                          <CoverMiddleMiddleBottomRight />
                          <CoverBottom />
                        </LinkPreviewSkeleton>}

                      <MediaInput
                        ref="media"
                        type="file"
                        id="file"
                        name="file"
                        accept=".png, .jpg, .jpeg, .gif"
                        multiple={true}
                        onChange={this.uploadMedia}
                      />
                      <MediaLabel htmlFor="file">+ Upload Image</MediaLabel>

                      <EmbedInput
                        placeholder={this.state.placeholder}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        value={this.state.embedUrl}
                      />

                      <MiniGallery>
                        {media.map((file, i) => (
                          <MiniImageContainer key={i}>
                            <Delete
                              id={file.meta.key}
                              onClick={this.removeImage}
                            >
                              ✕
                            </Delete>
                            <Image src={file.url} />
                          </MiniImageContainer>
                        ))}
                      </MiniGallery>
                    </div>
                  : <PreviewWrapper>
                      <StoryTitlePreview>{composer.title}</StoryTitlePreview>
                      <div className="markdown" ref="story">
                        <Markdown>{linkFreqsInMd(composer.body)}</Markdown>
                      </div>
                    </PreviewWrapper>}
                <SubmitContainer sticky={!this.state.creating}>
                  {byline}
                  <Submit
                    type="submit"
                    disabled={this.state.loading}
                    value={this.state.loading ? 'Loading...' : 'Post Story'}
                    active={composer.title}
                  />
                </SubmitContainer>

                {this.props.composer.error &&
                  <Alert>{this.props.composer.error}</Alert>}
              </form>
            </FlexColumn>
          </Header>
        </ContentView>
      </ScrollBody>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    frequencies: state.frequencies,
    composer: state.composer,
  };
};

export default connect(mapStateToProps)(Composer);
