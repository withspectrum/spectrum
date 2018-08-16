// @flow
import styled from 'styled-components';
import { Button, TextButton } from 'src/components/buttons';
import { hexa, zIndex } from 'src/components/globals';
import Link from 'src/components/link';

export const ContentContainer = styled.div`
  padding: 128px 32px 72px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0 auto;
  max-width: 768px;
  z-index: ${zIndex.card};

  @media (max-width: 768px) {
    padding-top: 0;
    max-width: 100%;
    padding: 32px;
    padding-top: 64px;
  }
`;

export const Content = styled(ContentContainer)`
  position: relative;
  margin-bottom: 80px;

  > a > button {
    margin-top: 24px;
  }
`;

export const Heading = styled.h1`
  font-size: 40px;
  font-weight: 700;
  color: ${props =>
    props.reverse ? props.theme.text.reverse : props.theme.text.default};
  line-height: 1.2;
  grid-area: heading;

  @media (max-width: 768px) {
    margin-top: 48px;
    font-size: 32px;
  }
`;

export const Subhead = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${props =>
    props.reverse ? props.theme.text.reverse : props.theme.text.default};
  line-height: 1.2;
  margin-top: 24px;
`;

export const Copy = styled.p`
  font-size: 20px;
  font-weight: ${props => (props.reverse ? '500' : '400')};
  color: ${props =>
    props.reverse ? props.theme.text.reverse : props.theme.text.secondary};
  line-height: 1.6;
  margin-top: 24px;

  & + & {
    margin-top: 16px;
  }

  a {
    color: ${props => props.theme.brand.alt};
    text-decoration: underline;

    &:hover {
      color: ${props => props.theme.brand.dark};
    }
  }

  b {
    font-weight: 700;
  }
`;

export const CTA = styled(Button)`
  font-weight: 700;
  margin-top: 24px;
  padding: 8px 16px;
  font-size: 16px;
  align-self: flex-start;
`;

export const TextCTA = styled(TextButton)`
  padding: 16px 24px;
  font-size: 18px;
`;

export const TwoUp = styled(ContentContainer)`
  display: grid;
  max-width: 100%;
  padding: 128px 5% 40px;
  margin-bottom: 80px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: min-content;
  grid-template-areas: 'left right';
  grid-column-gap: 32px;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0;
    padding-top: 32px;
    grid-template-columns: 1fr;
    grid-template-rows: min-content 1fr;
    grid-template-areas: ${props =>
      props.reverse ? `'right' 'left'` : `'left' 'right'`};
    grid-row-gap: 32px;

    ${Heading}, ${Copy} {
      padding: 0px 32px;
    }
  }
`;

export const FourUp = styled.div`
  display: grid;
  max-width: 100%;
  padding: 128px 5% 128px;
  grid-template-columns: minmax(400, auto) minmax(400, auto);
  grid-template-rows: min-content auto 1fr;
  grid-template-areas: 'copy copy' 'one two' 'three four';
  grid-column-gap: 32px;
  grid-row-gap: 32px;
  justify-content: center;
  justify-items: stretch;

  > div {
    min-width: 320px;
    margin: 0;
    justify-content: space-between;

    &:first-of-type {
      justify-self: center;
      margin: 0 32px;
    }
  }

  @media (max-width: 768px) {
    padding: 0;
    padding-top: 32px;
    grid-template-columns: 1fr;
    grid-template-rows: min-content min-content min-content min-content min-content;
    grid-template-areas: 'copy' 'one' 'two' 'three' 'four';
    grid-row-gap: 32px;
  }
`;

export const Left = styled.div`
  grid-area: left;

  @media (max-width: 768px) {
    > a > button {
      margin-left: 32px;
    }
  }
`;

export const Right = styled.div`
  grid-area: right;

  @media (max-width: 768px) {
    > a > button {
      margin-left: 32px;
    }
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 72px 0 0;
  width: 100%;
`;

export const Subsection = styled.div`
  & + & {
    margin-top: 32px;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.text.primary};
  line-height: 1.3;
  margin-bottom: 16px;
`;

export const SectionSubtitle = styled.h4`
  font-size: 22px;
  font-weight: 600;
  color: ${props => props.theme.text.secondary};
  line-height: 1.4;
  margin: 16px 0;
`;

export const SectionDescription = styled.p`
  font-size: 20px;
  font-weight: 400;
  color: ${props => props.theme.text.secondary};
  line-height: 1.4;

  & + & {
    margin-top: 16px;
  }

  a {
    color: ${props => props.theme.brand.alt};
    font-weight: 500;
  }
`;

export const Highlight = styled.span`
  box-shadow: inset 0 -28px 0 rgba(74, 2, 210, 0.1);
  font-weight: 600;
  padding: 4px 1px;
  line-height: 1.6;
`;

export const Divider = styled.div`
  height: 1px;
  background: ${props => props.theme.bg.border};
  width: calc(100% + 64px);
  display: inline-block;
  margin: 64px -32px 0px;

  @media (max-width: 832px) {
    width: 100%;
    margin: 64px 0 0;
  }
`;

export const PlanSection = styled.div`
  display: flex;
  justify-self: center;
  margin: auto;
  flex-direction: column;
  padding: 32px;
  box-shadow: 0 8px 32px ${props => hexa(props.theme.brand.alt, 0.25)};
  background-color: ${props => props.theme.bg.default};
  border-radius: 8px;
  max-width: 480px;
  z-index: 1;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 24px;
    padding-bottom: 32px;
    margin: 0 8px;
  }

  a {
    display: inline-block;
    align-self: center;

    button {
      margin-top: 24px;
      padding: 8px 16px;
      font-size: 16px;
    }
  }
`;

export const CommunityListCard = styled(PlanSection)`
  justify-self: flex-start;
  padding: 24px;
  margin: 0;
  margin-top: 24px;

  & + a {
    display: none;
  }

  @media (max-width: 860px) {
    display: none;

    & + a {
      display: inline-block;
    }
  }
`;

export const CardTitle = styled(Subhead)`
  margin-top: 0;
`;

export const CommunityListGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-rows: minmax(auto, 1fr);
  grid-row-gap: 16px;
  justify-content: stretch;
  margin-top: 32px;
`;

export const CommunityCard = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr;
  grid-column-gap: 16px;
  align-items: center;
  grid-template-areas: 'avatar title button';
  border-bottom: 1px solid ${props => props.theme.bg.wash};
  padding-bottom: 16px;

  &:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const CommunityListRow = styled(CommunityListGrid)`
  display: grid;
  grid-template-columns: minmax(auto, 240px) minmax(auto, 240px) minmax(
      auto,
      240px
    );
  grid-auto-rows: min-content;
  grid-gap: 32px;
  margin-top: 32px;
  justify-content: center;

  @media (max-width: 860px) {
    grid-template-columns: minmax(auto, 240px) minmax(auto, 240px);
  }

  @media (max-width: 560px) {
    grid-template-columns: minmax(auto, 240px);
  }
  & + a {
    display: none;
  }

  ${CommunityCard} {
    justify-items: center;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    grid-template-areas: 'avatar' 'title' 'button';
    grid-column-gap: 0;
    grid-row-gap: 16px;
    border-bottom: none;
    padding-bottom: 0;
    padding: 16px;
    border-radius: 8px;
    background-color: ${props => props.theme.bg.default};
  }
`;

export const CommunityCardName = styled.h6`
  grid-area: title;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text.default};
`;

export const CommunityListActions = styled.div`
  display: flex;
  flex: auto;
  width: 100%;
  justify-content: space-between;

  a {
    display: inline-block;
  }

  a:first-of-type {
    flex: auto;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: flex-start;
  margin: 32px;
  margin-left: 0;

  @media (max-width: 768px) {
    margin-left: 32px;
  }
`;

export const CommunityCardButton = styled.button`
  -webkit-display: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text.alt};
  background: ${props => props.theme.bg.wash};
  transition: color 0.2s cubic-bezier(0.77, 0, 0.175, 1);
  width: 100%;

  &:hover {
    color: ${props => props.theme.text.default};
    cursor: pointer;
    transition: color 0.2s cubic-bezier(0.77, 0, 0.175, 1);
  }
`;

export const Illo = styled.img`
  position: absolute;
  right: ${props => (props.right ? `${props.right}px` : '0')};
  bottom: ${props => (props.bottom ? `${props.bottom}px` : '0')};
  width: ${props => (props.width ? `${props.width}px` : '200px')};

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ExtraContent = styled.div`
  margin-top: 32px;
  padding-top: 8px;
  padding-bottom: 16px;
  border-top: 1px solid ${props => props.theme.bg.border};
`;

export const PriceTable = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(2, 1fr);
  width: calc(100% + 256px);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    width: 100%;
    margin: 0;
  }
`;

export const PlanPrice = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.text.default};
  margin-bottom: 8px;
`;

export const PlanDescription = styled.p`
  font-size: 20px;
  font-weight: 400;
  color: ${props => props.theme.text.secondary};
  line-height: 1.3;
`;

export const BusinessPlanSection = styled.div`
  grid-column-start: span 2;
  display: flex;
  padding: 24px 32px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 6px rgba(0, 0, 0, 0.06);
  background: ${props => props.theme.bg.default};
  border-radius: 8px;

  @media (max-width: 1024px) {
    padding: 18px 24px;
    grid-column-start: 1;
    flex-direction: column;
  }
`;

export const BusinessPlanAction = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 24px;

  button {
    margin-top: 0;
  }

  @media (max-width: 768px) {
    margin-top: 16px;
    padding-left: 0;

    a {
      width: 100%;
    }
  }
`;

export const BusinessPlanContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PlanFeatures = styled.ul`
  list-style-type: none;
  margin-top: 16px;
  padding: 0;
`;

export const FeaturePrice = styled.span`
  grid-area: price;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;
  letter-spacing: -0.2px;
  color: ${props =>
    props.color
      ? props.theme[props.color].default
      : props.theme.success.default};
  background: ${props =>
    props.color
      ? hexa(props.theme[props.color].default, 0.08)
      : hexa(props.theme.success.default, 0.08)};
`;

export const FeatureWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: repeat(2, min-content);
  grid-template-areas: 'icon title price' '. description description' '. render render';
  color: ${props => props.theme[props.color].default};
  padding: 16px 0;
  align-items: center;
  grid-column-gap: 16px;
  border-bottom: 1px solid ${props => props.theme.bg.border};

  &:last-of-type {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .icon {
    grid-area: icon;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FeatureRender = styled.div`
  grid-area: render;
  margin-top: 16px;
`;

export const FeatureTitle = styled.p`
  grid-area: title;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.2;
  margin-top: -1px;
  color: ${props => props.theme.text.secondary};
`;

export const FeatureDescription = styled.p`
  grid-area: description;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: ${props => props.theme.text.alt};
  padding-right: 24px;
  margin-top: 8px;
`;

export const ConciergeLink = styled(Link)`
  display: flex;
  flex: none;

  button {
    padding: 12px 16px;
    margin-top: 0 !important;
  }
`;
