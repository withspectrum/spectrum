import styled from 'styled-components';
import Card from '../../components/card';
import Link from 'src/components/link';
import { FlexCol, H1, H2, H3, Span, Tooltip } from '../../components/globals';

export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid ${props => props.theme.bg.border};
  padding-bottom: 16px;
`;

export const ListHeading = styled(H3)`
  font-weight: 800;
  font-size: 20px;
  color: ${({ theme }) => theme.text.default};
`;

export const ListContainer = styled(FlexCol)`
  margin: 8px 0 0 0;
  width: 100%;

  a + a {
    border-top: 2px solid ${({ theme }) => theme.bg.wash};
  }
`;

export const MoreLink = styled(Link)`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.brand.alt};
`;

export const StyledCard = styled(Card)`
  padding: 16px 16px 16px 20px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 0 8px;
`;

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
    border: 2px solid ${props => props.theme.brand.default};
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const AddRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 8px;
  background: ${props => props.theme.bg.wash};
  margin-top: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  font-weight: 500;
  border-radius: 4px;

  &:hover {
    color: ${props => props.theme.text.default};
    cursor: pointer;
  }
`;

export const RemoveRow = styled.div`
  margin-left: 4px;
  color: ${props => props.theme.text.alt};

  &:hover {
    cursor: pointer;
    color: ${props => props.theme.text.default};
  }
`;

export const CustomMessageToggle = styled.h4`
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  margin-top: 16px;

  &:hover {
    color: ${props => props.theme.brand.default};
    cursor: pointer;
  }

  div {
    position: relative;
    top: 5px;
    margin-right: 4px;
  }
`;

export const CustomMessageTextAreaStyles = {
  width: '100%',
  borderRadius: '8px',
  padding: '16px',
  marginTop: '8px',
  fontSize: '14px',
};

export const Title = styled(H1)`
  font-size: 20px;
`;

export const View = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-self: stretch;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const GrowthText = styled.h5`
  color: ${props =>
    props.positive
      ? props.theme.success.default
      : props.negative ? props.theme.warn.alt : props.theme.text.alt};
  display: inline-block;
  margin-right: 6px;
  font-size: 14px;
`;

export const MessageIcon = styled.div`
  color: ${props => props.theme.brand.alt};
  cursor: pointer;
  ${Tooltip} top: 2px;
`;

export const Plan = styled.div`
  padding: 24px 0 12px;
`;

export const PlanDescription = styled.h4`
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
  margin-bottom: 8px;
`;

export const PlanTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  margin-bottom: 4px;
`;

export const PlanCost = styled.span`
  font-size: 16px;
  color: ${props => props.theme.text.alt};
  font-weight: 500;
  margin-left: 8px;
`;

export const Highlight = styled.strong`
  color: ${props => props.theme.text.default};
  font-weight: 400;
`;

export const PlanEmoji = styled.span`
  font-size: 16px;
  display: inline-block;
  margin-right: 4px;
`;

export const PlanActions = styled.div`
  padding: 4px 0 8px;
`;
