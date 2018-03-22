// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { track } from 'src/helpers/events';
import PageFooter from '../components/footer';
import Nav from '../components/nav';
import { Wrapper } from '../style';
import FreeFeaturesList from './components/freeFeaturesList';
import PaidFeaturesList from './components/paidFeaturesList';
import CommunityList from './components/communityList';
import PricingPlanTable from './components/pricingPlanTable';
import Link from 'src/components/link';
import {
  getCurrentUserCommunityConnection,
  type GetUserCommunityConnectionType,
} from 'shared/graphql/queries/user/getUserCommunityConnection';
import {
  ContentContainer,
  PageTitle,
  PageSubtitle,
  Section,
  SectionTitle,
  SectionSubtitle,
  SectionDescription,
  Subsection,
  Highlight,
  Divider,
  TableCardButton,
} from './style';
import type { ContextRouter } from 'react-router';

type Props = {
  data: {
    user: GetUserCommunityConnectionType,
  },
  ...$Exact<ContextRouter>,
};
class Pricing extends React.Component<Props> {
  paidFeaturesSection: ?HTMLDivElement;
  freeFeaturesSection: ?HTMLDivElement;
  fairPriceFaqSection: ?HTMLDivElement;
  ownedCommunitiesSection: ?HTMLDivElement;
  ossSection: ?HTMLDivElement;

  componentDidMount() {
    track('pricing', 'viewed', null);
  }

  shouldComponentUpdate(nextProps) {
    const curr = this.props;
    if (curr.data.user !== nextProps.data.user) return true;
    if (curr.location.hash !== nextProps.location.hash) return true;
    return false;
  }

  scrollToPaidFeatures = () => {
    const node = this.paidFeaturesSection;
    if (!node) return;
    window.scrollTo(0, node.offsetTop);
  };

  scrollToFreeFeatures = () => {
    const node = this.freeFeaturesSection;
    if (!node) return;
    window.scrollTo(0, node.offsetTop);
  };

  scrollToFairPriceFaq = () => {
    const node = this.fairPriceFaqSection;
    if (!node) return;
    window.scrollTo(0, node.offsetTop);
  };

  scrollToOwnedCommunities = () => {
    const node = this.ownedCommunitiesSection;
    if (!node) return;
    window.scrollTo(0, node.offsetTop);
  };

  scrollToOss = () => {
    const node = this.ossSection;
    if (!node) return;
    window.scrollTo(0, node.offsetTop);
  };

  render() {
    const { data: { user } } = this.props;

    const isUser = user && user.communityConnection;

    const hasCommunities =
      isUser &&
      user.communityConnection.edges &&
      user.communityConnection.edges.length > 0;

    const ownsCommunities =
      hasCommunities &&
      user.communityConnection.edges.some(
        c => c && c.node.communityPermissions.isOwner
      );

    const ownedCommunities =
      ownsCommunities &&
      user.communityConnection.edges
        .filter(c => c && c.node.communityPermissions.isOwner)
        .filter(Boolean)
        .map(c => c.node);

    return (
      <Wrapper data-e2e-id="pricing-page">
        <Nav location={'pricing'} />

        <ContentContainer>
          <PageTitle>Pricing designed with communities in mind.</PageTitle>

          <PageSubtitle>
            We know how hard it can be to build a great online community. We’ve
            designed our pricing to make things easier. The result is our{' '}
            <a
              style={{ fontWeight: 'bold' }}
              onClick={this.scrollToFairPriceFaq}
            >
              Fair Price Promise
            </a>.
          </PageSubtitle>

          <Section>
            <PricingPlanTable
              scrollToPaidFeatures={this.scrollToPaidFeatures}
              scrollToOss={this.scrollToOss}
            />
          </Section>

          <Section>
            <SectionTitle>Our Fair Price Promise</SectionTitle>
            <SectionDescription>
              Growing and managing an active online community is hard work. The
              last thing you need is another bill looming on the horizon for
              features you don’t need, or rarely ever use.
            </SectionDescription>

            <SectionDescription>
              <Highlight>
                That’s why we automatically prorate your monthly bill to only
                charge for the time that features were used.
              </Highlight>
            </SectionDescription>

            <TableCardButton
              light
              onClick={this.scrollToFairPriceFaq}
              style={{ marginTop: '24px' }}
            >
              Learn more about how this works
            </TableCardButton>
          </Section>

          <Section
            innerRef={component => (this.freeFeaturesSection = component)}
          >
            <SectionTitle>It all starts with free</SectionTitle>
            <SectionDescription>
              It takes time for a community to find its feet - we’ve been there
              before. That’s why all communities on Spectrum can be started and
              maintained indefinitely for free. Free communities come with:
            </SectionDescription>

            <FreeFeaturesList />
          </Section>

          <Section
            innerRef={component => (this.paidFeaturesSection = component)}
          >
            <SectionTitle>
              Pay as you go for powerful management features
            </SectionTitle>
            <SectionDescription>
              For growing communities that need deeper understanding and
              powerful management tools, we’ve got you covered. All of our paid
              features are covered by our{' '}
              <Highlight>Fair Price Promise</Highlight>.
            </SectionDescription>

            <PaidFeaturesList />
          </Section>

          <Section innerRef={component => (this.ossSection = component)}>
            <SectionTitle>For communities that are giving back</SectionTitle>
            <SectionDescription>
              If you’re looking for a place to grow your community for an&nbsp;
              <Highlight>
                open-source project, non-profit, or education program
              </Highlight>, we want to help. Qualifying communities will have
              access to{' '}
              <Highlight>
                one free moderator seat and one free private channel
              </Highlight>.
            </SectionDescription>

            <SectionDescription>
              Get in touch with information about your community or
              organization, and we’ll get back to you soon.
            </SectionDescription>

            {ownedCommunities && (
              <TableCardButton
                light
                onClick={this.scrollToOwnedCommunities}
                style={{ marginTop: '24px' }}
              >
                View my communities
              </TableCardButton>
            )}

            <a href={'mailto:hi@spectrum.chat'} style={{ width: '100%' }}>
              <TableCardButton light>Get in touch</TableCardButton>
            </a>
          </Section>

          {ownedCommunities && (
            <Section
              innerRef={component => (this.ownedCommunitiesSection = component)}
            >
              <SectionTitle>Your communities</SectionTitle>
              <SectionDescription>
                We found these communities that you already own - you can manage
                them in their settings or apply directly for an open-source,
                non-profit, or education discount.
              </SectionDescription>

              <SectionDescription>
                When applying for a discount, please provide as much information
                as possible about your project or community so that we can help
                you as quickly as possible.
              </SectionDescription>

              <CommunityList communities={ownedCommunities} />
            </Section>
          )}

          <Section>
            <SectionTitle>Creating a new community?</SectionTitle>
            <SectionDescription>
              Communities can be created for free at any time. Get started
              below.
            </SectionDescription>

            <Link style={{ width: '100%' }} to={'/new/community'}>
              <TableCardButton style={{ marginTop: '24px' }}>
                Create a community
              </TableCardButton>
            </Link>
          </Section>

          <Divider />

          <Section
            innerRef={component => (this.fairPriceFaqSection = component)}
          >
            <SectionTitle>More about our Fair Price Promise</SectionTitle>
            <Subsection>
              <SectionSubtitle>How it works</SectionSubtitle>

              <SectionDescription>
                Each month we only bill you for the features that you used in
                that time period, and prorate any features used for less than a
                month.
              </SectionDescription>

              <SectionDescription>Here’s a quick example:</SectionDescription>

              <SectionDescription>
                Imagine you need a private channel for an event planning team
                within your community. When you create the private channel,
                Spectrum bills you $10. If your private channel is still being
                used at the end of the month, we’ll automatically keep the
                subscription going.
              </SectionDescription>

              <SectionDescription>
                However, if you archive the channel after one week, we’ll
                automatically apply credit to your account for the unused time.
              </SectionDescription>
            </Subsection>

            <Subsection>
              <SectionSubtitle>
                How will this be reflected on my credit card statement?
              </SectionSubtitle>

              <SectionDescription>
                Spectrum calculates usage at the end of each billing cycle, and
                then prorates back any credit for unused features. You may
                receive lower-than-expected charges on your card that reflect
                credit being used.
              </SectionDescription>
            </Subsection>

            <Subsection>
              <SectionSubtitle>
                Will I know when I’ve received a proration for unused time?
              </SectionSubtitle>

              <SectionDescription>
                Yes. At the end of each billing cycle we will send you a receipt
                email that will include line items for all charges, prorations,
                and credit used.
              </SectionDescription>
            </Subsection>

            <Subsection>
              <SectionSubtitle>
                I would like to talk with the team about how this works.
              </SectionSubtitle>

              <SectionDescription>
                If you have any questions about this, or feel you’ve found an
                error in how much you were charged, please don’t hesitate to{' '}
                <a href="mailto:hi@spectrum.chat">get in touch</a>.
              </SectionDescription>
            </Subsection>
          </Section>
        </ContentContainer>

        <PageFooter />
      </Wrapper>
    );
  }
}
export default compose(getCurrentUserCommunityConnection)(Pricing);
