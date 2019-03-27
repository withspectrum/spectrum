// @flow
import React from 'react';

export const NavigationContext = React.createContext({
  navigationIsOpen: false,
  setNavigationIsOpen: () => {},
});
