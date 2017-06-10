// @flow
import React from 'react';
import Trend from 'react-trend';

type Data = {
  createdAt: number,
};

type Type = 'absolute' | 'relative';

type Props = {
  data: Array<Data>,
  gradient?: Array<string>,
  type?: Type,
};

const Chart = (props: Props) => {
  const data = props.data;

  return (
    <div>
      <Trend
        gradient={['#1CD2F2', '#00D6A9']}
        strokeWidth={2}
        smooth
        strokeLinecap="round"
        {...props}
      />
    </div>
  );
};

export default Chart;
