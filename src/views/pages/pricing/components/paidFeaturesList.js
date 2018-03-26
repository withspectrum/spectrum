// @flow
import * as React from 'react';
import {
  FeaturesList,
  ExtraContent,
  FeatureSublabel,
  FeatureDescription,
} from '../style';
import FeatureItem from './featureItem';

class PaidFeaturesList extends React.Component<{}> {
  render() {
    return (
      <FeaturesList data-e2e-id="pricing-page-paid-features-list">
        <FeatureItem
          title={'Moderator seats'}
          subtitle={
            'An extra set of hands to help keep conversations in your community healthy and productive.'
          }
          icon={'member-add'}
          color={'space'}
          priceLabel={'$10 per month per person'}
          render={() => (
            <ExtraContent>
              <FeatureSublabel>A stronger community</FeatureSublabel>
              <FeatureDescription>
                Moderators can create and manage channels, view analytics to
                make more informed decisions, and manage the permissions of
                other members in your community. If a conversation is getting
                out of hand, moderators are able to lock the thread, delete
                individual messages, or delete the entire conversation if
                needed.
              </FeatureDescription>

              <FeatureSublabel>Better community management</FeatureSublabel>
              <FeatureDescription>
                Moderators are highlighted within your community with a special
                badge and place on your community profile. This makes it easy
                for people to contact your team with questions or concerns.
              </FeatureDescription>
            </ExtraContent>
          )}
        />

        <FeatureItem
          title={'Private channels'}
          subtitle={
            'A private space for discussions where all members require approval.'
          }
          icon={'private-outline'}
          color={'special'}
          priceLabel={'$10 per month per channel'}
          render={() => (
            <ExtraContent>
              <FeatureSublabel>Privacy when you need it</FeatureSublabel>
              <FeatureDescription>
                Private channels are a separate space within your community
                where only specific members can read and participate in
                conversations. This space is perfect for when you need to
                discuss more sensitive topics, or if you want to have
                conversations with specific people.
              </FeatureDescription>

              <FeatureSublabel>Archive and restore on demand</FeatureSublabel>
              <FeatureDescription>
                We’ve made it easy to archive and restore private channels at
                any time so that they can be used for short-term projects. When
                you’re finished, the channel can be archived to save you money,
                while still providing read-only access to the conversations.
              </FeatureDescription>
            </ExtraContent>
          )}
        />

        <FeatureItem
          title={'Analytics'}
          subtitle={
            'Understand who is in your community, and what they care the most about.'
          }
          icon={'analytics'}
          color={'success'}
          priceLabel={'$100 per month'}
          render={() => (
            <ExtraContent>
              <FeatureSublabel>
                Identify influencers and lurkers
              </FeatureSublabel>
              <FeatureDescription>
                Community analytics highlight your most active contributors in
                your community and make it easy to identify the people who are
                lurking quietly. Knowing at a glance who is contributing the
                most to conversations can help to build stronger relationships
                with your members.
              </FeatureDescription>

              <FeatureSublabel>Keep up with the conversation</FeatureSublabel>
              <FeatureDescription>
                Keeping up with an ever-growing stream of conversations can be
                time consuming. Community analytics helps save you time by
                surfacing insights about the the most popular conversations
                happening in real-time. Analytics also highlight conversations
                that have not received replies yet, helping to avoid valuable
                questions slipping through the cracks.
              </FeatureDescription>

              <FeatureSublabel>See the big picture</FeatureSublabel>
              <FeatureDescription>
                Community analytics help to surface big picture growth trends.
                We help you understand how conversations and memberships are
                growing over time to better understand the long-term health of
                your community.
              </FeatureDescription>
            </ExtraContent>
          )}
        />
      </FeaturesList>
    );
  }
}

export default PaidFeaturesList;

// KEEP THIS FOR FUTURE USE

// <FeatureItem
//   title={'Advanced moderation tools'}
//   subtitle={
//     'Automate away the pain of moderating spam and harrassment. Coming in 2018.'
//   }
//   icon={'support'}
//   color={'warn'}
//   priceLabel={'Coming soon'}
//   render={() => (
//     <ExtraContent>
//       <FeatureSublabel>Fighting toxicity together</FeatureSublabel>
//       <FeatureDescription>
//         Our goal is to help anyone build healthy, productive online
//         communities. We are building advanced moderation tooling that
//         will help admins automate the fight against spam and toxicity,
//         giving you more time to join conversations and connect with your
//         community members in positive ways.
//       </FeatureDescription>

//       <FeatureSublabel>Coming soon</FeatureSublabel>
//       <FeatureDescription>
//         Advanced moderation tooling will be coming later this year.
//       </FeatureDescription>
//     </ExtraContent>
//   )}
// />
