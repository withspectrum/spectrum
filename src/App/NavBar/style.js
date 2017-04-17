import styled from 'styled-components';
import { Shadow, Gradient } from '../../shared/Globals';

export const NavBarContainer = styled.div`
  width: 100%;
  display: flex;
  background-color: ${({ theme }) => theme.bg.reverse};
  height: 48px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  box-shadow: ${Shadow.high};
  justify-content: space-between;
  padding: 0 4px;

  a, span {
    padding: 8px;
  }
`;

export const Menu = styled.span`

`;

export const Logo = styled.img`
  padding: 8px;
  width: 32px;
  height: 32px;
`;

export const Text = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  align-content: center;
  align-items: center;
  max-width: calc(100% - 96px);
`;

export const Title = styled.h3`
  color: #fff;
  font-size: ${props => (props.large ? '18px' : '14px')};
  font-weight: 800;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
  white-space: nowrap;
`;

export const Subtitle = styled.p`
  color: rgba(255,255,255,0.8);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  font-weight: 600;
  line-height: 1.4;
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
  white-space: nowrap;
`;

export const Avatar = styled.div`
  margin: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 16px;
`;

export const Photo = styled.img`
  width: 32px;
  height: 32px;
  padding: 2px;
  background-clip: content-box;
  border-radius: 16px;
  border: 2px solid ${props => (props.pro ? props.theme.space.light : props.theme.bg.default)};
`;

export const Pro = styled.b`
  color: #02AAFA;
  background-image: radial-gradient(ellipse farthest-corner at top left , #00C384 0%, #02AAFA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-right: 16px;
  margin-top: 4px;
`;
