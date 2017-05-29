// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import Icon from '../../components/icons';
import { TitleBar, Text, Subtitle, Title } from './style';

class Titlebar extends Component {
  render() {
    const { title, subtitle } = this.props;

    return (
      <TitleBar>
        <span>icon</span>
        <Text>
          <Subtitle>{subtitle ? subtitle : ''}</Subtitle>
          <Title large={subtitle ? false : true}>
            {title ? title : 'Spectrum'}
          </Title>
        </Text>
        <span>icon</span>
      </TitleBar>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(Titlebar);
