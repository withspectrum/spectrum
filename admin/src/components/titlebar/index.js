// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { withRouter } from 'react-router';
import Icon from '../../components/icons';
import { IconButton } from '../../components/buttons';
import { TitleBar, Text, Subtitle, Title, Spacer } from './style';

class Titlebar extends Component {
  handleBack = () => {
    const { history } = this.props;
    const length = history.length;

    if (length > 3) {
      history.goBack();
    } else {
      history.push(this.props.backRoute);
    }
  };

  render() {
    const { title, subtitle, provideBack } = this.props;
    return (
      <TitleBar>
        {provideBack
          ? <IconButton
              glyph="view-back"
              color="text.reverse"
              onClick={this.handleBack}
            />
          : <Spacer />}
        <Text>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
          {title
            ? <Title large={subtitle ? false : true}>{title}</Title>
            : <Icon glyph="logo" />}

        </Text>
      </TitleBar>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
  isOpen: state.composer.isOpen,
});
export default compose(withRouter, connect(mapStateToProps))(Titlebar);
