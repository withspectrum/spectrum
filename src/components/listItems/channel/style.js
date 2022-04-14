// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { Truncate } from 'src/components/globals';
import { Link } from 'react-router-dom';

export const ChannelContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  color: ${theme.text.secondary};
  min-width: 0;

  border-top: 1px solid ${theme.bg.wash};

  &:first-of-type {
    border-top: 0;
  }

  &:hover {
    color: ${theme.text.default};
  }

  .icon {
    color: ${theme.text.alt};
  }
`;

export const ChannelNameLink = styled(Link)`
  display: flex;
  align-items: center;
  flex: 1;
  padding: 8px 0;
  min-width: 0;
`;

export const ChannelName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.text.default};

  ${Truncate};
`;

export const ChannelActions = styled.div`
  display: flex;
  align-items: center;
  flex: 0 1 auto;
  min-width: 0;

  a {
    display: flex;
    align-items: center;
  }
`;
