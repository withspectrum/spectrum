// @flow
import styled from 'styled-components/native';
import { LinearGradient } from 'expo';

export const Bubble = styled.View`
  border-radius: 16px;
  align-self: ${props => (props.me ? `flex-end` : `flex-start`)};
  /* Android */
  elevation: 10;
  margin-top: 2px;
  margin-bottom: 2px;
  background-color: ${props =>
    props.me ? props.theme.brand.default : props.theme.generic.default};
`;

export const TextWrapper = styled.View`
  flex: 0;
  border-radius: 16px;
  padding: 8px 16px;
`;

export const QuotedParagraph = styled.View`
  border-left-width: 4px;
  border-left-color: ${props => props.theme.bg.border};
  padding-left: 12px;
  margin: 4px 0;
`;

export const QuoteWrapper = styled.View`
  background: ${props => props.theme.bg.default};
  border-radius: ${props => (props.noPadding ? '0' : '12px')};
  padding: ${props => (props.noPadding ? '0' : '8px 12px')};
  margin-left: 4px;
  margin-right: 4px;
  margin-bottom: 0px;
  margin-top: 4px;
  overflow: hidden;
  ${props => (props.expanded ? '' : 'max-height: 100px;')};
`;

export const QuoteGradient = styled(LinearGradient).attrs({
  colors: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'],
})`
  width: 107.5%; /* NOTE(@mxstbr): Magic number, for some reason 100% is too short */
  height: 32px;
  position: absolute;
  bottom: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;
