// @flow
import * as React from 'react';
import { FeaturesList } from '../style';
import FeatureItem from './featureItem';

class PaidFeaturesList extends React.Component {
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
        />

        <FeatureItem
          title={'Private channels'}
          subtitle={
            'A private space for discussions, requiring all members to be approved before participating.'
          }
          icon={'private-outline'}
          color={'special'}
          priceLabel={'$10 per month per channel'}
        />

        <FeatureItem
          title={'Analytics'}
          subtitle={
            'Understand who is in your community, and what they care the most about.'
          }
          icon={'analytics'}
          color={'success'}
          priceLabel={'$100 per month'}
        />

        <FeatureItem
          title={'Advanced moderation tools'}
          subtitle={
            'Automate away the pain of moderating spam and harrassment. Coming in 2018.'
          }
          icon={'support'}
          color={'warn'}
          priceLabel={'Coming soon'}
        />
      </FeaturesList>
    );
  }
}

export default PaidFeaturesList;
