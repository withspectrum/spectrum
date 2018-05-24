import styled from 'styled-components/native';

export const AvatarImage = styled.Image`
  background-color: ${props => props.theme.bg.border};
  width: ${props => (props.size ? `${props.size}px` : '30px')};
  height: ${props => (props.size ? `${props.size}px` : '30px')};
  border-radius: ${props => (props.size ? `${props.size / 2}px` : '15px')};
`;
