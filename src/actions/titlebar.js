// @flow
import type { TitlebarPayloadProps } from 'src/views/globalTitlebar';

export const setTitlebarProps = (payload: TitlebarPayloadProps) => {
  return {
    type: 'SET_TITLEBAR_PROPS',
    payload,
  };
};
