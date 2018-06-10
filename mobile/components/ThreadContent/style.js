// @flow
import styled from 'styled-components/native';

export const BodyText = styled.Text`
  margin-top: ${16 * 1.25}px;
  font-size: 16px;
  font-weight: ${props => (props.bold ? 700 : 500)};
  line-height: 24;
  color: ${props => props.theme.text.default};
  font-style: ${props => (props.italic ? 'italic' : 'normal')};
  text-decoration-line: ${props => (props.underline ? 'underline' : 'none')};
`;

export const HeaderOne = styled.Text`
  margin-top: ${20 * 1.25}px;
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  line-height: 30;
`;

export const HeaderTwo = styled.Text`
  margin-top: ${18 * 1.25}px;
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  line-height: 26;
`;
