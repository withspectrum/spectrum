// @flow
import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Brush } from 'recharts';
import { CoreMetricsContainer, Count, LegendItem, Legend } from '../style';
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
type State = {
  dau: boolean,
  wau: boolean,
  mau: boolean,
  dac: boolean,
  wac: boolean,
  mac: boolean,
  cpu: boolean,
  mpu: boolean,
  tpu: boolean,
  users: boolean,
  communities: boolean,
  threads: boolean,
  dmThreads: boolean,
  threadMessages: boolean,
  dmMessages: boolean,
  data: ?Array<CoreMetric>,
};
class CoreMetrics extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      dau: true,
      wau: true,
      mau: true,
      dac: true,
      wac: true,
      mac: true,
      cpu: true,
      mpu: true,
      tpu: true,
      users: true,
      communities: true,
      threads: true,
      dmThreads: true,
      threadMessages: true,
      dmMessages: true,
      data: null,
    };
  }

  toggleKey = (e: any) => {
    const { id } = e.target;
    const val = this.state[id];

    const obj = {};
    obj[id] = !val;

    const newState = Object.assign(
      {},
      { ...this.state },
      {
        ...obj,
      }
    );

    const newData = this.state.data && [...this.state.data];

    this.setState({
      ...newState,
      data: newData,
    });
  };

  toggleAll = (val: boolean) => {
    const stateKeys = Object.keys(this.state);
    const newState = Object.assign(
      {},
      {
        ...this.state,
      }
    );
    stateKeys.map(k => k !== 'data' && (newState[k] = val));
    return this.setState({
      ...newState,
    });
  };

  componentDidMount() {
    if (!this.props.data) return;
    return this.setState({
      data: this.props.data,
    });
  }

  render() {
    const { data } = this.state;
    const legendKeys = Object.keys(this.state).filter(k => k !== 'data');
    const hasLinesToRender = legendKeys.some(k => this.state[k]);
    return (
      <CoreMetricsContainer>
        <Count>Core Metrics</Count>
        <Legend>
          <LegendItem active onClick={() => this.toggleAll(true)}>
            All
          </LegendItem>
          <LegendItem active onClick={() => this.toggleAll(false)}>
            None
          </LegendItem>
          {legendKeys &&
            legendKeys.length > 0 &&
            legendKeys.map(k => {
              return (
                <LegendItem
                  active={this.state[k]}
                  onClick={this.toggleKey}
                  key={k}
                  id={k}
                  color={cColors[k]}
                >
                  {k}
                </LegendItem>
              );
            })}
        </Legend>
        {data &&
          hasLinesToRender && (
            <LineChart
              width={window.innerWidth - 72}
              height={400}
              data={data}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              {this.state.dau && (
                <Line type="monotone" dataKey="DAU" stroke={cColors.dau} />
              )}

              {this.state.wau && (
                <Line type="monotone" dataKey="WAU" stroke={cColors.wau} />
              )}

              {this.state.mau && (
                <Line type="monotone" dataKey="MAU" stroke={cColors.mau} />
              )}

              {this.state.dac && (
                <Line type="monotone" dataKey="DAC" stroke={cColors.dac} />
              )}

              {this.state.wac && (
                <Line type="monotone" dataKey="WAC" stroke={cColors.wac} />
              )}

              {this.state.mac && (
                <Line type="monotone" dataKey="MAC" stroke={cColors.mac} />
              )}

              {this.state.cpu && (
                <Line
                  type="monotone"
                  dataKey="communities/user"
                  stroke={cColors.cpu}
                />
              )}

              {this.state.mpu && (
                <Line
                  type="monotone"
                  dataKey="messages/user"
                  stroke={cColors.mpu}
                />
              )}

              {this.state.tpu && (
                <Line
                  type="monotone"
                  dataKey="threads/user"
                  stroke={cColors.tpu}
                />
              )}

              {this.state.users && (
                <Line type="monotone" dataKey="users" stroke={cColors.users} />
              )}

              {this.state.communities && (
                <Line
                  type="monotone"
                  dataKey="communities"
                  stroke={cColors.communities}
                />
              )}

              {this.state.threads && (
                <Line
                  type="monotone"
                  dataKey="threads"
                  stroke={cColors.threads}
                />
              )}

              {this.state.dmThreads && (
                <Line
                  type="monotone"
                  dataKey="dmThreads"
                  stroke={cColors.dmThreads}
                />
              )}

              {this.state.threadMessages && (
                <Line
                  type="monotone"
                  dataKey="threadMessages"
                  stroke={cColors.threadMessages}
                />
              )}

              {this.state.dmMessages && (
                <Line
                  type="monotone"
                  dataKey="dmMessages"
                  stroke={cColors.dmMessages}
                />
              )}

              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Brush dataKey="date" data={data} />
            </LineChart>
          )}
      </CoreMetricsContainer>
    );
  }
}
export default CoreMetrics;
