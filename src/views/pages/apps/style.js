import styled from 'styled-components';

/* eslint no-eval: 0 */

export const Intro = styled.div`
  display: grid;
  grid-template-rows: auto 40vh;
  grid-template-columns: 1fr;
  grid-template-areas: 'copy';
  margin: 160px 5% 80px;
  align-items: center;
  justify-content: center;
  text-align: center;

  @media (max-width: 1480px) {
    grid-template-rows: auto 33vh;
    grid-template-areas: 'copy';
  }

  @media (max-width: 960px) {
    grid-template-rows: auto 25vh;
    text-align: left;
  }

  @media (max-width: 460px) {
    grid-template-rows: 1fr auto;
  }
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

  @media (max-width: 800px) {
    flex-direction: column;

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
