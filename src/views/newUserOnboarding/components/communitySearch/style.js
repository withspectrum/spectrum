// @flow
// $FlowFixMe
import styled from 'styled-components';
import {
  FlexCol,
  FlexRow,
  Shadow,
  hexa,
  zIndex,
} from '../../../../components/globals';
import { Avatar } from '../../../../components/avatar';
import Icon from '../../../../components/icons';

export const SearchWrapper = styled.div`
  position: relative;
  margin: 32px 16px;
  padding: 12px 16px;
  border: 2px solid ${props => props.theme.border.default};
  border-radius: 12px;
  width: 100%;
  max-width: 640px;

  @media (max-width: 768px) {
    margin: 32px 32px 16px;
  }
`;

export const SearchInputWrapper = styled(FlexRow)`
  flex: auto;
  color: ${props => props.theme.text.placeholder};
`;

export const SearchIcon = styled(Icon)`
`;

export const SearchInput = styled.input`
  font-size: 18px;
  font-weight: 500;
  padding: 4px 20px;
  flex: auto;
  position: relative;
  z-index: ${zIndex.search};

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const SearchSpinnerContainer = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  z-index: ${zIndex.search + 1};
`;

export const SearchResultsDropdown = styled.ul`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${Shadow.mid} ${props => hexa(props.theme.bg.reverse, 0.1)};
  position: absolute;
  top: 64px;
  left: 0;
  display: inline-block;
  width: 100%;
  flex: auto;
  max-height: 400px;
  overflow-y: scroll;
  z-index: ${zIndex.search};
  background: ${props => props.theme.bg.default};

  @media (max-width: 768px) {
    border-radius: 0 0 8px 8px;
  }
`;

export const SearchResult = styled.li`
  display: flex;
  flex: auto;
  background: ${props =>
    props.focused ? props.theme.bg.wash : props.theme.bg.default};
  border-bottom: 2px solid ${props => props.theme.border.default};
  align-items: center;
  padding: 8px 16px 8px 8px;

  &:hover {
    background: ${props => props.theme.bg.wash};
    cursor: pointer;
  }

  h2 {
    color: ${props => props.theme.text.default};
  }

  p {
    color: ${props => props.theme.text.alt};
    line-height: 1.4;
  }

  &:only-child {
    border-bottom: none;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const SearchResultImage = styled(Avatar)`
  margin: 4px 16px 0 4px;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  align-self: flex-start;
`;

export const SearchResultMetaWrapper = styled(FlexCol)`
  margin-left: 4px;
  flex: auto;
  padding-right: 16px;
`;

export const SearchResultName = styled.h2`
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
`;

export const SearchResultMetadata = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
`;

export const SearchResultNull = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: auto;
  padding: 24px;
  background-color: ${props => props.theme.bg.default};
  border: 0;

  &:hover {
    border: 0;

    p {
      color: ${props => props.theme.text.alt};
    }
  }

  a {
    margin-top: 16px;
  }

  p {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: ${props => props.theme.text.alt};
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
`;

export const SearchResultDescription = styled.p`
  font-size: 14px;
  color: ${props => props.theme.text.alt};
`;
