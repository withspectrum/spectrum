// @flow
import type { TitlebarProps } from 'src/views/globalTitlebar';

export const setTitlebarProps = (payload: TitlebarProps) => {
  return {
    type: 'SET_TITLEBAR_PROPS',
    payload,
  };
};
