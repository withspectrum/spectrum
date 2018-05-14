import styled, { css } from 'styled-components';
import { SvgWrapper } from 'src/components/icons';

/* eslint no-eval: 0 */

export const Intro = styled.div`
  display: grid;
  grid-template-rows: auto 40vh;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas: 'copy copy .' '. illo illo';
  margin: 160px 5% 80px;

  @media (max-width: 1152px) {
    grid-template-rows: auto 33vh;
    grid-template-areas: 'copy copy copy' 'illo illo illo';
  }

  @media (max-width: 800px) {
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

  > a {
    display: inline-block;

    > button {
      padding: 8px 16px 8px 8px;

      > span {
        font-size: 16px;
        margin-left: 16px;
      }
    }
  }

  @media (max-width: 1152px) {
    justify-self: flex-start;
  }

  @media (max-width: 800px) {
    padding-top: 0;
    margin-left: 0;
    margin-bottom: 0;

    > h1 {
      margin-top: 0;
    }
  }
`;

export const Waterfall = styled.img`
  grid-area: illo;
  position: relative;
  justify-self: center;
  top: -25vh;
  height: 100vh;
  max-height: 100vw;
  z-index: 0;
  transition: all 0.2s ease-in-out;

  @media (max-width: 1152px) {
    top: -20vh;
    height: 80vh;
    left: 20vw;
  }

  @media (max-width: 800px) {
    top: -8vh;
    left: 8px;
    height: 66vh;
  }

  @media (max-width: 460px) {
    display: none;
  }
`;

export const Topic = styled.div`
  grid-area: topic;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > div {
    margin-top: 32px;
  }
`;

export const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => (props.reverse ? `60% 40%` : `40% 60%`)};
  grid-template-rows: 1fr;
  grid-column-gap: 2.5%;
  grid-template-areas: ${props =>
    props.reverse ? `'copy topic'` : `'topic copy'`};
  margin: 80px 5% 40px;

  @media (max-width: 1080px) {
    grid-template-columns: '50% 50%';
  }

  @media (max-width: 800px) {
    margin: 40px 5%;
    grid-template-columns: 1fr;
    grid-template-rows: 320px 1fr;
    grid-template-areas: 'topic' 'copy';
    
    > ${Topic} {
      margin-bottom: 32px;
    }
  }

  @media (max-width: 400px) {
    ${Topic}
      display: none;
    }
  }
`;

export const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15%;

  > h1 {
    margin-bottom: 32px;
    max-width: 640px;
  }
`;

export const Feature = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  grid-row-gap: 8px;
  grid-column-gap: 16px;
  grid-template-areas: 'icon name' '. copy';
  max-width: 560px;

  ${SvgWrapper} {
    grid-area: icon;
    margin-top: 2px;
  }

  & + & {
    margin-top: 16px;
  }

  @media (max-width: 640px) {
    grid-template-areas: 'name name' 'copy copy';

    ${SvgWrapper} {
      display: none;
    }
  }
`;

export const EtcFeature = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr;
  grid-template-areas: 'icon name';
  grid-column-gap: 16px;
  max-width: 560px;

  ${SvgWrapper} {
    grid-area: icon;
    margin-top: 2px;
    flex-basis: 48px;
    height: 48px;
    width: 48px;
    max-height: 48px;
    max-width: 48px;
  }

  color: ${props =>
    props.color
      ? eval(`props.theme.${props.color}`)
      : props.theme.text.default};
`;

export const FeatureName = styled.span`
  grid-area: name;
  font-weight: 700;
  font-size: 24px;
  align-self: center;
  line-height: 1.2;

  ${props =>
    props.comingSoon &&
    css`
      &:after {
        content: 'Coming soon';
        text-transform: uppercase;
        font-size: 12px;
        background-color: ${props =>
          props.bright ? props.theme.success.alt : props.theme.space.dark};
        color: ${props => props.theme.text.reverse};
        padding: 4px 8px;
        border-radius: 16px;
        position: relative;
        top: -3px;
        margin-left: 8px;
        white-space: nowrap;
        font-weight: 900;
      }
    `};
`;

export const EtcName = styled(FeatureName)`
  font-size: 20px;
  color: ${props => props.theme.text.default};
  line-height: 1.2;
`;

export const EtcGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  grid-template-areas: 'heading heading heading';
  grid-gap: 32px;
  margin: 80px 5% 40px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: 'heading heading';
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    grid-template-areas: 'heading';
  }

  > h1 {
    margin-bottom: 16px;
  }
`;

export const EtcCTA = styled.div`
  display: flex;
  flex: none;
  flex-direction: column;
  align-self: stretch;
  align-items: center;
  margin-bottom: 80px;

  > span {
    margin-top: 32px;
    font-size: 24px;
    margin-bottom: 16px;
  }

  > a {
    display: inline-block;

    > button {
      padding: 8px 16px 8px 8px;

      > span {
        font-size: 16px;
        margin-left: 16px;
      }
    }
  }
`;

export const FeatureCopy = styled.div`
  grid-area: copy;
  font-size: 18px;
  line-height: 1.4;

  p + p {
    margin-top: 16px;
  }
`;
