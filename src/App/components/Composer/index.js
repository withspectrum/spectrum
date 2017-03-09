import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateTitle,
  updateBody,
  addMediaList,
  removeImageFromStory,
} from '../../../actions/composer';
import { publishStory, initStory } from '../../../actions/stories';
import { getCurrentFrequency } from '../../../helpers/frequencies';
import { uploadMultipleMedia } from '../../../helpers/stories';
import Textarea from 'react-textarea-autosize';
import Markdown from 'react-remarkable';

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
} from './style';

class Composer extends Component {
  constructor(props) {
    super(props);

    let { user } = props;
    let userFreqs = Object.keys(user.frequencies);

    this.state = {
      error: null,
      frequencyPicker: userFreqs ? userFreqs[0] : '',
      loading: false,
      placeholder: '+ Embed',
      embedUrl: '',
      creating: true,
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
        for (let file of filesArr) {
          body = `${body}\n![](${file.url})\n`;
          this.props.dispatch(addMediaList(file));
          this.props.dispatch(updateBody(body));
        }

        this.setState({
          loading: false,
        });
      })
      .catch(e => {
        this.setState({
          error: e,
        });
      });
  };

  publishStory = e => {
    e.preventDefault();
    const title = this.props.composer.title;
    const description = this.props.composer.body;
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
        }),
      );
    } else if (!frequency && title) {
      // if no frequency is chosen
      this.setState({
        error: 'Choose a frequency to share this story to!',
      });
    } else if (!title) {
      // missing a title
      this.setState({
        error: 'Be sure to type a title!',
      });
    } else {
      // something else went wrong...
      this.setState({
        error: 'Oops!',
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
    this.setState({
      creating: false,
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
                        placeholder={'What’s up?'}
                        autoFocus
                      />

                      <Textarea
                        onChange={this.changeBody}
                        value={composer.body}
                        style={TextBody}
                        placeholder={'Say more words...'}
                      />

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
                        <Markdown
                          options={{
                            html: true,
                            linkify: true,
                          }}
                          source={composer.body}
                        />
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

                {this.state.error && <Alert>{this.state.error}</Alert>}
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
