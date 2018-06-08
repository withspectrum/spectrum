// @flow
import React from 'react';
import Section from 'src/components/themedSection';
import Feature from '../../pricing/components/feature';
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
} from '../../pricing/style';
import { track, events } from 'src/helpers/analytics';

type Props = {
  goopColor?: string,
};

const Intro = (props: Props) => {
  const { goopColor = 'bg.reverse' } = props;
  return (
    <Section goop={4} color={goopColor}>
      <TwoUp>
        <Left>
          <Heading>Spectrum Concierge</Heading>
          <Copy>
            We'll take care of the hardest parts of building communities:
            growing your audience, implementing an effective strategy,
            understanding and supporting your members, and analyzing your
            community’s impact on your business.
          </Copy>
          <a
            onClick={() => track(events.CONCIERGE_PAGE_CONTACT_US_CLICKED)}
            href={'mailto:hi@spectrum.chat'}
          >
            <CTA style={{ padding: '16px 24px', fontSize: '18px' }} large>
              Contact our team
            </CTA>
          </a>
        </Left>
        <Right>
          <PlanSection>
            <PlanPrice>Let us take care of the hard parts.</PlanPrice>
            <PlanDescription>
              Spectrum Concierge eliminates the painful parts of community
              building and management:
            </PlanDescription>
            <PlanFeatures>
              <Feature title={'Community strategy consultation'} />
              <Feature title={'Content management pipeline'} />
              <Feature title={'Conversation and issue triage'} />
              <Feature title={'Notification filtering and prioritization'} />
              <Feature title={'Dedicated moderation team'} />
              <Feature
                title={'Deep reports and customized community analytics'}
              />
              <Feature title={'Accelerated growth'} />
              <Feature title={'Migration assistance'} />
            </PlanFeatures>
          </PlanSection>
        </Right>
      </TwoUp>
    </Section>
  );
};

export default Intro;
