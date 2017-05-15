import React from 'react';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import { Label, iconButton } from './style';
import { Spinner } from '../globals';
import { Loading } from '../loading';
import { getSpinnerColor, getButtonType } from './helpers';
import Icon from '../icons';

type ButtonProps = {
  loading: Boolean,
  size: 'small' | 'default' | 'large',
  disabled: Boolean,
  color: 'default' | 'brand' | 'pro' | 'warn' | 'success',
  type: 'default' | 'outline' | 'link' | 'icon',
  /*
    don't use 'type' as a prop when writing buttons. The types are wrapped in
    more semantic component names like <OutlineButton .../>. See the exports
    of this file for examples.
  */
  icon: String,
};

const ButtonPure = (props: ButtonProps) => {
  /*
    these calculations are needed up front to handle sizing and colors based
    on different props the button might receive, as well as ensuring that
    we never end up with white text on a white background, or a purple icon
    on a purplse background
  */
  const spinnerSize = props.size === 'large' ? 24 : 16;
  const spinnerColor = getSpinnerColor(props.color, props.type || 'button');
  const iconSize = props.size === 'xsmall'
    ? 16
    : props.size === 'small' ? 24 : 32;

  /*
    the type gets passed in automatically when you write <OutlineButton .../> or
    <Button> or <LinkButton .../> etc.

    this type gets evaulated to return a styled component
  */
  const StyledButton = getButtonType(props.type);

  return (
    <StyledButton {...props}>
      {/*
        if the button gets passed an icon, it will be replaced with a loading spinner
        when the button is in a loading state
      */}
      {props.icon
        ? props.loading
            ? <Loading color={spinnerColor} size={iconSize * 0.6} />
            : <Icon
                icon={props.icon}
                size={iconSize}
                color={props.iconColor}
                scaleOnHover={props.scaleOnHover}
                hoverColor={props.iconHoverColor}
              />
        : ''}

      {/*
        if the button is loading and doesn't have an icon prop, we will fade the
        label out and insert a centered loading spinner relative to the button size
      */}
      {props.loading &&
        !props.icon &&
        <Spinner color={spinnerColor} size={spinnerSize} />}

      <Label loading={props.loading} hasIcon={props.icon}>
        {props.children}
      </Label>
    </StyledButton>
  );
};

/*
  these are the exports that will be used when writing UI in order to keep things
  as simple and make sure props being passed are only related to presentation:
  - size, color, icon, etc.
*/
export const Button = compose(pure)(ButtonPure);
export const OutlineButton = (props: ButtonProps) => (
  <Button type="outline" {...props} />
);
export const LinkButton = (props: ButtonProps) => (
  <Button type="link" {...props} />
);

export const IconButton = props => {
  <iconButton hoverColor={props.hoverColor} hoverScale={props.hoverScale}>
    <Icon
      icon={props.icon}
      tipText={props.tipText}
      tipLocation={props.tipLocation}
    />
  </iconButton>;
};
