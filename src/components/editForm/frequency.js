// @flow
import React from 'react';
import Card from '../card';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import branch from 'recompose/branch';
//$FlowFixMe
import { Link } from 'react-router-dom';
import { LoadingCard } from '../loading';
import { Button, LinkButton } from '../buttons';
import { Input, UnderlineInput, TextArea, Checkbox } from '../formElements';
import {
  StyledCard,
  Form,
  FormTitle,
  Description,
  Actions,
  Action,
  ActionOutline,
} from './style';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

type FrequencyProps = {
  id: String,
  name: String,
  slug: String,
  description: String,
  metaData: {
    stories: Number,
    subscribers: Number,
  },
};

const FrequencyWithData = ({
  data: { frequency },
  data,
}: {
  data: { frequency: FrequencyProps },
}): React$Element<any> => {
  if (!frequency) {
    return (
      <StyledCard>
        <FormTitle>This frequency doesn't exist yet.</FormTitle>
        <Description>Want to make it?</Description>
        <Actions>
          <Button>Create</Button>
        </Actions>
      </StyledCard>
    );
  }

  return (
    <StyledCard>
      <FormTitle>Frequency Settings</FormTitle>
      <Form>
        <Input defaultValue={frequency.name}>Name</Input>
        <UnderlineInput defaultValue={frequency.slug}>sp.chat/</UnderlineInput>
        <TextArea defaultValue={frequency.description}>Description</TextArea>
        <Checkbox>Private?</Checkbox>
        <Actions>
          <LinkButton color={'warn.alt'}>Cancel</LinkButton>
          <Button>Save</Button>
        </Actions>
      </Form>
    </StyledCard>
  );
};

const Frequency = compose(displayLoadingState, pure)(FrequencyWithData);
export default Frequency;
