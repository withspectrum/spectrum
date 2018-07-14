// @flow
import * as React from 'react';
import { Img, Fallback } from './style';
import VisibilitySensor from 'react-visibility-sensor';

type Props = {
  src: any,
  type: 'user' | 'community',
  size: number,
  mobilesize?: number,
};

export default class Image extends React.Component<Props> {
  render() {
    const { type, size, mobilesize } = this.props;
    const fallbackSrc =
      type === 'user'
        ? '/img/default_avatar.svg'
        : '/img/default_community.svg';

    return (
      <VisibilitySensor>
        <Img
          {...this.props}
          decode={false}
          loader={
            <Fallback
              size={size}
              mobilesize={mobilesize}
              type={type}
              src={fallbackSrc}
              alt=""
            />
          }
          unloader={
            <Fallback
              size={size}
              mobilesize={mobilesize}
              type={type}
              src={fallbackSrc}
              alt=""
            />
          }
        />
      </VisibilitySensor>
    );
  }
}
