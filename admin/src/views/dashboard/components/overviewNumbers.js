// @flow
import React from 'react';
import compose from 'recompose/compose';
import { overviewQuery } from '../../../api/queries';
import { convertTimestampToDate, cColors } from '../../../helpers/utils';
import { displayLoadingState } from '../../../components/loading';
import { LineChart, Line, Tooltip } from 'recharts';
import CoreMetrics from './coreMetrics';
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
  ChartContainer,
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
      coreMetrics,
    },
  } = data;

  const chartable = coreMetrics.map(o => {
    return Object.assign(
      {},
      {
        ...o,
        DAU: o.dau,
        WAU: o.wau,
        MAU: o.mau,
        DAC: o.dac,
        WAC: o.wac,
        MAC: o.mac,
        'communities/user': o.cpu,
        'messages/user': o.mpu,
        'threads/user': o.tpu,
        date: convertTimestampToDate(o.date),
      }
    );
  });

  const displayAu = (count: number, range: string) => {
    return (
      <Growth>
        <Row>
          <Neutral>{Math.round(count / usersGrowth.count * 100)}%</Neutral>
          <RangeLabel>
            {range} ({count.toLocaleString()})
          </RangeLabel>
        </Row>
      </Growth>
    );
  };

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

  const singleChartWidth =
    window.innerWidth < 768
      ? window.innerWidth - 32
      : (window.innerWidth - 156) / 4;

  return (
    <OverviewRow>
      <CoreMetrics data={chartable} />

      <Subsection>
        <Column>
          <Subtext>Users</Subtext>
          <Count>{usersGrowth.count.toLocaleString()}</Count>
          <ChartContainer>
            <LineChart
              width={singleChartWidth}
              height={128}
              data={chartable}
              margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
            >
              <Line type="monotone" dataKey="DAU" stroke={cColors.dau} />
              <Line type="monotone" dataKey="WAU" stroke={cColors.dwau} />
              <Line type="monotone" dataKey="MAU" stroke={cColors.mau} />
              <Line type="monotone" dataKey="users" stroke={cColors.users} />
              <Tooltip />
            </LineChart>
          </ChartContainer>
          {displayAu(usersGrowth.dau, 'daily active')}
          {displayAu(usersGrowth.wau, 'weekly active')}
          {displayAu(usersGrowth.mau, 'monthly active')}
          {displayGrowthPercentage(usersGrowth.weeklyGrowth, 'weekly')}
          {displayGrowthPercentage(usersGrowth.monthlyGrowth, 'monthly')}
          {displayGrowthPercentage(usersGrowth.quarterlyGrowth, 'quarterly')}
        </Column>
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Communities</Subtext>
          <Count>{communitiesGrowth.count.toLocaleString()}</Count>
          <ChartContainer>
            <LineChart
              width={singleChartWidth}
              height={128}
              data={chartable}
              margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
            >
              <Line type="monotone" dataKey="DAC" stroke={cColors.dac} />
              <Line type="monotone" dataKey="WAC" stroke={cColors.wac} />
              <Line type="monotone" dataKey="MAC" stroke={cColors.mac} />
              <Line
                type="monotone"
                dataKey="communities"
                stroke={cColors.communities}
              />
              <Tooltip />
            </LineChart>
          </ChartContainer>
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
          <ChartContainer>
            <LineChart
              width={singleChartWidth}
              height={128}
              data={chartable}
              margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
            >
              <Line
                type="monotone"
                dataKey="threads/user"
                stroke={cColors.tpu}
              />
              <Line
                type="monotone"
                dataKey="threads"
                stroke={cColors.threads}
              />
              <Tooltip />
            </LineChart>
          </ChartContainer>
          {displayGrowthPercentage(threadsGrowth.weeklyGrowth, 'weekly')}
          {displayGrowthPercentage(threadsGrowth.monthlyGrowth, 'monthly')}
          {displayGrowthPercentage(threadsGrowth.quarterlyGrowth, 'quarterly')}
        </Column>
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Thread Messages</Subtext>
          <Count>{threadMessagesGrowth.count.toLocaleString()}</Count>
          <ChartContainer>
            <LineChart
              width={singleChartWidth}
              height={128}
              data={chartable}
              margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
            >
              <Line
                type="monotone"
                dataKey="messages/user"
                stroke={cColors.mpu}
              />
              <Line
                type="monotone"
                dataKey="threadMessages"
                stroke={cColors.threadMessages}
              />
              <Tooltip />
            </LineChart>
          </ChartContainer>
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
          <ChartContainer>
            <LineChart
              width={singleChartWidth}
              height={128}
              data={chartable}
              margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
            >
              <Line
                type="monotone"
                dataKey="dmThreads"
                stroke={cColors.dmThreads}
              />
              <Tooltip />
            </LineChart>
          </ChartContainer>
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
          <ChartContainer>
            <LineChart
              width={singleChartWidth}
              height={128}
              data={chartable}
              margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
            >
              <Line
                type="monotone"
                dataKey="dmMessages"
                stroke={cColors.dmMessages}
              />
              <Tooltip />
            </LineChart>
          </ChartContainer>
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
