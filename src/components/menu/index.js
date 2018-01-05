import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IconButton } from '../../components/buttons';
import { Wrapper, MenuContainer, MenuOverlay, Absolute } from './style';

class Menu extends Component {
  constructor() {
    super();

    this.state = {
      menuIsOpen: false,
    };
  }

  toggleMenu() {
    this.setState({ menuIsOpen: !this.state.menuIsOpen });
  }

  render() {
    return (
      <Wrapper>
        <IconButton glyph={'menu'} onClick={() => this.toggleMenu()} />
        <Absolute open={this.state.menuIsOpen}>
          <MenuContainer>{this.props.children}</MenuContainer>
          <IconButton glyph={'view-close'} onClick={() => this.toggleMenu()} />
          <MenuOverlay onClick={() => this.toggleMenu()} />
        </Absolute>
      </Wrapper>
    );
  }
}

export default Menu;
