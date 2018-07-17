// @flow
import * as React from 'react';
import Icon from 'src/components/icons';
import {
  Button,
  PrimaryButton,
  SecondaryButton,
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

          <TextButton disabled>Text Button</TextButton>

          <OutlineButton disabled>Outline Button</OutlineButton>

          <IconButton disabled>
            <Icon glyph="thumbsup" size={32} />
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
