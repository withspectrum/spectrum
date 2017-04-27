// @flow
import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Frequency from '../frequency';

const data = {
  title: 'Test frequency',
  subtitle: 'Whats up',
  description: 'Testing the frequency profile',
  id: 'asdf-123',
};

it('should render with no size', () => {
  const wrapper = shallow(<Frequency data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a mini size', () => {
  const wrapper = shallow(<Frequency size="mini" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a small size', () => {
  const wrapper = shallow(<Frequency size="small" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a medium size', () => {
  const wrapper = shallow(<Frequency size="medium" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a large size', () => {
  const wrapper = shallow(<Frequency size="large" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a full size', () => {
  const wrapper = shallow(<Frequency size="full" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});
