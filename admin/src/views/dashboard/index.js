// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
import {
  Section,
  SectionTitle,
  OverviewRow,
  Subsection,
  Subtext,
  Count,
  RangePicker,
  RangeItem,
  HeaderZoneBoy,
  Column,
} from './style';
import Chart from '../../components/spark-line';
import { overviewQuery } from '../../api/queries';
import { displayLoadingState } from '../../components/loading';
import getGrowthPerDay from '../../utils/get-growth-per-day';
import formatNumber from '../../utils/format-number';

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

  const { meta } = data;
  const userCount = formatNumber(meta.userGrowth.length);
  const communityCount = formatNumber(meta.communityGrowth.length);
  const channelCount = formatNumber(meta.channelGrowth.length);
  const threadCount = formatNumber(meta.threadGrowth.length);
  const messageCount = formatNumber(meta.messageGrowth.length);
  const totalPerMonth = formatNumber(
    meta.subscriptionGrowth.reduce((total, { amount }) => total + amount, 0) /
      100
  );
  const userGrowth = getGrowthPerDay(meta.userGrowth);
  const communityGrowth = getGrowthPerDay(meta.communityGrowth);
  const channelGrowth = getGrowthPerDay(meta.channelGrowth);
  const threadGrowth = getGrowthPerDay(meta.threadGrowth);
  const messageGrowth = getGrowthPerDay(meta.messageGrowth);
  const subscriptionGrowth = getGrowthPerDay(meta.subscriptionGrowth, day =>
    day.reduce((total, { amount }) => total + amount, 0)
  );

  return (
    <OverviewRow>
      <Subsection>
        <Column>
          <Subtext>Users</Subtext>
          <Count>
            {userCount}
          </Count>
        </Column>
        <Chart height={56} data={userGrowth} />
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Communities</Subtext>
          <Count>
            {communityCount}
          </Count>
        </Column>
        <Chart height={56} data={communityGrowth} />
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Channels</Subtext>
          <Count>
            {channelCount}
          </Count>
        </Column>
        <Chart height={56} data={channelGrowth} />
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Threads</Subtext>
          <Count>
            {threadCount}
          </Count>
        </Column>
        <Chart height={56} data={threadGrowth} />
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Messages</Subtext>
          <Count>
            {messageCount}
          </Count>
        </Column>
        <Chart height={56} data={messageGrowth} />
      </Subsection>

      <Subsection>
        <Column>
          <Subtext>Money</Subtext>
          <Count>
            ${totalPerMonth}/m
          </Count>
        </Column>
        <Chart type="absolute" height={56} data={subscriptionGrowth} />
      </Subsection>
    </OverviewRow>
  );
};

const OverviewWithData = compose(overviewQuery, displayLoadingState)(
  OverviewNumbers
);

class Overview extends Component {
  state: {
    range: string,
  };

  constructor() {
    super();

    this.state = {
      range: 'all',
    };
  }

  setRange = range => {
    this.setState({
      range,
    });
  };

  render() {
    const { range } = this.state;

    return (
      <Section>
        <HeaderZoneBoy>
          <SectionTitle>Overview</SectionTitle>

          <RangePicker>
            <RangeItem
              active={range === 'all'}
              onClick={() => this.setRange('all')}
            >
              All
            </RangeItem>
            <RangeItem
              active={range === 'week'}
              onClick={() => this.setRange('week')}
            >
              Week
            </RangeItem>
            <RangeItem
              active={range === 'month'}
              onClick={() => this.setRange('month')}
            >
              Month
            </RangeItem>
          </RangePicker>
        </HeaderZoneBoy>

        <OverviewWithData range={range} />
      </Section>
    );
  }
}

export default Overview;
