// @flow
import styled from 'styled-components';
import { Button } from 'src/components/button';

export const CurrentCount = styled.b`
  font-size: 14px;
`;

export const LikeButtonWrapper = styled(Button)`
  position: relative;
  padding-right: 48px;
  color: ${props =>
    props.hasReacted ? props.theme.brand.default : props.theme.text.secondary};

  div + span {
    margin: 0;
    margin-left: 8px;
  }

  ${CurrentCount} {
    background: ${props => props.theme.bg.wash};
    border-left: 1px solid ${props => props.theme.bg.border};
    padding: 12px;
    margin-left: 12px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    color: ${props =>
      props.hasReacted
        ? props.theme.brand.default
        : props.theme.text.secondary};
    position: absolute;
    right: 0;
    height: 100%;
  }
`;

export const LikeCountWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};

  span {
    margin-left: 4px;
    font-weight: 600;
  }
`;
