import styled from 'styled-components';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Navbar = styled.nav`
  display: flex;
  width: 100;
  background: ${props => props.theme.text.default};
  padding: 16px 32px;
`;

export const Logo = styled.h1`
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 800;
  color: #fff;
`;
