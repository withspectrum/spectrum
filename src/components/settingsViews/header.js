// @flow
import * as React from 'react';
import Link from 'src/components/link';
import { StyledHeader, Heading, Subheading, HeaderText } from './style';
import Avatar from '../avatar';

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
        {avatar && (
          <Avatar
            community={avatar.community ? avatar.community : null}
            user={avatar.user ? avatar.user : null}
            src={avatar.profilePhoto}
            size={'48'}
            radius={avatar.user ? 48 : 8}
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
