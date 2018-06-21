import styled from 'styled-components';

export const CurrentCount = styled.span`
  font-size: 1em;
`;

export const LikeWrapper = styled.div`
  display: flex;
  flex: none;
  align-items: center;

  > button {
    color: ${props =>
      props.hasReacted ? props.theme.brand.alt : props.theme.text.alt};
    transition: transform 0.2s ease-in-out;

    &:hover {
      color: ${props =>
        props.hasReacted ? props.theme.warn.alt : props.theme.brand.alt};
      transition: color 0.3s ease-in-out;
    }
  }

  ${CurrentCount} {
    margin-left: 4px;
    font-weight: 500;
    color: ${props =>
      props.hasReacted ? props.theme.text.default : props.theme.text.alt};
  }
`;
