// @flow
import * as React from 'react';
import { track } from 'src/helpers/events';
import PageFooter from '../components/footer';
import { Wrapper } from '../style';
import {
  ContentContainer,
  PageTitle,
  PageSubtitle,
  Section,
  SectionTitle,
  SectionDescription,
} from '../pricing/style';
import { PrivacyTermsList } from '../terms/style';

class Privacy extends React.Component<{}> {
  componentDidMount() {
    track('terms', 'viewed', null);
  }

  render() {
    return (
      <Wrapper data-e2e-id="terms-page">
        <ContentContainer>
          <PageTitle>Privacy Policy</PageTitle>
          <PageSubtitle>Last updated March 15th, 2017</PageSubtitle>

          <Section>
            <SectionDescription>
              Space Program, Inc. operates the spectrum.chat website, which
              provides the SERVICE.
            </SectionDescription>

            <SectionDescription>
              This page is used to inform website visitors regarding our
              policies with the collection, use, and disclosure of Personal
              Information if anyone decided to use our Service.
            </SectionDescription>

            <SectionDescription>
              If you choose to use our Service, then you agree to the collection
              and use of information in relation with this policy. The Personal
              Information that we collect are used for providing and improving
              the Service. We will not use or share your information with anyone
              except as described in this Privacy Policy.
            </SectionDescription>

            <SectionDescription>
              The terms used in this Privacy Policy have the same meanings as in
              our Terms and Conditions, which is accessible at spectrum.chat,
              unless otherwise defined in this Privacy Policy.
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>Information Collection and Use</SectionTitle>

            <SectionDescription>
              For a better experience while using our Service, we may require
              you to provide us with certain personally identifiable
              information, including but not limited to your name, phone number,
              and postal address. The information that we collect will be used
              to contact or identify you.
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>Log Data</SectionTitle>

            <SectionDescription>
              We want to inform you that whenever you visit our Service, we
              collect information that your browser sends to us that is called
              Log Data. This Log Data may include information such as your
              computer’s Internet Protocol (“IP”) address, browser version,
              pages of our Service that you visit, the time and date of your
              visit, the time spent on those pages, and other statistics.
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>Service Providers</SectionTitle>

            <SectionDescription>
              We may employ third-party companies and individuals due to the
              following reasons:
            </SectionDescription>

            <PrivacyTermsList>
              <li>To facilitate our Service;</li>
              <li>To provide the Service on our behalf;</li>
              <li>To perform Service-related services; or</li>
              <li>To assist us in analyzing how our Service is used.</li>
            </PrivacyTermsList>

            <SectionDescription>
              We want to inform our Service users that these third parties have
              access to your Personal Information. The reason is to perform the
              tasks assigned to them on our behalf. However, they are obligated
              not to disclose or use the information for any other purpose.
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>Security</SectionTitle>

            <SectionDescription>
              We value your trust in providing us your Personal Information,
              thus we are striving to use commercially acceptable means of
              protecting it. But remember that no method of transmission over
              the internet, or method of electronic storage is 100% secure and
              reliable, and we cannot guarantee its absolute security.
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>Links to Other Sites</SectionTitle>

            <SectionDescription>
              Our Service may contain links to other sites. If you click on a
              third-party link, you will be directed to that site. Note that
              these external sites are not operated by us. Therefore, we
              strongly advise you to review the Privacy Policy of these
              websites. We have no control over, and assume no responsibility
              for the content, privacy policies, or practices of any third-party
              sites or services.
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>Children’s Privacy</SectionTitle>

            <SectionDescription>
              Our Services do not address anyone under the age of 13. We do not
              knowingly collect personal identifiable information from children
              under 13. In the case we discover that a child under 13 has
              provided us with personal information, we immediately delete this
              from our servers. If you are a parent or guardian and you are
              aware that your child has provided us with personal information,
              please contact us so that we will be able to do necessary actions.
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>Changes to This Privacy Policy</SectionTitle>

            <SectionDescription>
              We may update our Privacy Policy from time to time. Thus, we
              advise you to review this page periodically for any changes. We
              will notify you of any changes by posting the new Privacy Policy
              on this page. These changes are effective immediately, after they
              are posted on this page.
            </SectionDescription>
          </Section>

          <Section>
            <SectionTitle>Contact Us</SectionTitle>

            <SectionDescription>
              If you have any questions or suggestions about our Privacy Policy,
              do not hesitate to{' '}
              <a href="mailto:support@spectrum.chat">contact us</a>.
            </SectionDescription>
          </Section>
        </ContentContainer>

        <PageFooter />
      </Wrapper>
    );
  }
}
export default Privacy;
