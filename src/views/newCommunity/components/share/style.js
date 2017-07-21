// @flow
// $FlowFixMe
import styled from 'styled-components';

export const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-wrap: wrap;
  margin-top: 16px;
  justify-content: center;

  a,
  button {
    margin-top: 16px;
  }

  a:first-of-type,
  button:first-of-type {
    margin-left: 0;
    margin-right: 16px;
  }

  a > button:first-of-type {
    margin: 0;
  }
`;

export const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-wrap: wrap;
  margin: 16px;
  justify-content: center;
  position: relative;
  max-width: 100%;
`;

export const Input = styled.div`
  padding: 4px 12px;
  border-radius: 8px;
  border: 2px solid ${props => props.theme.border.default};
  background: #fff;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  padding-right: 72px;
  position: relative;
  display: flex;
  align-self: center;
  max-width: 100%;
  z-index: 2;

  &:hover {
    cursor: pointer;

    &:after {
      background: ${props => props.theme.bg.wash};
    }
  }

  &:after {
    content: 'COPY';
    font-size: 11px;
    font-weight: 600;
    color: ${props => props.theme.brand.default};
    text-transform: uppercase;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    padding: 4px 12px;
    border-left: 2px solid ${props => props.theme.border.default};
    border-radius: 0 8px 8px 0;
    z-index: 3;
  }
`;
