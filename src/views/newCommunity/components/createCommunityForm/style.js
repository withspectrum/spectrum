// @flow
import styled, { css } from 'styled-components';
import { FlexCol } from '../../../../components/globals';

export const ImageInputWrapper = styled(FlexCol)`
  position: relative;
  flex: 0 0 auto;
  margin-top: 8px;
  margin-bottom: 24px;

  > label:nth-of-type(2) {
    position: absolute;
    bottom: -24px;
    left: 24px;
  }
`;

export const Spacer = styled.div`
  height: ${props => (props.height ? `${props.height}px` : 'auto')};
  width: ${props => (props.width ? `${props.width}px` : 'auto')};
  display: block;
`;

export const CommunitySuggestionsText = styled.p`
  margin: 16px 0px 8px;
  font-size: 14px;
  color: ${props => props.theme.text.default};
`;

export const CommunitySuggestionsWrapper = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0 0 24px;
`;

export const CommunitySuggestion = styled.li`
  padding: 8px 12px;
  font-size: 14px;
  background: ${props => props.theme.bg.wash};
  color: ${props => props.theme.text.alt};
  border-left: 1px solid ${props => props.theme.bg.border};
  border-right: 1px solid ${props => props.theme.bg.border};
  display: flex;
  align-items: center;

  strong {
    margin-left: 8px;
    margin-right: 8px;
    font-weight: 500;
  }

  &:hover {
    color: ${props => props.theme.text.default};
  }

  &:first-of-type {
    padding-top: 8px;
    border-top: 1px solid ${props => props.theme.bg.border};
  }

  &:last-of-type {
    padding-bottom: 8px;
    border-bottom: 1px solid ${props => props.theme.bg.border};
  }
`;

export const PrivacySelector = styled.div`
  display: flex;
  border-radius: 4px;
  border: 2px solid ${props => props.theme.bg.border};
  margin-top: 16px;
  overflow: hidden;
`;

export const PrivacyOption = styled.label`
  display: flex;
  flex-direction: column;
  flex: 1 0 50%;
  padding: 16px;
  background: ${props =>
    props.selected ? props.theme.bg.default : props.theme.bg.wash};
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    border-radius: 24px;
    border: 2px solid ${props => props.theme.bg.border};
  }

  input:checked {
    box-shadow: inset 0 0 0 4px ${props => props.theme.brand.alt};
    border: 2px solid ${props => props.theme.brand.alt};
  }

  ${props =>
    props.selected
      ? css`
          p {
            color: ${props.theme.text.default};
          }
        `
      : css`
          p {
            color: ${props.theme.text.alt};
          }
        `} &:first-of-type {
    border-right: 2px solid ${props => props.theme.bg.border};
  }
`;

export const PrivacyOptionLabel = styled.p`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;

  input {
    margin-right: 8px;
  }
`;

export const PrivacyOptionText = styled.p`
  font-size: 14px;
  font-weight: 400;
  margin-top: 8px;
  line-height: 1.4;
`;
