import React, { Component } from 'react';
import FullscreenView from '../../components/fullscreenView';

class NewUserOnboarding extends Component {
  render() {
    return (
      <FullscreenView close={this.props.close}>
        <div>foo</div>
      </FullscreenView>
    );
  }
}

export default NewUserOnboarding;
