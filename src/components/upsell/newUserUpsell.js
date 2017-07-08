// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import compose from 'recompose/compose';
import { track } from '../../helpers/events';
import { openModal } from '../../actions/modals';
import SetUsername from '../../components/setUsername';
import { Button, OutlineButton } from '../../components/buttons';
import TopCommunities from '../../views/dashboard/components/topCommunities';
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
  ButtonRow,
  FriendlyError,
} from './newUserUpsellStyles';

class UpsellNewUser extends Component {
  state: {
    joinedCommunities: number,
    error: string,
    savedUsername: boolean,
  };

  constructor(props) {
    super(props);

    this.state = {
      joinedCommunities: 0,
      error: '',
      savedUsername: props.user.username ? props.user.username : false,
    };
  }

  componentDidMount() {
    track('onboarding', 'viewed', null);
  }

  graduate = () => {
    const { joinedCommunities, savedUsername } = this.state;
    const { communities } = this.props;

    if ((joinedCommunities > 0 || communities) && savedUsername) {
      track('onboarding', 'graduated', null);
      this.props.graduate();
    } else {
      let error;
      if (joinedCommunities === 0 && !communities) {
        error =
          'To get started, try joining some communities above, or creating your own!';
      } else if (!savedUsername) {
        error = 'Be sure to save your username!';
      }

      this.setState({
        error,
      });
    }
  };

  joined = () => {
    let { joinedCommunities } = this.state;
    joinedCommunities += 1;

    this.setState({
      joinedCommunities,
      error: '',
    });
  };

  left = () => {
    let { joinedCommunities } = this.state;
    joinedCommunities -= 1;

    this.setState({
      joinedCommunities,
    });
  };

  createCommunity = () => {
    this.props.history.push('/new/community');
  };

  clickShareLink = value => {
    track('onboarding', 'share link clicked', value);
  };

  savedUsername = () => {
    this.setState({
      savedUsername: true,
    });
  };

  render() {
    const { user } = this.props;

    return (
      <NullCard bg="onboarding" repeat={true} noPadding>
        <Section>
          <LargeEmoji>
            <span role="img" aria-label="Howdy!">
              👋
            </span>
          </LargeEmoji>
          <Title>
            Howdy, {user.name}!
          </Title>
          <Subtitle>
            Spectrum is a place where communities live. It's easy to follow the
            things that you care about most, or even create your own community
            to share with the world.
          </Subtitle>
        </Section>

        <Section noPadding>
          <SectionHeader>
            <SectionHeaderNumber>1</SectionHeaderNumber>
          </SectionHeader>

          <SmallTitle>Set your username</SmallTitle>
          <SmallSubtitle>
            Pick a username so that people can find you on Spectrum!
          </SmallSubtitle>

          <SetUsername user={user} usernameSaved={this.savedUsername} />
        </Section>

        <Section noPadding>
          <SectionHeader>
            <SectionHeaderNumber>2</SectionHeaderNumber>
          </SectionHeader>

          <SmallTitle>Find your people</SmallTitle>
          <SmallSubtitle>
            Join communities that look interesting or fun, and threads posted to
            those communities will start showing up in your home feed!
          </SmallSubtitle>

          <TopCommunities join={this.joined} leave={this.left} />
        </Section>

        <Section>
          <SectionHeader>
            <SectionHeaderNumber>3</SectionHeaderNumber>
          </SectionHeader>

          <SmallTitle>More fun with friends</SmallTitle>
          <SmallSubtitle>
            Interneting is more fun with friends - invite your favorite people
            to join the conversation!
          </SmallSubtitle>

          <ButtonRow>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://spectrum.chat&t=Come hang out with me on Spectrum, a new place on the internet for communities!`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                icon="facebook"
                gradientTheme={'none'}
                color={'social.facebook.default'}
                onClick={() => this.clickShareLink('twitter')}
              >
                Share on Facebook
              </Button>
            </a>
            <a
              href={`https://twitter.com/share?text=Come hang out with me on @withspectrum, a new place on the internet for communities!&url=https://spectrum.chat`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                icon="twitter"
                gradientTheme={'none'}
                color={'social.twitter.default'}
                onClick={() => this.clickShareLink('twitter')}
              >
                Share on Twitter
              </Button>
            </a>
          </ButtonRow>
        </Section>

        <Section>
          <SectionHeader>
            <SectionHeaderNumber>4</SectionHeaderNumber>
          </SectionHeader>

          <SmallTitle>Build a community</SmallTitle>
          <SmallSubtitle>
            Already run an online community? Or have you been dreaming of
            building a new space for people who like the same things? Create a
            community in less than a minute:
          </SmallSubtitle>

          <OutlineButton onClick={this.createCommunity} icon="plus">
            Create a community
          </OutlineButton>
        </Section>

        <Section>
          <SectionHeader>
            <SectionHeaderNumber>5</SectionHeaderNumber>
          </SectionHeader>

          <SmallTitle>All set?</SmallTitle>
          <SmallSubtitle>
            Once you've found a few communities and topics, or created your own,
            you're ready to go!
          </SmallSubtitle>

          {this.state.error &&
            <FriendlyError>
              {this.state.error}
            </FriendlyError>}

          <Button onClick={this.graduate} icon="logo">
            Cool! Take me home.
          </Button>
        </Section>
      </NullCard>
    );
  }
}

export default compose(withRouter, connect())(UpsellNewUser);
