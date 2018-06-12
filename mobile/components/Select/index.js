// @flow
// This is a wrapper around react-native-picker-select with Spectrum's select styling applied
import React from 'react';
import Picker, { type PickerProps } from 'react-native-picker-select';

const customInputStyles = {
  paddingTop: 8,
  paddingBottom: 8,
  paddingLeft: 12,
  paddingRight: 12,
  borderColor: 'rgb(223, 231, 239)',
  borderRadius: 8,
  borderWidth: 1,
  color: '#000',
};

export default (props: PickerProps) => (
  <Picker
    hideIcon
    {...props}
    style={{
      inputIOS: { ...customInputStyles, ...props.style },
      inputAndroid: { ...customInputStyles, ...props.style },
    }}
  />
);
