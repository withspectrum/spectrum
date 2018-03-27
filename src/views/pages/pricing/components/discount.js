// @flow
import * as React from 'react';
import Section from 'src/components/themedSection';
import { Content, Heading, Copy, CTA } from '../style';

const Discount = () => {
  return (
    <Section goop={6} color={'bg.reverse'}>
      <Content>
        <Heading>Do you run a community that gives back?</Heading>
        <Copy>
          If you're looking for a place to grow your community for an
          open-source project, non-profit, or educational program, we're here to
          help.
        </Copy>
        <Copy>
          Qualifying communities get one additional moderator seat and one
          private channel for free.
        </Copy>
        <a href="mailto:hi@spectrum.chat">
          <CTA icon={'payment'}>Apply for discount</CTA>
        </a>
      </Content>
    </Section>
  );
};

export default Discount;
