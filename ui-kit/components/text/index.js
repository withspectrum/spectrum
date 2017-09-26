// @flow
import * as React from 'react';
import { StyledHeading } from './style';

type Props = {
  children: React.Node,
  size?: string,
  weight?: string,
  overrideColor?: string,
};

class Heading extends React.Component<Props> {
  static defaultProps = {
    size: '3',
    weight: '3',
    overrideColor: '',
  };

  render() {
    const { size, weight, overrideColor, children } = this.props;

    return (
      <StyledHeading size={size} weight={weight} overrideColor={overrideColor}>
        {children}
      </StyledHeading>
    );
  }
}

export default Heading;
