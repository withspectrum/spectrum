// @flow
import styled from 'styled-components';
import { hexa } from 'src/components/globals';

export const SlackChannelRow = styled.div`
  display: flex;
  align-items: center;
  margin: 0 -16px;
  width: calc(100% + 32px);
  padding: 12px 16px;

  &:nth-of-type(odd) {
    background: ${props => hexa(props.theme.bg.wash, 0.8)};
  }
`;

export const ChannelName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text.default};
  flex: 1 0 auto;
`;

export const StyledSelect = styled.div`
  border: 1px solid ${props => props.theme.bg.border};
  border-radius: 4px;
  overflow: hidden;
`;

export const Select = styled.select`
  padding: 4px 12px;
  width: 130%;
  border: none;
  box-shadow: none;
  background: ${props => props.theme.bg.default};
  background-image: none;
  -webkit-appearance: none;
  font-weight: 400;
  font-size: 14px;
  color: ${props => props.theme.text.default};
`;

export const SendsTo = styled.div`
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  flex: none;
  margin-right: 12px;
`;
export const ChannelListContainer = styled.div`
  margin-top: 16px;
  margin-bottom: -16px;
`;
