// @flow
import styled from 'styled-components';

export const Bar = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 32px;
  justify-items: center;
  align-items: center;
  background: ${props =>
    props.color ? props.theme[props.color].default : 'transparent'};
  color: ${props => (props.color ? props.theme.text.reverse : 'rgba(0,0,0,0)')};
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.5px;
  line-height: 1;
`;
