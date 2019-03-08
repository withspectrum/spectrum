// @flow
import React from 'react';
import { Tooltip } from 'brianlovin-react-tippy';

const Tip = (props: Props) => (
  <Tooltip
    position="left-start"
    arrow={true}
    arrowSize={'small'}
    html={
      <span style={{ fontSize: '14px', fontWeight: '600' }}>{props.title}</span>
    }
    // https://github.com/FezVrasta/popper.js/issues/535
    popperOptions={{
      modifiers: {
        preventOverflow: {
          boundariesElement: 'window',
        },
      },
    }}
    {...props}
  />
);

export default Tip;
