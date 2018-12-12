// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { StyledHeader, Heading, Subheading, HeaderText } from './style';
import { UserAvatar, CommunityAvatar } from '../avatar';

type Props = {
  avatar?: {
    profilePhoto: string,
    community?: Object,
    user?: Object,
  },
  subheading: {
    to: string,
    label: string,
  },
  heading: string,
};

class Header extends React.Component<Props> {
  render() {
    const { avatar, subheading, heading } = this.props;
    return (
      <StyledHeader>
        {avatar && avatar.community && (
          <CommunityAvatar
            community={avatar.community}
            showHoverProfile={false}
            size={48}
          />
        )}
        {avatar && avatar.user && (
          <UserAvatar
            showOnlineStatus={false}
            showHoverProfile={false}
            user={avatar.user}
            size={48}
          />
        )}
        <HeaderText>
          <Link to={subheading.to}>
            <Subheading>{subheading.label}</Subheading>
          </Link>
          <Heading>{heading}</Heading>
        </HeaderText>
      </StyledHeader>
    );
  }
}

export default Header;
