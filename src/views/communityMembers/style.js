// @flow
import styled, { css } from 'styled-components';
import { TextButton } from '../../components/buttons';

export const Heading = styled.h1`
  margin-left: 16px;
  font-size: 32px;
  color: ${props => props.theme.text.default};
  font-weight: 800;
`;

export const Subheading = styled.h3`
  margin-left: 16px;
  font-size: 16px;
  color: ${props => props.theme.text.alt};
  font-weight: 500;
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
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export const StyledThreadListItem = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.bg.border};
  padding: 16px 0;
  flex-direction: column;

  &:last-of-type {
    border-bottom: 0;
    padding-bottom: 0;
  }
`;
export const ThreadListItemTitle = styled.h4`
  font-size: 16px;
  color: ${props => props.theme.text.default};
  line-height: 1.28;
  font-weight: 500;

  &:hover {
    color: ${props => props.theme.brand.alt};
  }
`;

export const ThreadListItemSubtitle = styled.h5`
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  line-height: 1.28;
  margin-top: 4px;

  a:hover {
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

export const Filters = styled.ul`
  display: flex;
  padding: 8px 0 16px;
  margin: 0 0 16px;
  flex: 1;
  border-bottom: 1px solid ${props => props.theme.bg.border};
`;

export const Filter = styled.li`
  color: ${props =>
    props.active ? props.theme.text.reverse : props.theme.text.alt};
  background: ${props =>
    props.active ? props.theme.brand.alt : props.theme.bg.default};
  font-weight: ${props => (props.active ? 500 : 400)};
  border-radius: 4px;
  margin-right: 8px;
  font-size: 16px;
  list-style-type: none;
  padding: 2px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    ${props =>
      !props.active &&
      css`
        color: ${props => props.theme.text.default};
        background: ${props => props.theme.bg.wash};
      `};
  }
`;

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  margin-left: 4px;
  flex: auto;
  color: ${props => props.theme.brand.alt};

  .icon:first-of-type {
    position: absolute;
    left: -6px;
    top: 0px;
    pointer-events: none;
    color: ${props => props.theme.text.alt};
  }

  .icon:last-of-type {
    position: absolute;
    right: 0;
    top: 0;
    point-events: none;
  }
`;

export const SearchFilter = styled(Filter)`
  padding: 0;
  margin-left: 8px;

  &:hover {
    background: none;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SearchInput = styled.input`
  padding-left: 24px;
  font-size: 16px;
  padding: 5px;
  padding-left: 24px;
  padding-right: 24px;
  border-bottom: 1px solid transparent;
  flex: 1;
  padding-top: 4px;

  &:focus {
    border-bottom: 1px solid ${props => props.theme.brand.alt};
  }
`;

export const FetchMore = styled(TextButton)`
  display: flex;
  flex: 1;
  justify-content: center;
  padding: 8px 16px;
  align-items: center;
  font-size: 14px;
  color: ${props => props.theme.text.alt};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.brand.alt};
  }
`;

export const EditDropdownContainer = styled.div`
  position: relative;
  color: ${props => props.theme.text.alt};
  cursor: pointer;
`;

export const Dropdown = styled.div`
  border-radius: 4px;
  border: 1px solid ${props => props.theme.bg.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: absolute;
  right: 0;
  top: 0;
  z-index: 100;
  width: 320px;
  overflow: hidden;
`;

export const DropdownSectionDivider = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.bg.wash};
  border-top: 1px solid ${props => props.theme.bg.border};
  border-bottom: 1px solid ${props => props.theme.bg.border};
`;

export const DropdownSection = styled.div`
  padding: 12px 8px;
  background: ${props => props.theme.bg.default};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid ${props => props.theme.bg.border};

  .icon {
    margin-right: 8px;
  }

  &:first-of-type {
    border-bottom: 0;
  }

  &:last-of-type {
    border-bottom: 0;
  }

  &:hover {
    background: ${props => props.theme.bg.wash};
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
  color: ${props => props.theme.text.default};
  line-height: 1.3;
`;

export const DropdownSectionSubtitle = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
  line-height: 1.2;
`;

export const DropdownAction = styled.div`
  display: flex;
  flex: 0 0 48px;
  align-items: center;
  justify-content: center;
  position: relative;
`;
