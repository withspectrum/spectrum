import styled from 'styled-components';

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
`;

export const Body = styled.div`

`;

export const Footer = styled.div`
  padding-top: 0;
`;
