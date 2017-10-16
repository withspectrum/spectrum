// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
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
} from './style';
import Icon from '../../components/icons';
import { Button, OutlineButton, TextButton } from '../../components/buttons';

const enhance = compose(
  withHandlers({
    highlightAndCopy: props => e => {
      let range = document.createRange();
      range.selectNode(e.target);
      window.getSelection().addRange(range);
      document.execCommand('copy');
    },
    toString: props => e => {},
  })
);

const glyphList = [
  'attachment',
  'channel',
  'channel-private',
  'checkbox',
  'checkmark',
  'community',
  'delete',
  'door-enter',
  'door-leave',
  'down',
  'down-fill',
  'edit',
  'emoji',
  'everything',
  'explore',
  'facebook',
  'flag',
  'flag-fill',
  'freeze',
  'home',
  'like',
  'like-fill',
  'link',
  'logo',
  'menu',
  'message',
  'message-fill',
  'message-new',
  'minus',
  'minus-fill',
  'notification',
  'notification-fill',
  'payment',
  'person',
  'photo',
  'photo-fill',
  'plus',
  'plus-fill',
  'post',
  'post-cancel',
  'post-fill',
  'private',
  'private-unlocked',
  'profile',
  'profile-fill',
  'search',
  'send',
  'send-fill',
  'settings',
  'share',
  'twitter',
  'up',
  'up-fill',
  'view-back',
  'view-close',
  'view-forward',
  'view-reload',
];

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
            <Swatch color={'space.alt'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.space.alt'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'brand.wash'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.brand.wash'}</Code>
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
            <Swatch color={'bg.inactive'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.bg.inactive'}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Swatch color={'bg.border'} />
          </Component>
          <Code onClick={highlightAndCopy}>{'props.theme.bg.border'}</Code>
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
      <Subheading>Props</Subheading>

      <PropsList>
        <li>
          <pre>glyph: String</pre>
          <p>
            Gets passed into a switch statement which will return the proper svg
            path .
          </p>
        </li>
        <li>
          <pre>size: Int</pre>
          <p>
            Describes the size (in px) that an icon should be rendered at. Use
            only with <pre>-fill</pre> variants - stroked icons are drawn at
            specific sizes to maintain consistent stroke width and level of
            detail.
          </p>
        </li>
      </PropsList>

      <Subheading>Examples</Subheading>
      <Section>
        {glyphList.map((glyph, i) => {
          return (
            <ComponentContainer key={i} width={'25%'}>
              <Component>
                <Icon glyph={glyph} />
              </Component>
              <Code
                onClick={highlightAndCopy}
              >{`<Icon glyph='${glyph}' />`}</Code>
            </ComponentContainer>
          );
        })}
      </Section>
    </Section>

    {/* Buttons */}
    <Section container>
      <Heading>Buttons</Heading>
      <Subheading>Props</Subheading>

      <PropsList>
        <li>
          <pre>size: 'small' | 'large'</pre>
          <p>
            Adjusts padding for different contexts. Defaults to a midway size
            between small and large.
          </p>
        </li>
        <li>
          <pre>disabled: Boolean</pre>
          <p>Lowers opacity and turns off interactions while disabled.</p>
        </li>
        <li>
          <pre>loading: Boolean</pre>
          <p>
            Replaces the button label or button icon with an inline spinner.
          </p>
        </li>
        <li>
          <pre>icon: String</pre>
          <p>Insert an icon into the button using any library icon.</p>
        </li>
      </PropsList>

      <Subheading>All Buttons</Subheading>
      <Section>
        <ComponentContainer>
          <Component>
            <Button>Button</Button>
          </Component>
          <Code onClick={highlightAndCopy}>{`<Button>Button</Button>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Button color={'warn'}>Button</Button>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Button color={'warn'}>Button</Button>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Button color={'pro'}>Button</Button>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Button color={'pro'}>Button</Button>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Button color={'success'}>Button</Button>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Button color={'success'}>Button</Button>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <OutlineButton>Outline Button</OutlineButton>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<OutlineButton>Outline Button</OutlineButton>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <OutlineButton color={'warn'} icon={'post'}>
              Outline Button with Icon
            </OutlineButton>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<OutlineButton color={'warn'} icon={'post'}>Outline Button with Icon</OutlineButton>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <OutlineButton color={'pro'} icon={'post'} loading={true}>
              Loading Outline Button with Icon
            </OutlineButton>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<OutlineButton color={'pro'} icon={'post'} loading={true}>Loading Outline Button with Icon</OutlineButton>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <TextButton>Button</TextButton>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<TextButton>Button</TextButton>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <TextButton icon={'messages'}>Link Button with Icon</TextButton>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<TextButton icon={'messages'}>Link Button with Icon</TextButton>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <TextButton icon={'messages'} loading={true}>
              Loading Link Button with Icon
            </TextButton>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<TextButton icon={'messages'} loading={true}>Loading Link Button with Icon</TextButton>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Button loading={true}>Button Loading</Button>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Button loading={true}>Button Loading</Button>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Button icon={'messages'}>Button with Icon</Button>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Button icon={'messages'}>Button with Icon</Button>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Button disabled={true}>Button Disabled</Button>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Button disabled={true}>Button Disabled</Button>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Button size={'small'}>Button Small</Button>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Button size={'small'}>Button Small</Button>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Button size={'small'} loading={true}>
              Button Small Loading
            </Button>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Button size={'small'} loading={true}>Button Small Loading</Button>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Button size={'small'} icon={'share'}>
              Button Small wtih Icon
            </Button>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Button size={'small'} icon={'share'}>Button Small wtih Icon</Button>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Button size={'large'}>Button Large</Button>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Button size={'large'}>Button Large</Button>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Button size={'large'} icon={'explore'}>
              Button Large with Icon
            </Button>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Button size={'large'} icon={'explore'}>Button Large with Icon</Button>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Button size={'large'} loading={true}>
              Button Large Loading
            </Button>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Button size={'large'} loading={true}>Button Large Loading</Button>`}</Code>
        </ComponentContainer>
      </Section>
    </Section>
  </PageContainer>
));

const StyleGuide = compose()(StyleGuidePure);
export default StyleGuide;
