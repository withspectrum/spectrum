// @flow
import React from 'react';
import Tooltip from 'src/components/Tooltip';
import { StyledLinkFab, StyledFab } from './style';

const Fab = (props: Props) => {
  const { to, title, ...rest } = props;

  const style = {
    position: 'fixed',
    bottom: 0,
    right: 0,
    width: '108px',
    height: '90px',
  };

  if (to)
    return (
      <Tooltip style={style} title={title} position={'top'}>
        <StyledLinkFab to={to} {...rest} />
      </Tooltip>
    );

  return (
    <Tooltip style={style} title={title} position={'top'}>
      <StyledFab {...rest} />
    </Tooltip>
  );
};

export default Fab;
