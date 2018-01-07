import styled, { css } from 'styled-components';
import Link from '../../components/link';
import { Button } from '../../components/buttons';
import {
  H2,
  FlexCol,
  FlexRow,
  P,
  Transition,
  Shadow,
  zIndex,
  hexa,
  Gradient,
} from '../../components/globals';

export const Wrapper = styled.div`
  display: inline-block;

  ${props =>
    props.darkContext &&
    css`
      > button {
        color: ${props => props.theme.text.reverse};
        transition: ${Transition.hover.off};

        &:hover {
          color: ${props => props.theme.text.reverse};
          transform: scale(1.1);
          transition: ${Transition.hover.on};
        }
      }
    `};
`;

export const Absolute = styled.div`
  display: ${props => (props.open ? 'flex' : 'none')};
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  min-width: 100vw;
  height: 100vh;
  min-height: 100vh;
  z-index: 1;

  > button {
    color: ${props => props.theme.text.reverse};
    z-index: 2;
    align-self: flex-start;
    margin-top: ${props => (props.hasNavBar ? '56px' : '8px')};
    margin-left: 8px;
  }
`;

export const MenuContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-content: start;
  justify-content: stretch;
  left: 0;
  top: 0;
  bottom: 0;
  height: ${props => (props.hasNavbar ? 'calc(100vh - 48px)' : '100vh')};
  width: 300px;
  color: ${props => props.theme.brand.alt};
  background-color: ${props => props.theme.bg.default};
  background-image: ${props =>
    Gradient(props.theme.bg.default, props.theme.bg.wash)};
  box-shadow: ${Shadow.high} ${props => hexa(props.theme.bg.reverse, 0.25)};
  padding-top: ${props => (props.hasNavBar ? '48px' : '0')};
  z-index: ${zIndex.fullscreen + 1};
`;

export const MenuOverlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  min-width: 100vw;
  height: 100vh;
  min-height: 100vh;
  background-color: ${props => hexa(props.theme.bg.reverse, 0.5)};
`;
