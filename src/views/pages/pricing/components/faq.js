// @flow
import * as React from 'react';
import Section from 'src/components/themedSection';
import { Content, Heading, Subhead, Copy } from '../style';

const Faq = () => {
  return (
    <Section goop={4} color={'bg.reverse'}>
      <Content>
        <Heading>FAQ</Heading>
        <Subhead>How does the Fair Price Promise work?</Subhead>
        <Copy>
          Each month we only bill you for the features that you used in that
          time period, and prorate any features used for less than a month.
        </Copy>
        <Copy>Here’s a quick example:</Copy>
        <Copy>
          Imagine you need a private channel for an event planning team within
          your community. When you create the private channel, Spectrum bills
          you $10. If your private channel is still being used at the end of the
          month, we’ll automatically keep the subscription going.
        </Copy>
        <Copy>
          However, if you archive the channel after one week, we’ll
          automatically apply credit to your account for the unused time.
        </Copy>
        <Subhead>
          How will this be reflected on my credit card statement?
        </Subhead>
        <Copy>
          Spectrum calculates usage at the end of each billing cycle, and then
          prorates back any credit for unused features. You may receive
          lower-than-expected charges on your card that reflect credit being
          used.
        </Copy>
        <Subhead>
          Will I know when I’ve received a proration for unused time?
        </Subhead>
        <Copy>
          Yes. At the end of each billing cycle we will send you a receipt email
          that will include line items for all charges, prorations, and credit
          used.
        </Copy>
        <Subhead>
          I would like to talk with the team about how this works.
        </Subhead>
        <Copy>
          If you have any questions about this, or feel you’ve found an error in
          how much you were charged, please don’t hesitate to{' '}
          <a href="mailto:hi@spectrum.chat">get in touch</a>.
        </Copy>
      </Content>
    </Section>
  );
};

export default Faq;
