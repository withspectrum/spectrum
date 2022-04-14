// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import Tooltip from 'src/components/tooltip';
import { openModal } from 'src/actions/modals';
import { truncateNumber } from 'src/helpers/utils';
import Icon from 'src/components/icon';
import { ReputationWrapper, ReputationLabel } from './style';

type Props = {
  size?: 'mini' | 'default' | 'large',
  reputation: number,
  dispatch: Dispatch<Object>,
  ignoreClick?: boolean,
};

class Reputation extends React.Component<Props> {
  open = e => {
    const { reputation, ignoreClick, dispatch } = this.props;
    e.preventDefault();
    if (ignoreClick) return;
    return dispatch(openModal('REP_EXPLAINER_MODAL', { reputation }));
  };

  render() {
    const { reputation } = this.props;

    if (reputation === undefined || reputation === null) return null;

    const renderedReputation = reputation > 0 ? `${reputation}` : '0';

    return (
      <Tooltip content={'Reputation'}>
        <ReputationWrapper onClick={this.open}>
          <Icon glyph="rep" size={24} />

          <ReputationLabel>
            {truncateNumber(parseInt(renderedReputation, 10), 1)}
          </ReputationLabel>
        </ReputationWrapper>
      </Tooltip>
    );
  }
}

export default connect()(Reputation);
