import styled from 'styled-components';
import Card from '../../components/card';
import { Link } from 'react-router-dom';
import { FlexCol, H1, H2, H3, Span } from '../../components/globals';

export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid ${props => props.theme.border.default};
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

export const StyledCard = styled(Card)`padding: 16px 16px 16px 20px;`;

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
    ${props =>
      props.error ? props.theme.warn.default : props.theme.border.default};
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
  fontSize: '16px',
};

export const Title = styled(H1)`font-size: 20px;`;

export const Pitch = styled(FlexCol)`margin: 0 0 32px 0;`;

export const PitchItem = styled(FlexCol)`
  display: inline-block;
  font-size: 14px;
  line-height: 1.4;

  div {
    font-size: 32px;
    text-align: center;
    align-self: center;
  }

  p {
    margin-top: 8px;
    text-align: center;
  }

  b {
    font-weight: 700;
  }

  & + & {
    margin-top: 16px;
  }
`;

export const Cost = styled(FlexCol)`
  align-items: center;
  text-align: center;
  justify-content: flex-end;
  flex: none;
`;

export const CostNumber = styled(H2)`
  margin-top: 16px;
  font-size: 44px;
  letter-spacing: -2px;
  vertical-align: baseline;
  position: relative;
  left: -16px;
  color: ${props => props.theme.text.default};

  &:before {
    content: '$';
    vertical-align: top;
    position: absolute;
    top: 16px;
    right: calc(100% + 2px);
    font-weight: 400;
    font-size: 20px;
    letter-spacing: normal;
    color: ${({ theme }) => theme.text.alt};
  }

  &:after {
    content: ${props => (props.per ? `'/ ${props.per}'` : `''`)};
    color: ${({ theme }) => theme.text.alt};
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
  color: ${({ theme }) => theme.text.alt};
  position: relative;
  left: -12px;
  font-weight: 500;
  letter-spacing: normal;
`;

export const CostSubtext = styled(FlexCol)`
  color: ${({ theme }) => theme.text.alt};
  flex: none;
  margin-bottom: 24px;
  justify-content: flex-start;
  font-size: 14px;
  font-weight: 500;
`;
