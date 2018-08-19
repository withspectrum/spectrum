// @flow
import React from 'react';
import DraftEditor from '../draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createCodeEditorPlugin from 'draft-js-code-editor-plugin';
import createMarkdownPlugin from 'draft-js-markdown-plugin';
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
import { customStyleMap } from 'src/components/rich-text-editor/style';
import type { DraftEditorState } from 'draft-js/lib/EditorState';
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from 'draft-js-mention-plugin';
import mentionPositionSuggestion from './mentionPositionSuggestion';

import { InputWrapper } from './style';

type Props = {
  editorState: DraftEditorState,
  onChange: DraftEditorState => void,
  placeholder: string,
  className?: string,
  focus?: boolean,
  readOnly?: boolean,
  editorRef?: any => void,
  networkDisabled: boolean,
  children?: React$Node,
  hasAttachment?: boolean,
  code?: boolean,
  onMentionChange: any => void,
  mentionSuggestions: Array<any>,
};

type State = {
  plugins: Array<mixed>,
  mentionSuggestions: Array<any>,
};
// const positionSuggestions = ({ state, props }) => {
//   console.log('EDITOR STATE');
//   console.log(state);
//   console.log(props);

//   let constantOffset = -70;
//   let transform;
//   let transition;

//   if (state.isActive && props.suggestions.length > 0) {
//     transform = `scaleY(1) translateY(${constantOffset -
//       props.suggestions.length * 30}px)`;
//     transition = 'all 0.25s cubic-bezier(.3,1.2,.2,1)';
//   } else if (state.isActive) {
//     transform = 'scaleY(0)';
//     transition = 'all 0.25s cubic-bezier(.3,1,.2,1)';
//   }

//   return {
//     transform,
//     transition,
//   };
// };

/*
 * NOTE(@mxstbr): DraftJS has huge troubles on Android, it's basically unusable
 * We work around this by replacing the DraftJS editor with a plain text Input
 * on Android, and then converting the plain text to DraftJS content State
 * debounced every couple ms
 */
class Input extends React.Component<Props, State> {
  editor: any;
  mentionPlugin: any;

  constructor(props: Props) {
    super(props);
    this.mentionPlugin = createMentionPlugin({
      positionSuggestions: mentionPositionSuggestion,
      mentionPrefix: '@',
    });

    this.state = {
      mentionSuggestions: [],
      plugins: [
        createPrismPlugin({
          prism: Prism,
        }),
        createMarkdownPlugin({
          features: {
            inline: ['BOLD', 'ITALIC', 'CODE'],
            block: ['CODE', 'blockquote'],
          },
          renderLanguageSelect: () => null,
        }),
        this.mentionPlugin,
        createCodeEditorPlugin(),
        createLinkifyPlugin({
          target: '_blank',
        }),
      ],
    };
  }

  setRef = (editor: any) => {
    const { editorRef } = this.props;
    this.editor = editor;
    if (editorRef && typeof editorRef === 'function') editorRef(editor);
  };

  onAddMention = () => {
    //TODO
  };

  render() {
    const {
      editorState,
      onChange,
      focus,
      placeholder,
      readOnly,
      editorRef,
      networkDisabled,
      children,
      hasAttachment,
      code,
      mentionSuggestions,
      ...rest
    } = this.props;
    const { plugins } = this.state;
    const { MentionSuggestions } = this.mentionPlugin;

    return (
      <InputWrapper
        hasAttachment={hasAttachment}
        focus={focus}
        networkDisabled={networkDisabled}
      >
        {children}
        <DraftEditor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          editorRef={this.setRef}
          readOnly={readOnly}
          placeholder={!readOnly && placeholder}
          spellCheck={true}
          autoCapitalize="sentences"
          autoComplete="on"
          autoCorrect="on"
          stripPastedStyles={true}
          customStyleMap={customStyleMap}
          {...rest}
        />
        <MentionSuggestions
          onSearchChange={({ value }) => {
            this.props.onMentionChange({ value });
          }}
          suggestions={
            console.log(mentionSuggestions, 'mentions') || mentionSuggestions
          }
        />
      </InputWrapper>
    );
  }
}

export default Input;
