// @flow
import * as React from 'react';
import { ComposerUpsell, UpsellPulse, UpsellDot } from '../style';

export default class Upsell extends React.Component<{}> {
  render() {
    return (
      <ComposerUpsell>
        <UpsellDot />
        <UpsellPulse />
        <p>Create a thread to get a conversation started in your community.</p>
      </ComposerUpsell>
    );
  }
}
