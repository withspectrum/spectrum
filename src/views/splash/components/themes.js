// @flow
import React from 'react';
import styled from 'styled-components';
import Goop from '../../../components/goop';
import {
  ClusterOne,
  ClusterTwo,
  ClusterThree,
  ClusterFour,
  Constellations,
} from './illustrations';
import { FlexCol, hexa } from '../../../components/globals';

export const Default = styled(FlexCol)`
  display: flex;
  position: relative;
  flex: auto;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg.default};
  color: ${({ theme }) => theme.text.default};
`;

export const Primary = styled(Default)`
  background-color: ${({ theme }) => theme.space.dark};
  background-image: ${({ theme }) =>
    `radial-gradient(farthest-corner at 50% 100%,
      ${hexa(theme.brand.alt, 0.75)}, ${theme.space.dark}
    )`};
  color: ${({ theme }) => theme.text.reverse};
`;

export const Brand = styled(Default)`
  background-color: ${({ theme }) => theme.brand.default};
  background-image: linear-gradient(
    to bottom,
    ${({ theme }) => `${theme.brand.alt}, ${theme.brand.default}`}
  );
  color: ${({ theme }) => theme.text.reverse};
`;

export const Dark = styled(Default)`
  background-color: ${({ theme }) => theme.space.dark};
  background-image: linear-gradient(
    to bottom,
    ${({ theme }) => `${theme.space.dark}, ${theme.brand.default}`}
  );
  color: ${({ theme }) => theme.text.reverse};
`;

export const Space = styled(Default)`
  background-color: ${({ theme }) => theme.space.dark};
  background-image: linear-gradient(
    to bottom,
    ${({ theme }) => `${theme.space.alt}, ${theme.space.dark}`}
  );
  color: ${({ theme }) => theme.text.reverse};
`;

export const Light = styled(Default)`
  background-color: ${({ theme }) => theme.space.alt};
  color: ${({ theme }) => theme.text.reverse};
`;

export const Bright = styled(Default)`
  background-color: ${({ theme }) => theme.brand.default};
  background-image: linear-gradient(
    to bottom,
    ${({ theme }) => `${theme.space.alt}, ${theme.brand.default}`}
  );
  color: ${({ theme }) => theme.text.reverse};
`;

export const Grayscale = styled(Default)`
  background-color: ${({ theme }) => theme.bg.reverse};
  background-image: linear-gradient(
    to bottom,
    ${({ theme }) => `${theme.text.alt}, ${theme.bg.reverse}`}
  );
  color: ${({ theme }) => theme.text.reverse};
`;

type ThemeProps = Object;

const Theme = (props: ThemeProps) => {
  switch (props.background) {
    default:
      return (
        <Default>
          <ClusterOne src="/img/cluster-1.svg" role="presentation" />
          <ClusterTwo src="/img/cluster-2.svg" role="presentation" />
          <ClusterThree src="/img/cluster-5.svg" role="presentation" />
          <ClusterFour src="/img/cluster-4.svg" role="presentation" />
          {props.children}
          <Goop {...props} />
        </Default>
      );
    case 'primary':
      return (
        <Primary>
          {props.children}
          <Goop {...props} />
        </Primary>
      );
    case 'brand':
      return (
        <Brand>
          {props.children}
          <Goop {...props} />
        </Brand>
      );
    case 'constellations':
      return (
        <Primary>
          {props.children}
          <Constellations />
          <Goop {...props} />
        </Primary>
      );
    case 'dark':
      return (
        <Dark>
          {props.children}
          <Goop {...props} />
        </Dark>
      );
    case 'space':
      return (
        <Space>
          {props.children}
          <Goop {...props} />
        </Space>
      );
    case 'bright':
      return (
        <Bright>
          {props.children}
          <Goop {...props} />
        </Bright>
      );
    case 'light':
      return (
        <Light>
          {props.children}
          <Goop {...props} />
        </Light>
      );
    case 'grayscale':
      return (
        <Grayscale>
          {props.children}
          <Goop {...props} />
        </Grayscale>
      );
  }
};

export default Theme;
