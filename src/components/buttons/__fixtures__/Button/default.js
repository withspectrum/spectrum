// @flow
import { createFixture } from 'react-cosmos-flow/fixture';
import { Button } from '../..';

export default createFixture({
  component: Button,

  props: {
    children: 'Push it real good',
  },
});
