// @flow
import React from 'react';
import { injectGlobal } from 'styled-components';
import { EditorState } from 'draft-js';
import DraftEditor, { composeDecorators } from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createMarkdownPlugin from 'draft-js-markdown-plugin';
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
import createCodeEditorPlugin from 'draft-js-code-editor-plugin';
import Icon from '../icons';
import { IconButton } from '../buttons';
import mentionsDecorator from './mentions-decorator';

import Image from './Image';
import Embed from './Embed';
import MediaInput from '../mediaInput';
import SideToolbar from './toolbar';
import {
  Wrapper,
  MediaRow,
  ComposerBase,
  Expander,
  Action,
  EmbedUI,
} from './style';
import { LinkPreview, LinkPreviewLoading } from '../linkPreview';

type Props = {
  state: Object,
  onChange: Function,
  showLinkPreview?: boolean,
  linkPreview?: Object,
  focus?: boolean,
  readOnly?: boolean,
  editorRef?: any => void,
  placeholder?: string,
  className?: string,
  style?: Object,
  version?: 2,
};

type State = {
  plugins: Array<mixed>,
  addEmbed: (Object, string) => mixed,
  addImage: (Object, string, ?Object) => mixed,
  inserting: boolean,
  embedding: boolean,
  embedUrl: string,
};

class Editor extends React.Component<Props, State> {
  editor: any;

  constructor(props: Props) {
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
    const codePlugin = createCodeEditorPlugin();

    const decorator = composeDecorators(
      focusPlugin.decorator,
      dndPlugin.decorator
    );

    const imagePlugin = createImagePlugin({
      decorator,
      imageComponent: Image,
    });

    this.state = {
      plugins: [
        imagePlugin,
        prismPlugin,
        embedPlugin,
        createMarkdownPlugin(),
        codePlugin,
        linkifyPlugin,
        dndPlugin,
        focusPlugin,
      ],
      addEmbed: embedPlugin.addEmbed,
      addImage: imagePlugin.addImage,
      inserting: false,
      embedding: false,
      embedUrl: '',
    };
  }

  changeEmbedUrl = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      embedUrl: evt.target.value,
    });
  };

  addEmbed = (evt: ?SyntheticUIEvent<>) => {
    evt && evt.preventDefault();

    const { state, onChange } = this.props;

    onChange(this.state.addEmbed(state, this.state.embedUrl));
    this.setState({
      embedUrl: '',
      embedding: false,
      inserting: false,
    });
  };

  addImages = (files: FileList) => {
    const { addImage } = this.state;
    const { state, onChange } = this.props;
    // Add images to editorState
    // eslint-disable-next-line
    for (var i = 0, file; (file = files[i]); i++) {
      onChange(addImage(state, window.URL.createObjectURL(file), { file }));
    }
  };

  addImage = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.addImages(e.target.files);
  };

  handleDroppedFiles = (_: any, files: FileList) => {
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
      state,
      onChange,
      className,
      style,
      editorRef,
      showLinkPreview,
      linkPreview,
      focus,
      version,
      placeholder,
      readOnly,
      ...rest
    } = this.props;
    const { embedding, inserting } = this.state;

    if (version === 2) {
      return (
        <ComposerBase className={`markdown ${className || ''}`} focus={focus}>
          <DraftEditor
            editorState={state}
            onChange={onChange}
            plugins={this.state.plugins}
            handleDroppedFiles={this.handleDroppedFiles}
            ref={editor => {
              this.editor = editor;
              if (editorRef) editorRef(editor);
            }}
            readOnly={readOnly}
            placeholder={!readOnly && placeholder}
            spellCheck={true}
            autoCapitalize="sentences"
            autoComplete="on"
            autoCorrect="on"
            decorators={[mentionsDecorator]}
            {...rest}
          />
          {!readOnly && (
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
          {showLinkPreview &&
            linkPreview &&
            linkPreview.loading && (
              <LinkPreviewLoading margin={'16px 0 24px 0'} />
            )}
          {showLinkPreview &&
            linkPreview &&
            linkPreview.data && (
              <LinkPreview
                data={linkPreview.data}
                size={'large'}
                remove={linkPreview.remove}
                editable={!this.props.readOnly}
                trueUrl={linkPreview.trueUrl}
                margin={'16px 0 24px 0'}
              />
            )}
        </ComposerBase>
      );
    } else {
      return (
        <div
          className={className}
          style={{ width: '100%', height: '100%', ...style }}
        >
          <Wrapper className="markdown" focus={focus}>
            <DraftEditor
              editorState={state}
              onChange={onChange}
              plugins={this.state.plugins}
              handleDroppedFiles={this.handleDroppedFiles}
              ref={editor => {
                this.editor = editor;
                if (editorRef) editorRef(editor);
              }}
              readOnly={readOnly}
              placeholder={!readOnly && placeholder}
              spellCheck={true}
              autoCapitalize="sentences"
              autoComplete="on"
              autoCorrect="on"
              decorators={[mentionsDecorator]}
              {...rest}
            />
          </Wrapper>
          {showLinkPreview &&
            linkPreview &&
            linkPreview.loading && (
              <LinkPreviewLoading margin={'16px 0 24px 0'} />
            )}
          {showLinkPreview &&
            linkPreview &&
            linkPreview.data && (
              <LinkPreview
                data={linkPreview.data}
                size={'large'}
                remove={linkPreview.remove}
                editable={!this.props.readOnly}
                trueUrl={linkPreview.trueUrl}
                margin={'16px 0 24px 0'}
              />
            )}
          {!readOnly && (
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
