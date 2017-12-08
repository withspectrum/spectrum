// @flow
import React from 'react';
import styled, { css } from 'styled-components';
import Link from 'src/components/link';
import { Logo } from '../../components/logo';
import Icon from '../../components/icons';
import {
  zIndex,
  hexa,
  Shadow,
  Gradient,
  FlexCol,
  FlexRow,
  H1,
  H2,
  Span,
  P,
  Transition,
} from '../../components/globals';
import Search from '../explore/components/search';
import { Communities } from './components/communities';
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
  const ThisContent = styled(Content)`margin-top: 96px;`;

  const Text = styled(FlexCol)`
    margin: 120px 16px 120px 16px;
    text-align: left;
    align-items: flex-start;
    z-index: 2;

    @media (max-width: 768px) {
      margin-bottom: 16px;
    }
  `;

  const ThisCopy = styled(Copy)`
    font-size: 16px;
    line-height: 1.6;
    font-weight: 500;
    max-width: 580px;
  `;

  const ThisTagline = styled(Tagline)`
    margin-bottom: 16px;
    font-size: 40px;
  `;

  const Actions = styled(Flexer)`
    margin-top: 48px;
    align-items: flex-start;
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

  const ThisText = styled(Text)`
    position: relative;
    right: 20vw;

    @media (max-width: 768px) {
      right: 0;
    }
  `;

  const ThisPrimaryCTA = styled(PrimaryCTA)`font-size: 16px;`;

  const ThisButton = styled(SecondaryCTA)`
    padding: 12px 16px;
    border: 2px solid ${props => props.theme.text.reverse};
  `;

  const Links = styled(FlexRow)`
    > a {
      font-weight: 700;
      margin-left: 32px;

      &:not(:last-of-type) {
        @media (max-width: 640px) {
          display: none;
        }
      }
    }
  `;

  const Img = styled.img`
    position: absolute;
    top: 32px;
    bottom: 0;
    left: calc(20vw + 480px);
    max-height: calc(100% - 32px);
    z-index: 0;
    ${'' /* transform: perspective(600px) rotate3d(0, 1, 0, -10deg); */} @media(max-width: 768px) {
      display: none;
    }
  `;

  return (
    <Section background="constellations" goop={2}>
      <ThisContent>
        <ThisText>
          <ThisTagline>A community platform for the future.</ThisTagline>
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
            <Link to="/login">
              <ThisPrimaryCTA icon="private">Join Spectrum</ThisPrimaryCTA>
            </Link>
            <Link to="/new/community">
              <ThisSecondaryCTA icon="plus-fill">
                Create your community
              </ThisSecondaryCTA>
            </Link>
          </Actions>
        </ThisText>
        <Img src={'/img/diagram.png'} />
      </ThisContent>
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

  const ThisCopy = styled(Copy)`
    font-weight: 400;
    margin-top: 16px;
  `;

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

  const LogoSection = styled.div`
    display: flex;
    align-self: center;
    max-width: 80vw;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    z-index: 2;

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
            <Link to="/explore">
              <ThisPrimaryCTA icon="explore">
                Explore communities
              </ThisPrimaryCTA>
            </Link>
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

  const ThisCopy = styled(Copy)`
    font-weight: 400;
    margin-top: 16px;
  `;

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
            <Link to="/thread/764331db-16dd-4fc4-a2c5-aabd735a64a9">
              <ThisPrimaryCTA icon="message-fill">
                Check out a conversation
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
    font-weight: 400;
    max-width: 640px;
    margin-top: 16px;
  `;

  const ThisContent = styled(Content)`
    margin: 60px 16px 40px;
    font-size: 18px;
    align-items: center;
    text-align: left;
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

  const ThisPrimaryCTA = styled(PrimaryCTA)`
    font-size: 16px;
    color: ${props => props.theme.text.default};

    &:hover {
      color: ${props => props.theme.brand.alt};
      box-shadow: ${Shadow.high} #000;
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
    <Section goop={0} background={'reverse'}>
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
            <Link to="/login">
              <ThisPrimaryCTA icon="private">Join Spectrum</ThisPrimaryCTA>
            </Link>
            <Link to="/explore">
              <ThisSecondaryCTA icon="explore">
                Explore communities
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

export const Plans = (props: Props) => {
  const Layout = styled.div`
    flex: auto;
    display: grid;
    margin: 64px;
    margin-top: 120px;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: 'pricing';
    justify-items: center;
    z-index: ${zIndex.background + 1};

    @media (max-width: 768px) {
      grid-template-columns: 100%;
      grid-template-rows: 1fr;
      grid-template-areas: 'pricing';
      margin: 32px 0 -80px;
    }
  `;

  const PricingGrid = styled.div`
    grid-area: pricing;
    display: grid;
    grid-template-columns: minmax(auto, 400px) minmax(auto, 400px);
    grid-template-rows: auto auto;
    grid-row-gap: 16px;
    grid-template-areas: 'view-title view-title' 'free pro';
    transform: rotateX(-10deg) rotateY(15deg);
    margin-right: 64px;

    > div > * {
      transform: rotateX(10deg) rotateY(15deg);
    }

    @media (max-width: 768px) {
      grid-template-columns: 100%;
      grid-template-rows: auto auto auto;
      grid-row-gap: 0;
      grid-template-areas: 'view-title' 'free' 'pro';
      margin-right: 0;
      transform: none;
    }
  `;

  const ThisTagline = styled(Tagline)`
    grid-area: view-title;
    text-align: center;
    transform: rotateX(10deg) rotateY(15deg);
  `;

  const Plan = styled.div`padding: 40px 32px 32px;`;

  const CostNumber = styled.h2`
    font-weight: 900;
    font-size: 72px;
    letter-spacing: -2px;
    vertical-align: baseline;
    position: relative;

    &:before {
      content: '$';
      vertical-align: top;
      position: absolute;
      top: 24px;
      right: calc(100% + 4px);
      font-weight: 500;
      font-size: 20px;
      letter-spacing: normal;
      color: ${props => props.theme.text.placeholder};
    }

    &:after {
      content: ${props => (props.per ? `'/ ${props.per}'` : `''`)};
      position: absolute;
      font-size: 14px;
      white-space: nowrap;
      left: calc(100% + 4px);
      bottom: 24px;
      font-weight: 700;
      letter-spacing: normal;
      color: ${props => props.theme.text.placeholder};
    }
  `;

  const Free = styled(Plan)`
    grid-area: free;
    color: ${props => props.theme.text.default};

    @media (max-width: 768px) {
      padding-top: 16px;
    }

    ${CostNumber} {
      &:before {
        content: '';
      }
    }
  `;

  const Cost = styled(FlexCol)`
    align-items: center;
    text-align: center;
  `;

  const Description = styled.p`
    font-size: 16px;
    font-weight: 400;
    margin: 16px 0;
    border-top: 2px solid ${({ theme }) => theme.bg.border};
    border-bottom: 2px solid ${({ theme }) => theme.bg.border};
    padding: 16px 8px;
  `;

  const Feature = styled.li`
    text-indent: -18px;
    font-weight: 400;

    a {
      font-weight: 500;
      text-decoration: underline;
      color: ${props => props.theme.brand.alt};
    }

    b {
      font-weight: 700;
    }

    + li {
      margin-top: 8px;
    }

    &:before {
      content: '+';
      margin-right: 8px;
      font-weight: 700;
      color: ${props => props.theme.text.placeholder};
    }
  `;

  const Paid = styled(Plan)`
    grid-area: pro;
    background-color: ${props => props.theme.brand.default};
    background-image: ${props =>
      Gradient(props.theme.brand.alt, props.theme.brand.default)};
    color: ${props => props.theme.text.reverse};
    box-shadow: 0 16px 32px ${props => hexa(props.theme.brand.alt, 0.35)};

    @media (max-width: 768px) {
      box-shadow: none;
      margin-top: 32px;
    }

    ${CostNumber} {
      left: -16px;

      &:before,
      &:after {
        color: ${props => props.theme.brand.border};
      }
    }

    ${Description} {
      font-weight: 500;
      border-color: ${props => props.theme.brand.alt};
    }

    ${Feature} {
      font-weight: 400;

      a {
        font-weight: 700;
        color: inherit;
      }

      b {
        font-weight: 900;
      }

      &:before {
        color: ${props => hexa(props.theme.brand.border, 0.5)};
      }
    }
  `;

  const Title = styled.h1`
    text-align: center;
    font-weight: 700;
  `;

  const CostPer = styled.span`
    position: relative;
    left: -12px;
    font-weight: 500;
    letter-spacing: normal;
  `;

  const CostSubtext = styled(FlexCol)`
    margin-top: 8px;
    flex: 0 0 48px;
    justify-content: flex-start;
    font-size: 14px;
    font-weight: 700;
  `;

  const FeatureList = styled.ul`
    padding-left: 24px;
    list-style: none;
    font-size: 16px;
    font-weight: 500;
  `;

  const PlanFooter = styled(FlexRow)`justify-content: center;`;

  const FreePrimaryCTA = styled(PrimaryCTA)`
    margin-top: 32px;
    background-color: ${props => props.theme.success.default};
    background-image: ${props =>
      Gradient(props.theme.success.alt, props.theme.success.default)};
    color: ${props => props.theme.text.reverse};

    &:hover {
      color: ${props => props.theme.text.reverse};
      box-shadow: ${Shadow.high}
        ${props => hexa(props.theme.success.dark, 0.25)};
    }
  `;

  const PaidPrimaryCTA = styled(PrimaryCTA)`
    margin-top: 32px;
    margin-bottom: 16px;

    &:hover {
      color: ${props => props.theme.brand.alt};
      box-shadow: ${Shadow.high} ${props => hexa(props.theme.brand.dark, 0.75)};
    }

    @media (max-width: 768px) {
      margin-bottom: 48px;
    }
  `;

  return (
    <Section background="illustrated" goop={1} color="space.dark">
      <Layout>
        <PricingGrid>
          <ThisTagline>Community plans</ThisTagline>
          <Free>
            <Title>Open</Title>
            <Cost>
              <CostNumber>Free</CostNumber>
              <CostSubtext>forever</CostSubtext>
            </Cost>
            <Description>
              Build your community on a platform purpose-built for constructive
              public communities.
            </Description>
            <FeatureList>
              <Feature>
                Never lose a thing. Spectrum gives you{' '}
                <b>
                  unlimited members, channels, messages, and file uploads
                </b>{' '}
                by default.
              </Feature>
              <Feature>
                Find that conversation you're looking for with{' '}
                <b>permalinked, search-indexed chat threads</b>.
              </Feature>
              <Feature>
                <b>Simple, powerful moderation</b> with automated toxicity
                monitoring and clear guidelines set by our open source{' '}
                <a href="https://github.com/withspectrum/code-of-conduct">
                  Code of Conduct
                </a>.
              </Feature>
            </FeatureList>
            <PlanFooter>
              <Link to="/new/community">
                <FreePrimaryCTA icon="plus-fill">
                  Create my community
                </FreePrimaryCTA>
              </Link>
            </PlanFooter>
          </Free>
          <Paid>
            <Title>Standard</Title>
            <Cost>
              <CostNumber per="month">100</CostNumber>
              <CostSubtext>per 1,000 members</CostSubtext>
            </Cost>
            <Description>
              Take your community to the next level with top-tier moderation and
              support tools.
            </Description>
            <FeatureList>
              <Feature>
                Keep team conversations confidential with{' '}
                <b>invite-only, private channels</b>.
              </Feature>
              <Feature>
                <b>Community analytics</b> provide a bird's-eye view of
                community behavior and ROI.
              </Feature>
              <Feature>
                Highlight your team and incentivize your community members with{' '}
                <b>additional moderators</b> and <b>custom badges</b>.
              </Feature>
              <Feature>
                <b>Priority support</b> for moderation and technical issues.
              </Feature>
            </FeatureList>
            <PlanFooter>
              <Link to="/new/community">
                <PaidPrimaryCTA icon="plus-fill">
                  Create my community
                </PaidPrimaryCTA>
              </Link>
            </PlanFooter>
          </Paid>
        </PricingGrid>
      </Layout>
    </Section>
  );
};

export const Standard = (props: Props) => {
  return <Section />;
};

export const Pro = (props: Props) => {
  return <Section />;
};
