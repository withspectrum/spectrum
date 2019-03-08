// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
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
  z-index: 11;
  padding: 12px 16px 8px 8px;

  @media (min-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.text.default};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .icon {
    margin-right: 0;
  }
`;
