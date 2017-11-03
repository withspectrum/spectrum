// @flow
import * as React from 'react';
import { StyledHeading } from './style';

type Props = {
  children: React.Node,
};

class Heading extends React.Component<Props> {
  render() {
    const { children } = this.props;

    return <StyledHeading>{children}</StyledHeading>;
  }
}

export default Heading;
