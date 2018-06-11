// @flow
import styled from 'styled-components/native';

export const ThreadAnchorText = styled.Text`
  color: ${props => props.theme.brand.alt};
  font-weight: 500;
`;

export const MessageAnchorText = styled.Text`
  color: ${props => props.theme.text.default};
  font-weight: 700;
`;
