// @flow
import styled from 'styled-components';
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
  margin: 0 -16px 16px;
  padding: 0 16px;
  flex: 1;
  border-bottom: 1px solid ${props => props.theme.bg.border};
`;

export const Filter = styled.li`
  color: ${props =>
    props.active ? props.theme.text.default : props.theme.text.alt};
  font-weight: 400;
  font-size: 16px;
  list-style-type: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  margin-bottom: -1px;
  border-bottom: 1px solid
    ${props => (props.active ? props.theme.text.default : 'transparent')};

  &:hover {
    color: ${props => props.theme.text.default};
  }
`;

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
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
  padding-left: 8px;

  &:hover {
    background: none;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SearchInput = styled.input`
  font-size: 16px;
  border-bottom: 1px solid transparent;
  flex: 1;
  padding: 4px 24px 15px;
  margin-bottom: -13px;
  background: transparent;

  &:focus {
    border-bottom: 1px solid ${props => props.theme.text.default};
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
