// @flow
import styled, { css } from 'styled-components';

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

  .icon {
    position: absolute;
    left: -6px;
    top: 0px;
    pointer-events: none;
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
  border-bottom: 1px solid transparent;
  flex: 1;
  padding-top: 4px;

  &:focus {
    border-bottom: 1px solid ${props => props.theme.brand.alt};
  }
`;
