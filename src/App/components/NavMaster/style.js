import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { Gradient, H3 } from '../../../shared/Globals';

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
  padding: 16px;
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
`;

export const MetaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;

export const Name = styled(H3)`
  font-size: 16px;
  line-height: 16px;
  color: ${({ theme }) => theme.text.reverse};
  font-weight: 500;
  margin-top: 2px;
  margin-bottom: 4px;
`;

export const P = styled.p`
  display: flex;
  font-size: 12px;
  line-height: 12px;
  color: ${({ theme }) => theme.text.alt};
  font-weight: 500;

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

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.text.reverse};
    transition: color 0.2s ease-out;
  }
`;

export const MetaLink = styled(Link)`${linkStyles}`;

export const MetaAnchor = styled.a`${linkStyles}`;

export const FreqList = styled.div`
  list-style: none;
  width: 100%;
  margin-bottom: 2rem;
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
  margin-left: 8px;
  margin-right: 8px;
  pointer-events: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  padding: 8px 0;
  overflow: hidden;
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
  display: flex;
  flex: 0 0 auto;
  width: 100%;
  padding: 0 16px 16px 16px;
  align-self: flex-end;
  align-items: center;
  justify-content: space-between;
`;

export const FooterLogo = styled.img`
  height: 24px;
  width: 24px;
`;

export const FooterP = styled(P)`
  text-align: right;
  align-self: flex-end;
`;

export const Button = styled.button`
  margin: 16px;
  background-color: #0f1010;
  box-shadow: 0 1px 0 rgba(255,255,255,0.02);
  font-size: 12px;
  font-weight: bold;
  color: rgba(255,255,255,0.7);
  padding: 8px;
  display: flex;
  justify-content: center;
  text-align: center;
  text-align: -webkit-center;
  flex: 0 0 auto;
  border-radius: 2px;
  transition: all 0.2s;

  span {
    margin: 0 auto;
    display: inline-block;
  }

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
  border-radius: 50%;
  background-color: ${({ theme }) => theme.warn.default};
  width: 10px;
  height: 10px;
`;
