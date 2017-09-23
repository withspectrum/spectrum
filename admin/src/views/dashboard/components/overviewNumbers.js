// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
import { overviewQuery } from '../../../api/queries';
import { displayLoadingState } from '../../../components/loading';
import {
  OverviewRow,
  Subsection,
  Subtext,
  Count,
  Column,
  Growth,
  Positive,
  Negative,
  Neutral,
  Label,
} from '../style';

const IS_PROD = process.env.NODE_ENV === 'production';
const LOGIN_URL = IS_PROD
  ? `https://spectrum.chat/auth/twitter?r=https://${window.location.host}`
  : 'http://localhost:3001/auth/twitter?r=http://localhost:3000';

const OverviewNumbers = ({ data }) => {
  if (data.loading) return <p>Loading...</p>;
  if (data.error || data.meta === null || data.meta.userCount === null) {
    if (IS_PROD) window.location.href = LOGIN_URL;
    return <a href={LOGIN_URL}>Login</a>;
  }

  const {
    meta: {
      usersGrowth,
      communitiesGrowth,
      channelsGrowth,
      threadsGrowth,
      directMessageThreadsGrowth,
      threadMessagesGrowth,
      directMessagesGrowth,
    },
  } = data;

  const displayGrowthPercentage = (num, range) => {
    if (num > 0) {
      return (
        <Growth>
          <Positive>+{num}%</Positive>
          <Label>{range}</Label>
        </Growth>
      );
    } else if (num < 0) {
      return (
        <Growth>
          <Negative>{num}%</Negative>
          <Label>{range}</Label>
        </Growth>
      );
    } else {
      return (
        <Growth>
          <Neutral>+0%</Neutral>
          <Label>{range}</Label>
        </Growth>
      );
    }
  };

  return (
    <OverviewRow>
      <Subsection>
        <Column>
          <Subtext>Users</Subtext>
          <Count>{usersGrowth.count.toLocaleString()}</Count>
          {displayGrowthPercentage(usersGrowth.weeklyGrowth, '7 days')}
          {displayGrowthPercentage(usersGrowth.monthlyGrowth, '30 days')}
          {displayGrowthPercentage(usersGrowth.quarterlyGrowth, '90 days')}
        </Column>
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Communities</Subtext>
          <Count>{communitiesGrowth.count.toLocaleString()}</Count>
          {displayGrowthPercentage(communitiesGrowth.weeklyGrowth, '7 days')}
          {displayGrowthPercentage(communitiesGrowth.monthlyGrowth, '30 days')}
          {displayGrowthPercentage(
            communitiesGrowth.quarterlyGrowth,
            '90 days'
          )}
        </Column>
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Channels</Subtext>
          <Count>{channelsGrowth.count.toLocaleString()}</Count>
          {displayGrowthPercentage(channelsGrowth.weeklyGrowth, '7 days')}
          {displayGrowthPercentage(channelsGrowth.monthlyGrowth, '30 days')}
          {displayGrowthPercentage(channelsGrowth.quarterlyGrowth, '90 days')}
        </Column>
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Threads</Subtext>
          <Count>{threadsGrowth.count.toLocaleString()}</Count>
          {displayGrowthPercentage(threadsGrowth.weeklyGrowth, '7 days')}
          {displayGrowthPercentage(threadsGrowth.monthlyGrowth, '30 days')}
          {displayGrowthPercentage(threadsGrowth.quarterlyGrowth, '90 days')}
        </Column>
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Thread Messages</Subtext>
          <Count>{threadMessagesGrowth.count.toLocaleString()}</Count>
          {displayGrowthPercentage(threadMessagesGrowth.weeklyGrowth, '7 days')}
          {displayGrowthPercentage(
            threadMessagesGrowth.monthlyGrowth,
            '30 days'
          )}
          {displayGrowthPercentage(
            threadMessagesGrowth.quarterlyGrowth,
            '90 days'
          )}
        </Column>
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Direct Message Threads</Subtext>
          <Count>{directMessageThreadsGrowth.count.toLocaleString()}</Count>
          {displayGrowthPercentage(
            directMessageThreadsGrowth.weeklyGrowth,
            '7 days'
          )}
          {displayGrowthPercentage(
            directMessageThreadsGrowth.monthlyGrowth,
            '30 days'
          )}
          {displayGrowthPercentage(
            directMessageThreadsGrowth.quarterlyGrowth,
            '90 days'
          )}
        </Column>
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Direct Messages</Subtext>
          <Count>{directMessagesGrowth.count.toLocaleString()}</Count>
          {displayGrowthPercentage(directMessagesGrowth.weeklyGrowth, '7 days')}
          {displayGrowthPercentage(
            directMessagesGrowth.monthlyGrowth,
            '30 days'
          )}
          {displayGrowthPercentage(
            directMessagesGrowth.quarterlyGrowth,
            '90 days'
          )}
        </Column>
      </Subsection>
    </OverviewRow>
  );
};

const OverviewWithData = compose(overviewQuery, displayLoadingState)(
  OverviewNumbers
);

export default OverviewWithData;
