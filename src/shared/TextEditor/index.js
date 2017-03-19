import React from 'react';
import { EditorState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from 'draft-js-mention-plugin';
import { fromJS } from 'immutable';
import { findUsersByUsername } from '../../db/users';
import { Wrapper } from './style';

const noop = () => {};

const mentionPlugin = createMentionPlugin();
const { MentionSuggestions } = mentionPlugin;

let plugins = [mentionPlugin];

class TextEditor extends React.Component {
  static propTypes = {
    editorState: React.PropTypes.any.isRequired,
    onChange: React.PropTypes.func,
    editorRef: React.PropTypes.func,
    singleLine: React.PropTypes.bool,
    readOnly: React.PropTypes.bool,
  };

  state = {
    suggestions: fromJS([]),
    editorState: this.props.editorState || EditorState.createEmpty(),
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !nextState.suggestions.equals(this.state.suggestions) ||
      !nextState.editorState._immutable.equals(
        this.state.editorState._immutable,
      ) ||
      !nextProps.editorState._immutable.equals(
        this.props.editorState._immutable,
      );
  }

  onChange = editorState => {
    this.setState({
      editorState,
    });
  };

  onSearchChange = ({ value }) => {
    findUsersByUsername(value).then(users => {
      this.setState({
        suggestions: fromJS(
          users.map(user => ({
            ...user,
            name: user.username,
            id: user.uid,
            avatar: user.photoURL,
          })),
        ),
      });
    });
  };

  render() {
    const {
      singleLine,
      className,
      ...editorProps
    } = this.props;

    return (
      <Wrapper className={className}>
        <Editor
          {...editorProps}
          ref={this.props.editorRef}
          editorState={this.props.editorState || this.state.editorState}
          onChange={this.props.onChange || this.onChange}
          plugins={this.props.readOnly ? [] : plugins}
          readOnly={this.props.readOnly || false}
        />
        <MentionSuggestions
          onSearchChange={this.onSearchChange}
          suggestions={this.state.suggestions}
        />
      </Wrapper>
    );
  }
}

export default TextEditor;
