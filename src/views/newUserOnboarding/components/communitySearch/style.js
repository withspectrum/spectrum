// @flow
// $FlowFixMe
import styled from 'styled-components';
// $FlowFixMe
import { Link } from 'react-router-dom';
import {
  FlexCol,
  FlexRow,
  H1,
  H2,
  H3,
  P,
  Transition,
  Gradient,
  Shadow,
  hexa,
  Truncate,
} from '../../../../components/globals';
import Card from '../../../../components/card';
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
  z-index: 2;

  &:hover {
  }
`;

export const SearchSpinnerContainer = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  z-index: 5;
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
  z-index: 1000;
  background: ${props => props.theme.bg.default};

  @media (max-width: 768px) {
    border-radius: 0 0 8px 8px;
  }
`;

export const SearchResultTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
`;

export const SearchResult = styled.li`
  display: flex;
  background: ${props =>
    props.focused ? props.theme.bg.wash : props.theme.bg.default};
  border-bottom: 2px solid ${props => props.theme.border.default};

  &:hover {
    background: ${props => props.theme.bg.wash};
    cursor: pointer;
  }

  h2 {
    color: ${props => props.theme.text.default};
  }

  p {
    color: ${props => props.theme.text.alt};
  }

  &:only-child {
    border-bottom: none;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const SearchLink = styled(Link)`
  display: flex;
  align-items: center;
  width: 100%;
  ${Truncate()}
  padding: 8px 16px 8px 8px;
`;

export const SearchResultImage = styled(Avatar)`
  margin: 8px 16px 8px 8px;
  width: 48px;
  height: 48px;
`;

export const SearchResultMetaWrapper = styled(FlexCol)`
  margin-left: 4px;
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
