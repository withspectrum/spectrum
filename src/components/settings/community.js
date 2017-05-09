// @flow
import React from 'react';
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
// $FlowFixMe
import { withRouter } from 'react-router';
import { Button, LinkButton } from '../buttons';
import { LoadingCard } from '../loading';
import { Input, UnderlineInput, TextArea } from '../formElements';
import { StyledCard, Form, FormTitle, Description, Actions } from './style';
import { deleteCommunityMutation } from '../../api/community';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

type CommunityProps = {
  id: String,
  name: String,
  slug: String,
  description: String,
  metaData: {
    frequencies: Number,
    members: Number,
  },
};

const CommunityWithData = ({
  data: { community },
  data,
  deleteCommunity,
  history,
}: {
  data: { community: CommunityProps },
}): React$Element<any> => {
  const triggerDeleteCommunity = e => {
    e.preventDefault();
    deleteCommunity(community.id).then(() => {
      history.push(`/`);
    });
  };

  if (!community) {
    return (
      <StyledCard>
        <FormTitle>This community doesn't exist yet.</FormTitle>
        <Description>Want to make it?</Description>
        <Actions>
          <Button>Create</Button>
        </Actions>
      </StyledCard>
    );
  }

  return (
    <StyledCard>
      <FormTitle>Community Settings</FormTitle>
      <Form>
        <Input defaultValue={community.name}>Name</Input>
        <UnderlineInput defaultValue={community.slug}>sp.chat/</UnderlineInput>
        <TextArea defaultValue={community.description}>Description</TextArea>
        <Actions>
          <LinkButton color={'warn.alt'}>Cancel</LinkButton>
          <Button>Save</Button>
        </Actions>

        <Actions>
          <LinkButton color={'warn.alt'} onClick={triggerDeleteCommunity}>
            Delete Community
          </LinkButton>
        </Actions>
      </Form>
    </StyledCard>
  );
};

const Community = compose(
  deleteCommunityMutation,
  displayLoadingState,
  withRouter,
  pure
)(CommunityWithData);
export default Community;
