// @flow
import * as React from 'react';
import Icon from 'src/components/icon';
import { Wrapper, MenuContainer, MenuOverlay, Absolute } from './style';

type Props = {
  hasNavBar?: boolean,
  darkContext?: boolean,
  hasTabBar?: boolean,
  children: React$Node,
};

type State = {
  menuIsOpen: boolean,
};
class Menu extends React.Component<Props, State> {
  state = {
    menuIsOpen: false,
  };

  toggleMenu() {
    this.setState({ menuIsOpen: !this.state.menuIsOpen });
  }

  render() {
    const { hasNavBar, darkContext, hasTabBar } = this.props;
    const { menuIsOpen } = this.state;
    return (
      <Wrapper darkContext={darkContext}>
        <Icon
          data-cy={'community-menu-open'}
          glyph={'menu'}
          onClick={() => this.toggleMenu()}
        />
        <Absolute open={this.state.menuIsOpen} hasNavBar={hasNavBar}>
          <MenuContainer hasNavBar={hasNavBar} hasTabBar={hasTabBar}>
            {menuIsOpen && this.props.children}
          </MenuContainer>
          <Icon
            glyph={'view-close'}
            onClick={() => this.toggleMenu()}
            hasNavBar={hasNavBar}
          />
          <MenuOverlay
            data-cy={'community-menu-close'}
            onClick={() => this.toggleMenu()}
          />
        </Absolute>
      </Wrapper>
    );
  }
}

export default Menu;
