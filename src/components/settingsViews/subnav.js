// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { StyledSubnav, SubnavList, SubnavListItem } from './style';

type SubnavItem = {
  to: string,
  label: string,
  activeLabel: string,
};
type Props = {
  items: Array<SubnavItem>,
  activeTab: string,
};

class Subnav extends React.Component<Props> {
  render() {
    const { activeTab, items } = this.props;

    return (
      <StyledSubnav>
        <SubnavList>
          {items.map((item, i) => {
            return (
              <SubnavListItem key={i} active={activeTab === item.activeLabel}>
                <Link to={item.to}>{item.label}</Link>
              </SubnavListItem>
            );
          })}
        </SubnavList>
      </StyledSubnav>
    );
  }
}

export default Subnav;
