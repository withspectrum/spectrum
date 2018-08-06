// @flow
import * as React from 'react';
import { Loading } from 'src/components/loading';
import { HoverWrapper, ProfileCard } from './style';

type Props = {
  innerRef: (?HTMLElement) => void,
  style: CSSStyleDeclaration,
};

export default class LoadingHoverProfile extends React.Component<Props> {
  render() {
    const { innerRef, style } = this.props;

    return (
      <HoverWrapper popperStyle={style} innerRef={innerRef}>
        <ProfileCard style={{ display: 'flex', alignItems: 'center' }}>
          <Loading />
        </ProfileCard>
      </HoverWrapper>
    );
  }
}
