// @flow
import styled from 'styled-components';

export const TokenInputWrapper = styled.div`
  position: relative;
  cursor: pointer;

  input {
    cursor: pointer;
  }

  &:after {
    content: 'Copy link';
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
    text-transform: uppercase;
    color: ${props => props.theme.text.reverse};
    background: ${props => props.theme.text.alt};
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 700;
  }

  &:hover {
    &:after {
      background: ${props => props.theme.success.alt};
    }
  }
`;

export const MessageIconContainer = styled.div`
  color: ${props => props.theme.text.alt};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.brand.alt};
  }
`;

export const UserListItemContainer = styled.div`
  border-bottom: 1px solid ${props => props.theme.bg.wash};

  &:last-of-type {
    border-bottom: none;
  }
`;
