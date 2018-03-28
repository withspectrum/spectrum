// @flow
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1 0 auto;
  background-color: ${props => props.theme.bg.wash};
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
  padding: 32px 64px;
  background-image: url('/img/discover.svg');
  background-repeat: no-repeat;
  background-position: 100% -100%;
  background-size: 500px auto;

  @media (max-width: 1020px) {
    padding: 32px 24px;
    background-position: 120% 150%;
    background-size: 400px auto;
  }

  @media (max-width: 768px) {
    background: ${props => props.theme.bg.default};
  }
`;

export const Content = styled.div`
  width: 100%;
  max-width: 768px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
`;

export const Title = styled.h2`
  font-size: 48px;
  font-weight: 800;
  color: ${props => props.theme.text.default};
  margin-bottom: 16px;
  line-height: 1.3;
`;

export const Subtitle = styled.h3`
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 400;
  letter-spacing: 3px;
  color: ${props => props.theme.text.alt};
  margin-bottom: 0px;
`;

export const Description = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: ${props => props.theme.text.default};
  max-width: 600px;
  line-height: 1.4;
`;

export const ActionRow = styled.div`
  margin-top: 48px;
  display: flex;
  flex-wrap: wrap;

  button:first-of-type {
    margin-right: 16px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;

    button:first-of-type {
      margin-bottom: 16px;
      margin-right: 0;
    }

    button {
      width: 100%;
      display: flex;
      justify-content: center;
    }
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
