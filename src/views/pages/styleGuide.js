// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
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
  Spacer,
} from './style';
import Icon from '../../components/icons';
import { Button, OutlineButton, TextButton } from '../../components/buttons';
import {
  UserProfile,
  ChannelProfile,
  CommunityProfile,
} from '../../components/profile';

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

const dummyData = {
  user: {
    id: 'lYh3iULMUyZ7zIzmqnjdktFDZCG3',
    title: 'Brian Lovin',
    subtitle: '@brian',
    profilePhoto: 'https://pbs.twimg.com/profile_images/570313913648955392/cf4tgX7M_bigger.jpeg',
    description: 'Chief Nice Boy™ · Building @withspectrum, @designdetailsfm, @specfm · prev. @facebook, @buffer',
    meta: [],
  },

  channel: {
    id: '1c246adb-10a1-40a0-af39-1b7b3278199a',
    title: 'Design Details',
    subtitle: 'SpecFM',
    description: 'A show about the people who design our favorite products.',
    meta: [],
  },

  community: {
    id: 'ae390edd-667f-42e4-bf0b-10371665c742',
    title: 'SpecFM',
    subtitle: '8,918 members',
    profilePhoto: 'https://pbs.twimg.com/profile_images/766307796132343808/OtMSJrFo_400x400.jpg',
    description: 'The best podcasts, blogs, and resources for designers and developers.',
    meta: [],
  },
};

const StyleGuidePure = enhance(({ highlightAndCopy, toString }) => (
  <PageContainer>
    {/* Profiles */}
    <Section container>
      <Heading>Profiles</Heading>
      <Subheading>User</Subheading>
      <Section>
        <ComponentContainer width={'50%'}>
          <Component transparent>
            <UserProfile size="mini" data={dummyData.user} />
          </Component>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <UserProfile size="small" data={dummyData.user} />
          </Component>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <UserProfile size="medium" data={dummyData.user} />
          </Component>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <UserProfile size="large" data={dummyData.user} />
          </Component>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <UserProfile size="full" data={dummyData.user} />
          </Component>
        </ComponentContainer>
      </Section>

      <Spacer height="32px" />
      <Subheading>Community</Subheading>
      <Section>
        <ComponentContainer width={'50%'}>
          <Component transparent>
            <CommunityProfile size="mini" data={dummyData.community} />
          </Component>
          <Code onClick={highlightAndCopy}>{''}</Code>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <CommunityProfile size="small" data={dummyData.community} />
          </Component>
          <Code onClick={highlightAndCopy}>{''}</Code>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <CommunityProfile size="medium" data={dummyData.community} />
          </Component>
          <Code onClick={highlightAndCopy}>{''}</Code>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <CommunityProfile size="large" data={dummyData.community} />
          </Component>
          <Code onClick={highlightAndCopy}>{''}</Code>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <CommunityProfile size="full" data={dummyData.community} />
          </Component>
          <Code onClick={highlightAndCopy}>{''}</Code>
        </ComponentContainer>
      </Section>

      <Spacer height="32px" />
      <Subheading>Channel</Subheading>
      <Section>
        <ComponentContainer width={'50%'}>
          <Component transparent>
            <ChannelProfile size="mini" data={dummyData.channel} />
          </Component>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <ChannelProfile size="small" data={dummyData.channel} />
          </Component>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <ChannelProfile size="medium" data={dummyData.channel} />
          </Component>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <ChannelProfile size="large" data={dummyData.channel} />
          </Component>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <ChannelProfile size="full" data={dummyData.channel} />
          </Component>
        </ComponentContainer>
      </Section>
    </Section>

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
          <pre>icon: String</pre>
          <p>
            Gets passed into a switch statement which will return the proper svg path
            ).
          </p>
        </li>
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
            <Icon glyph="messages" />
          </Component>
          <Code onClick={highlightAndCopy}>{`<Icon glyph="messages" />`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Icon glyph="view-close" />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="view-close" />`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component reverse>
            <Icon glyph="explore" />
          </Component>
          <Code onClick={highlightAndCopy}>{`<Icon glyph="explore" />`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <Icon glyph="post" hoverColor={'brand.default'} scaleOnHover />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="post" hoverColor={'brand.default'} scaleOnHover />`}</Code>
        </ComponentContainer>
      </Section>

      <Spacer height="32px" />
      <Subheading>All Icons</Subheading>
      <Section>
        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="messages"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="messages" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="attachment"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="attachment" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="view-back"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="view-back" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="plus"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="plus" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="minus"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="minus" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="delete"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="delete" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="flag"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="flag" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="freeze"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="freeze" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="channel"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="channel" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="channel-private"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="channel-private" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="like-fill"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="like-fill" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="like"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="like" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="logo"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="logo" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="private-unlocked"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="private-unlocked" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="private"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="private" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="menu"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="menu" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="photo"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="photo" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="scroll-top"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="scroll-top" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="scroll-bottom"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="scroll-bottom" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="send"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="send" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="settings"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="settings" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="share"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="share" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="post"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="post" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="post-cancel"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="post-cancel" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="post"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="post" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="twitter"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="twitter" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="facebook"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="facebook" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="checkmark"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="checkmark" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="checkbox"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="checkbox" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="notification"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="notification" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="everything"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="everything" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="home"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="home" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="emoji"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="emoji" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="view-close"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="view-close" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="caret-gt"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="caret-gt" ...props />`}</Code>
        </ComponentContainer>

        <ComponentContainer width={'25%'}>
          <Component>
            <Icon
              glyph="explore"
              scaleOnHover
              color={'text.alt'}
              hoverColor={'brand.default'}
            />
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Icon glyph="explore" ...props />`}</Code>
        </ComponentContainer>
      </Section>
    </Section>

    {/* Buttons */}
    <Section container>
      <Heading>Buttons</Heading>
      <Subheading>
        Props
      </Subheading>

      <PropsList>
        <li>
          <pre>size: 'small' | 'large'</pre>
          <p>
            Adjusts padding for different contexts. Defaults to a midway size between small and large.
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
            <Button size={'small'} loading={true}>Button Small Loading</Button>
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
            <Button size={'large'} loading={true}>Button Large Loading</Button>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<Button size={'large'} loading={true}>Button Large Loading</Button>`}</Code>
        </ComponentContainer>

      </Section>
    </Section>
  </PageContainer>
));

const StyleGuide = compose(pure)(StyleGuidePure);
export default StyleGuide;
