// @flow
import React from 'react';
// @Flow Fix Me
import styled from 'styled-components';
import Goop from '../../../components/goop';
import {
  ClusterOne,
  ClusterTwo,
  ClusterThree,
  ClusterFour,
  Constellations,
} from './illustrations';
import {
  Default,
  Primary,
  Brand,
  Dark,
  Space,
  Light,
  Bright,
  Grayscale,
} from './themes';
import {
  Gradient,
  FlexCol,
  FlexRow,
  zIndex,
  hexa,
} from '../../../components/globals';

const Content = styled(FlexRow)`
	flex: auto;
	align-self: stretch;
	align-items: center;
	justify-content: center;
	position: relative;

	@media (max-width: 768px) {
    flex-direction: column;
	}
`;

const Section = props => {
  switch (props.background) {
    default:
      return (
        <Default>
          <ClusterOne src="/img/cluster-1.svg" role="presentation" />
          <ClusterTwo src="/img/cluster-2.svg" role="presentation" />
          <ClusterThree src="/img/cluster-5.svg" role="presentation" />
          <ClusterFour src="/img/cluster-4.svg" role="presentation" />
          <Content {...props}>
            {props.children}
          </Content>
          <Goop {...props} />
        </Default>
      );
    case 'primary':
      return (
        <Primary>
          <Content {...props}>
            {props.children}
          </Content>
          <Goop {...props} />
        </Primary>
      );
    case 'brand':
      return (
        <Brand>
          <Content {...props}>
            {props.children}
          </Content>
          <Goop {...props} />
        </Brand>
      );
    case 'constellations':
      return (
        <Primary>
          <Content {...props}>
            {props.children}
          </Content>
          <Constellations />
          <Goop {...props} />
        </Primary>
      );
    case 'dark':
      return (
        <Dark>
          <Content {...props}>
            {props.children}
          </Content>
          <Goop {...props} />
        </Dark>
      );
    case 'space':
      return (
        <Space>
          <Content {...props}>
            {props.children}
          </Content>
          <Goop {...props} />
        </Space>
      );
    case 'bright':
      return (
        <Bright>
          <Content {...props}>
            {props.children}
          </Content>
          <Goop {...props} />
        </Bright>
      );
    case 'light':
      return (
        <Light>
          <Content {...props}>
            {props.children}
          </Content>
          <Goop {...props} />
        </Light>
      );
    case 'grayscale':
      return (
        <Grayscale>
          <Content {...props}>
            {props.children}
          </Content>
          <Goop {...props} />
        </Grayscale>
      );
  }
};

export default Section;
