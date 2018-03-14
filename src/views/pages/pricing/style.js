// @flow
import styled, { css } from 'styled-components';
import { hexa } from 'src/components/globals';

export const ContentContainer = styled.div`
  padding: 32px;
  padding-top: 64px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0 auto;
  max-width: 768px;

  @media (max-width: 768px) {
    padding-top: 0;
    padding: 16px;
  }
`;

export const PageTitle = styled.h1`
  font-size: 54px;
  font-weight: 700;
  color: ${props => props.theme.text.default};
  line-height: 1.2;
  margin: 48px 0 24px;

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

export const PageSubtitle = styled.h2`
  font-size: 28px;
  font-weight: 400;
  color: ${props => props.theme.text.secondary};
  line-height: 1.4;

  strong {
    font-weight: 500;
    color: ${props => props.theme.text.default};
  }

  @media (max-width: 768px) {
    font-size: 24px;
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

export const FeaturesList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 48px -64px 0;
  width: calc(100% + 128px);

  @media (max-width: 896px) {
    margin: 48px 0 0;
    width: 100%;
  }
`;

export const Feature = styled.li`
  display: flex;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 6px rgba(0, 0, 0, 0.06);
  background: ${props => props.theme.bg.default};
  transition: all 0.2s cubic-bezier(0.77, 0, 0.175, 1);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  & + & {
    margin-top: 16px;
  }
`;

export const FeatureContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  padding-right: 24px;
  transition: all 0.2s cubic-bezier(0.77, 0, 0.175, 1);

  @media (max-width: 768px) {
    padding-right: 0;
  }
`;

export const FeatureIcon = styled.div`
  color: ${props =>
    props.color
      ? props.theme[props.color].default
      : props.theme.success.default};
  display: flex;
  align-items: flex-start;
  margin-right: 16px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const PriceLabel = styled.span`
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

export const FeatureLabel = styled.h5`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.6px;
  color: ${props =>
    props.color ? props.theme[props.color].default : props.theme.text.default};

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;

    ${PriceLabel} {
      margin-left: 0;
      text-align: center;
      margin-top: 8px;
    }
  }
`;

export const FeatureSublabel = styled.h6`
  font-size: 18px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.2px;
  margin-top: 16px;
  color: ${props => props.theme.text.default};
`;

export const FeatureDescription = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: ${props => props.theme.text.alt};
  line-height: 1.4;
  margin-top: 8px;
  display: flex;
  flex: 1 0 auto;
  max-width: ${props => (props.isExpanded ? '80%' : '100%')};

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const Highlight = styled.span`
  box-shadow: inset 0 -28px 0 rgba(74, 2, 210, 0.1);
  font-weight: 600;
  padding: 4px 0;
  line-height: 1.6;
`;

export const FeatureAction = styled.div`
  display: flex;
  align-items: center;
  flex: 1 0 auto;
  justify-content: flex-end;

  @media (max-width: 768px) {
    margin-top: 16px;
    justify-content: center;

    button {
      width: 100%;
    }
  }
`;

export const FeatureButton = styled.button`
  -webkit-display: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 18px;
  font-weight: 600;
  color: ${props =>
    props.color ? props.theme[props.color].default : props.theme.text.alt};
  background: ${props =>
    props.color
      ? hexa(props.theme[props.color].default, 0.08)
      : props.theme.bg.wash};
  transition: all 0.2s cubic-bezier(0.77, 0, 0.175, 1);

  &:hover {
    color: ${props =>
      props.color
        ? props.theme[props.color].default
        : props.theme.text.default};
    background: ${props =>
      props.color
        ? hexa(props.theme[props.color].default, 0.1)
        : props.theme.bg.wash};
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.77, 0, 0.175, 1);
  }
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

export const CommunityListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
  justify-content: center;
  margin: 48px -64px 0;
  width: calc(100% + 128px);

  @media (max-width: 896px) {
    width: 100%;
    margin: 48px 0 0;
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const CommunityCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 16px 16px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 6px rgba(0, 0, 0, 0.06);
  background: ${props => props.theme.bg.default};
  align-items: center;

  a {
    width: 100%;
    display: block;
    margin-bottom: 8px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
`;

export const CommunityCardAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 8px;
`;

export const CommunityCardName = styled.h6`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${props => props.theme.text.default};
`;

export const CommunityCardButton = styled.button`
  -webkit-display: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.text.alt};
  background: ${props => props.theme.bg.wash};
  transition: all 0.2s cubic-bezier(0.77, 0, 0.175, 1);
  width: 100%;

  &:hover {
    color: ${props => props.theme.text.default};
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.77, 0, 0.175, 1);
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
  margin-top: 24px;
  padding-top: 8px;
  padding-bottom: 16px;
  border-top: 1px solid ${props => props.theme.bg.border};
`;

export const PriceTable = styled.div`
  margin: 0 -128px;
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

export const PlanSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  justify-content: space-between;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 6px rgba(0, 0, 0, 0.06);
  background: ${props => props.theme.bg.default};
  border-radius: 8px;

  @media (max-width: 1024px) {
    grid-column-start: 1;
    padding: 18px 24px;
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

const gradient = (c1, c2) => `linear-gradient(${c1} 0%, ${c2} 100%)`;
export const TableCardButton = styled.button`
  display: flex;
  flex: none;
  align-self: center;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: 600;
  white-space: nowrap;
  word-break: keep-all;
  transition: all 0.2s;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  position: relative;
  text-align: center;
  padding: 12px 16px;
  width: 100%;
  border: ${props =>
    props.light
      ? `1px solid ${props.theme.bg.border}`
      : `1px solid ${props.theme.brand.default}`};
  color: ${props =>
    props.light ? props.theme.text.secondary : props.theme.text.reverse};
  background-image: ${props =>
    props.light
      ? gradient(props.theme.bg.default, props.theme.bg.wash)
      : gradient(props.theme.brand.alt, props.theme.brand.default)};
  box-shadow: ${props =>
    props.light ? '0 1px 3px rgba(0,0,0,0.04)' : '0 2px 4px rgba(0,0,0,0.2)'};
  margin-top: 16px;

  img {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-right: 8px;
  }

  &:hover {
    transition: all 0.2s;
    box-shadow: ${props =>
      props.light
        ? '0 2px 6px rgba(0,0,0,0.06)'
        : '0 4px 12px rgba(0,0,0,0.2)'};
  }
`;

export const PlanFeatures = styled.ul`
  list-style-type: none;
  margin: 24px 0 16px;
  padding: 0;

  @media (max-width: 768px) {
    margin: 16px 0 8px;
  }
`;

export const PlanFeatureContainer = styled.li`
  color: ${props => props.theme[props.color].default};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid ${props => props.theme.bg.wash};

  &:last-of-type {
    border-bottom: 0;
  }

  .icon {
    margin-right: 12px;
  }

  @media (max-width: 768px) {
    flex-direction: column;

    ${PriceLabel} {
      margin-left: 0px;
      margin-top: 16px;
    }
  }
`;

export const PlanFeatureContent = styled.div`
  display: flex;
  align-items: flex-start;

  @media (max-width: 768px) {
    ${props =>
      props.hideIconsOnMobile &&
      css`
        .icon {
          display: none;
        }
      `};
  }
`;

export const PlanFeatureText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PlanFeatureTitle = styled.p`
  font-size: 17px;
  font-weight: 500;
  line-height: 1;
  margin-top: 4px;
  color: ${props => props.theme.text.secondary};
`;

export const PlanFeatureSubtitle = styled.p`
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  color: ${props => props.theme.text.alt};
  padding-right: 24px;
  margin-top: 8px;
`;

export const SampleCommunitiesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 90%;

  a {
    display: inline-block;
    margin-right: 16px;
  }
`;
