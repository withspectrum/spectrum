// @flow
import { createGlobalStyle } from 'styled-components';
// $FlowIssue
import prismGlobalCSS from '!!raw-loader!./components/rich-text-editor/prism-theme.css';
import theme from 'shared/theme';

export default createGlobalStyle`
  ${prismGlobalCSS}

  * {
    border: 0;
    box-sizing: inherit;
    -webkit-font-smoothing: auto;
    font-weight: inherit;
    margin: 0;
    outline: 0;
    padding: 0;
    text-decoration: none;
    text-rendering: optimizeLegibility;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  html {
    display: flex;
    min-height: 100%;
    width: 100%;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 1.5;
    background-color: ${theme.bg.wash};
    color: #16171a;
    padding: 0;
    margin: 0;
    -webkit-font-smoothing: auto;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  }

  body {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overscroll-behavior-y: none;
    -webkit-overflow-scrolling: touch;
  }

  #root {
    height: 100%
    width: 100%;
  }

  a {
    color: currentColor;
    text-decoration: none;
  }

  a:hover {
    cursor: pointer;
  }

  textarea {
    resize: none;
  }

  ::-moz-selection {
    /* Code for Firefox */
    background: ${theme.brand.alt};
    color: ${theme.text.reverse};
  }

  ::selection {
    background: ${theme.brand.alt};
    color: ${theme.text.reverse};
  }

  ::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    color: ${theme.text.placeholder};
  }
  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: ${theme.text.placeholder};
    opacity: 1;
  }
  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: ${theme.text.placeholder};
    opacity: 1;
  }
  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${theme.text.placeholder};
  }

  .fade-enter {
    opacity: 0;
    z-index: 1;
  }

  .fade-enter.fade-enter-active {
    opacity: 1;
    transition: opacity 250ms ease-in;
  }

  .markdown {
    font-size: 16px;
    line-height: 1.4;
    color: ${theme.text.default};
  }

  .markdown pre {
    font-size: 15px;
    white-space: pre;
  }

  .markdown p {
    color: inherit;
    font-size: 16px;
    font-weight: 400;
    display: block;
  }

  .markdown p + p {
    margin-top: 16px;
  }

  .markdown img {
    margin-top: 16px;
    max-width: 100%;
    display: inline;
    border-radius: 4px;
    transition: box-shadow 0.2s;
    display: block;
    margin: 12px 0;
  }

  .markdown img:hover {
    cursor: pointer;
    transition: box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .markdown em {
    color: inherit;
    font-size: inherit;
    font-style: italic;
  }

  .markdown strong {
    color: inherit;
    font-size: inherit;
    font-weight: 700;
  }

  .markdown ul,
  .markdown ol {
    color: inherit;
    margin: 8px 0;
    margin-left: 16px;
  }

  .markdown li {
    color: inherit;
    font-size: 16px;
    margin-bottom: 4px;
    line-height: 1.5;
    font-weight: 400;
  }

  .markdown blockquote {
    color: ${theme.text.secondary};
    border-left: 4px solid ${theme.text.secondary};
    background: ${theme.bg.wash};
    padding: 4px 8px 4px 16px;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.4;
    margin: 16px 0;
    word-break: break-all;
  }

  .markdown blockquote p {
    margin-top: 0;
  }

  .markdown a {
    color: ${theme.brand.default};
    font-weight: 500;
    text-decoration: none;
    font-size: inherit;
    word-wrap: break-word;
    line-height: inherit;
  }

  .markdown a:hover {
    text-decoration: underline;
  }

  .markdown a:visited {
    opacity: 0.6;
    transition: opacity 0.2s ease-in;
  }

  .markdown code {
    font-family: 'Input Mono', 'Menlo', 'Inconsolata', 'Roboto Mono', monospace;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.4px;
    background-color: ${theme.bg.wash};
    padding: 2px 4px;
    display: inline;
    width: 100%;
    border: 1px solid ${theme.bg.border};
    border-radius: 4px;
    margin-bottom: 16px;
  }

  .markdown pre {
    margin: 16px 0;
    display: block;
    border-radius: 4px;
    background-color: ${theme.bg.wash};
  }

  .markdown pre code {
    padding: 8px 16px;
    display: block;
    white-space: pre;
    position: relative;
    margin: 0;
    border: none;
    background: none;
  }

  .markdown div[data-block='true'] {
    margin-top: 12px;
  }

  .markdown div[data-block='true']:first-of-type {
    margin-top: 0;
  }

  .markdown span[data-text='true'] {
    line-height: 1.4;
  }

  .markdown code span {
    max-width: 100%;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .markdown iframe {
    margin: 1rem 0;
  }

  .markdown hr {
    width: 100%;
    height: 1px;
    background: ${theme.bg.border};
    display: block;
    margin: 32px 0;
  }

  .markdown h1 {
    font-size: 24px;
    line-height: 40px;
    border-bottom: 1px solid ${theme.bg.border};
    font-weight: 800;
    margin-top: 1rem;
    margin-bottom: 8px;
  }

  .markdown h2 {
    font-size: 20px;
    line-height: 32px;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 8px;
  }

  .markdown h3 {
    font-size: 18px;
    line-height: 28px;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 8px;
  }

  .markdown h4 {
    font-size: 16px;
    line-height: 20px;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 8px;
    text-transform: lowercase;
    font-variant: small-caps;
  }

  .markdown h5 {
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 8px;
    text-transform: lowercase;
    font-variant: small-caps;
  }

  .markdown h6 {
    font-size: 12px;
    line-height: 16px;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 8px;
    text-transform: lowercase;
    font-variant: small-caps;
  }

  .threadComposer textarea {
    line-height: 1.5;
    height: calc(100% + 48px)!important;
  }
  
  .tippy-backdrop {
    background-color: ${theme.text.default};
  }
`;
