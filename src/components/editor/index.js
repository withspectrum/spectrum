// @flow
import React, { Component } from 'react';
//$FlowFixMe
import { Editor as SlateEditor, Raw, Plain } from 'slate';
//$FlowFixMe
import type { SlatePlugin } from 'slate-mentions/src/types';
//$FlowFixMe
import MarkdownPlugin from 'slate-markdown';
import { Wrapper, MediaRow } from './style';
import SingleLinePlugin from './single-line-plugin';
import ImagePlugin from './image-plugin';
import MediaInput from '../mediaInput';
import { LinkPreview, LinkPreviewLoading } from '../linkPreview';

const ENTER = 13;

const initialState = Plain.deserialize('');

type EditorProps = {
  markdown?: boolean,
  state?: Object,
  onChange?: Function,
  onEnter?: Function,
  placeholder?: string,
  singleLine?: boolean,
  className?: string,
  style?: Object,
  images?: boolean,
};

class Editor extends Component {
  props: EditorProps;
  editor: any;

  state: {
    state: Object,
    plugins: Array<SlatePlugin | false>,
  };

  constructor(props: EditorProps) {
    super(props);
    const imagePlugin = ImagePlugin();
    this.insertImage = imagePlugin.insertImage;
    this.state = {
      state: initialState,
      plugins: [
        props.markdown !== false && MarkdownPlugin(),
        props.images !== false && imagePlugin,
        props.singleLine === true && SingleLinePlugin,
      ],
    };
  }

  // $FlowFixMe
  addImage = e => {
    const files = e.target.files;
    const onChange = this.props.onChange || this.onChange;
    const state = this.props.state || this.state.state;
    // files is a FileList, not an array, so it doesn't have .reduce
    let filesArray = [];
    // eslint-disable-next-line
    for (var i = 0, f; (f = files[i]); i++) {
      filesArray.push(f);
    }
    // Add all the files to the state
    const newState = filesArray.reduce(
      (prevState, file) =>
        this.insertImage(prevState, window.URL.createObjectURL(file), file),
      state
    );
    onChange(newState);
  };

  onChange = (state: Object) => {
    this.setState({ state });
  };

  onKeyDown = (e: Object) => {
    if (e.which === ENTER) {
      this.props.onEnter && this.props.onEnter(e);
    }
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    const {
      state = this.state.state,
      onChange = this.onChange,
      onEnter,
      className,
      style,
      images,
      showLinkPreview,
      linkPreview,
      focus,
      ...rest
    } = this.props;

    return (
      <Wrapper
        className={className}
        style={style}
        onClick={this.focus}
        focus={focus}
      >
        <SlateEditor
          state={state}
          onChange={onChange}
          onKeyDown={onEnter && this.onKeyDown}
          plugins={this.state.plugins}
          ref={editor => {
            this.editor = editor;
            if (this.props.editorRef) this.props.editorRef(editor);
          }}
          {...rest}
        />

        {showLinkPreview && linkPreview && linkPreview.loading
          ? <LinkPreviewLoading margin={'16px 0 24px 0'} />
          : showLinkPreview && linkPreview && linkPreview.data
            ? <LinkPreview
                data={linkPreview.data}
                size={'large'}
                remove={linkPreview.remove}
                editable={true}
                trueUrl={linkPreview.trueUrl}
                margin={'16px 0 24px 0'}
              />
            : null}

        {images !== false &&
          <MediaRow>
            <MediaInput onChange={this.addImage} multiple>
              Add
            </MediaInput>
          </MediaRow>}
      </Wrapper>
    );
  }
}

const toJSON = (state: Object) => Raw.serialize(state, { terse: true });
const toState = (json: Object) => Raw.deserialize(json, { terse: true });

const toPlainText = (state: Object) => Plain.serialize(state);
const fromPlainText = (string: string) => Plain.deserialize(string);

export { toJSON, toState, toPlainText, fromPlainText };

export default Editor;
