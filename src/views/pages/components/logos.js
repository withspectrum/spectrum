// @flow
import React from 'react';
import styled from 'styled-components';

const Logo = styled.img`
  height: 32px;
  object-fit: contain;

  @media (max-width: 768px) {
    height: 24px;
  }
`;

export const AbstractLogo = () => <Logo src="/img/logos/abstract.svg" />;

export const BootstrapLogo = () => <Logo src="/img/logos/bootstrap.svg" />;

export const ExpoLogo = () => <Logo src="/img/logos/expo.svg" />;

export const FigmaLogo = () => <Logo src="/img/logos/figma.svg" />;

export const InvisionLogo = () => <Logo src="/img/logos/invision.svg" />;

export const NodeLogo = () => <Logo src="/img/logos/nodejs.svg" />;

export const RealmLogo = () => <Logo src="/img/logos/realm.svg" />;

export const SketchLogo = () => <Logo src="/img/logos/sketch.svg" />;

export const ZeitLogo = () => <Logo src="/img/logos/zeit.svg" />;
