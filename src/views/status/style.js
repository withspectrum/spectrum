// @flow
import styled from 'styled-components';
import { hexa } from 'src/components/globals';

export const Bar = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 40px;
  justify-items: center;
  align-items: center;
  background: ${props =>
    props.color ? hexa(props.theme[props.color].default, 0.1) : 'transparent'};
  color: ${props =>
    props.color ? props.theme[props.color].default : 'rgba(0,0,0,0)'};
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.5px;
  line-height: 1;
`;
