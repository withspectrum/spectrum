import React from 'react';
import { Step, Line, Container } from './style';

const Stepper = ({ activeStep }) => {
  return (
    <Container>
      <Line />
      <Step
        tipText={'Create your community'}
        tipLocation={'top'}
        active={activeStep === 1}
      >
        1
      </Step>
      <Step
        tipText={'Invite others'}
        tipLocation={'top'}
        active={activeStep === 2}
      >
        2
      </Step>
      <Step
        tipText={'Start a conversation'}
        tipLocation={'top'}
        active={activeStep === 3}
      >
        3
      </Step>
      <Step tipText={'Share'} tipLocation={'top'} active={activeStep === 4}>
        4
      </Step>
    </Container>
  );
};

export default Stepper;
