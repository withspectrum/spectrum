// @flow
import * as React from 'react';
import type { GetCommunitySettingsType } from 'shared/graphql/queries/community/getCommunitySettings';
import Form from './form';

type Props = {
  community: GetCommunitySettingsType,
  render: Function,
  onCardSaved?: Function,
};

type State = {
  stripe: ?any,
  isMounted: boolean,
};

let injected = false;
class CardForm extends React.Component<Props, State> {
  render() {
    const { stripe } = this.state;
    return null;
  }
}

export default CardForm;
