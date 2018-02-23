// @flow
import React from 'react';
import styled from 'styled-components';
import { FlexCol, zIndex, hexa, Gradient } from 'src/components/globals';

export const Layout = styled.div`
  flex: auto;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto 1fr;
  grid-template-areas: 'pricing' 'cta';
  width: 100%;
  justify-items: stretch;
  z-index: ${zIndex.background + 1};
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin: 32px 0 -80px;
  }
`;

export const Packages = styled.div`
  grid-area: pricing;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: calc(100% - 64px);
  max-width: 1280px;
  grid-template-rows: auto;
  grid-row-gap: 32px;
  grid-column-gap: 16px;
  grid-template-areas: 'open indie business';
  justify-self: center;

  @media (max-width: 768px) {
    ${'' /* width: 100%; */} grid-template-columns: 100%;
    grid-template-rows: repeat(3, auto);
    grid-row-gap: 0;
    grid-column-gap: 0;
    grid-template-areas: 'open' 'indie' 'business';
    margin-right: 0;
    transform: none;
  }
`;

export const Plan = styled.div`
  display: grid;
  grid-template-rows: repeat(2, auto) 1fr;
  padding: 32px;
`;

export const CostNumber = styled.h2`
  font-weight: 900;
  font-size: 64px;
  letter-spacing: -2px;
  vertical-align: baseline;
  position: relative;

  &:before {
    content: '$';
    vertical-align: top;
    position: absolute;
    top: 22px;
    right: calc(100% + 4px);
    font-weight: 500;
    font-size: 20px;
    letter-spacing: normal;
    color: ${props => props.theme.text.placeholder};
  }

  &:after {
    content: ${props => (props.per ? `'/ ${props.per}'` : "''")};
    position: absolute;
    font-size: 14px;
    white-space: nowrap;
    left: calc(100% + 4px);
    bottom: 22px;
    font-weight: 700;
    letter-spacing: normal;
    color: ${props => props.theme.text.placeholder};
  }
`;

export const Title = styled.h1`
  text-align: center;
  font-weight: 700;
  margin-bottom: 24px;
`;

export const Feature = styled.li`
  text-indent: -18px;
  font-weight: 500;

  a {
    font-weight: 500;
    text-decoration: underline;
    color: ${props => props.theme.brand.alt};
  }

  b {
    font-weight: 700;
  }

  + li {
    margin-top: 16px;
  }

  &:before {
    content: '+';
    margin-right: 8px;
    font-weight: 700;
    color: ${props => props.theme.text.placeholder};
  }
`;

export const PackageContents = styled.ul`
  padding: 16px;
  list-style: none;
  font-size: 16px;
  font-weight: 500;
  text-shadow: none;
  border-top: 2px solid;
`;

export const Cost = styled(FlexCol)`
  align-items: center;
  justify-content: flex-end;
  text-align: center;
  margin-top: 16px;
  position: relative;
`;

export const CostPer = styled.span`
  position: relative;
  font-weight: 500;
  letter-spacing: normal;
`;

export const Free = styled(Plan)`
  grid-area: open;
  color: ${props => props.theme.text.default};
  background-color: ${props => props.theme.bg.default};
  box-shadow: 0 8px 32px ${props => hexa(props.theme.text.alt, 0.35)};

  @media (max-width: 768px) {
    padding-top: 16px;
  }

  ${PackageContents} {
    border-color: ${props => props.theme.bg.border};
  }

  ${CostNumber} {
    &:before {
      content: '';
    }
  }
`;

const Indie = styled(Plan)`
  grid-area: indie;
  color: ${props => props.theme.text.reverse};
  text-shadow: 0 0 8px ${props => hexa(props.theme.brand.dark, 0.65)};
  background-color: ${props => props.theme.brand.default};
  background-image: ${props =>
    Gradient(props.theme.brand.alt, props.theme.brand.default)};
  box-shadow: 0 8px 32px ${props => hexa(props.theme.brand.alt, 0.5)};

  @media (max-width: 768px) {
    padding-top: 16px;
    margin-top: 16px;
  }

  ${PackageContents} {
    border-color: ${props => hexa(props.theme.brand.border, 0.5)};
  }

  ${Feature} {
    a {
      font-weight: 700;
      color: inherit;
    }

    &:before {
      color: ${props => hexa(props.theme.brand.border, 0.5)};
    }
  }

  ${CostNumber} {
    left: -16px;

    &:before,
    &:after {
      color: ${props => props.theme.brand.border};
    }
  }
`;

export const Paid = styled(Plan)`
  grid-area: business;
  color: ${props => props.theme.text.reverse};
  text-shadow: 0 0 8px ${props => hexa(props.theme.text.default, 0.5)};
  background-color: ${props => props.theme.bg.reverse};
  background-image: ${props =>
    Gradient(props.theme.text.alt, props.theme.bg.reverse)};
  box-shadow: 0 8px 32px ${props => hexa(props.theme.text.default, 0.5)};

  @media (max-width: 768px) {
    padding-top: 16px;
    margin-top: 16px;
    margin-bottom: 64px;
  }

  ${PackageContents} {
    border-color: ${props => hexa(props.theme.bg.border, 0.5)};
  }

  ${Feature} {
    a {
      font-weight: 700;
      color: inherit;
    }

    &:before {
      color: ${props => hexa(props.theme.bg.border, 0.5)};
    }
  }

  ${CostNumber} {
    left: -16px;

    &:before,
    &:after {
      color: ${props => props.theme.bg.border};
    }
  }
`;

export const PlanSelector = (props: Props) => {
  return (
    <Layout>
      <Packages>
        <Free>
          <Title>Open</Title>
          <PackageContents>
            <Feature>1 administrator seat</Feature>
            <Feature>Unlimited public channels</Feature>
          </PackageContents>
          <Cost>
            <CostNumber>Free</CostNumber>
          </Cost>
        </Free>
        <Indie>
          <Title>Indie</Title>
          <PackageContents>
            <Feature>1 extra moderator seat</Feature>
            <Feature>Unlimited public and private channels</Feature>
            <Feature>Priority support</Feature>
          </PackageContents>
          <Cost>
            <CostNumber per="month">15</CostNumber>
          </Cost>
        </Indie>
        <Paid>
          <Title>Business</Title>
          <PackageContents>
            <Feature>3 extra moderator seats</Feature>
            <Feature>Unlimited public and private channels</Feature>
            <Feature>Priority support</Feature>
            <Feature>Analytics</Feature>
          </PackageContents>
          <Cost>
            <CostNumber per="month">100</CostNumber>
          </Cost>
        </Paid>
      </Packages>
    </Layout>
  );
};
