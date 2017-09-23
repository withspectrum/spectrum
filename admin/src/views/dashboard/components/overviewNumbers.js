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
  RangeLabel,
  Label,
  Row,
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

  const displayGrowthPercentage = (
    { growth, currentPeriodCount, prevPeriodCount },
    range
  ) => {
    if (growth > 0) {
      return (
        <Growth>
          <Row>
            <Positive>+{growth}%</Positive>
            <RangeLabel>{range}</RangeLabel>
          </Row>
          <Row>
            <Label>Curr. period: {currentPeriodCount}</Label>
          </Row>
          <Row>
            <Label>Prev. period: {prevPeriodCount}</Label>
          </Row>
        </Growth>
      );
    } else if (growth < 0) {
      return (
        <Growth>
          <Row>
            <Negative>{growth}%</Negative>
            <RangeLabel>{range}</RangeLabel>
          </Row>
          <Row>
            <Label>Curr. period: {currentPeriodCount}</Label>
          </Row>
          <Row>
            <Label>Prev. period: {prevPeriodCount}</Label>
          </Row>
        </Growth>
      );
    } else {
      return (
        <Growth>
          <Row>
            <Neutral>+0%</Neutral>
            <RangeLabel>{range}</RangeLabel>
          </Row>
          <Row>
            <Label>Curr. period: {currentPeriodCount}</Label>
          </Row>
          <Row>
            <Label>Prev. period: {prevPeriodCount}</Label>
          </Row>
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
          {displayGrowthPercentage(usersGrowth.weeklyGrowth, 'weekly')}
          {displayGrowthPercentage(usersGrowth.monthlyGrowth, 'monthly')}
          {displayGrowthPercentage(usersGrowth.quarterlyGrowth, 'quarterly')}
        </Column>
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Communities</Subtext>
          <Count>{communitiesGrowth.count.toLocaleString()}</Count>
          {displayGrowthPercentage(communitiesGrowth.weeklyGrowth, 'weekly')}
          {displayGrowthPercentage(communitiesGrowth.monthlyGrowth, 'monthly')}
          {displayGrowthPercentage(
            communitiesGrowth.quarterlyGrowth,
            'quarterly'
          )}
        </Column>
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Channels</Subtext>
          <Count>{channelsGrowth.count.toLocaleString()}</Count>
          {displayGrowthPercentage(channelsGrowth.weeklyGrowth, 'weekly')}
          {displayGrowthPercentage(channelsGrowth.monthlyGrowth, 'monthly')}
          {displayGrowthPercentage(channelsGrowth.quarterlyGrowth, 'quarterly')}
        </Column>
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Threads</Subtext>
          <Count>{threadsGrowth.count.toLocaleString()}</Count>
          {displayGrowthPercentage(threadsGrowth.weeklyGrowth, 'weekly')}
          {displayGrowthPercentage(threadsGrowth.monthlyGrowth, 'monthly')}
          {displayGrowthPercentage(threadsGrowth.quarterlyGrowth, 'quarterly')}
        </Column>
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Thread Messages</Subtext>
          <Count>{threadMessagesGrowth.count.toLocaleString()}</Count>
          {displayGrowthPercentage(threadMessagesGrowth.weeklyGrowth, 'weekly')}
          {displayGrowthPercentage(
            threadMessagesGrowth.monthlyGrowth,
            'monthly'
          )}
          {displayGrowthPercentage(
            threadMessagesGrowth.quarterlyGrowth,
            'quarterly'
          )}
        </Column>
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Direct Message Threads</Subtext>
          <Count>{directMessageThreadsGrowth.count.toLocaleString()}</Count>
          {displayGrowthPercentage(
            directMessageThreadsGrowth.weeklyGrowth,
            'weekly'
          )}
          {displayGrowthPercentage(
            directMessageThreadsGrowth.monthlyGrowth,
            'monthly'
          )}
          {displayGrowthPercentage(
            directMessageThreadsGrowth.quarterlyGrowth,
            'quarterly'
          )}
        </Column>
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Direct Messages</Subtext>
          <Count>{directMessagesGrowth.count.toLocaleString()}</Count>
          {displayGrowthPercentage(directMessagesGrowth.weeklyGrowth, 'weekly')}
          {displayGrowthPercentage(
            directMessagesGrowth.monthlyGrowth,
            'monthly'
          )}
          {displayGrowthPercentage(
            directMessagesGrowth.quarterlyGrowth,
            'quarterly'
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
