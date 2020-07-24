// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { Truncate } from 'src/components/globals';

export const MentionsInputStyle = {
  overflow: 'visible',
  suggestions: {
    zIndex: 99999,
    list: {
      backgroundColor: theme.bg.default,
      boxShadow: '1px 0 12px rgba(0,0,0,0.12)',
      borderRadius: '4px',
      overflow: 'hidden',
    },
  },
};

export const StyledMentionSuggestion = styled.div`
  display: flex;
  padding: 8px 12px;
  align-items: center;
  background: ${props => (props.focused ? theme.brand.wash : theme.bg.default)};
  min-width: 156px;
  line-height: 1.3;
  border-bottom: 1px solid ${theme.bg.border};
`;

export const MentionContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MentionName = styled.span`
  margin-left: 12px;
  width: calc(184px - 62px);
  ${Truncate};
  font-size: 14px;
  font-weight: 500;
  color: ${props => (props.focused ? theme.brand.default : theme.text.default)};
`;

export const MentionUsername = styled.span`
  margin-left: 12px;
  font-size: 13px;
  font-weight: 400;
  width: calc(184px - 62px);
  ${Truncate};
  color: ${props => (props.focused ? theme.brand.default : theme.text.alt)};
`;
