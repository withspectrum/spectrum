// @flow
import theme from 'shared/theme';
import React from 'react';
import styled from 'styled-components';
import Goop from 'src/components/goop';
import {
  ClusterOne,
  ClusterTwo,
  ClusterThree,
  ClusterFour,
  Constellations,
  Empty,
} from 'src/components/illustrations';
import { FlexCol, hexa } from 'src/components/globals';
import { MEDIA_BREAK } from 'src/components/layout';

export const Default = styled(FlexCol)`
  display: flex;
  position: relative;
  flex: auto;
  align-items: center;
  justify-content: center;
  background-color: ${theme.bg.default};
  color: ${theme.text.default};
`;

export const Primary = styled(Default)`
  background-color: ${theme.space.dark};
  background-image: ${({ theme }) =>
    `radial-gradient(farthest-corner at 50% 100%,
      ${hexa(theme.brand.alt, 0.75)}, ${theme.space.dark}
    )`};
  color: ${theme.text.reverse};
  display: flex;
  flex: 1 0 auto;
`;

export const Brand = styled(Default)`
  background-color: ${theme.brand.default};
  background-image: linear-gradient(
    to bottom,
    ${({ theme }) => `${theme.brand.alt}, ${theme.brand.default}`}
  );
  color: ${theme.text.reverse};
  display: flex;
  flex: 1 0 auto;
`;

export const Dark = styled(Default)`
  background-color: ${theme.space.dark};
  background-image: linear-gradient(
    to bottom,
    ${({ theme }) => `${theme.space.dark}, ${theme.brand.default}`}
  );
  color: ${theme.text.reverse};
  display: flex;
  flex: 1 0 auto;
`;

export const Space = styled(Default)`
  background-color: ${theme.space.dark};
  background-image: linear-gradient(
    to bottom,
    ${({ theme }) => `${theme.space.alt}, ${theme.space.dark}`}
  );
  color: ${theme.text.reverse};
  display: flex;
  flex: 1 0 auto;
`;

export const Light = styled(Default)`
  background-color: ${theme.space.alt};
  color: ${theme.text.reverse};
  display: flex;
  flex: 1 0 auto;
`;

export const Bright = styled(Default)`
  background-color: ${theme.brand.default};
  background-image: linear-gradient(
    to bottom,
    ${({ theme }) => `${theme.space.alt}, ${theme.brand.default}`}
  );
  color: ${theme.text.reverse};
  display: flex;
  flex: 1 0 auto;
`;

export const Grayscale = styled(Default)`
  background-color: ${theme.bg.reverse};
  background-image: linear-gradient(
    to bottom,
    ${({ theme }) => `${theme.text.alt}, ${theme.bg.reverse}`}
  );
  color: ${theme.text.reverse};
  display: flex;
  flex: 1 0 auto;
`;

export const Reverse = styled(Default)`
  background-color: ${theme.bg.reverse};
  background-image: none;
  color: ${theme.text.reverse};
  display: flex;
  flex: 1 0 auto;
`;

export const Blank = styled(Default)`
  background-image: none;
  display: flex;
  flex: 1 0 auto;
`;

export const Illustrated = styled(Default)`
  display: flex;
  flex: 1 0 auto;

  > img {
    opacity: 0.15;

    @media (max-width: ${MEDIA_BREAK}px) {
      opacity: 0.025;
    }
  }
`;

type ThemeProps = Object;

const Section = (props: ThemeProps) => {
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
    case 'blank':
      return (
        <Default>
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
    case 'illustrated':
      return (
        <Illustrated>
          <Empty />
          {props.children}
          <Goop {...props} />
        </Illustrated>
      );
    case 'reverse':
      return (
        <Reverse>
          {props.children}
          <Goop {...props} />
        </Reverse>
      );
  }
};

export default Section;
