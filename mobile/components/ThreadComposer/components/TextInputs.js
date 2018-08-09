// @flow
import styled from 'styled-components/native';

export const TitleTextInput = styled.TextInput`
  font-size: 24px;
  padding: 0px;
  font-weight: 800;
  width: 100%;
  color: ${props => props.theme.text.default};
  height: 34px;
`;

export const BodyTextInput = styled.TextInput`
  font-size: 16px;
  line-height: 24px;
  color: ${props => props.theme.text.default};
`;
