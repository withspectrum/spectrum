import React from 'react';
import {
  Label,
  StyledSolidButton,
  StyledTextButton,
  StyledIconButton,
  StyledOutlineButton,
  StyledFauxOutlineButton,
  SpinnerContainer,
  StyledButtonRow,
} from './style';
import { Spinner } from '../globals';
import Icon from '../icons';

type ButtonProps = {
  loading?: boolean,
  disabled?: boolean,
  large?: boolean,
  color?: string,
  gradientTheme?: string,
  icon?: string,
  children?: any,
  dataCy?: string,
};

type IconProps = {
  glyph: string,
  color?: string,
  hoverColor?: string,
  disabled?: boolean,
  tipText?: string,
  tipLocation?:
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'bottom'
    | 'bottom-right'
    | 'bottom-left'
    | 'left'
    | 'right',
};

export const Button = (props: ButtonProps) => (
  <StyledSolidButton disabled={props.loading} data-cy={props.dataCy} {...props}>
    {props.icon ? (
      props.loading ? (
        <SpinnerContainer>
          <Spinner
            isBtnLoading={props.loading}
            color="text.reverse"
            size="16"
          />
        </SpinnerContainer>
      ) : (
        <Icon glyph={props.icon} />
      )
    ) : (
      ''
    )}
    {props.loading &&
      !props.icon && (
        <Spinner isBtnLoading={props.loading} color="text.reverse" size="16" />
      )}
    <Label loading={props.loading} hasIcon={props.icon}>
      {props.children}
    </Label>
  </StyledSolidButton>
);

export const OutlineButton = (props: ButtonProps) => (
  <StyledOutlineButton
    disabled={props.loading}
    data-cy={props.dataCy}
    {...props}
  >
    {props.icon ? (
      props.loading ? (
        <SpinnerContainer>
          <Spinner color="brand.alt" size="16" />
        </SpinnerContainer>
      ) : (
        <Icon glyph={props.icon} />
      )
    ) : (
      ''
    )}
    {props.loading && !props.icon && <Spinner color="brand.alt" size="16" />}
    <Label loading={props.loading} hasIcon={props.icon}>
      {props.children}
    </Label>
  </StyledOutlineButton>
);

// looks like a button, but isn't a button so it won't submit forms
export const FauxOutlineButton = (props: ButtonProps) => (
  <StyledFauxOutlineButton
    disabled={props.loading}
    data-cy={props.dataCy}
    {...props}
  >
    {props.icon ? (
      props.loading ? (
        <SpinnerContainer>
          <Spinner color="brand.alt" size="16" />
        </SpinnerContainer>
      ) : (
        <Icon glyph={props.icon} />
      )
    ) : (
      ''
    )}
    {props.loading && !props.icon && <Spinner color="brand.alt" size="16" />}
    <Label loading={props.loading} hasIcon={props.icon}>
      {props.children}
    </Label>
  </StyledFauxOutlineButton>
);

export const TextButton = (props: ButtonProps) => (
  <StyledTextButton disabled={props.loading} data-cy={props.dataCy} {...props}>
    {props.icon ? (
      props.loading ? (
        <SpinnerContainer>
          <Spinner color="text.alt" size="16" />
        </SpinnerContainer>
      ) : (
        <Icon glyph={props.icon} />
      )
    ) : (
      ''
    )}
    {props.loading && !props.icon && <Spinner color="text.alt" size="16" />}
    <Label loading={props.loading} hasIcon={props.icon}>
      {props.children}
    </Label>
  </StyledTextButton>
);

export const IconButton = (props: IconProps) => (
  <StyledIconButton disabled={props.loading} data-cy={props.dataCy} {...props}>
    <Icon
      glyph={props.glyph}
      tipText={props.tipText}
      tipLocation={props.tipLocation}
    />
  </StyledIconButton>
);

export const ButtonRow = props => (
  <StyledButtonRow>{props.children}</StyledButtonRow>
);
