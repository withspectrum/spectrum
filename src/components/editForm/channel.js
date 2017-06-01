// @flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withRouter } from 'react-router';
import { editChannelMutation, deleteChannelMutation } from '../../api/channel';
import { openModal } from '../../actions/modals';
import { addToastWithTimeout } from '../../actions/toasts';
import { Notice } from '../listItems/style';
import { Button, TextButton, IconButton } from '../buttons';
import { NullCard } from '../upsell';
import { Input, UnderlineInput, TextArea, Checkbox } from '../formElements';
import {
  StyledCard,
  Form,
  FormTitle,
  TertiaryActionContainer,
  Description,
  Actions,
  GeneralNotice,
} from './style';

class ChannelWithData extends Component {
  state: {
    name: string,
    slug: string,
    description: string,
    isPrivate: boolean,
    channelId: string,
    channelData: Object,
    isLoading: boolean,
  };
  constructor(props) {
    super(props);

    const { channel } = this.props;

    this.state = {
      name: channel.name,
      slug: channel.slug,
      description: channel.description,
      isPrivate: channel.isPrivate || false,
      channelId: channel.id,
      channelData: channel,
      isLoading: false,
    };
  }

  handleChange = e => {
    const key = e.target.id;
    const value = e.target.value;
    const { isPrivate } = this.state;

    const newState = {};
    // checkboxes should reverse the value
    if (key === 'isPrivate') {
      newState[key] = !isPrivate;
    } else {
      newState[key] = value;
    }

    this.setState(prevState => {
      return Object.assign({}, prevState, {
        ...newState,
      });
    });
  };

  save = e => {
    e.preventDefault();
    const { name, slug, description, isPrivate, channelId } = this.state;
    const input = {
      name,
      slug,
      description,
      isPrivate,
      channelId,
    };

    this.setState({
      isLoading: true,
    });

    this.props
      .editChannel(input)
      .then(({ data: { editChannel } }) => {
        const channel = editChannel;

        this.setState({
          isLoading: false,
        });

        // the mutation returns a channel object. if it exists,
        if (channel !== undefined) {
          this.props.dispatch(addToastWithTimeout('success', 'Channel saved!'));
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });

        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  cancelForm = e => {
    e.preventDefault();
    return (window.location.href = `/${this.props.channel.community.slug}/${this.props.channel.slug}`);
  };

  triggerDeleteChannel = (e, channelId) => {
    e.preventDefault();
    const { name, channelData } = this.state;
    const message = (
      <div>
        <p>
          Are you sure you want to delete
          {' '}
          <b>{channelData.community.name}/{name}</b>
          ?
        </p>
        {channelData.metaData.threads > 0 &&
          <p>
            The
            {' '}
            <b>{channelData.metaData.threads} threads</b>
            {' '}
            posted in this channel will be deleted.
          </p>}
        <p>
          All messages, reactions, and media shared in this channel will be deleted.
        </p>
        <p><b>This cannot be undone.</b></p>
      </div>
    );

    return this.props.dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: channelId,
        entity: 'channel',
        message,
        redirect: `/${channelData.community.slug}`,
      })
    );
  };

  render() {
    const { name, slug, description, isPrivate, isLoading } = this.state;
    const { channel } = this.props;

    if (!channel) {
      return (
        <NullCard
          bg="channel"
          heading={`This channel doesn't exist yet.`}
          copy={`Want to make it?`}
        >
          {/* TODO: wire up button */}
          <Button>Create</Button>
        </NullCard>
      );
    } else {
      return (
        <StyledCard>
          <FormTitle>Channel Settings</FormTitle>
          <Form>
            <Input defaultValue={name} id="name" onChange={this.handleChange}>
              Name
            </Input>
            <UnderlineInput defaultValue={slug} disabled>
              {`URL: /${channel.community.slug}/`}
            </UnderlineInput>
            <TextArea
              id="description"
              defaultValue={description}
              onChange={this.handleChange}
            >
              Description
            </TextArea>

            {slug !== 'general' &&
              <Checkbox
                id="isPrivate"
                checked={isPrivate}
                onChange={this.handleChange}
              >
                Private channel
              </Checkbox>}
            {isPrivate
              ? <Description>
                  Only approved people on Spectrum can see the threads, messages, and members in this channel. You can manually approve users who request to join this channel.
                </Description>
              : <Description>
                  Anyone on Spectrum can join this channel, post threads and messages, and will be able to see other members.
                </Description>}

            {// if the user is moving from private to public
            this.props.channel.isPrivate &&
              !isPrivate &&
              <Notice>
                When a private channel is made public all pending users will be added as members of the channel. Blocked users will remain blocked from viewing all content in this channel but in the future any new person will be able to join.
              </Notice>}

            <Actions>
              {slug !== 'general' &&
                <TertiaryActionContainer>
                  <IconButton
                    glyph="delete"
                    tipText={`Delete ${name}`}
                    tipLocation="top-right"
                    color="text.placeholder"
                    hoverColor="warn.alt"
                    onClick={e => this.triggerDeleteChannel(e, channel.id)}
                  />
                </TertiaryActionContainer>}
              <TextButton color={'text.alt'} onClick={this.cancelForm}>
                Cancel
              </TextButton>
              <Button onClick={this.save} loading={isLoading}>Save</Button>
            </Actions>

            {slug === 'general' &&
              <GeneralNotice>
                The General channel is the default channel for your community. It can't be deleted or private, but you can still change the name and description.
              </GeneralNotice>}
          </Form>
        </StyledCard>
      );
    }
  }
}

const Channel = compose(
  deleteChannelMutation,
  editChannelMutation,
  withRouter,
  pure
)(ChannelWithData);
export default connect()(Channel);
