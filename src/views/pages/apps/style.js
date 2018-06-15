// @flow
import styled from 'styled-components';

export const Intro = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: 'illo' 'copy';
  grid-gap: 32px;
  margin: 10vh 5vw;
  align-items: center;
  justify-content: center;
  text-align: center;

  @media (min-width: 1440px) {
    grid-template-rows: 1fr;
    grid-template-columns: 1fr auto;
    grid-template-areas: 'copy illo';
    margin: 10vh 10vw;
    align-items: left;
    text-align: left;
  }
`;

export const Devices = styled.img`
  grid-area: illo;
  justify-self: center;
  max-height: 40vh;
  max-width: 80vw;

  @media (min-width: 1440px) {
    max-width: 40vw;
`;

export const TextContent = styled.div`
  grid-area: copy;
  justify-self: center;
  z-index: 1;
  text-shadow: 0 0 4px ${props => props.theme.bg.default};
  max-width: 560px;

  @media (max-width: 800px) {
    padding-top: 0;
    margin-left: 0;
    margin-bottom: 0;

    > h1 {
      margin-top: 0;
    }
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  a {
    margin: 0 16px;
  }

  @media (min-width: 1440px) {
    flex-direction: column;
    align-items: stretch;

    a {
      margin: 0;
      margin-bottom: 16px;
    }
  }

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: stretch;

    a {
      margin: 0 0 16px;
      display: flex;
      flex: 1;
      width: 100%;
    }

    button {
      display: flex;
      flex: 1;
      width: 100%;
    }
  }
`;
