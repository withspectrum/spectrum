// @flow
import React from 'react';
import {
  CreateThreadComposer,
  ComposerLeft,
  ComposeIconContainer,
  ChevronIconContainer,
} from '../style';
import Icon from '../../../components/icons';

// export default () => (
//   <CreateThreadComposer
//     to={{
//       pathname: window.location.pathname,
//       search: `?t=new`,
//     }}
//   >
//     <ComposerLeft>
//       <ComposeIconContainer>
//         <Icon glyph={'post'} size={32} />
//       </ComposeIconContainer>
//       Start a new converation...
//     </ComposerLeft>
//     <ChevronIconContainer>
//       <Icon glyph={'view-forward'} size={32} />
//     </ChevronIconContainer>
//   </CreateThreadComposer>
// );

export default () => (
  <CreateThreadComposer
    to={{
      pathname: window.location.pathname,
      search: `?t=new`,
    }}
  >
    <ComposeIconContainer>
      <Icon glyph={'post'} size={32} />
    </ComposeIconContainer>
  </CreateThreadComposer>
);
