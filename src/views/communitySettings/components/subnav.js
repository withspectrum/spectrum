import * as React from 'react';
import { Link } from 'react-router-dom';
import { StyledSubnav, SubnavList, SubnavListItem } from '../style';

type Props = {
  match: Object,
  communitySlug: string,
  active: boolean,
};

class Subnav extends React.Component<Props> {
  render() {
    const { communitySlug, active } = this.props;

    return (
      <StyledSubnav>
        <SubnavList>
          <SubnavListItem active={active === 'settings'}>
            <Link to={`/${communitySlug}/settings`}>Overview</Link>
          </SubnavListItem>

          <SubnavListItem active={active === 'analytics'}>
            <Link to={`/${communitySlug}/settings/analytics`}>Analytics</Link>
          </SubnavListItem>
        </SubnavList>
      </StyledSubnav>
    );
  }
}

export default Subnav;
