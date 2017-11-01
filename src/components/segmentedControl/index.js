// @flow
import styled, { css } from 'styled-components';
import { FlexRow } from '../globals';

export const SegmentedControl = styled(FlexRow)`
  align-self: stretch;
  margin: 0 32px;
  margin-top: 16px;
  border-bottom: 2px solid ${props => props.theme.bg.border};
  align-items: stretch;
  min-height: 48px;

  @media (max-width: 768px) {
    background-color: ${props => props.theme.bg.default};
    align-self: stretch;
    margin: 0;
    margin-bottom: 2px;
  }
`;

export const Segment = styled(FlexRow)`
  padding: 8px 24px;
  justify-content: center;
  align-items: center;
  text-align: center;
  line-height: 1;
  font-size: 18px;
  font-weight: 500;
  color: ${props =>
    props.selected ? props.theme.text.default : props.theme.text.alt};
  cursor: pointer;
  position: relative;
  top: 2px;
  border-bottom: 2px solid
    ${props => (props.selected ? props.theme.text.default : 'transparent')};

  ${'' /* ${props =>
    props.selected &&
    css`
      border-bottom: 2px solid ${props => props.theme.bg.reverse};
    `}; */} &:hover {
    color: ${props => props.theme.text.default};
  }

  @media (max-width: 768px) {
    flex: auto;
    justify-content: space-around;
    margin-top: 32px;
    text-align: left;
    justify-content: flex-start;
    border-bottom: 0;

    &:not(:first-of-type) {
      display: none;
    }
  }
`;
