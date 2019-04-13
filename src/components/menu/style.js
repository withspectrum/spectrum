// @flow
import theme from 'shared/theme';
import styled, { css } from 'styled-components';
import { Transition, Shadow, zIndex, hexa } from 'src/components/globals';
import { isDesktopApp } from 'src/helpers/desktop-app-utils';

export const Wrapper = styled.div`
  display: inline-block;

  ${props =>
    props.darkContext &&
    css`
      > button {
        color: ${theme.text.reverse};
        transition: ${Transition.hover.off};

        &:hover {
          color: ${theme.text.reverse};
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
  height: 100%;
  min-height: 100%;
  z-index: 1;

  button {
    color: ${theme.text.reverse};
    z-index: 2;
    align-self: flex-start;
    margin-top: ${props => (props.hasNavBar ? '56px' : '8px')};
    margin-left: 8px;
  }

  button:hover {
    color: ${theme.text.reverse};
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
  height: 100%;
  width: 300px;
  color: ${theme.brand.alt};
  background-color: ${theme.bg.wash};
  box-shadow: ${Shadow.high} ${props => hexa(props.theme.bg.reverse, 0.25)};
  padding-top: ${props =>
    props.hasNavBar ? '48px' : isDesktopApp() ? '40px' : '0'};
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
