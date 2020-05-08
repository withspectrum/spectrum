// @flow
import * as React from 'react';
import { Img, FallbackImg, LoadingImg } from './style';
import VisibilitySensor from 'react-visibility-sensor';

type Props = {
  src: any,
  type: 'user' | 'community',
  size: number,
  mobilesize?: number,
  isClickable?: boolean,
  alt: string,
};

export default class Image extends React.Component<Props> {
  render() {
    const { type, size, mobilesize } = this.props;
    const { ...rest } = this.props;
    const fallbackSrc =
      type === 'user'
        ? '/img/default_avatar.svg'
        : '/img/default_community.svg';

    return (
      <VisibilitySensor>
        <Img
          {...rest}
          decode={false}
          loader={
            <LoadingImg
              size={size}
              mobilesize={mobilesize}
              type={type}
              src={fallbackSrc}
              alt=""
            />
          }
          unloader={
            <FallbackImg
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
