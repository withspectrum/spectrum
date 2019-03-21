// @flow
import theme from 'shared/theme';
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Icon from 'src/components/icon';
import { UserAvatar } from 'src/components/avatar';
import { FlexCol, Transition, HorizontalRule } from 'src/components/globals';
import Search from '../explore/components/search';
import Section from 'src/components/themedSection';
import {
  PrimaryButton,
  WhiteOutlineButton,
  WhiteButton,
} from 'src/components/button';
import { Conversation, Discover } from 'src/components/illustrations';
import {
  AbstractLogo,
  BootstrapLogo,
  ExpoLogo,
  FigmaLogo,
  InvisionLogo,
  ZeitLogo,
  SketchLogo,
  RealmLogo,
  NodeLogo,
} from './components/logos';
import {
  Tagline,
  Copy,
  Bullets,
  Bullet,
  BulletHeading,
  BulletTitle,
  BulletCopy,
  Flexer,
  PrimaryCTA,
  Content,
} from './style';
import { track, events } from 'src/helpers/analytics';
import { MEDIA_BREAK } from 'src/components/layout';

export const Overview = () => {
  const ThisContent = styled(Content)`
    max-width: 100vw;
    margin-top: 92px;
    margin-bottom: 80px;

    @media (max-width: 640px) {
      margin-bottom: 40px;
    }
  `;

  const Text = styled(FlexCol)`
    margin: 120px 32px 120px 32px;
    text-align: left;
    align-items: flex-start;
    z-index: 2;

    @media (max-width: ${MEDIA_BREAK}px) {
      margin-top: 0;
      margin-bottom: 16px;
      text-align: center;
      align-items: center;
    }
  `;

  const ThisCopy = styled(Copy)`
    line-height: 1.6;
    font-weight: 500;
    max-width: 580px;

    @media (max-width: ${MEDIA_BREAK}px) {
      text-align: center;
    }
  `;

  const ThisTagline = styled(Tagline)`
    margin-bottom: 16px;
    font-size: 40px;

    @media (max-width: ${MEDIA_BREAK}px) {
      font-size: 24px;
    }
  `;

  const Actions = styled.div`
    display: flex;
    margin-top: 48px;
    width: 100%;
    align-items: flex-start;

    @media (max-width: ${MEDIA_BREAK}px) {
      flex-direction: column;
      align-items: center;
    }
  `;

  const ThisSecondaryCTA = styled(WhiteOutlineButton)`
    margin-left: 16px;
    font-size: 16px;

    @media (max-width: ${MEDIA_BREAK}px) {
      margin-left: 0;
      margin-top: 16px;
    }
  `;

  const ThisText = styled(Text)`
    position: relative;
    right: 20vw;

    @media (max-width: 1400px) {
      right: 15vw;
    }

    @media (max-width: 1200px) {
      right: 0;
    }
  `;

  const ThisPrimaryCTA = styled(WhiteButton)`
    color: ${theme.brand.alt};

    &:hover {
      color: ${theme.brand.default};
    }
  `;

  const Img = styled.img`
    position: absolute;
    top: 32px;
    bottom: 0;
    left: calc(25vw + 480px);
    max-height: calc(100% - 32px);
    z-index: 0;

    @media (max-width: 1400px) {
      left: calc(20vw + 480px);
    }

    @media (max-width: 1200px) {
      display: none;
    }

    @media (max-width: ${MEDIA_BREAK}px) {
      display: none;
    }
  `;

  return (
    <Section background="constellations" goop={2}>
      <ThisContent>
        <ThisText>
          <ThisTagline>The community platform for the future.</ThisTagline>
          <ThisCopy>The internet was built for communities.</ThisCopy>
          <ThisCopy>
            But, as the web has changed and improved radically, community
            software has hardly improved since the heyday of messageboards and
            IRC.
          </ThisCopy>
          <ThisCopy>
            Spectrum makes it easy to grow safe, successful online communities
            that are built to last.
          </ThisCopy>
          <Actions>
            <ThisPrimaryCTA
              to="/login"
              onClick={() => track(events.HOME_PAGE_JOIN_SPECTRUM_CLICKED)}
            >
              Join Spectrum
            </ThisPrimaryCTA>
            <ThisSecondaryCTA
              to="/new/community"
              onClick={() => track(events.HOME_PAGE_CREATE_COMMUNITY_CLICKED)}
            >
              Create your community
            </ThisSecondaryCTA>
          </Actions>
        </ThisText>
        <Img src={'/img/diagram.svg'} alt="" />
      </ThisContent>
    </Section>
  );
};

export const Centralized = () => {
  const ThisContent = styled(Content)`
    img {
      margin: 24px 0;
    }
  `;

  const Text = styled(FlexCol)`
    margin: 40px 16px 64px;

    @media (max-width: ${MEDIA_BREAK}px) {
      margin-top: 20px;
      margin-bottom: 44px;
    }
  `;

  const ThisCopy = styled(Copy)`
    font-weight: 400;
    margin-top: 16px;
  `;

  const ThisPrimaryCTA = styled(PrimaryButton)`
    margin-top: 32px;
  `;

  const Actions = styled.div`
    @media (max-width: ${MEDIA_BREAK}px) {
      display: flex;
      justify-content: center;
    }
  `;

  const ThisTagline = styled(Tagline)`
    @media (max-width: ${MEDIA_BREAK}px) {
      margin-bottom: 0;
    }
  `;

  const LogoSection = styled.div`
    display: flex;
    align-self: center;
    max-width: 80vw;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    z-index: 2;
    margin-bottom: 80px;

    img {
      margin-top: 32px;
      margin-right: 32px;

      &:last-of-type {
        margin-right: 0;
      }
    }
  `;

  return (
    <Section goop={6} color={'space.alt'}>
      <ThisContent>
        <Discover />
        <Text>
          <ThisTagline>Grow together</ThisTagline>
          <ThisCopy>
            By building on Spectrum, communities become easily discoverable
            through search, curation, and even other community members.
          </ThisCopy>
          <ThisCopy>
            It also means no more managing multiple logins or playing
            whack-a-mole with different notifications and preferences. Everyone
            wins!
          </ThisCopy>
          <Actions>
            <ThisPrimaryCTA
              to="/explore"
              onClick={() => track(events.HOME_PAGE_EXPLORE_CLICKED)}
            >
              Explore communities
            </ThisPrimaryCTA>
          </Actions>
        </Text>
      </ThisContent>
      <LogoSection>
        <FigmaLogo />
        <BootstrapLogo />
        <ExpoLogo />
        <ZeitLogo />
        <SketchLogo />
        <AbstractLogo />
        <RealmLogo />
        <NodeLogo />
        <InvisionLogo />
      </LogoSection>
    </Section>
  );
};

export const CommunitySearch = () => {
  const ThisContent = styled(Content)`
    flex-direction: column;
    width: 640px;
    align-content: center;
    align-self: center;
    margin-top: 40px;
    margin-bottom: 80px;
    padding: 16px;

    @media (max-width: 640px) {
      margin-top: 80px;
      width: 100%;
    }
  `;

  const ThisTagline = styled(Tagline)`
    margin-bottom: 16px;
  `;

  const ThisCopy = styled(Copy)`
    font-size: 18px;
    margin-bottom: 32px;
    font-weight: 500;
    text-align: center;
    max-width: 640px;

    @media (max-width: ${MEDIA_BREAK}px) {
      text-align: left;
    }
  `;

  return (
    <Section goop={4} background="bright">
      <ThisContent>
        <ThisTagline>Find a community for you!</ThisTagline>
        <ThisCopy>
          Try searching for topics like “crypto” or for products like “React”!
        </ThisCopy>
        <Search />
      </ThisContent>
    </Section>
  );
};

export const Chat = () => {
  const ThisContent = styled(Content)`
    overflow: hidden;
    margin: 40px 16px 80px;

    @media (max-width: ${MEDIA_BREAK}px) {
      margin-bottom: 40px;
    }
  `;

  const ThisCopy = styled(Copy)`
    font-weight: 400;
    margin-top: 16px;
  `;

  const ThisPrimaryCTA = styled(PrimaryButton)``;

  const Actions = styled.div`
    margin-top: 32px;

    @media (max-width: ${MEDIA_BREAK}px) {
      display: flex;
      justify-content: center;
    }
  `;

  const ThisTagline = styled(Tagline)`
    @media (max-width: ${MEDIA_BREAK}px) {
      margin-bottom: 0;
    }
  `;

  return (
    <Section goop={7} color={'bg.reverse'}>
      <ThisContent>
        <Conversation />
        <FlexCol>
          <ThisTagline>Real-time messaging with long-term value</ThisTagline>
          <ThisCopy>
            Conversations on Spectrum are real-time chat, just like your
            favorite messaging app. But on Spectrum, conversations continue to
            provide value to more and more people over time.
          </ThisCopy>
          <ThisCopy>
            Every conversation gets a unique link to make it easy for people to
            discover, share, or save for later.
          </ThisCopy>

          <Actions>
            <ThisPrimaryCTA
              to="/thread/764331db-16dd-4fc4-a2c5-aabd735a64a9"
              onClick={() =>
                track(events.HOME_PAGE_EXAMPLE_CONVERSATION_CLICKED)
              }
            >
              Check out a conversation
            </ThisPrimaryCTA>
          </Actions>
        </FlexCol>
      </ThisContent>
    </Section>
  );
};

export const Sell = () => {
  const Text = styled(FlexCol)`
    align-items: center;
    margin: 40px 0;
  `;

  const ThisContent = styled(Content)`
    margin-bottom: 80px;
  `;

  const ThisTagline = styled(Tagline)`
    margin-bottom: 0;
    margin-left: 16px;
    margin-right: 16px;
  `;

  const Actions = styled(Flexer)`
    margin-bottom: 48px;
    justify-content: center;
  `;

  const ThisSection = styled(Section)`
    margin-bottom: 40px;
  `;

  return (
    <ThisSection goop={2} background="dark" color={'bg.reverse'}>
      <ThisContent>
        <Text>
          <ThisTagline>Spectrum saves you time and money</ThisTagline>
          <Bullets>
            <Bullet>
              <BulletHeading>
                <BulletTitle>Supercharge support</BulletTitle>
              </BulletHeading>
              <BulletCopy>
                Stop wasting time with endless private customer support threads
                answering the same question over and over.
              </BulletCopy>
              <BulletCopy>
                Now your team can have conversations with your community as a
                whole and chat privately when a particular issue is sensitive.
              </BulletCopy>
            </Bullet>
            <Bullet>
              <BulletHeading>
                <BulletTitle>Bring people together</BulletTitle>
              </BulletHeading>
              <BulletCopy>
                Spectrum gives your top supporters and advocates a place to
                share their knowledge, empower others, and foster a place of
                belonging for everyone.
              </BulletCopy>
            </Bullet>
            <Bullet>
              <BulletHeading>
                <BulletTitle>Tighten your feedback loop</BulletTitle>
              </BulletHeading>
              <BulletCopy>
                There’s no better feedback than the insights that come directly
                from your customers.
              </BulletCopy>
              <BulletCopy>
                Think of Spectrum as a new direct line to discovering what your
                audience wants the most.
              </BulletCopy>
            </Bullet>
          </Bullets>
        </Text>
      </ThisContent>
      <Actions>
        <PrimaryCTA
          to="/new/community"
          onClick={() => track(events.HOME_PAGE_CREATE_COMMUNITY_CLICKED)}
        >
          Start building your community
        </PrimaryCTA>
      </Actions>
    </ThisSection>
  );
};

export const Yours = () => {
  const ThisContent = styled(Content)`
    margin: 60px 16px 80px;
    font-size: 18px;
    align-items: center;
    text-align: left;
  `;

  const ThisTagline = styled(Tagline)`
    text-align: center;
    align-self: center;
  `;

  const ThisSecondaryCTA = styled(WhiteOutlineButton)`
    margin-left: 16px;

    @media (max-width: ${MEDIA_BREAK}px) {
      margin-left: 0;
      margin-top: 16px;
    }
  `;

  const ThisPrimaryCTA = styled(WhiteButton)``;

  const Actions = styled(Flexer)`
    margin-top: 32px;
    justify-content: center;

    > a {
      display: inline-block;
    }

    @media (max-width: ${MEDIA_BREAK}px) {
      justify-content: center;
    }
  `;

  const Quotes = styled.div`
    display: flex;
    flex: auto;
    align-items: start;
    justify-content: center;
    padding: 40px 0;
    max-width: 100vw;
    flex-wrap: wrap;
    margin-left: -32px;

    @media (max-width: ${MEDIA_BREAK}px) {
      display: none;
    }
  `;

  const Quote = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: white;
    width: 400px;
    min-width: 320px;
    flex: none;
    box-shadow: 0 8px 16px #000;
    color: ${theme.text.default};
    position: relative;
    padding: 24px;
    transition: ${Transition.hover.off};
    margin-top: 32px;
    margin-left: 32px;

    &:hover {
      box-shadow: 0 0px 32px ${theme.brand.alt};
      transition: ${Transition.hover.on};

      > div {
        color: ${theme.brand.alt};
        transition: ${Transition.hover.on};
      }
    }
  `;

  const Pullquote = styled.p`
    padding: 0;
    padding-left: 16px;
    line-height: 1.6;
    margin: 16px 8px 8px 8px;
    font-size: 16px;
    position: relative;
    z-index: 2;
  `;

  const Signature = styled(Link)`
    font-weight: 700;
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-top: 16px;
    margin-left: 8px;

    div {
      margin-right: 8px;
    }

    span {
      color: ${theme.text.alt};
      font-weight: 400;
      margin-left: 4px;
    }
  `;

  const Rule = styled(HorizontalRule)`
    color: ${theme.brand.border};
    transition: ${Transition.hover.off};

    hr {
      color: inherit;
      border-color: currentColor;
    }
  `;

  return (
    <Section goop={0} background={'reverse'}>
      <ThisContent>
        <FlexCol>
          <ThisTagline>You’re gonna love Spectrum.</ThisTagline>
          <Quotes>
            <Quote>
              <Rule>
                <hr />
                <Icon glyph="quote" />
                <hr />
              </Rule>
              <Pullquote>
                okay, honestly Spectrum is the best thing that happened to me
                regarding social interaction in 2017
              </Pullquote>
              <Signature to="/users/traykov">
                <UserAvatar
                  size={40}
                  username={'traykov'}
                  isClickable={false}
                />
                Alexander Traykov
                <span>@Traykov</span>
              </Signature>
            </Quote>
            <Quote>
              <Rule>
                <hr />
                <Icon glyph="quote" />
                <hr />
              </Rule>
              <Pullquote>
                Spectrum will take the place that Reddit used to have a long
                time ago for communities (especially tech) to freely share ideas
                and interact. Except realtime and trolling-free
              </Pullquote>
              <Signature to="/users/rauchg">
                <UserAvatar size={40} username={'rauchg'} isClickable={false} />
                Guillermo Rauch
                <span>@rauchg</span>
              </Signature>
            </Quote>
            <Quote>
              <Rule>
                <hr />
                <Icon glyph="quote" />
                <hr />
              </Rule>
              <Pullquote>
                Spectrum is definitely a product worth looking out for. Huge fan
                and been lovely to be a part of the unique communities.
              </Pullquote>
              <Signature to="/users/tayler-m-odea">
                <UserAvatar
                  size={40}
                  username={'tayler-m-odea'}
                  isClickable={false}
                />
                Tayler O’Dea
                <span>@tayler-m-odea</span>
              </Signature>
            </Quote>
          </Quotes>
          <Actions>
            <ThisPrimaryCTA
              to="/login"
              onClick={() => track(events.HOME_PAGE_JOIN_SPECTRUM_CLICKED)}
            >
              Join Spectrum
            </ThisPrimaryCTA>
            <ThisSecondaryCTA
              to="/explore"
              onClick={() => track(events.HOME_PAGE_CREATE_COMMUNITY_CLICKED)}
            >
              Explore communities
            </ThisSecondaryCTA>
          </Actions>
        </FlexCol>
      </ThisContent>
    </Section>
  );
};
