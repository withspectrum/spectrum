// @flow
import React from 'react';
import { Tooltip } from 'react-tippy';

const Tip = (props: Props) => (
  <Tooltip
    {...props}
    position="left-start"
    arrow={true}
    arrowSize={'small'}
    // https://github.com/FezVrasta/popper.js/issues/535
    popperOptions={{
      modifiers: {
        preventOverflow: {
          boundariesElement: 'window',
        },
      },
    }}
  />
);

export default Tip;
