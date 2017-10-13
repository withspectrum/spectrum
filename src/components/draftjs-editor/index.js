import React from 'react';
import { injectGlobal } from 'styled-components';
import { EditorState } from 'draft-js';
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
import Icon from '../icons';
import { IconButton } from '../buttons';

import Image from './Image';
import Embed from './Embed';
import MediaInput from '../mediaInput';
import SideToolbar from './toolbar';
import {
  Wrapper,
  MediaRow,
  ComposerBase,
  SideToolbarWrapper,
  Expander,
  Action,
  EmbedUI,
} from './style';
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

    this.state = {
      plugins: [],
      editorState: props.initialState || EditorState.createEmpty(),
    };
  }

  componentWillMount() {
    this.setPlugins();
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.editorState !== nextProps.editorState ||
      this.props !== nextProps
    );
  }

  componentDidUpdate() {
    this.setPlugins();
  }

  setPlugins = () => {
    console.log('SET PLUGINS');
    const props = this.props;
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

    this.setState({
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
      inserting: false,
      embedding: false,
      embedUrl: '',
    };
  }

  onChange = editorState => {
    this.setState({
      editorState,
    });
  };

  changeEmbedUrl = evt => {
    this.setState({
      embedUrl: evt.target.value,
    });
  };

  addEmbed = evt => {
    evt && evt.preventDefault();

    const {
      state = this.state.editorState,
      onChange = this.onChange,
    } = this.props;

    onChange(this.state.addEmbed(state, this.state.embedUrl));
    this.setState({
      embedUrl: '',
      embedding: false,
      inserting: false,
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

  toggleToolbarDisplayState = () => {
    const { inserting } = this.state;

    this.setState({
      inserting: !inserting,
      embedding: false,
    });
  };

  toggleEmbedInputState = () => {
    const { embedding } = this.state;

    this.setState({
      embedding: !embedding,
      inserting: false,
    });
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
    const { embedding, inserting } = this.state;
    const linkPreviewIsLoading = linkPreview && linkPreview.loading;
    const linkPreviewIsReady = linkPreview && linkPreview.data;

    console.log(singleLine, this.state.plugins);

    if (version === 2) {
      return (
        <ComposerBase
          className={markdown !== false && 'markdown'}
          focus={focus}
        >
          <DraftEditor
            editorState={state}
            onChange={onChange}
            plugins={this.state.plugins}
            handleDroppedFiles={this.handleDroppedFiles}
            blockRenderMap={
              singleLine === true
                ? this.state.singleLineBlockRenderMap
                : undefined
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
          {images !== false &&
            !readOnly && (
              <SideToolbar editorState={state} editorRef={this.editor}>
                <Expander inserting={inserting}>
                  <IconButton
                    glyph={'inserter'}
                    onClick={this.toggleToolbarDisplayState}
                  />
                  <Action>
                    <MediaInput
                      onChange={this.addImage}
                      multiple
                      tipLocation={'right'}
                    />
                  </Action>
                  <Action embedding={embedding}>
                    <EmbedUI onSubmit={this.addEmbed} embedding={embedding}>
                      <label htmlFor="embed-input">
                        <Icon
                          glyph={'embed'}
                          tipText={'Embed a URL'}
                          onClick={this.toggleEmbedInputState}
                        />
                        <input
                          id="embed-input"
                          type="url"
                          placeholder="Enter a URL to embed"
                          value={this.state.embedUrl}
                          onChange={this.changeEmbedUrl}
                        />
                      </label>
                      <button onClick={this.addEmbed}>Embed</button>
                    </EmbedUI>
                  </Action>
                </Expander>
              </SideToolbar>
            )}
          {showLinkPreview && linkPreviewIsLoading ? (
            <LinkPreviewLoading margin={'16px 0 24px 0'} />
          ) : showLinkPreview && linkPreviewIsReady ? (
            <LinkPreview
              data={linkPreview.data}
              size={'large'}
              remove={linkPreview.remove}
              editable={!this.props.readOnly}
              trueUrl={linkPreview.trueUrl}
              margin={'16px 0 24px 0'}
            />
          ) : null}
        </ComposerBase>
      );
    } else {
      return (
        <div
          className={className}
          style={{ width: '100%', height: '100%', ...style }}
        >
          <Wrapper className={markdown !== false && 'markdown'} focus={focus}>
            <DraftEditor
              editorState={state}
              onChange={onChange}
              plugins={this.state.plugins}
              handleDroppedFiles={this.handleDroppedFiles}
              blockRenderMap={
                singleLine === true
                  ? this.state.singleLineBlockRenderMap
                  : undefined
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
          {showLinkPreview && linkPreviewIsLoading ? (
            <LinkPreviewLoading margin={'16px 0 24px 0'} />
          ) : showLinkPreview && linkPreviewIsReady ? (
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
