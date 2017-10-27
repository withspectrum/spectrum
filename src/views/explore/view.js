import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Transition, zIndex, Shadow, hexa } from '../../components/globals';
import ViewSegment from '../../components/viewSegment';
import { Button } from '../../components/buttons';
import Search from './components/search';
import { UpsellSignIn } from '../../components/upsell';
import {
  Header,
  Tagline,
  Copy,
  Bullets,
  Bullet,
  BulletHeading,
  BulletTitle,
  BulletCopy,
  LinkBlock,
  Footer,
  Flexer,
  PrimaryCTA,
  SecondaryCTA,
  Content,
} from '../splash/style';

export const CommunitySearch = (props: Props) => {
  const ThisContent = styled(Content)`
    flex-direction: column;
    width: 640px;
    align-content: center;
    align-self: center;
    margin-top: 40px;
    margin-bottom: 0;
    padding: 16px;

    @media (max-width: 640px) {
      margin-top: 80px;
      margin-bottom: 0;
      width: 100%;
    }
  `;

  const PrimaryCTA = styled(Button)`
    padding: 12px 16px;
    font-weight: 700;
    font-size: 14px;
    border-radius: 12px;
    background-color: ${props => props.theme.bg.default};
    background-image: none;
    color: ${props => props.theme.brand.alt};
    transition: ${Transition.hover.off};
    z-index: ${zIndex.card};

    &:hover {
      background-color: ${props => props.theme.bg.default};
      color: ${props => props.theme.brand.default};
      box-shadow: ${Shadow.high} ${props => hexa(props.theme.bg.reverse, 0.5)};
      transition: ${Transition.hover.on};
    }
  `;

  const SecondaryContent = styled(ThisContent)`margin-top: 0;`;

  const ThisTagline = styled(Tagline)`margin-bottom: 0;`;

  const SecondaryTagline = styled(ThisTagline)`
    font-size: 20px;
    font-weight: 900;
  `;

  const ThisCopy = styled(Copy)`
    font-size: 16px;
    margin-bottom: 32px;
    font-weight: 500;
    text-align: center;
    max-width: 640px;

    @media (max-width: 768px) {
      text-align: left;
    }
  `;

  const SecondaryCopy = styled(ThisCopy)`margin-bottom: 16px;`;

  return (
    <ViewSegment goop={3} background="constellations">
      <ThisContent>
        <ThisTagline>Find a community for you!</ThisTagline>
        <ThisCopy>
          Try searching for topics like "crypto" or for products like "React"!
        </ThisCopy>
        {props.children}
        {props.currentUser ? (
          <SecondaryContent>
            <SecondaryTagline>...or create your own community</SecondaryTagline>
            <SecondaryCopy>
              Building communities on Spectrum is easy and free forever
            </SecondaryCopy>
            <Link to={`/new/community`}>
              <PrimaryCTA>Get Started</PrimaryCTA>
            </Link>
          </SecondaryContent>
        ) : (
          <UpsellSignIn redirectPath={props.redirectPath} />
        )}
      </ThisContent>
    </ViewSegment>
  );
};
