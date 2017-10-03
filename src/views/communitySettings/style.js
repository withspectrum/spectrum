import styled from 'styled-components';
import Card from '../../components/card';
import { Link } from 'react-router-dom';
import { FlexCol, H1, H2, H3, Span } from '../../components/globals';

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
  display: ${props => (props.hideOnMobile ? 'none' : 'flex')};
  flex: 1 1 50%;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 4px;
  border: 2px solid
    ${props =>
      props.error ? props.theme.warn.default : props.theme.bg.border};
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

export const View = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-self: stretch;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SectionsContainer = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-wrap: wrap;
  padding: 8px;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  flex: 1 0 33%;

  @media (max-width: 768px) {
    flex: 1 0 100%;
    padding-top: 0;
    padding-bottom: 0;

    &:first-of-type {
      padding-top: 8px;
    }
  }
`;

export const SectionCard = styled.div`
  border-radius: 4px;
  border: 1px solid ${props => props.theme.bg.border};
  background: ${props => props.theme.bg.default};
  margin-bottom: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

export const SectionCardFooter = styled.div`
  border-top: 1px solid ${props => props.theme.bg.border};
  width: 100%;
  padding: 16px 0 0;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const SectionSubtitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  margin-bottom: 8px;
`;

export const Heading = styled.h1`
  margin-left: 16px;
  font-size: 32px;
  color: ${props => props.theme.text.default};
  font-weight: 600;
`;

export const Subheading = styled.h3`
  margin-left: 16px;
  font-size: 16px;
  color: ${props => props.theme.text.alt};
  font-weight: 400;
  line-height: 1;
  margin-bottom: 8px;
`;

export const StyledHeader = styled.div`
  display: flex;
  padding: 32px;
  border-bottom: 1px solid ${props => props.theme.bg.border};
  background: ${props => props.theme.bg.default};
  width: 100%;
  align-items: center;
  flex: none;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const StyledSubnav = styled.div`
  display: flex;
  padding: 0 32px;
  border-bottom: 1px solid ${props => props.theme.bg.border};
  background: ${props => props.theme.bg.default};
  width: 100%;
  flex: none;

  @media (max-width: 768px) {
    padding: 0 16px;
    display: block;
    justify-content: center;
  }
`;

export const SubnavList = styled.ul`
  list-style-type: none;
  display: flex;
  align-items: center;
`;

export const SubnavListItem = styled.li`
  position: relative;
  top: 1px;
  border-bottom: 1px solid
    ${props => (props.active ? props.theme.text.default : 'transparent')};
  color: ${props =>
    props.active ? props.theme.text.default : props.theme.text.alt};
  font-weight: ${props => (props.active ? '500' : '400')};

  &:hover {
    color: ${props => props.theme.text.default};
  }

  a {
    padding: 16px;
    display: inline-block;
  }
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
