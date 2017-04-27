import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from '../../../shared/Card';
import { Button } from '../../../shared/Globals';
import { Body, Title, Description } from './style';
import { toggleComposer } from '../../../actions/composer';

class ReportBugCard extends Component {
  toggleComposer = () => {
    this.props.dispatch(toggleComposer());
  };

  render() {
    return (
      <Card static>
        <Body>
          <Description emoji>🐞</Description>
          <Title>Report Bugs & Give Feedback</Title>
          <Description>
            If you're having trouble with Spectrum, we're here to help! Create a story with details of your issue (include screenshots, if possible) and we'll get back to you right away.
          </Description>
          <Button width={'100%'} onClick={this.toggleComposer}>
            Report Bug or Share Feedback
          </Button>
        </Body>
      </Card>
    );
  }
}

export default connect()(ReportBugCard);
