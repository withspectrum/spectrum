// @flow
// $FlowFixMe
import styled from 'styled-components';

export const FillSpaceError = styled.div`
  display: flex;
  flex: auto;
  background: ${props => props.theme.bg.default};
  justify-content: center;
  align-items: center;
  flex-direction: column;
  align-self: stretch;
  text-align: center;
  padding: ${props => (props.small ? '16px 12px' : '32px 24px')};
  border-radius: 12px;
`;

export const LargeEmoji = styled.span`
  text-align: center;
  display: block;
  font-size: ${props => (props.small ? '32px' : '56px')};
  margin-bottom: ${props => (props.small ? '16px' : '24px')};
  line-height: 1;
`;

export const Heading = styled.h3`
  font-size: ${props => (props.small ? '18px' : '24px')};
  font-weight: ${props => (props.small ? '500' : '600')};
  color: ${props => props.theme.text.default};
  max-width: 600px;
  margin-bottom: 8px;
`;

export const Subheading = styled.h4`
  font-size: ${props => (props.small ? '14px' : '18px')};
  font-weight: ${props => (props.small ? '400' : '500')};
  line-height: 1.4;
  color: ${props => props.theme.text.alt};
  max-width: 540px;
  margin-bottom: 32px;
`;
