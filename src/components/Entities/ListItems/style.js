// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { Truncate } from 'src/components/globals';

export const Row = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 12px;
  flex: 1 1 auto;
  background: ${theme.bg.default};
  border-bottom: 1px solid ${theme.bg.divider};

  &:hover {
    background: ${theme.bg.wash};
    cursor: pointer;
  }
`;

export const UserAvatarContainer = styled.div`
  margin-right: 12px;
  height: 40px;
`;

export const CommunityAvatarContainer = styled.div`
  margin-right: 12px;
  height: 32px;
`;

export const Content = styled.div`
  display: flex;
  flex: 1 1 auto;
  max-width: 100%;
  flex-direction: column;
  justify-content: center;
  align-self: center;
`;

export const Label = styled.div`
  color: ${theme.text.default};
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  display: inline-block;
  ${Truncate};

  .icon {
    color: ${theme.text.secondary};
    margin-right: 6px;
    position: relative;
    top: 1px;
  }
`;

export const Sublabel = styled.span`
  font-size: 15px;
  color: ${theme.text.alt};
  font-weight: 400;
  line-height: 1.2;
  display: inline-block;
  ${Truncate};
`;

export const Description = styled.p`
  font-size: 15px;
  line-height: 1.3;
  color: ${theme.text.default};
  margin-top: 6px;
  padding-right: 24px;
`;

export const MessageIcon = styled.div`
  color: ${theme.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${theme.text.default};
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
  color: ${theme.text.alt};
`;
