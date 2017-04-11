import styled from 'styled-components';

export const NavBarContainer = styled.div`
  width: 100%;
  display: flex;
  background: #171A21;
  height: 48px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  box-shadow: 0 1px 8px rgba(0,0,0,0.25);
  justify-content: space-between;

  a, span {
    padding: 7px;
  }
`;

export const Menu = styled.span`

`;

export const Logo = styled.img`
  padding: 7px;
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
  font-size: ${props => props.large ? '18px' : '14px'};
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
  padding: 8px 8px 12px;
  cursor: pointer;
`;

export const Photo = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 16px;
`;

export const SignIn = styled.p`
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  padding: 12px;
  cursor: pointer;
`;
