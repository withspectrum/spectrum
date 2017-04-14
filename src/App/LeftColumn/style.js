import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { H5, FlexRow, FlexCol, Transition } from '../../shared/Globals';

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bg.default};
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 3;
  transition: transform 0.2s ease-in-out;
`;

const linkStyles = css`
  text-decoration: none;
  font-size: 12px;
  color: ${({ theme }) => theme.text.alt};
  font-weight: 500;
  transition: color 0.2s ease-out;
  word-wrap: break-word;

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.text.default};
    transition: color 0.2s ease-out;
  }
`;

export const MetaLink = styled(Link)`${linkStyles}`;

export const MetaAnchor = styled.a`
  ${linkStyles}
  ${props => (props.pro ? 'color: #02AAFA; background-image: radial-gradient(ellipse farthest-corner at top left , #00C384 0%, #02AAFA 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;' : '')};
`;

export const List = styled(FlexCol)`
  width: 100%;
  margin-bottom: 16px;
  flex: 1 0 auto;
`;

export const ListHeading = styled(H5)`
  border-top: 2px solid ${({ theme }) => theme.border.default};
  padding: 16px 0 0 8px;
  margin: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.placeholder};
  letter-spacing: 0.4px;
  text-transform: uppercase;
`;

export const ListContainer = styled(FlexCol)`
  padding: 8px;
`;

export const ListItem = styled(FlexRow)`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
`;

export const NavButton = styled(FlexRow)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px;
  border-radius: 4px;
  text-transform: capitalize;
  color: ${props => (props.active ? props.theme.brand.default : props.theme.text.alt)};
  font-weight: 600;
  transition: ${Transition.hover.off};

  &:hover {
    transition: ${Transition.hover.on};
    cursor: pointer;
    background-color: ${props => props.theme.border.default};
  }
`;

export const Label = styled.div`
  font-size: 14px;
  display: inline-block;
  flex: 1 0 auto;
  pointer-events: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  padding: 0 8px;
  overflow: hidden;
  font-weight: inherit;
`;

export const DirtyDot = styled.div`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.warn.alt};
  min-width: ${props => (props.children ? '16px' : '8px')};
  height: ${props => (props.children ? '16px' : '8px')};
  margin-right: 8px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  padding: 0 ${props => (props.children ? '8px' : '')};
`;

export const Footer = styled.div`
  width: 100%;
  padding: 16px;
  padding-top: 0;
`;

export const FooterP = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text.alt};
  font-weight: 500;
  line-height: 1.4;

  + p {
    margin-top: 8px;
  }
`;
