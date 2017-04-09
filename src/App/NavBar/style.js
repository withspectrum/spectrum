import styled from 'styled-components';

export const NavBarContainer = styled.div`
  width: 100%;
  display: block;
  background: #171A21;

  height: 48px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  box-shadow: 0 1px 8px rgba(0,0,0,0.25);
  display: flex;
  justify-content: space-between;
`;
export const Logo = styled.img`
  padding: 12px;
  width: 48px;
  height: 48px;
`;
