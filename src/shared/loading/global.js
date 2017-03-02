import React from 'react';
import { Wrapper, Loader, Bar } from './style.js';

const GlobalLoadingIndicator = () => {
  return (
    <Wrapper>
      <Loader>
        <Bar />
        <Bar />
        <Bar />
        <Bar />
      </Loader>
    </Wrapper>
  );
};

export default GlobalLoadingIndicator;
