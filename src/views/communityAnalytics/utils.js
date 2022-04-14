// @flow
import React from 'react';
import {
  SectionSubtitle,
  GrowthText,
} from 'src/components/settingsViews/style';

export const parseGrowth = ({ growth }: { growth: number }, range: string) => {
  if (!growth) {
    return null;
  } else if (growth > 0) {
    return (
      <div>
        <SectionSubtitle>
          <GrowthText positive>+{growth}%</GrowthText>
          {range}
        </SectionSubtitle>
      </div>
    );
  } else if (growth < 0) {
    return (
      <div>
        <SectionSubtitle>
          <GrowthText negative>{growth}%</GrowthText>
          {range}
        </SectionSubtitle>
      </div>
    );
  } else {
    return (
      <div>
        <SectionSubtitle>
          <GrowthText>+0%</GrowthText>
          {range}
        </SectionSubtitle>
      </div>
    );
  }
};
