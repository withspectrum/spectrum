// @flow
import styled from 'styled-components/native';

export const InputWrapper = styled.ScrollView`
  height: 100%;
`;

export default styled.View`
  height: 100%;
  background-color: ${props => props.theme.bg.default};
  padding: 16px;
`;
