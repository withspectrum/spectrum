import * as React from 'react';
import { Link } from 'react-router-dom';
import { StyledHeader, Heading, Subheading, HeaderText } from '../style';
import Avatar from '../../../components/avatar';

type Props = {
  community: {
    name: string,
    profilePhoto: string,
    slug: string,
  },
};

class Header extends React.Component<Props> {
  render() {
    const { community: { name, profilePhoto, slug }, community } = this.props;
    return (
      <StyledHeader>
        <Avatar community={community} src={profilePhoto} size={48} radius={8} />
        <HeaderText>
          <Link to={`/${slug}`}>
            <Subheading>{name}</Subheading>
          </Link>
          <Heading>Settings</Heading>
        </HeaderText>
      </StyledHeader>
    );
  }
}

export default Header;
