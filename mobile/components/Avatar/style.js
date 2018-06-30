import styled from 'styled-components/native';

export const AvatarImage = styled.Image`
  background-color: transparent;
  width: ${props => (props.size ? `${props.size}px` : '30px')};
  height: ${props => (props.size ? `${props.size}px` : '30px')};
  border-radius: ${props =>
    props.radius ? `${props.radius}px` : `${props.size / 2}px`};
`;
