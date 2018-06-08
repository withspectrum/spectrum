// @flow
import * as React from 'react';
import Icon from '../Icon';
import type { GlyphTypes } from '../Icon/types';
import {
  FullscreenNullStateWrapper,
  FullscreenNullStateContent,
  FullscreenNullStateIcon,
  FullscreenNullStateTitle,
  FullscreenNullStateSubtitle,
  FullscreenNullStateChildren,
} from './style';

type Props = {
  title?: string,
  subtitle?: string,
  icon?: GlyphTypes,
  children?: any,
};

class FullscreenNullState extends React.Component<Props> {
  static defaultProps = {
    title: 'Oops, something went wrong',
    subtitle:
      'Our team has been notified and will investigate the problem soon.',
  };

  render() {
    const { title, subtitle, icon, children } = this.props;

    return (
      <FullscreenNullStateWrapper>
        <FullscreenNullStateContent>
          {icon && (
            <FullscreenNullStateIcon>
              <Icon
                glyph={icon ? icon : 'flag'}
                size={96}
                color={theme => theme.text.alt}
              />
            </FullscreenNullStateIcon>
          )}
          <FullscreenNullStateTitle>{title}</FullscreenNullStateTitle>
          <FullscreenNullStateSubtitle>{subtitle}</FullscreenNullStateSubtitle>

          {children && (
            <FullscreenNullStateChildren>
              {children}
            </FullscreenNullStateChildren>
          )}
        </FullscreenNullStateContent>
      </FullscreenNullStateWrapper>
    );
  }
}

export default FullscreenNullState;
