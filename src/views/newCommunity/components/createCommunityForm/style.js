// @flow
// $FlowFixMe
import styled from 'styled-components';
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
