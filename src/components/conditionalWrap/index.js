// @flow
// Conditionally wrap a Component in some more JSX
//
// Usage:
//   <ConditionalWrap
//     condition={shouldLink}
//     wrap={children => <TouchableOpacity onPress={this.onPress}>{children}</TouchableOpacity>}
//   >
//    <OtherComponent />
//  </ConditionalWrap>

import type { Node } from 'react';

type Props = {
  condition: boolean,
  wrap: (children: Node) => *,
  children: Node,
};

function ConditionalWrap({ condition, wrap, children }: Props) {
  return condition ? wrap(children) : children;
}

export default ConditionalWrap;
