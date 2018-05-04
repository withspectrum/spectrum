import styled from 'styled-components';
import { SvgWrapper } from 'src/components/icons';

export const Intro = styled.div`
  display: grid;
  grid-template-rows: 40% 1fr;
  grid-template-columns: minmax(33%, 560px) 1fr;
  grid-template-areas: 'copy .' 'copy illo';
  padding: 160px 5% 80px;

  @media (max-width: 1080px) {
    grid-template-rows: 1fr 40%;
    grid-template-columns: 1fr minmax(33%, 560px);
    grid-template-areas: 'illo copy' '. copy';
  }

  @media (max-width: 800px) {
    padding: 96px 32px 48px;
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
    grid-template-areas: 'illo' 'copy';
  }

  @media (max-width: 400px) {
    padding: 48px 16px 48px;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    grid-template-areas: 'copy';
  }
`;

export const TextContent = styled.div`
  grid-area: copy;
  margin-left: 32px;
  align-self: flex-start;
  z-index: 1;
  text-shadow: 0 0 4px ${props => props.theme.bg.default};

  @media (max-width: 1080px) {
    padding-top: 20%;
    align-self: flex-end;
  }

  @media (max-width: 800px) {
    padding-top: 0;
    margin-left: 0;
  }
`;

export const Waterfall = styled.img`
  grid-area: illo;
  max-width: 150%;
  margin: 0 -10% -50% -15%;
  z-index: 0;
  transition: all 0.2s ease-in-out;

  @media (max-width: 1080px) {
    opacity: 0.25;
    max-width: 250%;
    margin: -40% -20% -80% -40%;
  }

  @media (max-width: 800px) {
    max-width: 150%;
    margin: -40% -80% -60% -20%;
  }

  @media (max-width: 400px) {
    display: none;
  }
`;

export const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => (props.reverse ? `60% 40%` : `40% 60%`)};
  grid-template-rows: 1fr;
  grid-column-gap: 5%;
  grid-template-areas: ${props =>
    props.reverse ? `'copy topic'` : `'topic copy'`};
  padding: 5%;
`;

export const Topic = styled.div`
  grid-area: topic;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    margin-top: 32px;
  }
`;

export const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

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
`;

export const FeatureName = styled.span`
  grid-area: name;
  font-weight: 700;
  font-size: 24px;
  align-self: center;
`;

export const FeatureCopy = styled.div`
  grid-area: copy;
  font-size: 18px;
  line-height: 1.6;

  p + p {
    margin-top: 8px;
  }
`;
