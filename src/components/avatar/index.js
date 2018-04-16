// @flow
import React, { Component } from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import { optimize } from '../../helpers/images';
import HoverProfile from './hoverProfile';
import AvatarImage from './image';
import { Status, AvatarLink, AvatarNoLink } from './style';

const LinkHandler = props => {
  if (props.link && !props.noLink) {
    return <AvatarLink to={props.link}>{props.children}</AvatarLink>;
  } else {
    return <AvatarNoLink>{props.children}</AvatarNoLink>;
  }
};

type AvatarProps = {
  src: string,
  community?: any,
  user?: any,
  size?: string,
  mobileSize?: string,
  link?: ?string,
  noLink?: boolean,
  showProfile?: boolean,
};

type State = {
  isHovering: boolean,
};

export default class Avatar extends Component<AvatarProps, State> {
  state = { isHovering: false };
  hover = () =>
    this.setState(({ isHovering }) => ({ isHovering: !isHovering }));

  render() {
    const {
      src,
      community,
      user,
      size = '32',
      mobileSize,
      showProfile,
    } = this.props;
    const { isHovering } = this.state;

    const optimizedAvatar =
      src &&
      optimize(src, {
        w: size,
        dpr: '2',
        format: 'png',
      });
    const communityFallback = '/img/default_community.svg';
    const userFallback = '/img/default_avatar.svg';

    let source;

    if (community && !user) {
      source = [optimizedAvatar, communityFallback];
    } else {
      source = [optimizedAvatar, userFallback];
    }

    return (
      <Status
        size={size}
        mobileSize={mobileSize}
        {...this.props}
        onMouseEnter={this.hover}
        onMouseLeave={this.hover}
      >
        <Manager>
          <LinkHandler {...this.props}>
            <Reference>
              {({ ref }) => (
                <AvatarImage
                  src={source}
                  size={size}
                  mobileSize={mobileSize}
                  community={community}
                  innerRef={ref}
                />
              )}
            </Reference>
          </LinkHandler>
          {showProfile &&
            isHovering && (
              <Popper
                placement="top-start"
                modifiers={{
                  preventOverflow: { enabled: false },
                  flip: {
                    boundariesElement: 'scrollParent',
                    behavior: ['top', 'bottom', 'top'],
                  },
                  hide: { enabled: false },
                }}
              >
                {({ style, ref }) => (
                  <HoverProfile
                    source={source}
                    innerRef={ref}
                    style={style}
                    {...this.props}
                  />
                )}
              </Popper>
            )}
        </Manager>
      </Status>
    );
  }
}
