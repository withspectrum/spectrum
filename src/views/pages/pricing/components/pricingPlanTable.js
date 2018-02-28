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
};

class PricingPlanTable extends React.Component<Props> {
  render() {
    return (
      <PriceTable>
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
                title={'Additional moderators'}
                subtitle={
                  'An extra set of hands to help keep conversations in your community healthy and productive.'
                }
                color={'space'}
                icon={'member-add'}
                priceLabel={'$10/mo'}
              />

              <PricingTableFeatureRow
                title={'Private channels'}
                subtitle={
                  'A private space for discussions, requiring all members to be approved before participating.'
                }
                color={'special'}
                icon={'private-outline'}
                priceLabel={'$10/mo'}
              />

              <PricingTableFeatureRow
                title={'Analytics'}
                subtitle={
                  'Understand who is in your community, and what they care the most about.'
                }
                icon={'analytics'}
                priceLabel={'$100/mo'}
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
      </PriceTable>
    );
  }
}

export default PricingPlanTable;

// // @flow
// import * as React from 'react';
// import {
//   PriceTable,
//   TableCard,
//   TableCardTitle,
//   TableCardSubtitle,
//   TableCardFeatureList,
//   TableCardFeature,
//   TableCardButton
// } from '../style';

// class PricingPlanTable extends React.Component<{}> {
//   render() {
//     return (
//       <PriceTable>
//         <TableCard>

//             <TableCardTitle>Open</TableCardTitle>
//             <TableCardSubtitle>Perfect for new or growing communities</TableCardSubtitle>
//             <TableCardButton>Create a community</TableCardButton>
//             <TableCardFeatureList>
//               <TableCardFeature>Unlimited conversations</TableCardFeature>
//               <TableCardFeature>Unlimited members</TableCardFeature>
//               <TableCardFeature>Unlimited public channels</TableCardFeature>
//               <TableCardFeature>Search engine optimized</TableCardFeature>
//               <TableCardFeature>Reputation system</TableCardFeature>
//               <TableCardFeature>Ad free</TableCardFeature>
//               <TableCardFeature>Dedicated home page</TableCardFeature>
//             </TableCardFeatureList>

//             <TableCardTitle>On Demand</TableCardTitle>
//             <TableCardSubtitle>Pay as you go</TableCardSubtitle>
//             <TableCardFeatureList>
//               <TableCardFeature>All Open features</TableCardFeature>
//               <TableCardFeature>Moderator seats · $10/mo</TableCardFeature>
//               <TableCardFeature>Private channels · $10/mo</TableCardFeature>
//               <TableCardFeature>Analytics · $100/mo</TableCardFeature>
//             </TableCardFeatureList>

//             <TableCardTitle>Business</TableCardTitle>
//             <TableCardSubtitle>Custom solution</TableCardSubtitle>
//             <TableCardFeatureList>
//               <TableCardFeature>Need a custom setup for a large community, team, or special use case? Get in touch and we will find the best solution for you.</TableCardFeature>
//             </TableCardFeatureList>

//             <TableCardButton light>Learn more</TableCardButton>
//             <TableCardButton>Create a community</TableCardButton>

//         </TableCard>

//         <TableCard>
//           <div>
//             <TableCardTitle>On Demand</TableCardTitle>
//             <TableCardSubtitle>Pay as you go</TableCardSubtitle>
//             <TableCardFeatureList>
//               <TableCardFeature>All Open features</TableCardFeature>
//               <TableCardFeature>Moderator seats · $10/mo</TableCardFeature>
//               <TableCardFeature>Private channels · $10/mo</TableCardFeature>
//               <TableCardFeature>Analytics · $100/mo</TableCardFeature>
//             </TableCardFeatureList>
//           </div>
//           <div>
//             <TableCardButton light>Learn more</TableCardButton>
//             <TableCardButton>Create a community</TableCardButton>
//           </div>
//         </TableCard>

//         <TableCard>
//           <div>
//             <TableCardTitle>Business</TableCardTitle>
//             <TableCardSubtitle>Custom solution</TableCardSubtitle>
//             <TableCardFeatureList>
//               <TableCardFeature>Need a custom setup for a large community, team, or special use case? Get in touch and we will find the best solution for you.</TableCardFeature>
//             </TableCardFeatureList>
//           </div>
//           <div>
//             <TableCardButton light>Get in touch</TableCardButton>
//           </div>
//         </TableCard>
//       </PriceTable>
//     );
//   }
// }

// export default PricingPlanTable;
