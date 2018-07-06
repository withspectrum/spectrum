// @flow
import styled from 'styled-components';

export const Container = styled.div`
  margin: -16px;
  display: flex;
  flex: 1 0 auto;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
  padding: 32px;
  background-image: url('/img/share.svg');
  background-repeat: no-repeat;
  background-position: 100% 120%;
  background-size: 500px auto;

  @media (max-width: 1020px) {
    padding: 24px;
    background-position: 100% 100%;
    background-size: 400px auto;
  }

  @media (max-width: 960px) {
    background-position: 115% 100%;
  }

  @media (max-width: 880px) {
    background-position: 135% 100%;
  }

  @media (max-width: 820px) {
    background-position: 135% 150%;
  }

  @media (max-width: 768px) {
    background: none;
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
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  margin-bottom: 16px;
  line-height: 1.3;
`;

export const Subtitle = styled.h3`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.text.alt};
  margin-bottom: 4px;
`;

export const Description = styled.p`
  font-size: 20px;
  font-weight: 400;
  color: ${props => props.theme.text.secondary};
  max-width: 600px;
  line-height: 1.4;
`;

export const List = styled.ul`
  margin-left: 24px;
  margin-top: 12px;
  font-size: 20px;
  font-weight: 400;
  color: ${props => props.theme.text.secondary};
  max-width: 650px;

  li {
    line-height: 1.6;
  }
`;

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;

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
  padding: 8px 12px;
  font-size: 16px;
  margin-top: 24px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06),
    0 1px 0 rgba(255, 255, 255, 0.3);
  color: ${props => props.theme.text.secondary};
  font-weight: 500;

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 12px;
    justify-content: center;
  }

  img {
    margin-right: 12px;
  }
`;
