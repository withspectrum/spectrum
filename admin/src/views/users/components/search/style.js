import styled from 'styled-components';
import { Truncate } from '../../../../components/globals';
import { Avatar } from '../../../../components/avatar';

export const ComposerInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  display: block;
`;

export const ComposerInput = styled.input`
  font-size: 16px;
  padding: 15px 16px;
  width: 100%;
  border-bottom: 2px solid ${props => props.theme.border.default};
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

export const SearchSpinnerContainer = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  z-index: 5;
`;

export const SearchResultsDropdown = styled.ul`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: absolute;
  top: ${props => (props.moved ? '104px' : '60px')};
  left: 8px;
  display: inline-block;
  width: 320px;
  max-height: 420px;
  overflow-y: scroll;
  z-index: 1000;

  @media (max-width: 768px) {
    width: 100%;
    left: 0;
    border-radius: 0 0 8px 8px;
  }
`;

export const SearchResult = styled.li`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.border.default};
  background: ${props => (props.focused ? props.theme.bg.wash : '#fff')};
  width: 100%;
  ${Truncate()}
  padding: 8px 16px 8px 8px;

  &:only-child {
    border-bottom: none;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.theme.bg.wash};
    cursor: pointer;
  }
`;

export const SearchResultImage = styled(Avatar)`
  margin-right: 8px;
`;

export const SearchResultTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
`;

export const SearchResultDisplayName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text.default};
  line-height: 1.4;
`;

export const SearchResultUsername = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  line-height: 1.4;
`;

export const SearchResultNull = styled.p`
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
`;
