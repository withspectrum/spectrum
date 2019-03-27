// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { MEDIA_BREAK } from 'src/components/layout';

export const EmailInviteForm = styled.div`
  display: flex;
  align-items: center;

  &:first-of-type {
    margin-top: 16px;
  }
`;

export const EmailInviteInput = styled.input`
  display: flex;
  flex: 1 1 50%;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 4px;
  border: 2px solid
    ${props => (props.error ? props.theme.warn.default : props.theme.bg.border)};
  margin-bottom: 8px;
  margin-top: 8px;
  margin-left: 4px;
  margin-right: 4px;

  &:first-of-type {
    margin-left: 0;
  }

  &:last-of-type {
    margin-right: 0;
  }

  &:focus {
    border: 2px solid ${theme.brand.default};
  }

  @media screen and (max-width: ${MEDIA_BREAK}px) {
    display: ${props => (props.hideOnMobile ? 'none' : 'auto')};
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const Action = styled.button`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 8px;
  background: ${theme.bg.wash};
  margin-top: 8px;
  margin-bottom: ${props => props.mb || '16px'};
  font-size: 14px;
  color: ${theme.text.alt};
  font-weight: 500;
  border-radius: 4px;

  .icon {
    margin-right: 4px;
  }

  &:hover {
    color: ${theme.text.secondary};
    cursor: pointer;
  }
`;

export const ActionAsLabel = Action.withComponent('label');

export const ActionHelpText = styled.div`
  color: ${theme.text.alt};
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
  margin-bottom: 24px;
`;

export const RemoveRow = styled.div`
  margin-left: 4px;
  color: ${theme.text.alt};

  &:hover {
    cursor: pointer;
    color: ${theme.text.default};
  }
`;

export const CustomMessageToggle = styled.h4`
  font-size: 14px;
  color: ${theme.text.alt};
  margin-top: 16px;

  &:hover {
    color: ${theme.brand.default};
    cursor: pointer;
  }

  div {
    position: relative;
    top: 5px;
    margin-right: 4px;
  }
`;

export const FileUploadWrapper = styled.div`
  margin-right: 16px;
`;

export const CustomMessageTextAreaStyles = {
  width: '100%',
  borderRadius: '8px',
  padding: '16px',
  marginTop: '8px',
  fontSize: '14px',
};
