import React, { Component } from 'react';
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
} from './style';
import { overviewQuery } from '../../api/queries';
import { displayLoadingState } from '../loading';

const IS_PROD = process.env.NODE_ENV === 'production';
const LOGIN_URL = IS_PROD
  ? 'https://spectrum.chat/api/auth/twitter'
  : 'http://localhost:3001/auth/twitter';

const OverviewNumbers = ({ data }) => {
  if (data.loading) return <p>Loading...</p>;
  if (data.error || data.meta === null || data.meta.userCount === null) {
    if (IS_PROD) window.location.href = 'https://spectrum.chat';
    return <a href={LOGIN_URL}>Login</a>;
  }

  const numberWithCommas = num =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const { meta } = data;
  const userCount = numberWithCommas(meta.userCount);
  const communityCount = numberWithCommas(meta.communityCount);
  const channelCount = numberWithCommas(meta.channelCount);
  const threadCount = numberWithCommas(meta.threadCount);
  const messageCount = numberWithCommas(meta.messageCount);

  return (
    <OverviewRow>
      <Subsection>
        <Subtext>Users</Subtext>
        <Count>{userCount}</Count>
      </Subsection>

      <Subsection>
        <Subtext>Communities</Subtext>
        <Count>{communityCount}</Count>
      </Subsection>

      <Subsection>
        <Subtext>Channels</Subtext>
        <Count>{channelCount}</Count>
      </Subsection>

      <Subsection>
        <Subtext>Threads</Subtext>
        <Count>{threadCount}</Count>
      </Subsection>

      <Subsection>
        <Subtext>Messages</Subtext>
        <Count>{messageCount}</Count>
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
