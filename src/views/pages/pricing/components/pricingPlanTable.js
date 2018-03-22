// @flow
import * as React from 'react';
import {
  PriceTable,
  TableCardButton,
  PlanSection,
  BusinessPlanSection,
  BusinessPlanAction,
  BusinessPlanContent,
  PlanPrice,
  PlanDescription,
  PlanFeatures,
} from '../style';
import PricingTableFeatureRow from './pricingTableFeatureRow';
import Link from 'src/components/link';

type Props = {
  scrollToPaidFeatures: Function,
  scrollToOss: Function,
};

class PricingPlanTable extends React.Component<Props> {
  render() {
    return (
      <PriceTable data-e2e-id="pricing-page-price-table">
        <PlanSection>
          <div>
            <PlanPrice>Free</PlanPrice>
            <PlanDescription>
              For growing communities that need a new home for conversations.
            </PlanDescription>
            <PlanFeatures>
              <PricingTableFeatureRow title={'Unlimited conversations'} />

              <PricingTableFeatureRow title={'Unlimited members'} />

              <PricingTableFeatureRow title={'Unlimited public channels'} />

              <PricingTableFeatureRow title={'Search engine optimized'} />

              <PricingTableFeatureRow title={'Reputation system'} />

              <PricingTableFeatureRow title={'Ad-free'} />

              <PricingTableFeatureRow title={'Dedicated community page'} />
            </PlanFeatures>
          </div>

          <Link to={'/new/community'}>
            <TableCardButton>Create a community</TableCardButton>
          </Link>
        </PlanSection>

        <PlanSection>
          <div>
            <PlanPrice>Pay as you go</PlanPrice>
            <PlanDescription>
              For communities that want to understand and manage more
              effectively.
            </PlanDescription>

            <PlanFeatures>
              <PricingTableFeatureRow
                title={'Moderators'}
                subtitle={
                  'An extra set of hands to help keep conversations in your community healthy and productive.'
                }
                color={'space'}
                icon={'member-add'}
                priceLabel={'$10/mo'}
                hideIconsOnMobile
              />

              <PricingTableFeatureRow
                title={'Private channels'}
                subtitle={
                  'A private space for discussions where all members must be approved.'
                }
                color={'special'}
                icon={'private-outline'}
                priceLabel={'$10/mo'}
                hideIconsOnMobile
              />

              <PricingTableFeatureRow
                title={'Analytics'}
                subtitle={
                  'Understand who is in your community, and what they care about most.'
                }
                icon={'analytics'}
                priceLabel={'$100/mo'}
                hideIconsOnMobile
              />

              <PricingTableFeatureRow
                title={'Fair Price Promise'}
                subtitle={
                  'We only charge for the time that each feature is used each month.'
                }
                icon={'like'}
                color={'warn'}
                hideIconsOnMobile
              />
            </PlanFeatures>
          </div>

          <TableCardButton onClick={this.props.scrollToPaidFeatures} light>
            Learn more
          </TableCardButton>
        </PlanSection>

        <BusinessPlanSection>
          <BusinessPlanContent>
            <PlanPrice>Business</PlanPrice>
            <PlanDescription>
              Need a custom solution? Get in touch and we’ll find the best way
              to make Spectrum work for your community.
            </PlanDescription>
          </BusinessPlanContent>
          <BusinessPlanAction>
            <a href={'mailto:hi@spectrum.chat'}>
              <TableCardButton light>Get in touch</TableCardButton>
            </a>
          </BusinessPlanAction>
        </BusinessPlanSection>

        <BusinessPlanSection>
          <BusinessPlanContent>
            <PlanPrice>Open Source, education & non-profit</PlanPrice>
            <PlanDescription>
              We’re excited to help open-source, education, and non-profit
              communities with a free moderator seat and private channel.
            </PlanDescription>
          </BusinessPlanContent>
          <BusinessPlanAction>
            <TableCardButton onClick={this.props.scrollToOss} light>
              Learn more
            </TableCardButton>
          </BusinessPlanAction>
        </BusinessPlanSection>
      </PriceTable>
    );
  }
}

export default PricingPlanTable;
