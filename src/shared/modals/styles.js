import styled from 'styled-components';
import { IconButton, Gradient } from '../Globals';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background-color: ${({ theme }) => theme.bg.default};
  padding: 24px;
`;

export const UserHeader = styled.div`
  position: relative;
  text-align: center;
`;

export const UserPhoto = styled.img`
  display: inline-block;
  margin: 0 auto;
  border-radius: 44px;
  margin-bottom: 4px;
  position: relative;
  z-index: 2;
  border: 2px solid #fff;
  max-width: 64px;
  box-shadow: 0 2px 2px rgba(0,0,0,0.1);
`;

export const DisplayName = styled.h2`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 0;
  color: ${({ theme }) => theme.text.default};
`;

export const Username = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 32px;
  color: ${({ theme }) => theme.text.alt};
`;

export const Cover = styled.span`
  position: absolute;
  background-color: ${({ theme }) => theme.brand.default};
  background-image: ${props =>
  Gradient(props.theme.brand.alt, props.theme.brand.default)}
  left: -24px;
  right: -48px;
  top: -24px;
  height: 48px;
  z-index: 1;
`;

export const ProBadge = styled.span`
  background: #00C384;
  background-image: radial-gradient(ellipse farthest-corner at top left , #00C384 0%, #02AAFA 100%);
  display: inline-block;
  margin-left: 4px;
  position: relative;
  top: -5px;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 4px;
  border-radius: 4px;
  line-height: 1.5;
`;

export const Header = styled.div`

`;

export const Title = styled.div`
  font-weight: 800;
  font-size: 24px;
  padding-bottom: 24px;
  line-height: 28px;
  margin-top: 16px;
`;

export const Body = styled.div`

`;

export const Footer = styled.div`
  padding-top: 0;
`;

export const CloseButton = styled(IconButton)`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
`;
