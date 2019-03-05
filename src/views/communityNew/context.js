// @flow
import React from 'react';

export const SidenavContext = React.createContext({
  sidenavIsOpen: false,
  setSidenavIsOpen: () => {},
});
