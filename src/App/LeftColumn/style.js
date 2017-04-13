import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Gradient, H3, FlexRow, FlexCol } from '../../shared/Globals';

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bg.default};
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 3;
  transition: transform 0.2s ease-in-out;
  border-right: 2px solid ${({ theme }) => theme.border.default};
`;

export const Header = styled.div`
  display: flex;
  flex: 0 0 auto;
  padding: ${props => props.login ? '18px 16px' : '16px'};
  align-items: ${props => props.login ? `flex-start` : `center`};
  flex-direction: ${props => props.login ? `column` : `row`};

  @media (min-width: 768px) {
    display: none;
  }
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
    color: ${({ theme }) => theme.text.default};
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
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;

export const FreqLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  flex: 0 0 auto;
  pointer-events: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  padding: 4px 0;
  overflow: hidden;
  ${props => props.ml ? 'margin-left: 8px;' : ''};
`;

export const ViewNav = styled(FlexCol)`
  padding: 4px;
`;

export const ViewItem = styled(FlexRow)`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
`;

export const ViewSelector = styled(FlexRow)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px;
  border-radius: 4px;
  text-transform: capitalize;
  color: ${props =>
  props.active ? props.theme.brand.default : props.theme.text.alt};
  font-weight: ${props => props.active ? '600' : '500'};

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.border.default};
  }
`;

export const ViewLabel = styled(FreqLabel)`
  font-weight: inherit;
`;

export const Freq = styled.div`
  display: flex;
  flex: 0 0 36px;
  padding: 4px 16px;
  align-items: center;
  justify-content: space-between;
  background-color: ${props =>
  props.active ? props.theme.brand.default : props.theme.bg.default};
  background-image: ${props =>
  props.active
    ? Gradient(props.theme.brand.alt, props.theme.brand.default)
    : `none`};
  color: ${({ theme }) => theme.text.alt};

  &:hover {
    cursor: pointer;
    background-color: ${props =>
  props.active ? props.theme.brand.default : props.theme.text.alt};
    color: ${({ theme }) => theme.text.reverse};
  }
`;

export const FreqRow = styled(FlexRow)`

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

export const FooterP = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.text.alt};
  font-weight: 500;
  line-height: 1.4;

  + p {
    margin-top: 8px;
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
  background: ${({ theme }) => theme.success.default};
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
  border-top: 2px solid ${({ theme }) => theme.bg.wash};
  padding: 16px 0 8px 0;
  margin: 0 8px;
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.placeholder};
  letter-spacing: 0.4px;
  text-transform: uppercase;
`;
