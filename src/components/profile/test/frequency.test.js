// @flow
import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Channel from '../channel';

const data = {
  title: 'Test channel',
  subtitle: 'Whats up',
  description: 'Testing the channel profile',
  id: 'asdf-123',
};

it('should render with no size', () => {
  const wrapper = shallow(<Channel data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a mini size', () => {
  const wrapper = shallow(<Channel size="mini" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a small size', () => {
  const wrapper = shallow(<Channel size="small" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a medium size', () => {
  const wrapper = shallow(<Channel size="medium" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a large size', () => {
  const wrapper = shallow(<Channel size="large" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});

it('should render with a full size', () => {
  const wrapper = shallow(<Channel size="full" data={data} />);
  expect(toJSON(wrapper)).toMatchSnapshot();
});
