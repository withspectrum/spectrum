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
  height: 100%;
  max-height: 100%;
  position: relative;
`;

export const Thread = styled.div`
  display: flex;
  background: #fff;
  flex: auto;
  z-index: ${zIndex.chrome - 1};
  flex-direction: column;
  max-width: 100%;
`;

export const NullContainer = styled.div`
  display: flex;
  flex: auto;
  align-self: stretch;
  overflow-y: hidden;
  padding: 32px;
  height: 100%;
`;

export const NullThread = styled.div`
  display: flex;
  flex: auto;
  z-index: ${zIndex.slider + 3};
  flex-direction: column;
  max-width: 100%;
  border-radius: 8px;
  align-items: center;
  justify-content: center;

  button {
    padding: 16px 24px;
    font-size: 18px;
    font-weight: 600;
  }
`;

export const Heading = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  margin: 48px 24px 16px;
  text-align: center;
`;

export const Subheading = styled.h4`
  font-size: 18px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
  margin: 0 48px 32px;
  max-width: 600px;
  text-align: center;
`;
