import styled from 'styled-components';
import { IconButton } from '../Globals';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background-color: ${({ theme }) => theme.bg.default};
  padding: 24px;
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
