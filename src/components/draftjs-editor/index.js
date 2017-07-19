import React from 'react';
import styled from 'styled-components';
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from 'draft-js';
import DraftEditor, { composeDecorators } from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import draftToMarkdown from 'draftjs-to-markdown';
import createFocusPlugin from 'draft-js-focus-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
import 'draft-js/dist/Draft.css';

import MediaInput from '../mediaInput';
import { LinkPreview, LinkPreviewLoading } from '../linkPreview';
import { Wrapper, MediaRow } from '../editor/style';
import { ThreadDescription } from '../threadComposer/style';
import Image, { ImageContainer, ActiveOverlay } from '../editor/Image';

const ImageComponent = props => {
  const {
    block, // eslint-disable-line no-unused-vars
    theme, // eslint-disable-line no-unused-vars
    blockProps, // eslint-disable-line no-unused-vars
    customStyleMap, // eslint-disable-line no-unused-vars
    customStyleFn, // eslint-disable-line no-unused-vars
    decorator, // eslint-disable-line no-unused-vars
    forceSelection, // eslint-disable-line no-unused-vars
    offsetKey, // eslint-disable-line no-unused-vars
    selection, // eslint-disable-line no-unused-vars
    tree, // eslint-disable-line no-unused-vars
    contentState,
    ...elementProps
  } = props;
  const active = props.blockProps.isFocused;
  const { src } = contentState.getEntity(block.getEntityAt(0)).getData();
  return (
    <ImageContainer active={active}>
      <ActiveOverlay active={active} />
      <Image src={src} active={active} {...elementProps} />
    </ImageContainer>
  );
};

const toMarkdown = editorState =>
  draftToMarkdown(convertToRaw(editorState.getCurrentContent()));

const toPlainText = editorState =>
  editorState.getCurrentContent().getPlainText();

const fromPlainText = text =>
  EditorState.createWithContent(ContentState.createFromText(text));

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

class Editor extends React.Component {
  props: EditorProps;
  editor: any;

  constructor(props) {
    super(props);

    const focusPlugin = createFocusPlugin();
    const dndPlugin = createBlockDndPlugin();

    const decorator = composeDecorators(
      focusPlugin.decorator,
      dndPlugin.decorator
    );

    const imagePlugin = createImagePlugin({
      decorator,
      imageComponent: ImageComponent,
    });

    this.state = {
      plugins: [
        props.image !== false && imagePlugin,
        props.markdown !== false && createMarkdownShortcutsPlugin(),
        props.image !== false && dndPlugin,
        props.image !== false && focusPlugin,
      ],
      addImage: imagePlugin.addImage,
      editorState: props.initialState || EditorState.createEmpty(),
    };
  }

  onChange = editorState => {
    this.setState({
      editorState,
    });
  };

  addImage = e => {
    const files = e.target.files;
    let { editorState, addImage } = this.state;
    // Add images to editorState
    // eslint-disable-next-line
    for (var i = 0, file; (file = files[i]); i++) {
      editorState = addImage(editorState, window.URL.createObjectURL(file));
    }

    this.onChange(editorState);
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
        <DraftEditor
          editorState={this.state.editorState}
          onChange={this.onChange}
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

export { toMarkdown, convertFromRaw, toPlainText, fromPlainText };

export default Editor;
