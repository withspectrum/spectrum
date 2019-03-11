// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { Truncate } from 'src/components/globals';
import { MEDIA_BREAK } from 'src/components/layout';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props =>
    props.hasAction ? 'space-between' : 'flex-start'};
  width: 100%;
  background: ${theme.bg.default};
  position: sticky;
  top: 0;
  z-index: 15;
  padding: 12px 16px 12px 8px;
  flex: none;
  min-height: 62px;

  @media (min-width: ${MEDIA_BREAK}px) {
    display: ${props => (props.desktop ? 'flex' : 'none')};
  }
  @media (max-width: ${MEDIA_BREAK}px) {
    display: ${props => (props.desktop ? 'none' : 'flex')};
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.text.default};
  display: block;
  max-width: calc(100% - 96px);
  ${Truncate};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  a {
    display: flex;
    align-items: center;
  }

  .icon {
    margin-right: 0;
  }
`;

export const MenuActionContainer = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
