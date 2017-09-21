import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from 'draft-js';
import DraftEditor, { composeDecorators } from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-perl';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-swift';
import createPrismPlugin from 'draft-js-prism-plugin';
// NOTE(@mxstbr): This is necessary to make sure the placeholder is aligned
// and stuff like that. We have to import the raw CSS file and inject it with
// styled-components to make sure it works when we SSR.
/* eslint-disable import/first */
/* eslint-disable import/no-webpack-loader-syntax */
import draftGlobalCSS from '!!raw-loader!draft-js/dist/Draft.css';
injectGlobal`${draftGlobalCSS}`;
import prismGlobalCSS from '!!raw-loader!./prism-theme.css';
injectGlobal`${prismGlobalCSS}`;

import Image from './Image';
import { Wrapper, MediaRow } from './style';
import MediaInput from '../mediaInput';
import { ThreadDescription } from '../threadComposer/style';
import { LinkPreview, LinkPreviewLoading } from '../linkPreview';

const toPlainText = editorState =>
  editorState.getCurrentContent().getPlainText();

const fromPlainText = text =>
  EditorState.createWithContent(ContentState.createFromText(text));

const toJSON = editorState => convertToRaw(editorState.getCurrentContent());
const toState = json => EditorState.createWithContent(convertFromRaw(json));

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
    const prismPlugin = createPrismPlugin({
      prism: Prism,
    });

    const decorator = composeDecorators(
      focusPlugin.decorator,
      dndPlugin.decorator
    );

    const imagePlugin = createImagePlugin({
      decorator,
      imageComponent: Image,
    });

    const singleLine = createSingleLinePlugin();

    this.state = {
      plugins: [
        props.image !== false && imagePlugin,
        props.markdown !== false && prismPlugin,
        props.markdown !== false && createMarkdownShortcutsPlugin(),
        props.image !== false && dndPlugin,
        props.image !== false && focusPlugin,
        props.singleLine === true && singleLine,
      ],
      singleLineBlockRenderMap: singleLine.blockRenderMap,
      addImage: imagePlugin.addImage,
      editorState: props.initialState || EditorState.createEmpty(),
    };
  }

  onChange = editorState => {
    this.setState({
      editorState,
    });
  };

  addImages = files => {
    const { addImage } = this.state;
    const {
      state = this.state.editorState,
      onChange = this.onChange,
    } = this.props;
    // Add images to editorState
    // eslint-disable-next-line
    for (var i = 0, file; (file = files[i]); i++) {
      onChange(addImage(state, window.URL.createObjectURL(file), { file }));
    }
  };

  addImage = e => {
    this.addImages(e.target.files);
  };

  handleDroppedFiles = (selection, files) => {
    this.addImages(files);
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    const {
      state = this.state.editorState,
      onChange = this.onChange,
      markdown,
      onEnter,
      className,
      style,
      images,
      showLinkPreview,
      linkPreview,
      focus,
      singleLine,
      ...rest
    } = this.props;

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Wrapper
          className={`${className} ${markdown !== false && 'markdown'}`}
          onClick={this.focus}
          focus={focus}
        >
          <DraftEditor
            editorState={state}
            onChange={onChange}
            plugins={this.state.plugins}
            handleDroppedFiles={this.handleDroppedFiles}
            blockRenderMap={
              singleLine === true && this.state.singleLineBlockRenderMap
            }
            ref={editor => {
              this.editor = editor;
              if (this.props.editorRef) this.props.editorRef(editor);
            }}
            {...rest}
          />
        </Wrapper>
        {showLinkPreview && linkPreview && linkPreview.loading ? (
          <LinkPreviewLoading margin={'16px 0 24px 0'} />
        ) : showLinkPreview && linkPreview && linkPreview.data ? (
          <LinkPreview
            data={linkPreview.data}
            size={'large'}
            remove={linkPreview.remove}
            editable={!this.props.readOnly}
            trueUrl={linkPreview.trueUrl}
            margin={'16px 0 24px 0'}
          />
        ) : null}
        {images !== false &&
          !this.props.readOnly && (
            <MediaRow>
              <MediaInput onChange={this.addImage} multiple>
                Add
              </MediaInput>
            </MediaRow>
          )}
      </div>
    );
  }
}

export { toPlainText, fromPlainText, toJSON, toState };

export default Editor;
