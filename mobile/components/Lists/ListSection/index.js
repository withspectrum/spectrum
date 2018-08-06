// @flow
import * as React from 'react';
import { Container } from './style';

type Props = { children: any };

export class ListSection extends React.Component<Props> {
  render() {
    const { children } = this.props;

    return <Container>{children}</Container>;
  }
}
