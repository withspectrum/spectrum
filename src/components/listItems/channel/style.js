// @flow
import styled from 'styled-components';
import { Truncate } from 'src/components/globals';
import Link from 'src/components/link';

export const ChannelContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1 0 auto;
  justify-content: space-between;
  color: ${props => props.theme.text.secondary};

  border-top: 1px solid ${props => props.theme.bg.wash};

  &:first-of-type {
    border-top: 0;
  }

  &:hover {
    color: ${props => props.theme.text.default};
  }

  .icon {
    color: ${props => props.theme.text.alt};
  }
`;

export const ChannelNameLink = styled(Link)`
  display: flex;
  align-items: center;
  flex: 1 0 auto;
  padding: 8px 16px;
`;

export const ChannelName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text.default};

  ${Truncate};
`;
