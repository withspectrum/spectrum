// @flow
import React from 'react';
import { Step, Line, Container } from './style';

const Stepper = ({ activeStep }) => {
  return (
    <Container>
      <Line />
      <Step active={activeStep === 1}>1</Step>
      <Step active={activeStep === 2}>2</Step>
      <Step active={activeStep === 3}>3</Step>
    </Container>
  );
};

export default Stepper;
