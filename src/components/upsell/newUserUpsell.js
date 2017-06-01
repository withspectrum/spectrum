// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import { openModal } from '../../actions/modals';
import { Button } from '../../components/buttons';
import { NullCard } from './index';
import {
  LargeEmoji,
  Title,
  SmallTitle,
  Subtitle,
  SmallSubtitle,
} from './style';
import {
  Section,
  SectionHeader,
  SectionHeaderNumber,
} from './newUserUpsellStyles';

class UpsellNewUser extends Component {
  createCommunity = () => {
    this.props.dispatch(openModal('CREATE_COMMUNITY_MODAL'));
  };

  render() {
    const { user } = this.props;

    return (
      <NullCard bg="channel" repeat={true}>
        <LargeEmoji>
          👋
        </LargeEmoji>
        <Title>Howdy, {user.name}!</Title>
        <Subtitle>
          Spectrum is a place where communities live. It's easy to follow the things that you care about most, or even create your own community to share with the world.
        </Subtitle>

        <Section>
          <SectionHeader>
            <SectionHeaderNumber>1</SectionHeaderNumber>
          </SectionHeader>

          <SmallTitle>Find Your People</SmallTitle>
          <SmallSubtitle>
            Join communities that look interesting or fun, and threads posted to those communities will start showing up in your home feed!
          </SmallSubtitle>
        </Section>

        <Section>
          <SectionHeader>
            <SectionHeaderNumber>2</SectionHeaderNumber>
          </SectionHeader>

          <SmallTitle>More Fun With Friends</SmallTitle>
          <SmallSubtitle>
            Interneting is more fun with friends - invite your favorite people to join the conversation!
          </SmallSubtitle>
        </Section>

        <Section>
          <SectionHeader>
            <SectionHeaderNumber>3</SectionHeaderNumber>
          </SectionHeader>

          <SmallTitle>Build a Community</SmallTitle>
          <SmallSubtitle>
            Already run an online community? Or have you been dreaming of building a new space for people who like the same things? Create a community in less than a minute:
          </SmallSubtitle>

          <Button onClick={this.createCommunity} icon="plus">
            Create a Community
          </Button>
        </Section>
      </NullCard>
    );
  }
}

export default connect()(UpsellNewUser);
