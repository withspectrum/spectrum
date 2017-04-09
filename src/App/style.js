import styled from 'styled-components';

export const Body = styled.div`
  background: #f6f7f8;
  display: flex;
  overflow: hidden;
  height: 100%;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  height: 100%;
	overflow: auto;

  @media (max-width: 768px) {
    overflow-x: hidden;
  }
`;
