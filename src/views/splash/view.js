// @flow
import React from 'react';
import styled, { css } from 'styled-components';
import Link from 'src/components/link';
import { Logo } from '../../components/logo';
import Icon from '../../components/icons';
import Avatar from '../../components/avatar';
import Privacy from '../../components/privacy';
import Terms from '../../components/terms';
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
  HorizontalRule,
} from '../../components/globals';
import Badge from '../../components/badges';
import { Button } from '../../components/buttons';
import Search from '../explore/components/search';
import { Communities } from './components/communities';
import ViewSegment from '../../components/viewSegment';
import { Conversation, Discover } from '../../components/illustrations';
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
  FeatureList,
  Feature,
  Layout,
  PricingGrid,
  Free,
  Title,
  Cost,
  CostNumber,
  CostSubtext,
  Description,
  PlanFooter,
  FreePrimaryCTA,
  Paid,
  PaidPrimaryCTA,
} from './style';
import Nav from './nav';

type Props = Object;

const Section = (props: Props) => (
  <ViewSegment {...props}>{props.children}</ViewSegment>
);

export const Overview = (props: Props) => {
  const ThisContent = styled(Content)`
    max-width: 100vw;
    margin-top: 24px;
  `;

  const Text = styled(FlexCol)`
    margin: 120px 32px 120px 32px;
    text-align: left;
    align-items: flex-start;
    z-index: 2;

    @media (max-width: 768px) {
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
  `;

  const ThisTagline = styled(Tagline)`
    margin-bottom: 16px;
    font-size: 40px;

    @media (max-width: 768px) {
      font-size: 24px;
    }
  `;

  const Actions = styled(Flexer)`
    margin-top: 48px;
    align-items: flex-start;
    justify-content: space-between;

    @media (max-width: 768px) {
      align-items: center;
    }
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

    @media (max-width: 1400px) {
      right: 15vw;
    }

    @media (max-width: 1200px) {
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
    left: calc(25vw + 480px);
    max-height: calc(100% - 32px);
    z-index: 0;

    @media (max-width: 1400px) {
      left: calc(20vw + 480px);
    }

    @media (max-width: 1200px) {
      display: none;
    }

    @media (max-width: 768px) {
      display: none;
    }
  `;

  return (
    <Section background="constellations" goop={2}>
      <Nav dark />
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
            <Link to="/login">
              <ThisPrimaryCTA icon="welcome">Join Spectrum</ThisPrimaryCTA>
            </Link>
            <Link to="/new/community">
              <ThisSecondaryCTA icon="plus-fill">
                Create your community
              </ThisSecondaryCTA>
            </Link>
          </Actions>
        </ThisText>
        <Img src={'/img/diagram.svg'} />
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
    margin-bottom: 40px;

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
    margin: 60px 16px 16px;
    font-size: 18px;
    align-items: center;
    text-align: left;
  `;

  const ThisTagline = styled(Tagline)`
    text-align: center;
    align-self: center;
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
    justify-content: center;

    > a {
      display: inline-block;
    }

    @media (max-width: 768px) {
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

    @media (max-width: 768px) {
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
    color: ${props => props.theme.text.default};
    position: relative;
    padding: 24px;
    transition: ${Transition.hover.off};
    margin-top: 32px;
    margin-left: 32px;

    &:hover {
      box-shadow: 0 0px 32px ${props => props.theme.brand.alt};
      transition: ${Transition.hover.on};

      > div {
        color: ${props => props.theme.brand.alt};
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
      color: ${props => props.theme.text.alt};
      font-weight: 400;
      margin-left: 4px;
    }
  `;

  const Rule = styled(HorizontalRule)`
    color: ${props => props.theme.brand.border};
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
          <ThisTagline>You're gonna love Spectrum.</ThisTagline>
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
              <Signature to="https://spectrum.chat/users/Traykov">
                <Avatar
                  size={'40'}
                  src="https://spectrum.imgix.net/users/ZN37gjzZ31PKVPmd6E4ZTlZJa7Z2/5sasho.png.0.17582088793809425?auto=compress&w=64&dpr=2&format=png"
                />Alexander Traykov<span>@Traykov</span>
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
              <Signature to="https://spectrum.chat/users/rauchg">
                <Avatar
                  size={'40'}
                  src="https://spectrum-imgp.imgix.net/https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F871555682608136205%2FyMs8Gnot_normal.jpg?w=128&h=128&ixlib=js-1.1.1&s=cc42ed724e75265fbb959ec43c910be2"
                />Guillermo Rauch <span>@rauchg</span>
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
              <Signature to="https://www.spectrum.chat/users/tayler-m-odea">
                <Avatar
                  size={'40'}
                  src="https://spectrum-imgp.imgix.net/https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F900025975278157824%2FmydeOAGa_normal.jpg?w=128&h=128&ixlib=js-1.1.1&s=a50556fe67cb087d5083b9d1342711ab"
                />Tayler O'Dea <span>@tayler-m-odea</span>
              </Signature>
            </Quote>
          </Quotes>
          <Actions>
            <Link to="/login">
              <ThisPrimaryCTA icon="welcome">Join Spectrum</ThisPrimaryCTA>
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
        <Link to="/">
          <Icon glyph="logo" size={32} />
        </Link>
      </FlexRow>
      <Flexer>
        <LinkBlock href="/pricing">
          <div>Pricing</div>
        </LinkBlock>
        <LinkBlock href="/support">
          <div>Support</div>
        </LinkBlock>
        <LinkBlock href="https://github.com/withspectrum/code-of-conduct">
          <div>Code of Conduct</div>
        </LinkBlock>
      </Flexer>
    </Footer>
  );
};

export const UserPricing = (props: Props) => {
  const Text = styled(FlexCol)`
    margin: 120px 16px 120px 16px;
    text-align: center;
    align-items: center;
    z-index: 2;

    @media (max-width: 768px) {
      margin-bottom: 16px;
    }

    p {
      margin-top: 16px;

      & + p {
        margin-top: 32px;
      }
    }

    b {
      font-weight: 900;
    }
  `;

  const ThisFeatureList = styled(FeatureList)`
    margin-top: 8px;

    li > span {
      box-shadow: 0 0 8px 8px ${props => props.theme.space.dark};
      line-height: 2;
      vertical-align: middle;
      margin-right: 4px;
      display: inline-block;
    }
  `;

  const ThisFree = styled(Free)`box-shadow: none;`;

  const ThisPricingGrid = styled(PricingGrid)`
    grid-template-rows: auto;
    grid-template-columns: minmax(auto, 400px);
    grid-template-areas: 'paid';
    justify-content: center;
    margin-top: 40px;
  `;

  const ThisPaid = styled(Paid)`
    box-shadow: none;
    background-color: ${props => props.theme.success.default};
    background-image: ${props =>
      Gradient(props.theme.space.alt, props.theme.space.default)};
    grid-area: paid;

    ${FeatureList}, ${Feature} {
      text-align: left;
    }

    ${CostNumber} {
      &:before,
      &:after {
        color: ${props => props.theme.space.wash};
      }
    }

    ${Feature}:before {
      color: ${props => props.theme.space.border};
    }

    ${Description} {
      border-color: ${props => props.theme.space.border};
      text-align: left;
    }
  `;

  return (
    <Section background="dark" goop={1}>
      <Content>
        <Text>
          <Tagline>Spectrum will always be free for users.</Tagline>
          <Copy>Unlimited usage. Zero ads.</Copy>
          <Copy>We'll never sell your data either.</Copy>
        </Text>
      </Content>
    </Section>
  );
};

export const Plans = (props: Props) => {
  const Text = styled(FlexCol)`
    margin: 48px 16px;
    text-align: left;
    align-items: start;
    z-index: 2;

    ${Copy} {
      margin-top: 16px;
      margin-left: 32px;
    }

    @media (max-width: 768px) {
      margin: 0;
      z-index: 1;
    }
  `;

  const ThisTagline = styled(Tagline)`
    text-align: center;
    margin-left: 16px;
  `;

  return (
    <Section background="illustrated" goop={1} color="space.dark">
      <Nav location={'pricing'} />
      <Content>
        <Text>
          <Layout>
            <PricingGrid>
              <Free>
                <Title>Open</Title>
                <Cost>
                  <CostNumber>Free</CostNumber>
                  <CostSubtext>forever</CostSubtext>
                </Cost>
                <Description>
                  Build your community on a platform purpose-built for
                  constructive public communities.
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
                  Take your community to the next level with top-tier moderation
                  and support tools.
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
                    Empower your team with <b>additional moderators</b>.
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
        </Text>
      </Content>
    </Section>
  );
};

export const ContactInfo = () => {
  const ThisContent = styled(Content)`
    flex-direction: column;
    align-items: center;

    > h2 {
      margin: 0 32px;
    }
  `;

  const Grid = styled.div`
    margin: 32px;
    display: grid;
    grid-template-columns: repeat(2, 400px);
    grid-template-rows: repeat(2, minmax(240px, auto));
    grid-row-gap: 32px;
    grid-column-gap: 32px;

    @media (max-width: 768px) {
      margin: 32px 0;
      align-self: stretch;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(4, minmax(240px, auto));
    }
  `;

  const HelpCard = styled.div`
    background-color: ${props => props.theme.bg.default};
    box-shadow: 0 8px 32px ${props => hexa(props.theme.brand.default, 0.2)};
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: 16px;
    grid-template-rows: auto auto auto;
    grid-template-areas: 'lede' 'flavor' 'button';
    padding: 32px;
    justify-items: center;

    > a > button {
      font-size: 16px;
      font-weight: 700;
      align-self: end;
    }

    b {
      font-weight: 700;
    }

    @media (max-width: 768px) {
      padding: 32px auto;
    }
  `;

  const BugCard = styled(HelpCard)`
    ${'' /* box-shadow: 0 8px 32px ${props => hexa(props.theme.warn.dark, 0.2)}; */} button {
      background-color: ${props => props.theme.warn.alt};
      background-image: ${props =>
        Gradient(props.theme.warn.alt, props.theme.warn.default)};

      &:hover {
        box-shadow: 0 4px 32px ${props => hexa(props.theme.warn.dark, 0.25)};
      }
    }
  `;

  const FeatCard = styled(HelpCard)`
    ${'' /* box-shadow: 0 8px 32px ${props => hexa(props.theme.success.dark, 0.2)}; */} button {
      background-color: ${props => props.theme.success.alt};
      background-image: ${props =>
        Gradient(props.theme.success.alt, props.theme.success.default)};

      &:hover {
        box-shadow: 0 4px 32px ${props => hexa(props.theme.success.dark, 0.25)};
      }
    }
  `;

  const EmailCard = styled(HelpCard)`
    ${'' /* box-shadow: 0 8px 32px ${props => hexa(props.theme.special.dark, 0.2)}; */} button {
      background-color: ${props => props.theme.special.default};
      background-image: ${props =>
        Gradient(props.theme.special.alt, props.theme.special.default)};

      &:hover {
        box-shadow: 0 4px 32px ${props => hexa(props.theme.special.dark, 0.25)};
      }
    }
  `;

  const TweetCard = styled(HelpCard)`
    ${'' /* box-shadow: 0 8px 32px ${props => hexa(props.theme.space.default, 0.2)}; */} button {
      background-color: ${props => props.theme.social.twitter.alt};
      background-image: ${props =>
        Gradient(
          props.theme.social.twitter.alt,
          props.theme.social.twitter.default
        )};

      &:hover {
        box-shadow: 0 4px 32px ${props => hexa(props.theme.space.dark, 0.25)};
      }
    }
  `;

  const Lede = styled.h4`
    font-size: 24px;
    font-weight: 900;
    text-align: center;
  `;

  const Flavor = styled.p`
    font-size: 16px;
    text-align: center;
  `;

  return (
    <Section goop={4} color="brand.alt">
      <Nav location={'support'} />
      <ThisContent>
        <Tagline>What can we help you with?</Tagline>
        <Grid>
          <BugCard>
            <Lede>Find a bug?</Lede>
            <Flavor>
              Join our <b>Hugs n Bugs</b> channel to check if there's already a
              fix or report a new issue!
            </Flavor>
            <Link to={'/spectrum/hugs-n-bugs'}>
              <Button icon="bug">Join spectrum/hugs-n-bugs</Button>
            </Link>
          </BugCard>
          <FeatCard>
            <Lede>Need some more features?</Lede>
            <Flavor>
              Jump into our <b>Feature Requests</b> channel and tell us what you
              want or add onto existing requests from others!
            </Flavor>
            <Link to={'/spectrum/feature-requests'}>
              <Button icon="idea">Join spectrum/feature-requests</Button>
            </Link>
          </FeatCard>
          <EmailCard>
            <Lede>Something else?</Lede>
            <Flavor>
              Concerned about something on Spectrum? Shoot us an email and we'll
              take care of it right away.
            </Flavor>
            <a href={'mailto://support@spectrum.chat'}>
              <Button icon="email">Email support@spectrum.chat</Button>
            </a>
          </EmailCard>
          <TweetCard>
            <Lede>Looking for updates?</Lede>
            <Flavor>
              We post news, release notes, and threads from all over Spectrum on
              Twitter!
            </Flavor>
            <a href={'https://twitter.com/withspectrum'}>
              <Button icon="twitter">@withspectrum on Twitter</Button>
            </a>
          </TweetCard>
        </Grid>
      </ThisContent>
    </Section>
  );
};

export const TermsSection = () => {
  const ThisContent = styled(Content)`
    margin: 32px;
    align-items: flex-start;
    justify-content: space-around;

    > p:not(:first-of-type) {
      margin-top: 0;
    }

    h1 {
      margin-top: 16px;
      font-size: 24px;
      line-height: 1.2;
      font-weight: 900;
    }

    h2 {
      font-size: 18px;
      line-height: 1.2;
      font-weight: 900;
      margin-top: 16px;
      margin-bottom: 4px;
    }

    p,
    ul {
      font-size: 18px;
      margin-top: 8px;
    }

    li {
      margin-top: 8px;
    }
  `;

  return (
    <Section background={'brand'} goop={6} color="bg.reverse">
      <ThisContent>
        <Copy>
          <Terms />
        </Copy>
        <Copy>
          <Privacy />
        </Copy>
      </ThisContent>
    </Section>
  );
};
