// @flow
import Badge from '..';

export default {
  component: Badge,

  props: {
    type: 'other',
    onClick: () => console.log('Badge pressed!'),
  },

  reduxState: {},
};
