import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import actions from '../../../actions';
import helpers from '../../../helpers';
import Textarea from 'react-textarea-autosize';

import {
  ScrollBody,
  ContentView,
  Header,
  StoryTitle,
  FlexColumn,
  Byline,
  TextBody,
  Alert,
  Select,
  Submit,
  SubmitContainer,
  MediaInput,
  MediaLabel
} from './style';

class Composer extends Component {
  constructor(props) {
    super(props)

    let { frequencies, user } = props
    let userFreqs = Object.keys(user.frequencies)

    this.state = {
      error: null,
      frequencyPicker: userFreqs ? userFreqs[0] : '',
      loading: false
    }
  }

  componentDidMount() {
    // if a draft already exists, no need to init another
    if (this.props.composer.newStoryKey) return
    // otherwise init a new draft
    this.props.dispatch(actions.initStory())
  }

  changeTitle = (e) => {
    this.props.dispatch(actions.updateTitle(e.target.value))
  };

  changeBody = (e) => {
    this.props.dispatch(actions.updateBody(e.target.value))
  };

  selectFrequencyFromDropdown = (e) => {
    this.setState({
      frequencyPicker: e.target.value,
    });
  };

  uploadMedia = (e) => {
    let file = e.target.files[0]
    let body = this.props.composer.body
    let story = this.props.composer.newStoryKey
    
    this.setState({ loading: true })
    let fileUrl = helpers.uploadMedia(file, story)
      .then((fileUrl) => {
        body = `${body}\n![Alt Text](${fileUrl})\n`
        this.props.dispatch(actions.updateBody(body))
        
        this.setState({
          loading: false
        })
      })
  }

  publishStory = (e) => {
    e.preventDefault()
    let title = this.props.composer.title
    let body = this.props.composer.body
    // if we pass in a custom frequency, it means the user is in 'all' and has selected a frequency from the dropdown
    // if the user isn't in all, we'll send the currently active frequency via the redux state
    let frequency = this.props.frequencies.active === 'all'
      ? this.state.frequencyPicker
      : this.props.frequencies.active;

    let newStoryObj = {
      frequency,
      title,
      body
    }

    if (frequency && title) { // if everything is filled out
      this.props.dispatch( actions.publishStory(newStoryObj))
      .then(() => { // after the story is created, we need to set messages so that the chat will work right away
        this.props.dispatch( actions.setMessages() )
      });
    } else if (!frequency && title) { // if no frequency is chosen
      this.setState({
        error: 'Choose a frequency to share this story to!'
      })
    } else if (!title) { // missing a title
      this.setState({
        error: "Be sure to type a title!"
      })
    } else { // something else went wrong...
      this.setState({
        error: "Oops!"
      })
    }
  }


  render() {
    let { frequencies, user, composer } = this.props
    let activeFrequency = frequencies.active
    let currentFrequency = frequencies.frequencies.filter((freq) => {
      return freq.id === activeFrequency
    })

    let byline = activeFrequency === "all"
      ? <span>
            <Byline>Post in
            <Select
              onChange={this.selectFrequencyFromDropdown}
              defaultValue={frequencies.frequencies[0].id}>
              
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
      : <Byline>New Story in {currentFrequency[0].name}</Byline>

    return (
      <ScrollBody>
        <ContentView>
          <Header>
            <FlexColumn>

              <form onSubmit={this.publishStory} encType="multipart/form-data">
                <Byline>New Story</Byline>
                <Textarea 
                  onChange={this.changeTitle}
                  style={StoryTitle} 
                  value={composer.title}
                  placeholder={"What's up?"} 
                  autoFocus></Textarea>
                
                <Textarea 
                  onChange={this.changeBody}
                  value={composer.body}
                  style={TextBody}
                  placeholder={"Say more words..."}></Textarea>

                <MediaInput
                  ref="media"
                  type="file"
                  id="file"
                  name="file"
                  accept=".png, .jpg, .jpeg, .gif"
                  onChange={this.uploadMedia}
                />
                <MediaLabel htmlFor="file">+ Upload Image</MediaLabel>
                <SubmitContainer>
                  { byline }
                  <Submit type="submit" disabled={this.state.loading} value={this.state.loading ? "Loading..." : "Post Story"} active={composer.title} />
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
    composer: state.composer
  }
}

export default connect(mapStateToProps)(Composer);
