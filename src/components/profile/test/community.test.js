// @flow
import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Community from '../community';

const data = {
  title: 'Test community',
  subtitle: 'Whats up',
  description: 'Testing the community profile',
  id: 'asdf-123',
};

it('should render with no size', () => {
  const wrapper = shallow(<Community data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a mini size', () => {
  const wrapper = shallow(<Community size="mini" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a small size', () => {
  const wrapper = shallow(<Community size="small" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a medium size', () => {
  const wrapper = shallow(<Community size="medium" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a large size', () => {
  const wrapper = shallow(<Community size="large" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a full size', () => {
  const wrapper = shallow(<Community size="full" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});
