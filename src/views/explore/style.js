import styled from 'styled-components';

import {
  FlexCol,
  FlexRow,
  H1,
  H2,
  H3,
  P,
  Transition,
  Gradient,
  Button,
  Shadow,
} from '../../components/globals';
// import ScrollRow from '../../../shared/ScrollRow';

export const ViewContainer = styled(FlexCol)`
  flex: 1 1 auto;
  align-self: stretch;
  overflow: hidden;
  overflow-y: scroll;
`;

export const ScrollBody = styled(FlexCol)`
  flex: 0 0 auto;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
  z-index: 1;
  background-color: ${({ theme }) => theme.generic.default};
`;

export const ViewTitle = styled(H1)`
  margin-left: 48px;
  margin-top: 48px;
  font-size: 32px;
  font-weight: 900;
  color: ${({ theme }) => theme.text.reverse};
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    margin-left: 16px;
    margin-top: 16px;
  }
`;

export const ViewSubtitle = styled(H2)`
  margin-left: 48px;
  color: ${({ theme }) => theme.text.reverse};
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    margin-left: 16px;
    font-size: 16px;
    line-height: 20px;
  }
`;

export const Section = styled(FlexCol)`
  padding-top: 32px;
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;

  &:nth-of-type(2) {
    background-color: ${({ theme }) => theme.space.dark};
    background-image: ${({ theme }) => `linear-gradient( ${theme.bg.default}, ${theme.generic.default} )`};
  }
`;

export const ViewHeader = styled(Section)`
  flex: 0 0 320px;
  padding-bottom: 120px;
  justify-content: flex-end;
  background-color: ${({ theme }) => theme.space.dark};
  background-image: ${({ theme }) => `linear-gradient( ${theme.space.dark}, ${theme.brand.alt} )`};

  @media (max-width: 768px) {
    flex: 0 0 240px;
    padding-bottom: 48px;
  }
`;

export const SectionTitle = styled(H2)`
  color: ${({ theme }) => theme.text.default};
  margin-left: 48px;


  @media (max-width: 768px) {
    margin-left: 16px;
  }
`;

export const SectionSubtitle = styled(H3)`
  color: ${({ theme }) => theme.text.default};
  margin-bottom: 8px;
  margin-left: 48px;

  @media (max-width: 768px) {
    margin-left: 16px;
  }
`;

export const Row = styled(FlexRow)`
  max-width: 100%;
  width: 100%;
  flex: 0 0 320px;
  padding: 8px 16px 32px 16px;

  &:after, &:before{
    content: '';
    display: inline-block;
    flex: 0 0 32px;
    align-self: stretch;
    background-color: transparent;
  }
`;

export const Item = styled(FlexCol)`
  padding: 16px;
  flex: 0 0 280px;
  flex-order: ${props => (props.active ? '2' : '1')};
  background-color: ${({ theme }) => theme.bg.default};
  color: ${({ theme }) => theme.text.default};
  border-radius: 16px;
  margin-right: 24px;
  justify-content: space-between;
  position: relative;
  opacity: ${props => (props.active ? '0.85' : '1')};
  box-shadow: ${props => (props.active ? Shadow.low : Shadow.high)};
  transition: ${Transition.hover.off};

  &:hover {
    box-shadow: ${Shadow.high};
    transition: ${Transition.hover.on};
    opacity: 1;
  }
`;

export const ItemTitle = styled(H2)`
  font-weight: 700;
  color: ${({ theme }) => theme.text.default};
`;

export const ItemCopy = styled(P)`
  color: ${({ theme }) => theme.text.default};
  margin: 8px 0;
`;

export const ItemMeta = styled(ItemCopy)`
  font-weight: 900;
  color: ${({ theme }) => theme.text.placeholder};
`;

export const ButtonContainer = styled(FlexRow)`
  justify-content: flex-end;
  align-items: center;

  > div {
    margin-right: 8px;
  }
`;

export const ItemButton = styled(Button)`
  font-weight: 700;
  color: ${({ theme }) => theme.text.reverse};
  background-color: ${props => (props.active ? props.theme.inactive : props.theme.brand.default)};
  background-image: ${props => (props.active ? 'none' : Gradient(props.theme.brand.alt, props.theme.brand.default))};
  box-shadow: none;
  transition: ${Transition.hover.on};

  &:hover {
    box-shadow: none;
  }
`;

export const Constellations = styled.div`
	background-color: transparent;
	background: url(/img/constellations.svg) center top no-repeat;
	position: absolute;
	background-size: cover 100%;
	z-index: 0;
	height: calc(100% + 4px);
	width: 110%;
	top: -10px;
	bottom: 0;
	left: 0;
	right: 0;
`;
