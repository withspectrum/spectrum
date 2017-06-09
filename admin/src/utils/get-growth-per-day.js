// @flow
import groupBy from 'lodash/groupBy';
import moment from 'moment';

const groupByDay = data =>
  groupBy(data, result => moment(result.createdAt).startOf('day'));

type Data = {
  createdAt: Date,
};

const getGrowthPerDay = (input: Array<Data>): Array<number> => {
  const growthByDay = groupByDay(input);
  const startDay = Object.keys(growthByDay).sort(
    (a, b) => moment(a).unix() - moment(b).unix()
  )[0];
  const amountOfDays = moment().diff(startDay, 'days');

  let growthData = [];
  for (var i = 0; i < amountOfDays; i++) {
    const currentDate = moment(startDay).add(i, 'days').toString();
    const currentDatesGrowth = growthByDay[currentDate];
    if (currentDatesGrowth) {
      growthData.push(currentDatesGrowth.length);
    } else {
      // M00p, didn't grow that day 😢
      growthData.push(0);
    }
  }

  return growthData;
};

export default getGrowthPerDay;
