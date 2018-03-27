// @flow
import * as React from 'react';
import Section from 'src/components/themedSection';
import CommunityList from './communityList';
import { PrimaryCTA } from '../../style';
import {
  TwoUp,
  Left,
  Right,
  Heading,
  Copy,
  PlanSection,
  PlanPrice,
  PlanDescription,
  PlanFeatures,
} from '../style';
import Feature from './feature';
import Link from 'src/components/link';

class Paid extends React.Component<> {
  render() {
    return (
      <Section background={'brand'} goop={4} color={'space.dark'}>
        <TwoUp reverse>
          <Left>
            <PlanSection>
              <PlanPrice>Upgrade your community.</PlanPrice>
              <PlanDescription>
                Make your organization more effective - enable your team,
                communicate securely with customers, and know your ROI.
              </PlanDescription>

              <PlanFeatures>
                <Feature
                  title={'Extra moderator seat'}
                  subtitle={
                    'Add an additional moderator to your community to help keep conversations healthy and productive.'
                  }
                  color={'space'}
                  icon={'member-add'}
                  priceLabel={'$10/mo'}
                />

                <Feature
                  title={'Private channel'}
                  subtitle={
                    'Add a private channel to your community to organize a private beta, support customers securely, or communicate internally with your team.'
                  }
                  color={'special'}
                  icon={'private-outline'}
                  priceLabel={'$10/mo'}
                />

                <Feature
                  title={'Analytics'}
                  subtitle={
                    "Get a high-level view of what's happening in your community and how it impacts your business."
                  }
                  icon={'analytics'}
                  priceLabel={'$100/mo'}
                />
              </PlanFeatures>
            </PlanSection>
          </Left>
          <Right>
            <Heading reverse>
              All paid features come with our Fair Price Promise
            </Heading>
            <Copy reverse>
              We will only charge you for the products you use in a billing
              cycle. If you don't use a feature for a whole month, we'll prorate
              it for the time you used it. No questions asked.
            </Copy>
            <Copy reverse>
              Want to use a private channel for a two-day project? Archive it
              when you're done and we'll only bill you for the two days.
            </Copy>
            <CommunityList upgrade />
            <Link to={`/new/community`}>
              <PrimaryCTA
                icon={'welcome'}
                style={{ marginTop: '24px', padding: '8px 16px' }}
              >
                Get started
              </PrimaryCTA>
            </Link>
          </Right>
        </TwoUp>
      </Section>
    );
  }
}

export default Paid;
