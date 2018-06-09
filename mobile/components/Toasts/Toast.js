// @flow
import * as React from 'react';
import {
  ToastWrapper,
  ToastLabel,
  IconContainer,
  ViewForwardContainer,
} from './style';
import type { GlyphTypes } from '../Icon/types';
import Icon from '../Icon';

type Props = {|
  type: 'notification' | 'success' | 'neutral' | 'error',
  message: string,
  onPressHandler: Function,
  icon?: ?GlyphTypes,
  z: number,
|};

export default class Toast extends React.Component<Props> {
  render() {
    const {
      message = 'Toasty! this a asjd al aisdj alsdkj alskdfj alsdkfj alskdfj alsdkf jalsdkf jasldfkj',
      icon,
      onPressHandler,
      z,
    } = this.props;

    return (
      <ToastWrapper z={z + 1} onPress={onPressHandler}>
        <React.Fragment>
          {icon && (
            <IconContainer>
              <Icon
                color={theme => theme.text.reverse}
                glyph={icon}
                size={24}
              />
            </IconContainer>
          )}
          <ToastLabel
            color={theme => theme.text.reverse}
            numberOfLines={1}
            ellipsizeMode={'tail'}
          >
            {message}
          </ToastLabel>

          {onPressHandler && (
            <ViewForwardContainer>
              <Icon
                color={theme => theme.text.reverse}
                glyph={'view-forward'}
                size={24}
              />
            </ViewForwardContainer>
          )}
        </React.Fragment>
      </ToastWrapper>
    );
  }
}
