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
import { Button, OutlineButton, LinkButton } from '../../components/buttons';
import {
  UserProfile,
  FrequencyProfile,
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
    photoURL: 'https://pbs.twimg.com/profile_images/570313913648955392/cf4tgX7M_bigger.jpeg',
    description: 'Chief Nice Boy™ · Building @withspectrum, @designdetailsfm, @specfm · prev. @facebook, @buffer',
    meta: [],
  },

  frequency: {
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
    photoURL: 'https://pbs.twimg.com/profile_images/766307796132343808/OtMSJrFo_400x400.jpg',
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
      <Subheading>Frequency</Subheading>
      <Section>
        <ComponentContainer width={'50%'}>
          <Component transparent>
            <FrequencyProfile size="mini" data={dummyData.frequency} />
          </Component>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <FrequencyProfile size="small" data={dummyData.frequency} />
          </Component>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <FrequencyProfile size="medium" data={dummyData.frequency} />
          </Component>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <FrequencyProfile size="large" data={dummyData.frequency} />
          </Component>
        </ComponentContainer>

        <ComponentContainer width={'50%'}>
          <Component transparent>
            <FrequencyProfile size="full" data={dummyData.frequency} />
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
            <OutlineButton color={'warn'} icon={'edit'}>
              Outline Button with Icon
            </OutlineButton>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<OutlineButton color={'warn'} icon={'edit'}>Outline Button with Icon</OutlineButton>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <OutlineButton color={'pro'} icon={'edit'} loading={true}>
              Loading Outline Button with Icon
            </OutlineButton>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<OutlineButton color={'pro'} icon={'edit'} loading={true}>Loading Outline Button with Icon</OutlineButton>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <LinkButton>Button</LinkButton>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<LinkButton>Button</LinkButton>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <LinkButton icon={'messages'}>Link Button with Icon</LinkButton>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<LinkButton icon={'messages'}>Link Button with Icon</LinkButton>`}</Code>
        </ComponentContainer>

        <ComponentContainer>
          <Component>
            <LinkButton icon={'messages'} loading={true}>
              Loading Link Button with Icon
            </LinkButton>
          </Component>
          <Code
            onClick={highlightAndCopy}
          >{`<LinkButton icon={'messages'} loading={true}>Loading Link Button with Icon</LinkButton>`}</Code>
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
