// @flow
import React from 'react';
import Trend from 'react-trend';
import relativeToAbsolute from '../../utils/relative-to-absolute';

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
  const data = props.type !== 'absolute'
    ? props.data
    : relativeToAbsolute(props.data);

  return (
    <div>
      <Trend
        gradient={['#1CD2F2', '#00D6A9']}
        strokeWidth={2}
        smooth
        strokeLinecap="round"
        {...props}
        data={data}
      />
    </div>
  );
};

export default Chart;
