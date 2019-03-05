// @flow
import styled from 'styled-components';
import theme from 'shared/theme';
import { Tooltip } from 'src/components/globals';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  background: ${theme.bg.default};
  border-right: 1px solid ${theme.bg.border};
  display: grid;
  grid-gap: 12px;
  padding: 12px;
  grid-template-columns: minmax(0, 1fr);
  align-content: start;
  grid-template-rows: auto;
  z-index: 9999;
  overflow-x: visible;
  overflow-y: scroll;
`;

export const AvatarGrid = styled.div`
  display: grid;
  grid-gap: 4px;
  grid-template-columns: minmax(0, 1fr);
  align-content: start;
`;

export const AvatarLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${Tooltip};
`;

export const Avatar = styled.img`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 6px;
  opacity: ${props => (props.isActive ? '1' : '0.4')};
  filter: ${props => (props.isActive ? 'none' : 'grayscale(100%)')};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.16);
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 1;
    filter: grayscale(0%);
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease-in-out;
  }
`;

export const Shortcut = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${theme.text.alt};
  margin-top: 2px;
  text-align: center;
`;
