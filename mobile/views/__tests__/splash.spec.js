/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';

import Splash from '../splash';

describe('Splash', () => {
  it('should render all its children', () => {
    const tree = renderer.create(<Splash />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
