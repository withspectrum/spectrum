// @flow
import theme from 'shared/theme';
import styled from 'styled-components';
import { MEDIA_BREAK } from 'src/components/layout';

export const View = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-self: stretch;

  @media (max-width: ${MEDIA_BREAK}px) {
    width: 100%;
  }
`;

export const SectionsContainer = styled.div`
  display: flex;
  flex: 0 1 auto;
  flex-wrap: wrap;
  padding: 8px;
  justify-content: center;
  align-items: flex-start;

  @media (max-width: ${MEDIA_BREAK}px) {
    padding: 8px 0;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  flex: 1 0 ${props => (props.fullWidth ? '100%' : '33%')};
  max-width: ${props => (props.fullWidth ? '1200px' : '600px')};

  @media (max-width: ${MEDIA_BREAK}px) {
    flex: 1 0 100%;
    padding: 0;
    max-width: 100%;

    &:first-of-type {
      padding-top: 8px;
    }
  }
`;

export const SectionCard = styled.div`
  border-radius: 4px;
  border: 1px solid ${theme.bg.border};
  background: ${theme.bg.default};
  margin-bottom: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  @media (max-width: ${MEDIA_BREAK}px) {
    border-radius: 0;
  }
`;

export const SectionCardFooter = styled.div`
  border-top: 1px solid ${theme.bg.border};
  width: calc(100% + 32px);
  margin: 16px -16px 0;
  padding: 16px 16px 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const SectionSubtitle = styled.h4`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.text.alt};
  margin-bottom: 4px;

  a {
    color: ${theme.brand.alt};
  }
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.text.default};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
`;

export const SectionTitleWithIcon = styled(SectionTitle)`
  .icon {
    margin-right: 12px;
  }
`;

export const Heading = styled.h1`
  margin-left: 16px;
  font-size: 32px;
  color: ${theme.text.default};
  font-weight: 600;
  line-height: 1;
`;

export const Subheading = styled.h3`
  margin-left: 16px;
  font-size: 16px;
  color: ${theme.text.alt};
  font-weight: 400;
  line-height: 1.3;

  &:hover {
    color: ${theme.brand.alt};
  }
`;

export const StyledHeader = styled.div`
  display: flex;
  padding: 32px;
  border-bottom: 1px solid ${theme.bg.border};
  background: ${theme.bg.default};
  width: 100%;
  align-items: center;
  flex: none;

  @media (max-width: ${MEDIA_BREAK}px) {
    display: none;
  }
`;

export const StyledSubnav = styled.div`
  display: flex;
  padding: 0 32px;
  border-bottom: 1px solid ${theme.bg.border};
  background: ${theme.bg.default};
  width: 100%;
  flex: none;

  @media (max-width: ${MEDIA_BREAK}px) {
    padding: 0 16px;
    display: block;
    justify-content: center;
    overflow-x: scroll;
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
    color: ${theme.text.default};
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

export const GrowthText = styled.span`
  color: ${props =>
    props.positive
      ? props.theme.success.default
      : props.negative
      ? props.theme.warn.alt
      : props.theme.text.alt};
  display: inline-block;
  margin-right: 6px;
  font-size: 14px;
`;

export const MessageIcon = styled.div`
  color: ${theme.brand.alt};
  cursor: pointer;
`;

export const EditDropdownContainer = styled.div`
  position: relative;
  color: ${theme.text.secondary};
  cursor: pointer;
  display: flex;
  padding-top: 16px;
`;

export const Dropdown = styled.div`
  border-radius: 4px;
  border: 1px solid ${theme.bg.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1000;
  background: ${theme.bg.default};
  width: 320px;
  overflow: hidden;
`;

export const DropdownSectionDivider = styled.div`
  width: 100%;
  height: 8px;
  background: ${theme.bg.wash};
  border-top: 1px solid ${theme.bg.border};
  border-bottom: 1px solid ${theme.bg.border};
`;

export const DropdownSection = styled.div`
  padding: 12px 8px;
  background: ${theme.bg.default};
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid ${theme.bg.border};

  .icon {
    margin-right: 8px;
  }

  &:hover {
    background: ${theme.bg.wash};
  }
`;

export const DropdownSectionText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const DropdownSectionTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.text.default};
  line-height: 1.3;
`;

export const DropdownSectionSubtitle = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: ${theme.text.alt};
  line-height: 1.2;
`;

export const DropdownAction = styled.div`
  display: flex;
  flex: 0 0 48px;
  align-items: center;
  justify-content: center;
  position: relative;
`;
