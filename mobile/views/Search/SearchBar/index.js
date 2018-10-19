// @flow
import React, { Component } from 'react';
import { withTheme } from 'styled-components';
import { SearchBar } from './style';

type Props = {
  allowFontScaling?: boolean,
  autoCapitalize?: 'characters' | 'words' | 'sentences' | 'none',
  autoCorrect: boolean,
  autoFocus: boolean,
  blurOnSubmit: boolean,
  caretHidden: boolean,
  clearButtonMode: 'never' | 'while-editing' | 'unless-editing' | 'always',
  clearTextOnFocus: boolean,
  contextMenuHidden: boolean,
  defaultValue: string,
  disableFullscreenUI: boolean,
  editable: boolean,
  enablesReturnKeyAutomatically: boolean,
  keyboardAppearance: 'default' | 'light' | 'dark',
  keyboardType: 'default' | 'numeric' | 'email-address' | 'phone-pad',
  multiline: boolean,
  onBlur: Function,
  onChange: Function,
  onChangeText: Function,
  onEndEditing: Function,
  onFocus: Function,
  onKeyPress: Function,
  onSelectionChange: Function,
  onSubmitEditing: Function,
  placeholder: string,
  returnKeyType: 'done' | 'go' | 'next' | 'search' | 'send',
  secureTextEntry: boolean,
  selectTextOnFocus: boolean,
};

class SearchInput extends Component<Props> {
  render() {
    const {
      allowFontScaling = true,
      autoCapitalize = 'sentences',
      autoCorrect = true,
      autoFocus = false,
      blurOnSubmit = true,
      caretHidden = false,
      clearButtonMode = 'always',
      clearTextOnFocus = false,
      contextMenuHidden = false,
      defaultValue = '',
      disableFullscreenUI = false,
      editable = true,
      enablesReturnKeyAutomatically = false,
      keyboardAppearance = 'default',
      keyboardType = 'default',
      multiline = false,
      placeholder = '',
      returnKeyType = 'done',
      secureTextEntry = false,
      selectTextOnFocus = true,
      ...props
    } = this.props;

    return (
      <SearchBar
        allowFontScaling={allowFontScaling}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        autoFocus={autoFocus}
        blurOnSubmit={blurOnSubmit}
        caretHidden={caretHidden}
        clearButtonMode={clearButtonMode}
        clearTextOnFocus={clearTextOnFocus}
        contextMenuHidden={contextMenuHidden}
        defaultValue={defaultValue}
        disableFullscreenUI={disableFullscreenUI}
        editable={editable}
        enablesReturnKeyAutomatically={enablesReturnKeyAutomatically}
        keyboardAppearance={keyboardAppearance}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholder={placeholder}
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        selectTextOnFocus={selectTextOnFocus}
        {...props}
      />
    );
  }
}

export default withTheme(SearchInput);
