// @flow
import * as React from 'react';
import Icon from 'src/components/icons';
import {
  Button,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  TextButton,
  OutlineButton,
  IconButton,
  ButtonRow,
  ButtonSegmentRow,
} from 'src/components/buttons';

export default class Buttons extends React.Component<{}> {
  render() {
    return (
      <div style={{ padding: '20px' }}>
        <ButtonRow>
          <Button>Button</Button>

          <PrimaryButton>Primary Button</PrimaryButton>

          <SecondaryButton>Secondary Button</SecondaryButton>

          <DangerButton>Danger Button</DangerButton>

          <TextButton>Text Button</TextButton>

          <OutlineButton>Outline Button</OutlineButton>

          <IconButton>
            <Icon glyph="thumbsup" size={32} />
          </IconButton>
        </ButtonRow>

        <div style={{ height: '40px' }} />

        <ButtonRow>
          <Button size="large">Button</Button>

          <PrimaryButton size="large">Primary Button</PrimaryButton>

          <SecondaryButton size="large">Secondary Button</SecondaryButton>

          <DangerButton size="large">Danger Button</DangerButton>

          <TextButton size="large">Text Button</TextButton>

          <OutlineButton size="large">Outline Button</OutlineButton>

          <IconButton size="large">
            <Icon glyph="thumbsup" size={32} />
          </IconButton>
        </ButtonRow>

        <div style={{ height: '40px' }} />

        <ButtonRow>
          <Button disabled>Button</Button>

          <PrimaryButton disabled>Primary Button</PrimaryButton>

          <SecondaryButton disabled>Secondary Button</SecondaryButton>

          <DangerButton disabled>Danger Button</DangerButton>

          <TextButton disabled>Text Button</TextButton>

          <OutlineButton disabled>Outline Button</OutlineButton>

          <IconButton disabled>
            <Icon glyph="thumbsup" size={32} />
          </IconButton>
        </ButtonRow>

        <div style={{ height: '40px' }} />

        <ButtonRow>
          <Button loading>Loading Button</Button>

          <PrimaryButton loading>Loading Primary Button</PrimaryButton>

          <SecondaryButton loading>Loading Secondary Button</SecondaryButton>

          <DangerButton loading>Loading Danger Button</DangerButton>

          <TextButton loading>Loading Text Button</TextButton>

          <OutlineButton loading>Loading Outline Button</OutlineButton>

          <IconButton loading>
            <Icon glyph="thumbsup" size={32} />
          </IconButton>
        </ButtonRow>

        <div style={{ height: '40px' }} />

        <ButtonRow>
          <Button>
            <Icon glyph="message-new" size={24} />
            Button
          </Button>

          <PrimaryButton>
            <Icon glyph="message-new" size={24} />
            Primary Button
          </PrimaryButton>

          <SecondaryButton>
            <Icon glyph="message-new" size={24} />
            Secondary Button
          </SecondaryButton>

          <DangerButton>
            <Icon glyph="message-new" size={24} />
            Danger Button
          </DangerButton>

          <TextButton>
            <Icon glyph="message-new" size={24} />
            Text Button
          </TextButton>

          <OutlineButton>
            <Icon glyph="message-new" size={24} />
            Outline Button
          </OutlineButton>

          <IconButton>
            <Icon glyph="message-new" size={32} />
          </IconButton>
        </ButtonRow>

        <div style={{ height: '40px' }} />

        <ButtonSegmentRow>
          <Button>Button</Button>
          <Button>Button</Button>
          <Button>Button</Button>
        </ButtonSegmentRow>

        <div style={{ height: '40px' }} />

        <ButtonSegmentRow>
          <PrimaryButton>PrimaryButton</PrimaryButton>
          <PrimaryButton>PrimaryButton</PrimaryButton>
          <PrimaryButton>PrimaryButton</PrimaryButton>
        </ButtonSegmentRow>

        <div style={{ height: '40px' }} />

        <ButtonSegmentRow>
          <SecondaryButton>SecondaryButton</SecondaryButton>
          <SecondaryButton>SecondaryButton</SecondaryButton>
          <SecondaryButton>SecondaryButton</SecondaryButton>
        </ButtonSegmentRow>
      </div>
    );
  }
}
