// @flow
import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import User from '../user';

const data = {
  title: 'Test user',
  subtitle: 'Whats up',
  description: 'Testing the user profile',
  profilePhoto: 'img.com/asdf.jpg',
  id: 'asdf-123',
};

it('should render with no size', () => {
  const wrapper = shallow(<User data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a mini size', () => {
  const wrapper = shallow(<User size="mini" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a small size', () => {
  const wrapper = shallow(<User size="small" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a medium size', () => {
  const wrapper = shallow(<User size="medium" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a large size', () => {
  const wrapper = shallow(<User size="large" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a full size', () => {
  const wrapper = shallow(<User size="full" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});
