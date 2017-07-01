//@flow
import React from 'react';
import marksy from 'marksy';
import { TextBubble, Emoji, ImageBubble } from './style';

const markdownToReact = marksy({
  createElement: React.createElement,
  // Override all elements to render paragraphs except for links
  elements: {
    a: ({ href, title, target, children }) => (
      <a href={href} title={title} target="_blank" children={children} />
    ),
    h1: ({ id, children }) => <span># {children}</span>,
    h2: ({ id, children }) => <span>## {children}</span>,
    h3: ({ id, children }) => <span>### {children}</span>,
    h4: ({ id, children }) => <span>#### {children}</span>,
    blockquote: ({ children }) => <span>&gt; {children}</span>,
    hr: () => null,
    ol: ({ children }) => <span>{children}</span>,
    ul: ({ children }) => <span>{children}</span>,
    p: ({ children }) => <span>{children}</span>,
    table: ({ children }) => <span>{children}</span>,
    thead: ({ children }) => <span>{children}</span>,
    tbody: ({ children }) => <span>{children}</span>,
    tr: ({ children }) => <span>{children}</span>,
    th: ({ children }) => <span>{children}</span>,
    td: ({ children }) => <span>{children}</span>,
    strong: ({ children }) => <span>**{children}**</span>,
    em: ({ children }) => <span>_{children}_</span>,
    br: () => null,
    del: ({ children }) => <span>{children}</span>,
    img: ({ src, alt }) => <span><a href={src} alt={alt}>{src}</a></span>,
    code: ({ language, code }) => <span>{code}</span>,
    codespan: ({ children }) => <span>{children}</span>,
  },
});

type BubbleProps = {
  me: boolean,
  pending: boolean,
  sender: Object,
  message: Object,
  imgSrc?: String,
};

export const Bubble = (props: BubbleProps) => {
  const { me, message } = props;

  const { tree } = markdownToReact(message.body);

  return (
    <TextBubble me={me}>
      {tree}
    </TextBubble>
  );
};

export const EmojiBubble = (props: BubbleProps) => {
  const { me, message } = props;
  return (
    <Emoji me={me}>
      {message.body}
    </Emoji>
  );
};

export const ImgBubble = (props: Object) => {
  const { me, pending, imgSrc } = props;
  return (
    <ImageBubble
      onClick={props.openGallery}
      me={me}
      pending={pending}
      src={`${imgSrc}${pending ? '' : `?max-w=${window.innerWidth * 0.6}`}`}
    />
  );
};
