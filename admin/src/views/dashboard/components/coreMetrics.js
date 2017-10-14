// @flow
import * as React from 'react';
// $FlowIssue
import { LineChart, Line, XAxis, YAxis, Tooltip, Brush } from 'recharts';
import { CoreMetricsContainer, Count } from '../style';
import { cColors } from '../../../helpers/utils';

type CoreMetric = {
  dau: number,
  wau: number,
  mau: number,
  dac: number,
  wac: number,
  mac: number,
  cpu: number,
  mpu: number,
  tpu: number,
  users: number,
  communities: number,
  threads: number,
  dmThreads: number,
  threadMessages: number,
  dmMessages: number,
  date: Date,
};
type Props = {
  data: Array<CoreMetric>,
};
class CoreMetrics extends React.Component<Props> {
  render() {
    const { data } = this.props;

    return (
      <CoreMetricsContainer>
        <Count>Core Metrics</Count>
        <LineChart
          width={window.innerWidth - 72}
          height={400}
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey="DAU" stroke={cColors.dau} />
          <Line type="monotone" dataKey="WAU" stroke={cColors.wau} />
          <Line type="monotone" dataKey="MAU" stroke={cColors.mau} />
          <Line type="monotone" dataKey="DAC" stroke={cColors.dac} />
          <Line type="monotone" dataKey="WAC" stroke={cColors.wac} />
          <Line type="monotone" dataKey="MAC" stroke={cColors.mac} />
          <Line
            type="monotone"
            dataKey="communities/user"
            stroke={cColors.cpu}
          />
          <Line type="monotone" dataKey="messages/user" stroke={cColors.mpu} />
          <Line type="monotone" dataKey="threads/user" stroke={cColors.tpu} />
          <Line type="monotone" dataKey="users" stroke={cColors.users} />
          <Line
            type="monotone"
            dataKey="communities"
            stroke={cColors.communities}
          />
          <Line type="monotone" dataKey="threads" stroke={cColors.threads} />
          <Line
            type="monotone"
            dataKey="dmThreads"
            stroke={cColors.dmThreads}
          />
          <Line
            type="monotone"
            dataKey="threadMessages"
            stroke={cColors.threadMessages}
          />
          <Line
            type="monotone"
            dataKey="dmMessages"
            stroke={cColors.dmMessages}
          />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Brush dataKey="date" data={data} />
        </LineChart>
      </CoreMetricsContainer>
    );
  }
}
export default CoreMetrics;
