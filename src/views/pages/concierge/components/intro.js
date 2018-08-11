// @flow
import React from 'react';
import Link from 'src/components/link';
import Section from 'src/components/themedSection';
import Feature from '../../pricing/components/feature';
import {
  TwoUp,
  Left,
  Right,
  Heading,
  Copy,
  CTA,
  TextCTA,
  PlanSection,
  PlanPrice,
  PlanDescription,
  PlanFeatures,
  Actions,
} from '../../pricing/style';
import { track, events } from 'src/helpers/analytics';
import { Button, TextButton } from 'src/components/button';

const Intro = () => {
  return (
    <Section goop={4} color={theme => theme.space.dark}>
      <TwoUp>
        <Left>
          <Heading>Introducing Concierge</Heading>
          <Copy>
            As a team, we’ve spent years building online communities and we’ve
            seen how valuable they can be to businesses when managed well. But
            that’s a full-time job, and a lot of businesses don’t have the
            access or the budget to hire experienced, full-time community
            managers.
          </Copy>
          <Copy>
            There are a lot of hard problems to solve when you’re starting a
            community from scratch, but now you don’t have to face these
            problems alone.
          </Copy>
          <Actions>
            <Button
              size={'large'}
              onClick={() => track(events.CONCIERGE_PAGE_CONTACT_US_CLICKED)}
              href={'mailto:hi@spectrum.chat'}
              style={{ marginRight: '16px' }}
            >
              Contact our team
            </Button>

            <TextButton
              size={'large'}
              onClick={() => track(events.CONCIERGE_PAGE_LEARN_MORE_CLICKED)}
              to={`/thread/c5a6ea22-eb8f-4247-bed4-c322f6177c94`}
            >
              Learn more
            </TextButton>
          </Actions>
        </Left>
        <Right>
          <PlanSection>
            <PlanPrice>Let Spectrum handle the hard parts.</PlanPrice>
            <PlanDescription>
              Concierge makes the most painful elements of community management
              easy:
            </PlanDescription>
            <PlanFeatures>
              <Feature title={'Formulating a community strategy'} />
              <Feature title={'Launching or migrating your community'} />
              <Feature title={'Developing a content pipeline'} />
              <Feature title={`Understanding your community's impact`} />
              <Feature title={'Managing time efficiently'} />
            </PlanFeatures>
          </PlanSection>
        </Right>
      </TwoUp>
    </Section>
  );
};

export default Intro;
