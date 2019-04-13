// @flow
import * as React from 'react';
import { Loading } from 'src/components/loading';
import { HoverWrapper, ProfileCard } from './style';

type Props = {
  ref?: (?HTMLElement) => void,
  style: CSSStyleDeclaration,
};

export default class LoadingHoverProfile extends React.Component<Props> {
  render() {
    const { ref, style } = this.props;

    return (
      <HoverWrapper popperStyle={style} ref={ref}>
        <ProfileCard style={{ display: 'flex', alignItems: 'center' }}>
          <Loading />
        </ProfileCard>
      </HoverWrapper>
    );
  }
}
