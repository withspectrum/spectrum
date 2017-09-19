// @flow
// $FlowFixMe
import styled from 'styled-components';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { zIndex } from '../../components/globals';

export const Container = styled.div`
  display: flex;
  flex: auto;
  align-self: stretch;
  overflow-y: hidden;
  padding: 32px 32px 0;
`;

export const Thread = styled.div`
  display: flex;
  background: #fff;
  flex: auto;
  z-index: ${zIndex.slider + 3};
  flex-direction: column;
  max-width: 100%;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 0 0 1px ${props => props.theme.border.default};

  @media (max-width: 768px) {
    top: -48px;
    width: 100%;
  }
`;
