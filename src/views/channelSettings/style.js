// @flow
import theme from 'shared/theme';
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
    color: ${theme.text.reverse};
    background: ${theme.text.alt};
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 700;
  }

  &:hover {
    &:after {
      background: ${theme.success.alt};
    }
  }
`;

export const MessageIconContainer = styled.div`
  color: ${theme.text.alt};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    color: ${theme.brand.alt};
  }
`;

export const UserListItemContainer = styled.div`
  border-bottom: 1px solid ${theme.bg.wash};

  &:last-of-type {
    border-bottom: none;
  }
`;
