import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
  background: #fff;
`;

export const Close = styled.div`
  color: #171A21;
  font-weight: 900;
  font-size: 0.75rem;

  &:hover {
    cursor: pointer;
  }
`;

export const Title = styled.div`
  margin-right: 3rem;
  color: #171A21;  
  font-weight: 600;
  font-size: 1rem;  
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
`;

export const Body = styled.div`
  background-color: #F5F6F7;
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
`;

export const Footer = styled.div`
  padding: 0 1rem;
  border-top: 1px solid #eee;
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
`;
