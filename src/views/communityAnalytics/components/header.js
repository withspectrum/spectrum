import * as React from 'react';
import { StyledHeader, Heading, Subheading, HeaderText } from '../style';
import { Avatar } from '../../../components/avatar';

type Props = {
  community: {
    name: string,
    profilePhoto: string,
  },
};

class Header extends React.Component<Props> {
  render() {
    const { community: { name, profilePhoto } } = this.props;
    return (
      <StyledHeader>
        <Avatar community src={profilePhoto} size={48} radius={8} />
        <HeaderText>
          <Subheading>{name}</Subheading>
          <Heading>Analytics</Heading>
        </HeaderText>
      </StyledHeader>
    );
  }
}

export default Header;
