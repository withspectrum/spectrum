import styled from 'styled-components';
import { Tooltip } from '../globals';

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
  justify-content: center;

  @media (max-width: 768px) {
    padding: 8px 0;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  flex: 1 0 33%;
  max-width: 600px;

  @media (max-width: 768px) {
    flex: 1 0 100%;
    padding: 0;

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

  @media (max-width: 768px) {
    border-radius: 0;
  }
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
  line-height: 1;
`;

export const Subheading = styled.h3`
  margin-left: 16px;
  font-size: 16px;
  color: ${props => props.theme.text.alt};
  font-weight: 400;
  line-height: 1.3;

  &:hover {
    color: ${props => props.theme.brand.alt};
  }
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
