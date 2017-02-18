import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
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
  SubmitContainer
} from './style';

class ComposerNew extends Component {
  constructor(props) {
    super(props)

    let { frequencies, user } = props
    let userFreqs = Object.keys(user.frequencies)

    this.state = {
      title: '',
      body: '',
      error: null,
      frequencyPicker: userFreqs ? userFreqs[0] : ''
    }
  }

  changeTitle = (e) => {
    this.setState({
      title: e.target.value,
      error: null,
    });
  };

  changeBody = (e) => {
    this.setState({
      body: e.target.value,
      error: null,
    });
  };

  selectFrequencyFromDropdown = (e) => {
    this.setState({
      frequencyPicker: e.target.value,
    });
  };

  createStory = (e) => {
    e.preventDefault()
    let title = this.state.title
    let body = this.state.body
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

    if (frequency && title || body) { // if everything is filled out
      this.props.dispatch( actions.createStory(newStoryObj));
    } else if (!frequency && title || body) { // if no frequency is chosen
      this.setState({
        error: 'Choose a frequency to share this story to!'
      })
    } else { // missing a title or body
      this.setState({
        error: "Be sure to type something first!"
      })
    }
  }


  render() {
    let { frequencies, user } = this.props
    let activeFrequency = frequencies.active
    let currentFrequency = frequencies.frequencies.filter((freq) => {
      return freq.id === activeFrequency
    })

    let byline = activeFrequency === "all"
      ? <span>
            <Byline>New Story in
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

              <form onSubmit={this.createStory} encType="multipart/form-data">
                { byline }

                <Textarea 
                  onChange={this.changeTitle}
                  style={StoryTitle} 
                  placeholder={"Title"} 
                  autoFocus></Textarea>
                
                <Textarea 
                  onChange={this.changeBody}
                  style={TextBody} 
                  placeholder={"What's this about?"}></Textarea>

                <SubmitContainer>
                  <Submit type="submit" value="Post" active={this.state.title || this.state.body} />
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
    frequencies: state.frequencies
  }
}

export default connect(mapStateToProps)(ComposerNew);
