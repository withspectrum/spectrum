// @flow
import * as React from 'react';
import { StyledHeader, Heading, Subheading } from '../style';
import { Avatar } from '../../../components/avatar';
import { FlexCol } from '../../../components/globals';

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
        <FlexCol>
          <Subheading>{name}</Subheading>
          <Heading>Analytics</Heading>
        </FlexCol>
      </StyledHeader>
    );
  }
}

export default Header;
