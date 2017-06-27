// @flow
import styled from 'styled-components';

export const EmailListItem = styled.div`
  padding: 8px 0 16px;
  border-bottom: 2px solid ${props => props.theme.bg.wash};

  &:last-of-type {
    border-bottom: none;
  }

  > label > div {
    align-items: center;
  }

  input {
    margin-right: 8px;
  }
`;
