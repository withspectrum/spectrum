// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withRouter, type History } from 'react-router-dom';
import { NavigationContext } from 'src/routes';
import Icon from 'src/components/icons';
import {
  TitlebarContainer,
  Content,
  Actions,
  Title,
  MenuActionContainer,
} from './style';

type Props = {
  title?: string,
  history: History,
  titleIcon?: any,
  rightAction?: any,
  menuAction: 'view-back' | 'menu',
};

const MobileTitlebar = (props: Props) => {
  const {
    title,
    titleIcon,
    rightAction,
    menuAction,
    history,
    previousHistoryBackFallback,
    forceHistoryBack,
    ...rest
  } = props;

  const handleMenuClick = setNavOpen => () => {
    if (menuAction === 'menu') {
      return setNavOpen(true);
    }

    if (forceHistoryBack) {
      return history.push(forceHistoryBack);
    }

    if (history.length >= 3) {
      return history.goBack();
    }

    // if there is not history, redirect back to the home view of the app
    // and let the redirect handler push the user to their last-viewed community
    return history.push(previousHistoryBackFallback || '/');
  };

  const menuActionComponent = setNavigationIsOpen => {
    if (typeof menuAction === 'string') {
      return (
        <Icon
          onClick={handleMenuClick(setNavigationIsOpen)}
          glyph={menuAction}
          size={32}
        />
      );
    }

    // if the menu action is a component, just render the component being passed
    // from the view directly
    return menuAction;
  };

  return (
    <NavigationContext.Consumer>
      {({ setNavigationIsOpen }) => (
        <TitlebarContainer {...rest} hasAction={rightAction}>
          <Content>
            {menuAction && (
              <MenuActionContainer>
                {menuActionComponent(setNavigationIsOpen)}
              </MenuActionContainer>
            )}

            <div style={{ width: '12px' }} />

            {titleIcon && (
              <React.Fragment>
                {titleIcon}
                <div style={{ width: '12px' }} />
              </React.Fragment>
            )}

            {title && <Title>{title}</Title>}
          </Content>

          {rightAction && <Actions>{rightAction}</Actions>}
        </TitlebarContainer>
      )}
    </NavigationContext.Consumer>
  );
};

export default compose(withRouter)(MobileTitlebar);
