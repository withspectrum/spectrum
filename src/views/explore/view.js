import React from 'react';
import styled from 'styled-components';
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

  const SecondaryContent = styled(ThisContent)`margin-top: 0;`;

  const ThisTagline = styled(Tagline)`margin-bottom: 16px;`;

  const SecondaryTagline = styled(ThisTagline)`font-size: 24px;`;

  const ThisCopy = styled(Copy)`
    font-size: 18px;
    margin-bottom: 32px;
    font-weight: 500;
    text-align: center;
    max-width: 640px;

    @media (max-width: 768px) {
      text-align: left;
    }
  `;

  const SecondaryCopy = styled(ThisCopy)``;

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
            <SecondaryTagline>Or create your own community</SecondaryTagline>
            <SecondaryCopy>
              Building communities on Spectrum is easy and free forever
            </SecondaryCopy>
            <Button>Button</Button>
          </SecondaryContent>
        ) : (
          <UpsellSignIn redirectPath={props.redirectPath} />
        )}
      </ThisContent>
    </ViewSegment>
  );
};
