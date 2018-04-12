// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { EditDropdownContainer } from '../../../components/settingsViews/style';
import Icon from '../../../components/icons';
import OutsideClickHandler from '../../../components/outsideClickHandler';

type Props = {
  render: Function,
};

type State = { isOpen: boolean };

class EditDropdown extends React.Component<Props, State> {
  initialState = { isOpen: false };

  state = this.initialState;

  toggleOpen = () => this.setState({ isOpen: true });

  close = () => this.setState({ isOpen: false });

  render() {
    const { isOpen } = this.state;

    return (
      <EditDropdownContainer>
        <Icon onClick={this.toggleOpen} isOpen={isOpen} glyph={'settings'} />

        {isOpen && (
          <OutsideClickHandler onOutsideClick={this.close}>
            {this.props.render()}
          </OutsideClickHandler>
        )}
      </EditDropdownContainer>
    );
  }
}

export default compose(connect())(EditDropdown);
