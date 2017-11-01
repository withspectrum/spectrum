// @flow
import React from 'react';
import { connect } from 'react-redux';
import { openModal } from '../../actions/modals';
import { truncateNumber } from '../../helpers/utils';
import Icon from '../icons';
import { ReputationWrapper, ReputationLabel } from './style';

type Props = {
  size: 'mini' | 'default' | 'large',
  reputation: number,
  tipText?: string,
  tipLocation?: string,
  dispatch: Function,
  ignoreClick: boolean,
};
class Reputation extends React.Component<Props> {
  open = e => {
    const { reputation, ignoreClick, dispatch } = this.props;
    e.preventDefault();
    if (ignoreClick) return;
    return dispatch(openModal('REP_EXPLAINER_MODAL', { reputation }));
  };

  render() {
    const {
      size = 'default',
      tipText = 'Reputation',
      tipLocation = 'top-right',
      reputation,
    } = this.props;

    if (reputation === undefined || reputation === null) return null;

    const renderedReputation = reputation > 0 ? reputation : '0';

    return (
      <ReputationWrapper
        onClick={this.open}
        tipText={`${tipText}`}
        tipLocation={tipLocation}
      >
        <Icon glyph="rep" size={24} />

        <ReputationLabel size={size}>
          {truncateNumber(renderedReputation, 1)} rep
        </ReputationLabel>
      </ReputationWrapper>
    );
  }
}

export default connect()(Reputation);
