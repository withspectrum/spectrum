/* @flow
 *
 * This is a wrapper around the vanilla draft-js-plugins-editor package that renders
 * a fallback vanilla text input on Android because DraftJS doesn't have Android support
 *
 */
import React from 'react';
import DraftEditor from 'draft-js-plugins-editor';
import debounce from 'debounce';
import Textarea from 'react-textarea-autosize';
import { isAndroid, toPlainText, fromPlainText } from 'shared/draft-utils';
import type DraftEditorProps from 'draft-js/lib/DraftEditorProps';

type Props = {
  ...$Exact<DraftEditorProps>,
  plugins?: Array<Object>,
  decorators?: Array<Object>,
  defaultKeyBindings?: boolean,
  defaultBlockRenderMap?: boolean,
  editorRef?: Function,
};

type FallbackState = {
  value: string,
};

class AndroidFallbackInput extends React.Component<Props, FallbackState> {
  constructor(props) {
    super(props);

    this.syncChanges = debounce(this.syncChanges, 100);
    this.state = {
      value: '',
    };
  }

  componentWillReceiveProps(next: Props) {
    const curr = this.props;
    if (next.editorState !== curr.editorState) {
      this.setState({
        value: toPlainText(next.editorState),
      });
    }
  }

  // NOTE: This is debounced in the constructor
  // This syncs the changes made to the plaintext input with the rest of the app
  // Because that's an expensive operation we debounce it
  syncChanges = () => {
    this.props.onChange(fromPlainText(this.state.value));
  };

  onChange = (evt: SyntheticInputEvent<>) => {
    const { value } = evt.target;
    this.setState({
      value,
    });

    this.syncChanges();
  };

  render() {
    const {
      editorState,
      editorRef,
      stripPastedStyles,
      customStyleMap,
      handleReturn,
      editorKey,
      ...rest
    } = this.props;
    return (
      <div className="DraftEditor-root">
        <div className="DraftEditor-editorContainer">
          <Textarea
            {...rest}
            value={this.state.value}
            onChange={this.onChange}
            className={'DraftEditor-content ' + (this.props.className || '')}
            style={{ width: '100%', fontSize: '14px' }}
            ref={this.props.editorRef}
          />
        </div>
      </div>
    );
  }
}

class CustomDraftJSPluginsEditor extends React.Component<Props> {
  render() {
    if (!isAndroid() || this.props.readOnly)
      return <DraftEditor {...this.props} ref={this.props.editorRef} />;
    return <AndroidFallbackInput {...this.props} />;
  }
}

export default CustomDraftJSPluginsEditor;
