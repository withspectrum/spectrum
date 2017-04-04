import React, { Component } from 'react';
import { Button, TextButton, FlexRow } from '../../../shared/Globals';
import {
  HighlightedCard,
  Header,
  Copy,
  Question,
  ButtonRow,
  Confirm,
  Cancel,
} from './style';

class OnboardingCard extends Component {
  render() {
    return (
      <HighlightedCard>
        <Header>Looking for somewhere to start?</Header>
        <Copy>Spectrum is a platform for building communities.</Copy>
        <Copy>We've got some pretty neat features to make that easier.</Copy>
        <Question>Want a quick tour?</Question>
        <ButtonRow>
          <Cancel>I'm good.</Cancel>
          <Confirm>Sure!</Confirm>
        </ButtonRow>
      </HighlightedCard>
    );
  }
}

export default OnboardingCard;
