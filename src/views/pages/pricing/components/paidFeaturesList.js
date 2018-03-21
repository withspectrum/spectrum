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
      <FeaturesList>
        <FeatureItem
          title={'Additional moderators'}
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
                other members in the community. If a conversation is getting out
                of hand, moderators are able to lock the thread, delete
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
            'A private space for discussions, requiring all members to be approved before participating.'
          }
          icon={'private-outline'}
          color={'special'}
          priceLabel={'$10 per month per channel'}
          render={() => (
            <ExtraContent>
              <FeatureSublabel>Privacy when you need it</FeatureSublabel>
              <FeatureDescription>
                Private channels are a separate space within your community
                where only specific members can read and join conversations.
                This provides a private space when you need it to discuss more
                sensitive topics, or if you only want certain conversations to
                happen with specific people in your community.
              </FeatureDescription>

              <FeatureSublabel>Archive and restore on demand</FeatureSublabel>
              <FeatureDescription>
                We’ve made it easy to archive and restore private channels at
                any time so that they can be easily used for short-term
                projects. When you’re finished, the channel can be archived to
                save you money, while still providing read-only access to the
                conversations.
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
                With community analytics it’s easy to
              </FeatureDescription>

              <FeatureSublabel>Keep up with the conversation</FeatureSublabel>
              <FeatureDescription>
                We know it can be tough to keep up with a stream of
                conversations happening in your community. Community analytics
                surfaces insights about the content being talked which identify
                popular conversations in real-time, as well as surfacing the
                conversations that have not received replies.
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
