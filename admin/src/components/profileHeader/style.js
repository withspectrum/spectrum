import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  background: ${props => props.theme.bg.default};
  border-bottom: 2px solid ${props => props.theme.border.default};
  padding: 32px;
  position: relative;
  justify-content: space-between;
  align-items: center;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
`;

export const Name = styled.h2`
  font-weight: 800;
  color: ${props => props.theme.text.default};
  font-size: 24px;
`;
export const Username = styled.h3`
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  font-size: 18px;
`;
