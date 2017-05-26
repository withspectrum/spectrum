import styled from 'styled-components';
import {
  FlexRow,
  FlexCol,
  H1,
  H2,
  Span,
  P,
  Transition,
  hexa,
} from '../globals';

export const Plans = styled(FlexRow)`
  align-items: stretch;
`;

export const Plan = styled(FlexCol)`
  flex: 1;
  align-items: stretch;
  padding: 16px 0;
  padding-right: 8px;
  margin-right: 8px;
  padding-left: 8px;
  border-radius: 12px;
  transition: ${Transition.hover.off};

  border: 2px solid ${props => (props.currentPlan ? props.theme.success.default : 'transparent')};

  h2 {
    color: ${props => (props.currentPlan ? props.theme.success.default : props.theme.text.alt)};
  }

  + div {
    padding-right: 8px;
    padding-left: 8px;
    margin-left: 8px;
  }

  &:hover {
    border-color: ${props => (props.currentPlan ? hexa(props.theme.success.default, 0.5) : hexa(props.theme.success.default, 0.125))};
    transition: ${Transition.hover.on};
    cursor: pointer;
  }
`;

export const Title = styled(H1)`
  text-align: center;
  font-weight: 700;
`;

export const Cost = styled(FlexCol)`
  align-items: center;
  text-align: center;
  justify-content: flex-end;
  flex: 0 0 160px;
`;

export const CostNumber = styled(H2)`
  margin-top: 32px;
  font-size: 72px;
  letter-spacing: -2px;
  vertical-align: baseline;
  position: relative;

  &:before {
    content: '$';
    vertical-align: top;
    position: absolute;
    top: 16px;
    right: calc(100% + 2px);
    font-weight: 400;
    font-size: 20px;
    letter-spacing: normal;
    color: ${({ theme }) => theme.text.placeholder};
  }

  &:after {
    content: ${props => (props.per ? `'/ ${props.per}'` : `''`)};
    color: ${({ theme }) => theme.text.placeholder};
    position: absolute;
    font-size: 14px;
    white-space: nowrap;
    left: calc(100% + 4px);
    bottom: 16px;
    font-weight: 500;
    letter-spacing: normal;
  }
`;

export const CostPer = styled(Span)`
  color: ${({ theme }) => theme.text.placeholder};
  position: relative;
  left: -12px;
  font-weight: 500;
  letter-spacing: normal;
`;

export const CostSubtext = styled(FlexCol)`
  color: ${({ theme }) => theme.text.default};
  margin-top: 8px;
  flex: 0 0 48px;
  justify-content: flex-start;
  font-size: 14px;
  font-weight: 700;
`;

export const Description = styled(P)`
  flex: 0 0 132px;
  margin: 16px 0;
  border-top: 2px solid ${({ theme }) => theme.bg.wash};
  border-bottom: 2px solid ${({ theme }) => theme.bg.wash};
  padding: 16px 8px;
`;

export const FeatureList = styled.ul`
  padding-left: 24px;
`;

export const Feature = styled.li`
  font-size: 14px;
  font-weight: 500;

  + li {
    margin-top: 8px;
  }
`;
