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
  onPressHandler?: ?Function,
  icon?: ?GlyphTypes,
|};

export default class Toast extends React.Component<Props> {
  render() {
    const { message = '', icon, onPressHandler } = this.props;

    let cleanedMessage = message;
    if (message.indexOf('GraphQL error: ') >= 0) {
      cleanedMessage = message.replace('GraphQL error: ', '');
    }

    return (
      <ToastWrapper onPress={onPressHandler}>
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
            {cleanedMessage}
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
