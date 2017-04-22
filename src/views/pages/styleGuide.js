import React from 'react';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import {
  PageContainer,
  Section,
  Heading,
  Subheading,
  ComponentContainer,
  Component,
  Code,
  PropsList,
  Swatch,
  Spacer,
} from './style';
import Icon from '../../components/icons';

const enhance = compose(
  withHandlers({
    highlightAndCopy: props => e => {
      let range = document.createRange();
      range.selectNode(e.target);
      window.getSelection().addRange(range);
      document.execCommand('copy');
    },
    toString: props => e => {
      console.log(props, e);
    },
  })
);

const StyleGuidePure = enhance(({ highlightAndCopy, toString }) => (
  <PageContainer>
    {/* Colors */}
    <Section container>
      <Heading>Colors</Heading>
      <Subheading>Palette</Subheading>
      <Section>
        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'brand.default'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.brand.default'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'brand.alt'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.brand.alt'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'space.dark'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.space.dark'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'space.light'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.space.light'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'space.soft'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.space.soft'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'warn.default'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.warn.default'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'warn.alt'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.warn.alt'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'success.default'} />
          </Component>
          <Code onClick={highlightAndCopy}>
            {'props.theme.success.default'}
          </Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'success.alt'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.success.alt'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'bg.default'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.bg.default'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'bg.reverse'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.bg.reverse'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'bg.wash'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.bg.wash'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'text.default'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.text.default'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'text.alt'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.text.alt'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'text.reverse'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.text.reverse'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'text.placeholder'} />
          </Component>
          <Code onClick={highlightAndCopy}>
            {'props.theme.text.placeholder'}
          </Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'generic.default'} />
          </Component>
          <Code onClick={highlightAndCopy}>
            {'props.theme.generic.default'}
          </Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'generic.alt'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.generic.alt'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'inactive'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.inactive'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'border.default'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.border.default'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'social.facebook.default'} />
          </Component>
          <Code onClick={highlightAndCopy}>
            {'props.theme.social.facebook.default'}
          </Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'social.twitter.default'} />
          </Component>
          <Code onClick={highlightAndCopy}>
            {'props.theme.social.twitter.default'}
          </Code>
        </ComponentContainer>
      </Section>
    </Section>

    {/* Icons */}
    <Section container>
      <Heading>Icons</Heading>
      <Subheading>
        Props
      </Subheading>

      <PropsList>
        <li>
          <pre>color: String</pre>
          <p>
            Describes the color of the icon in its inactive state. The string is composed into a
            {' '}
            <code>props.theme</code>
            {' '}
            evaulation, therefore you must pass the color as defined in the app theme (e.g.
            {' '}
            <code>"brand.default"</code>
            ).
          </p>
        </li>
        <li>
          <pre>hoverColor: String</pre>
          <p>Describes the color of the icon in its active state</p>
        </li>
        <li>
          <pre>scaleOnHover: Boolean</pre>
          <p>Determines if the icon should scale on user hover</p>
        </li>
      </PropsList>

      <Subheading>Examples</Subheading>
      <Section>
        <ComponentContainer>
          <Component>
            <Icon icon="messages" color={'brand.default'} />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="messages" color={'brand.default'} />`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Icon icon="close" hoverColor={'warn.default'} scaleOnHover />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="close" hoverColor={'warn.default'} scaleOnHover />`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component reverse>
            <Icon
              icon="explore"
              color={'bg.default'}
              hoverColor={'bg.default'}
              scaleOnHover
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="explore" color={'bg.default'} hoverColor={'bg.default'} scaleOnHover />`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Icon icon="write" hoverColor={'brand.default'} scaleOnHover />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="write" hoverColor={'brand.default'} scaleOnHover />`}</Code>
        </ComponentContainer>
      </Section>

      <Spacer height="32px" />
      <Subheading>All Icons</Subheading>
      <Section>
        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="messages"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="messages" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="attachment"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="attachment" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="back"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="back" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="subscribe"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="subscribe" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="unsubscribe"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="unsubscribe" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="delete"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="delete" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="flag"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="flag" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="freeze"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="freeze" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="frequency"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="frequency" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="frequency-private"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="frequency-private" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="like"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="like" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="like-active"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="like-active" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="logo"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="logo" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="unlock"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="unlock" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="lock"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="lock" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="menu"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="menu" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="photo"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="photo" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="scroll-top"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="scroll-top" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="scroll-bottom"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="scroll-bottom" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="send"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="send" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="settings"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="settings" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="share"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="share" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="write"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="write" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="write-cancel"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="write-cancel" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="edit"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="edit" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="twitter"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="twitter" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="facebook"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="facebook" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="checked"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="checked" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="unchecked"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="unchecked" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="notification"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="notification" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="everything"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="everything" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="home"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="home" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="emoji"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="emoji" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="close"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="close" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="caret-gt"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="caret-gt" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              icon="explore"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon icon="explore" ...props />`}</Code>
        </ComponentContainer>
      </Section>
    </Section>
  </PageContainer>
));

const StyleGuide = compose(pure)(StyleGuidePure);
export default StyleGuide;
