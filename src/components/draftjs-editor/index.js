import React from 'react';
import { injectGlobal } from 'styled-components';
import { EditorState, Entity, convertToRaw } from 'draft-js';
import DraftEditor, { composeDecorators } from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createMarkdownPlugin from 'draft-js-markdown-plugin';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import createEmbedPlugin from 'draft-js-embed-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
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
import Embed from './Embed';
import { Wrapper, MediaRow, ComposerBase } from './style';
import MediaInput from '../mediaInput';
import { LinkPreview, LinkPreviewLoading } from '../linkPreview';

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
    const linkifyPlugin = createLinkifyPlugin({
      target: '_blank',
    });
    const embedPlugin = createEmbedPlugin({
      EmbedComponent: Embed,
    });
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
        props.markdown !== false && embedPlugin,
        props.markdown !== false && linkifyPlugin,
        props.markdown !== false && createMarkdownPlugin(),
        props.image !== false && dndPlugin,
        props.image !== false && focusPlugin,
        props.singleLine === true && singleLine,
      ],
      singleLineBlockRenderMap: singleLine.blockRenderMap,
      addEmbed: embedPlugin.addEmbed,
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
      version,
      placeholder,
      readOnly,
      ...rest
    } = this.props;

    if (version === 2) {
      return (
        <ComposerBase
          className={markdown !== false && 'markdown'}
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
            readOnly={readOnly}
            placeholder={!readOnly && placeholder}
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            {...rest}
          />
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
              <MediaInput onChange={this.addImage} multiple>
                Add
              </MediaInput>
            )}
        </ComposerBase>
      );
    } else {
      return (
        <div
          className={className}
          style={{ width: '100%', height: '100%', ...style }}
        >
          <Wrapper
            className={markdown !== false && 'markdown'}
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
              readOnly={readOnly}
              placeholder={!readOnly && placeholder}
              spellCheck="false"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
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
}

export default Editor;
