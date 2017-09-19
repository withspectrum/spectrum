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
  box-shadow: 0 0 0 1px ${props => props.theme.bg.border};
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
  background: #fff;
  flex: auto;
  z-index: ${zIndex.slider + 3};
  flex-direction: column;
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 0 0 1px ${props => props.theme.bg.border};
  align-items: center;
  justify-content: center;

  button {
    padding: 16px 24px;
    font-size: 18px;
    font-weight: 600;
  }
`;

export const Illo = styled.div`
  background-image: url('/img/discover.svg');
  width: 250px;
  height: 360px;
  -webkit-filter: grayscale(50%);
  filter: grayscale(50%);
  background-repeat: no-repeat;
  opacity: 0.2;
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
