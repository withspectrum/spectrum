// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { EditDropdownContainer } from 'src/components/settingsViews/style';
import Icon from 'src/components/icon';
import OutsideClickHandler from 'src/components/outsideClickHandler';

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
