// @flow
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1 0 auto;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 768px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
`;

export const Description = styled.p`
  font-size: 16px;
  color: ${props => props.theme.text.default};
  max-width: 600px;
  line-height: 1.4;
`;

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;

  button:first-of-type {
    margin-right: 16px;
  }
`;

export const CardInfo = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.theme.bg.border};
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 15px;
  margin-top: 24px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06),
    0 1px 0 rgba(255, 255, 255, 0.3);
  color: ${props => props.theme.text.secondary};
  font-weight: 500;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }

  img {
    margin-right: 12px;
  }
`;
