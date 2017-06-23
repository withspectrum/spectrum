import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  background: ${props => props.theme.bg.default};
  border-bottom: 2px solid ${props => props.theme.border.default};
  padding: 16px;
  position: relative;
  justify-content: space-between;
  align-items: center;
  flex: 0 0 auto;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-left: 16px;
`;

export const Name = styled.h2`
  font-weight: 800;
  color: ${props => props.theme.text.default};
  font-size: 18px;
`;
export const Username = styled.h3`
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  font-size: 15px;
  line-height: 1.2;
`;
