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
};
class Reputation extends React.Component<Props> {
  render() {
    const {
      size = 'default',
      tipText = 'Reputation',
      tipLocation = 'top-right',
      dispatch,
      reputation,
    } = this.props;
    const renderedReputation = reputation > 0 ? reputation : '0';
    const iconSize = size === 'mini' ? '16' : size === 'default' ? '24' : '32';

    return (
      <ReputationWrapper
        onClick={() => dispatch(openModal('REP_EXPLAINER_MODAL'))}
      >
        <Icon
          glyph="rep"
          size={iconSize}
          tipText={tipText}
          tipLocation={tipLocation}
        />

        <ReputationLabel tipText={`${reputation.toLocaleString()} rep`}>
          {truncateNumber(renderedReputation, 1)} rep
        </ReputationLabel>
      </ReputationWrapper>
    );
  }
}

export default connect()(Reputation);
