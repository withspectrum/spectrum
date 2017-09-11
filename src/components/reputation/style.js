// @flow
import styled from 'styled-components';

export const ReputationIcon = styled.span`
  position: relative;
  display: inline-block;
  width: 24px;

  span:first-child {
    z-index: 2;
    top: 6px;
  }

  span: last-child {
    left: 5px;
    top: 6px;
    z-index: 1;
  }
`;

export const ReputationIconMini = styled.span`
  position: relative;
  display: inline-block;
  width: 20px;

  span {
    top: -10px;
    background: ${props => props.theme.text.alt};
  }

  &:hover {
    span {
      background: ${props => props.theme.brand.default};
    }
  }

  span:first-child {
    z-index: 2;
  }

  span: last-child {
    left: 5px;
    z-index: 1;
  }
`;

export const Circle = styled.span`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 12px;
  background: ${props => props.theme.brand.default};
  border: 2px solid ${props => props.theme.bg.default};
`;
