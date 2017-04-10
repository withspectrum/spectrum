import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  overflow-y: hidden;
`;

export const ScrollBody = styled.div`
  display: flex;
  flex: 1 1 auto;
  max-height: 100%;
  flex-direction: column;
  overflow-y: scroll;
`;

export const Footer = styled.div`
  width: 100%;
  border-top: 2px solid ${props => props.theme.border.default};
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
`;

export const Text = styled.p`
  margin-right: 16px;
  font-size: 16px;
  font-weight: 700;
  display: inline-block;
`;
