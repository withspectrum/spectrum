// @flow
import styled from 'styled-components';

export const SlackChannelRow = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;

  &:nth-of-type(2n) {
    border-top: 1px solid ${props => props.theme.bg.border};
    border-bottom: 1px solid ${props => props.theme.bg.border};
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
  background: transparent;
  background-image: none;
  -webkit-appearance: none;
  font-weight: 400;
  font-size: 14px;
  color: ${props => props.theme.text.alt};
`;
