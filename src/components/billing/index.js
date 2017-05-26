// @flow
import React from 'react';

import {
  Title,
  Cost,
  CostNumber,
  CostSubtext,
  Plans,
  Plan,
  Description,
  FeatureList,
  Feature,
} from './style';

export const PlanSelector = props => {
  return (
    <Plans>
      <Plan>
        <Title>Create</Title>
        <Cost>
          <CostNumber>0</CostNumber>
          <CostSubtext>forever</CostSubtext>
        </Cost>
        <Description>
          Build your community, audience, support group, open-source project, or really anything else on a platform purpose-built for open, constructive communities.
        </Description>
        <FeatureList>
          <Feature>Unlimited members</Feature>
          <Feature>Unlimited channels</Feature>
          <Feature>Search-indexed, public community</Feature>
          <Feature>Global moderation support</Feature>
        </FeatureList>
      </Plan>
      <Plan currentPlan>
        <Title>Cultivate</Title>
        <Cost>
          <CostNumber per="month">10</CostNumber>
          <CostSubtext>
            up to 100 members<br />(+ 10¢ / additional member)
          </CostSubtext>
        </Cost>
        <Description>
          Take your community to the next level with top-tier moderation and support tools.
        </Description>
        <FeatureList>
          <Feature>Unlimited moderators</Feature>
          <Feature>Unlimited private channels</Feature>
          <Feature>Unlimited default channels</Feature>
          <Feature>Priority support</Feature>
        </FeatureList>
      </Plan>
    </Plans>
  );
};
