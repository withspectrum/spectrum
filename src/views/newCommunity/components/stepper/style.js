// @flow
// $FlowFixMe
import styled from 'styled-components';
import { zIndex } from '../../../../components/globals';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 24px;
`;

export const Line = styled.span`
  position: absolute;
  height: 2px;
  background: ${props => props.theme.border.default};
  top: 50%;
  left: 24px;
  right: 24px;
  transform: translateY(-50%);
  z-index: ${zIndex.base};
`;

export const Step = styled.div`
  width: 32px;
  height: 32px;
  font-size: 16px;
  color: ${props =>
    props.active ? props.theme.brand.default : props.theme.text.alt};
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  border: 2px solid
    ${props =>
      props.active ? props.theme.brand.default : props.theme.border.default};
  box-shadow: 0 0 0 4px #fff;
  font-weight: 700;
  z-index: ${zIndex.base + 1};
  position: relative;
`;
