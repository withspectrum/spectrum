// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import Icon from '../../components/icons';
import { IconButton } from '../../components/buttons';
import { TitleBar, Text, Subtitle, Title } from './style';

class Titlebar extends Component {
  handleBack = () => {
    const { history } = this.props;
    const length = history.length;
    console.log('length', length);
    if (length > 3) {
      console.log('goback()');
      history.goBack();
    } else {
      console.log(`push(${this.props.backRoute})`);
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
              color="bg.default"
              onClick={this.handleBack}
            />
          : <span />}
        <Text>
          <Subtitle>{subtitle ? subtitle : ''}</Subtitle>
          <Title large={subtitle ? false : true}>
            {title ? title : 'Spectrum'}
          </Title>
        </Text>
        <span />
      </TitleBar>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default compose(withRouter, connect(mapStateToProps))(Titlebar);
