import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { track } from '../../../../EventTracker';
import {
  updateTitle,
  updateBody,
  addLinkPreview,
  removeLinkPreview,
  addMediaList,
  removeImageFromComposer,
} from '../../../../actions/composer';
import {
  publishStory,
  initStory,
  cancelEditStory,
  saveEditStory,
} from '../../../../actions/stories';
import { stopLoading } from '../../../../actions/loading';
import {
  getCurrentFrequency,
  linkFreqsInMd,
} from '../../../../helpers/frequencies';
import { uploadMultipleMediaToLocation } from '../../../../db/media';
import Textarea from 'react-textarea-autosize';
import Markdown from '../../../../shared/Markdown';
import LinkPreview from '../../../../shared/LinkPreview';
import { getLinkPreviewFromUrl } from '../../../../helpers/utils';

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

class StoryComposer extends Component {
  constructor(props) {
    super(props);

    let { user, composer: { metadata }, communities } = props;
    let userFreqs = Object.keys(user.frequencies);

    this.state = {
      error: null,
      communityPicker: communities ? communities[0].id : '',
      frequencyPicker: userFreqs ? userFreqs[0] : '',
      loading: false,
      metadata: metadata,
      creating: true,
      linkPreview: metadata && metadata.linkPreview
        ? metadata.linkPreview.data
        : null,
      trueUrl: metadata && metadata.linkPreview
        ? metadata.linkPreview.trueUrl
        : null,
      linkPreviewLength: 0,
      fetchingLinkPreview: false,
      title: props.composer.title || '',
      description: props.composer.body || '',
    };
  }

  componentDidMount() {
    // if a draft already exists, no need to init another
    if (this.props.composer.newStoryKey) return;
    // otherwise init a new draft
    this.props.dispatch(initStory(this.state.frequencyPicker));
  }

  changeTitle = e => {
    this.setState({
      title: e.target.value,
    });
  };

  changeBody = e => {
    this.setState({
      description: e.target.value,
    });

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

  selectCommunityFromDropdown = e => {
    this.setState({
      communityPicker: e.target.value,
    });
  };

  uploadMedia = e => {
    const user = this.props.user;
    let description = this.state.description;

    const files = e.target.files;
    const location = 'stories';
    const key = this.props.composer.newStoryKey;
    const userId = user.uid;

    // disable the submit button until uploads are done
    this.setState({ loading: true });

    uploadMultipleMediaToLocation(files, location, key, userId)
      .then(filesArr => {
        track('media', 'multiple uploaded', null);
        for (let file of filesArr) {
          description = `${description}\n![](${file.url})\n`;
          track('media', 'uploaded', null);
          this.props.dispatch(addMediaList(file));
          this.setState({
            description,
          });
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
    const isEditing = this.props.composer.editing;
    const title = this.state.title;
    const description = this.state.description;
    const metadata = this.props.composer.metadata;

    // if we pass in a custom frequency, it means the user is in 'all' and has selected a frequency from the dropdown
    // if the user isn't in all, we'll send the currently active frequency via the redux state
    const frequency = this.props.activeCommunity === 'everything'
      ? this.state.frequencyPicker
      : this.props.frequencies.active;

    const community = this.props.communities.find(
      community => community.slug === this.props.activeCommunity
    );

    // ignore the frequency id if we are editing a story while in /everything
    let frequencyId;
    if (!isEditing) {
      frequencyId = getCurrentFrequency(
        frequency,
        this.props.frequencies.frequencies,
        community.id
      ).id;
    }

    if (frequency && title && !isEditing) {
      // if everything is filled out
      this.props.dispatch(
        publishStory({
          frequencyId,
          title,
          description,
          metadata,
        })
      );
    } else if (frequency && title && isEditing) {
      this.props.dispatch(
        saveEditStory({
          title,
          description,
          metadata,
        })
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
    this.props.dispatch(removeImageFromComposer(key, story));
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

  cancelEditing = () => {
    this.props.dispatch(cancelEditStory());
  };

  render() {
    let { frequencies, composer, activeCommunity, communities } = this.props;
    let activeFrequency = frequencies.active;
    let currentFrequency = frequencies.frequencies.filter(freq => {
      return freq.slug === activeFrequency;
    });
    let media = composer.mediaList;

    const communitySelected = communities.find(
      community => community.id === this.state.communityPicker
    );
    const availableFrequencies = frequencies.byCommunity[communitySelected.id];

    let byline = activeCommunity === 'everything'
      ? <span>
          <Byline hasContent={true}>
            <Select
              onChange={this.selectCommunityFromDropdown}
              defaultValue={communities[0].id}
            >

              {communities.map((community, i) => {
                return (
                  <option key={i} value={community.id}>
                    {community.name}
                  </option>
                );
              })}
            </Select>

            <Select
              right
              onChange={this.selectFrequencyFromDropdown}
              defaultValue={availableFrequencies[0].id}
            >

              {availableFrequencies.map((frequency, i) => {
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
        <ContentView>
          <Header>
            <FlexColumn>
              <form onSubmit={this.publishStory} encType="multipart/form-data">
                <Byline
                  onClick={this.setCreating}
                  hasContent={true}
                  active={this.state.creating}
                >
                  {this.props.composer.editing ? 'Edit' : 'Create'}
                </Byline>
                <Byline
                  onClick={this.setPreviewing}
                  active={!this.state.creating}
                  hasContent={
                    this.state.title.length > 0 &&
                      this.state.description.length > 0
                  }
                >
                  Preview
                </Byline>

                {this.state.creating
                  ? <div>
                      <Textarea
                        onChange={this.changeTitle}
                        style={StoryTitle}
                        value={this.state.title}
                        placeholder={"What's up?"}
                        autoFocus
                      />

                      <Textarea
                        onChange={this.changeBody}
                        value={this.state.description}
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
                      <StoryTitlePreview>{this.state.title}</StoryTitlePreview>
                      <div
                        className="markdown"
                        ref="story"
                        style={{ marginBottom: '32px' }}
                      >
                        <Markdown>
                          {linkFreqsInMd(
                            this.state.description,
                            activeCommunity
                          )}
                        </Markdown>
                      </div>
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
                    </PreviewWrapper>}
                <SubmitContainer sticky={!this.state.creating}>

                  {!composer.editing && byline}

                  {this.props.composer.editing &&
                    <Byline hasContent={true} onClick={this.cancelEditing}>
                      Cancel
                    </Byline>}

                  <Submit
                    type="submit"
                    disabled={!this.state.title && !this.state.description}
                    value={
                      this.state.loading
                        ? 'Loading...'
                        : this.props.composer.editing
                            ? 'Update Story'
                            : 'Post Story'
                    }
                    active={this.state.title}
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
    activeCommunity: state.communities.active,
    communities: state.communities.communities,
    composer: state.composer,
  };
};

export default connect(mapStateToProps)(StoryComposer);
