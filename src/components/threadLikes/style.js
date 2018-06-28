// @flow
import styled from 'styled-components';

export const CurrentCount = styled.span`
  font-size: 14px;
`;

const LikeWrapper = styled.div`
  display: flex;
  flex: none;
  align-items: center;
`;

export const LikeButtonWrapper = styled(LikeWrapper)`
  min-width: 48px;
  display: flex;
  justify-content: center;
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
    margin-right: 8px;
    margin-left: 4px;
    font-weight: 600;
    color: ${props => props.theme.text.alt};
  }
`;

export const LikeCountWrapper = styled(LikeWrapper)`
  margin-right: 12px;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};

  span {
    margin-left: 4px;
    font-weight: 600;
  }
`;
