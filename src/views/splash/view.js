// @flow
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/logo';
import Icon from '../../components/icons';
import { hexa, Gradient, FlexCol, FlexRow } from '../../components/globals';
import Search from '../explore/components/search';

import ViewSegment from '../../components/viewSegment';
import { Conversation, Discover } from '../../components/illustrations';
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
} from './style';

// const Link = styled.a``;

type Props = Object;

const Section = (props: Props) => (
  <ViewSegment {...props}>{props.children}</ViewSegment>
);

export const Overview = (props: Props) => {
  const Text = styled(FlexCol)`
    margin: 60px 16px 120px 16px;
    text-align: center;
    align-items: center;

    @media (max-width: 768px) {
      margin-bottom: 16px;
    }
  `;

  const ThisCopy = styled(Copy)`
    font-size: 20px;
    line-height: 1.3;
    font-weight: 500;
    opacity: 0.95;

    @media (max-width: 768px) {
      font-size: 20px;
      text-align: center;
    }
  `;

  const ThisTagline = styled(Tagline)`
    margin-bottom: 16px;
    font-size: 40px;
  `;

  const Actions = styled(Flexer)`
    margin-top: 48px;
    justify-content: space-between;
  `;

  const ThisSecondaryCTA = styled(SecondaryCTA)`
    margin-left: 16px;
    font-size: 16px;
    border: 2px solid ${props => props.theme.text.reverse};

    @media (max-width: 768px) {
      margin-left: 0;
      margin-top: 16px;
    }
  `;

  const ThisPrimaryCTA = styled(PrimaryCTA)`font-size: 16px;`;

  const ThisButton = styled(SecondaryCTA)`
    padding: 12px 16px;
    border: 2px solid ${props => props.theme.text.reverse};
  `;

  return (
    <Section background="constellations" goop={2}>
      <Header>
        <Logo />
        <Link to="/login">
          <ThisButton>Log in</ThisButton>
        </Link>
      </Header>
      <Content>
        <Text>
          <ThisTagline>Build better communities</ThisTagline>
          <ThisCopy>
            Spectrum makes it easy to create and grow your online community.
          </ThisCopy>
          <Actions>
            <Link to="/new/community">
              <ThisPrimaryCTA icon="plus-fill">
                Create a community
              </ThisPrimaryCTA>
            </Link>
            <Link to="/explore">
              <ThisSecondaryCTA icon="explore">
                Find communities
              </ThisSecondaryCTA>
            </Link>
          </Actions>
        </Text>
      </Content>
    </Section>
  );
};

export const Centralized = (props: Props) => {
  const ThisContent = styled(Content)`
    img {
      margin: 24px 0;
    }
  `;

  const Text = styled(FlexCol)`
    margin: 40px 16px 64px;

    @media (max-width: 768px) {
      margin-top: 20px;
      margin-bottom: 44px;
    }
  `;

  const ThisCopy = styled(Copy)`margin-top: 16px;`;

  const ThisPrimaryCTA = styled(PrimaryCTA)`
    margin-top: 32px;
    background-color: ${props => props.theme.brand.alt};
    background-image: ${props =>
      Gradient(props.theme.brand.alt, props.theme.brand.default)};
    color: ${props => props.theme.text.reverse};

    &:hover {
      color: ${props => props.theme.text.reverse};
    }
  `;

  const Actions = styled.div`
    @media (max-width: 768px) {
      display: flex;
      justify-content: center;
    }
  `;

  const ThisTagline = styled(Tagline)`
    @media (max-width: 768px) {
      margin-bottom: 0;
    }
  `;

  return (
    <Section goop={6} color={'space.alt'}>
      <ThisContent>
        <Discover />
        <Text>
          <ThisTagline>Discoverable by default</ThisTagline>
          <ThisCopy>
            People shouldn't have to hunt down an email invite or search through
            a help center to find your community.
          </ThisCopy>
          <ThisCopy>
            When it's built on Spectrum, people can find your community
            organically with search, curation, and through other community
            members.
          </ThisCopy>
          <Actions>
            <Link to="/explore">
              <ThisPrimaryCTA icon="explore">
                Check out our top communities
              </ThisPrimaryCTA>
            </Link>
          </Actions>
        </Text>
      </ThisContent>
    </Section>
  );
};

export const CommunitySearch = (props: Props) => {
  const ThisContent = styled(Content)`
    flex-direction: column;
    width: 640px;
    align-content: center;
    align-self: center;
    margin-top: 40px;
    margin-bottom: 40px;
    padding: 16px;

    @media (max-width: 640px) {
      margin-top: 80px;
      margin-bottom: 0;
      width: 100%;
    }
  `;

  const ThisTagline = styled(Tagline)`margin-bottom: 16px;`;

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

  return (
    <Section goop={4} background="bright">
      <ThisContent>
        <ThisTagline>Find a community for you!</ThisTagline>
        <ThisCopy>
          Try searching for topics like "crypto" or for products like "React"!
        </ThisCopy>
        <Search />
      </ThisContent>
    </Section>
  );
};

export const Chat = (props: Props) => {
  const ThisContent = styled(Content)`
    overflow: hidden;
    margin: 40px 16px;

    @media (max-width: 768px) {
      margin-bottom: 0;
    }
  `;

  const ThisCopy = styled(Copy)`margin-top: 16px;`;

  const ThisPrimaryCTA = styled(PrimaryCTA)`
    background-color: ${props => props.theme.brand.alt};
    background-image: ${props =>
      Gradient(props.theme.brand.alt, props.theme.brand.default)};
    color: ${props => props.theme.text.reverse};
    margin-top: 32px;

    &:hover {
      color: ${props => props.theme.text.reverse};
    }
  `;

  const Actions = styled.div`
    @media (max-width: 768px) {
      display: flex;
      justify-content: center;
    }
  `;

  const ThisTagline = styled(Tagline)`
    @media (max-width: 768px) {
      margin-bottom: 0;
    }
  `;

  return (
    <Section goop={7} color={'space.dark'}>
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
            <Link to="/thread/764331db-16dd-4fc4-a2c5-aabd735a64a9">
              <ThisPrimaryCTA icon="message-fill">
                View a live conversation
              </ThisPrimaryCTA>
            </Link>
          </Actions>
        </FlexCol>
      </ThisContent>
    </Section>
  );
};

export const Sell = (props: Props) => {
  const Text = styled(FlexCol)`
    align-items: center;
    margin: 40px 0;
  `;

  const ThisContent = styled(Content)``;

  const ThisTagline = styled(Tagline)`
    margin-bottom: 0;
    margin-left: 16px;
    margin-right: 16px;
  `;

  const Actions = styled(Flexer)`
    margin-bottom: 48px;
    justify-content: center;
  `;

  const ThisSection = styled(Section)`margin-bottom: 40px;`;

  return (
    <ThisSection goop={2} background="dark">
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
                There's no better feedback than the insights that come directly
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
        <Link to="/new/community">
          <PrimaryCTA icon="plus-fill">
            Start building your community
          </PrimaryCTA>
        </Link>
      </Actions>
    </ThisSection>
  );
};

export const Yours = (props: Props) => {
  const ThisCopy = styled(Copy)`
    max-width: 640px;
    margin-top: 16px;
  `;

  const ThisContent = styled(Content)`
    margin: 60px 16px 40px;
    font-size: 18px;
    align-items: center;
    text-align: left;
  `;

  const ThisPrimaryCTA = styled(PrimaryCTA)`
    background-color: ${props => props.theme.brand.alt};
    background-image: ${props =>
      Gradient(props.theme.brand.alt, props.theme.brand.default)};
    color: ${props => props.theme.text.reverse};

    &:hover {
      color: ${props => props.theme.text.reverse};
    }
  `;

  const ThisSecondaryCTA = styled(SecondaryCTA)`
    margin-left: 16px;
    background-color: transparent;
    color: ${props => props.theme.brand.alt};
    border-color: ${props => props.theme.brand.alt};

    &:hover {
      border-color: ${props => props.theme.brand.alt};
      color: ${props => props.theme.brand.alt};
      box-shadow: 0 0 8px ${props => hexa(props.theme.brand.alt, 1)};
    }

    > div {
      top: -1px;
    }

    @media (max-width: 768px) {
      margin-left: 0;
      margin-top: 16px;
    }
  `;

  const Actions = styled(Flexer)`
    margin-top: 32px;
    justify-content: flex-start;

    > a {
      display: inline-block;
    }

    @media (max-width: 768px) {
      justify-content: center;
    }
  `;

  return (
    <Section goop={1} color="bg.reverse">
      <ThisContent>
        <FlexCol>
          <Tagline>All your communities in one place</Tagline>
          <ThisCopy>
            Before Spectrum, participating in online communities meant joining
            multiple platforms, remembering different logins, and managing
            endless notifications.
          </ThisCopy>
          <ThisCopy>
            On Spectrum you only have one account, and the conversations that
            matter come to you in one simple feed &mdash; no matter which
            community they're in.
          </ThisCopy>
          <Actions>
            <Link to="/new/community">
              <ThisPrimaryCTA icon="plus-fill">
                Create a community
              </ThisPrimaryCTA>
            </Link>
            <Link to="/explore">
              <ThisSecondaryCTA icon="explore">
                Find communities
              </ThisSecondaryCTA>
            </Link>
          </Actions>
        </FlexCol>
      </ThisContent>
    </Section>
  );
};

export const PageFooter = (props: Props) => {
  return (
    <Footer>
      <FlexRow>
        <a href="/spectrum">
          <Icon glyph="logo" size={48} />
        </a>
      </FlexRow>
      <Flexer>
        <LinkBlock href="https://github.com/withspectrum/code-of-conduct">
          <div>Code of Conduct</div>
        </LinkBlock>
        <LinkBlock href="mailto:support@spectrum.chat">
          <div>Support</div>
        </LinkBlock>
        <LinkBlock href="mailto:hi@spectrum.chat">
          <div>Contact</div>
        </LinkBlock>
      </Flexer>
    </Footer>
  );
};
