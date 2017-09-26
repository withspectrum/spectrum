// @flow
// $FlowFixMe
import styled from 'styled-components';

export const StyledHeading = styled.h1`
  font-size: ${props => props.theme.typeSize[props.size]};
  font-weight: ${props => props.theme.typeWeight[props.weight]}
  color: ${props =>
    props.overrideColor ? props.overrideColor : props.theme.text.default};
  display: block;
`;
