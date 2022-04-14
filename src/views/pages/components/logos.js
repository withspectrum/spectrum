// @flow
import React from 'react';
import styled from 'styled-components';
import { MEDIA_BREAK } from 'src/components/layout';

const Logo = styled.img`
  height: 32px;
  object-fit: contain;

  @media (max-width: ${MEDIA_BREAK}px) {
    height: 24px;
  }
`;

export const AbstractLogo = () => <Logo src="/img/logos/abstract.svg" alt="" />;

export const BootstrapLogo = () => (
  <Logo src="/img/logos/bootstrap.svg" alt="" />
);

export const ExpoLogo = () => <Logo src="/img/logos/expo.svg" alt="" />;

export const FigmaLogo = () => <Logo src="/img/logos/figma.svg" alt="" />;

export const InvisionLogo = () => <Logo src="/img/logos/invision.svg" alt="" />;

export const NodeLogo = () => <Logo src="/img/logos/nodejs.svg" alt="" />;

export const RealmLogo = () => <Logo src="/img/logos/realm.svg" alt="" />;

export const SketchLogo = () => <Logo src="/img/logos/sketch.svg" alt="" />;
