import React from 'react';
//$FlowFixMe
import { injectGlobal } from 'styled-components';
//$FlowFixMe
import MD from 'react-remarkable';

let injected = false;
class Markdown extends React.Component {
  state: {
    hljs: boolean,
  };
  state = {
    hljs: false,
  };

  componentWillMount() {
    // Inject highlight.js theme
    if (!injected) {
      // eslint-disable-next-line no-unused-expressions
      injectGlobal`
        .hljs {
        display: block;
        background: white;
        padding: 0.5em;
        color: #333333;
        overflow-x: auto;
        }

        .hljs-comment,
        .hljs-meta {
        color: #969896;
        }

        .hljs-string,
        .hljs-variable,
        .hljs-template-variable,
        .hljs-strong,
        .hljs-emphasis,
        .hljs-quote {
        color: #df5000;
        }

        .hljs-keyword,
        .hljs-selector-tag,
        .hljs-type {
        color: #a71d5d;
        }

        .hljs-literal,
        .hljs-symbol,
        .hljs-bullet,
        .hljs-attribute {
        color: #0086b3;
        }

        .hljs-section,
        .hljs-name {
        color: #63a35c;
        }

        .hljs-tag {
        color: #333333;
        }

        .hljs-title,
        .hljs-attr,
        .hljs-selector-id,
        .hljs-selector-class,
        .hljs-selector-attr,
        .hljs-selector-pseudo {
        color: #795da3;
        }

        .hljs-addition {
        color: #55a532;
        background-color: #eaffea;
        }

        .hljs-deletion {
        color: #bd2c00;
        background-color: #ffecec;
        }

        .hljs-link {
        text-decoration: underline;
        }
      `;
      injected = true;
    }
    // Load highlight.js when it's necessary, but not before
    import('highlight.js').then(module => {
      this.setState({
        hljs: module,
      });
    });
  }
  render() {
    const { hljs } = this.state;
    return (
      <MD
        options={{
          html: true,
          linkify: true,
          highlight: function(str, lang) {
            // If highlight.js isn't loaded yet don't highlight
            if (!hljs) return '';
            if (lang && hljs.getLanguage(lang)) {
              try {
                return hljs.highlight(lang, str).value;
              } catch (err) {}
            }

            try {
              return hljs.highlightAuto(str).value;
            } catch (err) {}

            return ''; // use external default escaping
          },
        }}
        source={this.props.children}
      />
    );
  }
}

export default Markdown;
