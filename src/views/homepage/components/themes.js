import styled from 'styled-components';
import { Gradient, FlexCol, hexa } from '../../../components/globals';

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
  min-height: 75vh;
`;

export const Brand = styled(Default)`
  background-color: ${({ theme }) => theme.brand.default};
  background-image: linear-gradient(to bottom, ${({ theme }) =>
    `${theme.brand.alt}, ${theme.brand.default}`});
	color: ${({ theme }) => theme.text.reverse};
`;

export const Dark = styled(Default)`
	background-color: ${({ theme }) => theme.space.dark};
	background-image: linear-gradient(to bottom, ${({ theme }) =>
    `${theme.space.dark}, ${theme.brand.default}`});
	color: ${({ theme }) => theme.text.reverse};
`;

export const Space = styled(Default)`
background-color: ${({ theme }) => theme.space.dark};
background-image: linear-gradient(to bottom, ${({ theme }) =>
  `${theme.space.light}, ${theme.space.dark}`});
color: ${({ theme }) => theme.text.reverse};
`;

export const Light = styled(Default)`
	background-color: ${({ theme }) => theme.space.light};
	color: ${({ theme }) => theme.text.reverse};
`;

export const Bright = styled(Default)`
  background-color: ${({ theme }) => theme.brand.default};
  background-image: linear-gradient(to bottom, ${({ theme }) =>
    `${theme.space.light}, ${theme.brand.default}`});
  color: ${({ theme }) => theme.text.reverse};
`;

export const Grayscale = styled(Default)`
  background-color: ${({ theme }) => theme.bg.reverse};
  background-image: linear-gradient(to bottom, ${({ theme }) =>
    `${theme.text.alt}, ${theme.bg.reverse}`});
  color: ${({ theme }) => theme.text.reverse};
`;
