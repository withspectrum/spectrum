import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Gradient, H3 } from '../../shared/Globals';

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bg.reverse};
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 3;
  transition: transform 0.2s ease-in-out;
`;

export const Header = styled.div`
  display: flex;
  flex: 0 0 auto;
  padding: ${props => props.login ? '18px 16px' : '16px'};
  align-items: ${props => props.login ? `flex-start` : `center`};
  flex-direction: ${props => props.login ? `column` : `row`};
`;

export const HeaderLogo = styled.img`
  height: 24px;
  width: 137px;
`;

export const Avatar = styled.img`
  height: 32px;
  flex: 0 0 32px;
  border-radius: 8px;
  align-self: flex-start;
`;

export const MetaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;

export const Name = styled(H3)`
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.text.reverse};
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 2px;
  position: relative;
`;

export const P = styled.p`
  display: flex;
  font-size: 12px;
  line-height: 1.4;
  color: ${({ theme }) => theme.text.alt};
  font-weight: 500;
  flex-direction: column;

  + p {
    margin-top: 8px;
  }
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
    color: ${({ theme }) => theme.text.reverse};
    transition: color 0.2s ease-out;
  }
`;

export const MetaLink = styled(Link)`${linkStyles}`;

export const MetaAnchor = styled.a`
  ${linkStyles}
  ${props =>
  props.pro
    ? 'color: #02AAFA; background-image: radial-gradient(ellipse farthest-corner at top left , #00C384 0%, #02AAFA 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'
    : ''};
`;

export const Username = styled.span`
  margin-bottom: 4px;
`;

export const FreqList = styled.div`
  list-style: none;
  width: 100%;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;

export const Freq = styled.div`
  display: flex;
  flex: 0 0 36px;
  padding: 0.2rem 1rem;
  align-items: center;
  justify-content: space-between;
  background-color: ${props =>
  props.active ? props.theme.brand.default : props.theme.bg.reverse};
  background-image: ${props =>
  props.active
    ? Gradient(props.theme.brand.alt, props.theme.brand.default)
    : `none`};
  color: ${({ theme }) => theme.text.alt};
  text-transform: capitalize;

  &:hover {
    cursor: pointer;
    background-color: ${props =>
  props.active ? props.theme.brand.default : '#2E313F'};
  }
`;

export const FreqText = styled.div`
  display: flex;
  align-items: center;
`;

export const FreqLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  flex: 0 0 auto;
  color: ${({ theme }) => theme.text.reverse};
  pointer-events: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  padding: 4px 0;
  overflow: hidden;
  ${props => props.ml ? 'margin-left: 8px;' : ''};
`;

export const FreqIcon = styled.img`
  height: 32px;
  flex: 0 0 32px;
  pointer-events: none;
`;

export const FreqGlyph = styled.span`
  margin-left: 8px;
  margin-right: 8px;
  display: inline-block;
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.text.reverse}
`;

export const Footer = styled.div`
  width: 100%;
  padding: 16px;
  padding-top: 0;
`;

export const FooterLogo = styled.img`
  height: 24px;
  width: 24px;
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

export const Button = styled.button`
  margin: 1rem;
  background-color: #0f1010;
  box-shadow: 0 1px 0 rgba(255,255,255,0.02);
  font-size: 12px;
  font-weight: bold;
  color: rgba(255,255,255,0.7);
  padding: 8px;
  display: inline-block;
  text-align: center;
  text-align: -webkit-center;
  width: calc(100% - 2rem);
  border-radius: 2px;
  transition: all 0.2s;

  &:hover {
    cursor: pointer;
    transition: all 0.2s;
    color: rgba(255,255,255,1);
    background-color: ${props => props.theme.brand.default};
    background-image: ${props =>
  Gradient(props.theme.brand.alt, props.theme.brand.default)};
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
  }

  &:active {
    box-shadow: 0 1px 0 rgba(255,255,255,0.04);
    background-color: #0f1010;
    background-image: none;
    position: relative;
    top: 1px;
    transition: all 0s;
  }
`;

export const DirtyDot = styled.div`
  border-radius: 8px;
  background-color: ${({ theme }) => theme.warn.alt};
  min-width: ${props => props.children ? '16px' : '8px'};
  height: ${props => props.children ? '16px' : '8px'};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  padding: 0 ${props => props.children ? '8px' : ''};
`;

export const ProBadge = styled.span`
  background: #00C384;
  background-image: radial-gradient(ellipse farthest-corner at top left , #00C384 0%, #02AAFA 100%);
  position: relative;
  margin-left: 8px;
  top: -2px;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 4px;
  border-radius: 4px;
  line-height: 1.5;
`;

export const CommunityHeading = styled(P)`
  border-top: 1px solid rgba(255,255,255,0.05);
  margin-top: 16px;
  padding: 16px 16px 8px 16px;
  display: block;
  font-size: 11px;
  letter-spacing: 0.4px;
  text-transform: uppercase;
`;
