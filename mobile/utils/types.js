// @flow
export type Navigation = {
  addListener: Function,
  dispatch: Function,
  getParam: Function,
  goBack: Function,
  isFocused: Function,
  navigate: Function,
  pop: Function,
  push: Function,
  replace: Function,
  setParams: Function,
  state: {
    key: string,
    routeName: string,
  },
};
