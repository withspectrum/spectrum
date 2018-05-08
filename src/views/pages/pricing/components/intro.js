// @flow
import React from 'react';
import Section from 'src/components/themedSection';
import Link from 'src/components/link';
import Feature from './feature';
import {
  TwoUp,
  Left,
  Right,
  Heading,
  Copy,
  CTA,
  PlanSection,
  PlanPrice,
  PlanDescription,
  PlanFeatures,
} from '../style';
import * as events from 'shared/analytics/event-types';
import { track } from 'src/helpers/events';

const Intro = () => {
  return (
    <Section background={'illustrated'} goop={2} color={'brand.alt'}>
      <TwoUp>
        <Left>
          <Heading>Pricing built with your community in mind.</Heading>
          <Copy>
            We know that communities are valuable even when they don't have a
            budget, so we made communities free by default.
          </Copy>
          <Copy>
            When you're ready to take your community to the next level, we've
            got some great features to help you grow, moderate, and measure more
            effectively.
          </Copy>
          <Link
            onClick={() => track(events.PRICING_PAGE_CREATE_COMMUNITY_CLICKED)}
            to={`/new/community`}
          >
            <CTA icon={'welcome'}>Create your community</CTA>
          </Link>
        </Left>
        <Right>
          <PlanSection>
            <PlanPrice>Basic communities are free.</PlanPrice>
            <PlanDescription>
              We won't show you ads. We won't sell your personal data. No
              gimmicks.
            </PlanDescription>
            <PlanFeatures data-cy="free-features-list">
              <Feature title={'Public community'} />
              <Feature title={'Search indexed conversations'} />
              <Feature title={'Unlimited chat messages'} />
              <Feature title={'Unlimited members'} />
              <Feature title={'Unlimited channels'} />
              <Feature title={'Member reputation system'} />
            </PlanFeatures>
          </PlanSection>
        </Right>
      </TwoUp>
    </Section>
  );
};

export default Intro;
