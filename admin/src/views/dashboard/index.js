import React, { Component } from 'react';
import { Section, SectionTitle, HeaderZoneBoy } from './style';
import OverviewNumbers from './components/overviewNumbers';

class Overview extends Component {
  render() {
    return (
      <Section>
        <HeaderZoneBoy>
          <SectionTitle>Overview</SectionTitle>
        </HeaderZoneBoy>
        <OverviewNumbers />
      </Section>
    );
  }
}

export default Overview;
