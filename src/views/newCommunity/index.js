// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import { track } from '../../helpers/events';
import queryString from 'query-string';
import { Button, TextButton } from '../../components/buttons';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import { ImportSlackWithoutCard } from '../communitySettings/components/importSlack';
import { CommunityInvitationForm } from '../../components/emailInvitationForm';
import CreateCommunityForm from './components/createCommunityForm';
import EditCommunityForm from './components/editCommunityForm';
import Titlebar from '../titlebar';
import Stepper from './components/stepper';
import Share from './components/share';
import { Login } from '../../views/login';
import { getCommunityByIdQuery } from 'shared/graphql/queries/community/getCommunity';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import {
  Actions,
  Container,
  Title,
  Description,
  Divider,
  ContentContainer,
} from './style';

type State = {
  activeStep: number,
  isLoading: boolean,
  community: any,
  existingId: ?string,
  hasInvitedPeople: boolean,
};

type Props = {
  currentUser: ?Object,
  client: Object,
  history: Object,
};

class NewCommunity extends React.Component<Props, State> {
  constructor() {
    super();

    const parsed = queryString.parse(window.location.search);
    let step = parsed.s;
    const id = parsed.id;

    step = step ? parseInt(step, 10) : 1;

    this.state = {
      activeStep: step,
      isLoading: false,
      community: null,
      existingId: id || null,
      hasInvitedPeople: false,
    };
  }

  componentDidMount() {
    track('community', 'create inited', null);

    const { existingId } = this.state;
    if (!existingId) return;

    this.props.client
      .query({
        query: getCommunityByIdQuery,
        variables: {
          id: existingId,
        },
      })
      .then(
        ({
          data: { community },
        }: {
          data: { community: GetCommunityType },
        }) => {
          if (!community) return;
          return this.setState({
            community,
          });
        }
      )
      .catch(err => {
        console.log('error creating community', err);
      });
  }

  step = direction => {
    const { activeStep, community } = this.state;
    let newStep = direction === 'next' ? activeStep + 1 : activeStep - 1;
    this.props.history.replace(
      `/new/community?s=${newStep}${community &&
        community.id &&
        `&id=${community.id}`}`
    );
    this.setState({
      activeStep: newStep,
    });
  };

  title = () => {
    const { activeStep, community } = this.state;
    switch (activeStep) {
      case 1: {
        return community ? 'Update your community' : 'Create a community';
      }
      case 2: {
        return `Invite people${
          community
            ? ` to the ${community.name} community`
            : ' to your community'
        }`;
      }
      case 3: {
        return 'Done!';
      }
      default: {
        return 'Create a community';
      }
    }
  };

  description = () => {
    const { activeStep, community } = this.state;
    switch (activeStep) {
      case 1: {
        return 'Creating a community on Spectrum is free, forever. To get started, tell us more about your community below.';
      }
      case 2: {
        return `Kickstart ${
          community ? `the ${community.name} community` : 'your community'
        } by inviting an existing Slack team or by inviting a handful of folks directly by email. You'll be able to invite more people at any point in the future, too, if you're not quite ready.`;
      }
      case 3: {
        return "You're all set! Your community is live - go check it out, start posting threads, and get the conversations started!";
      }
      default: {
        return 'Create a community';
      }
    }
  };

  communityCreated = community => {
    this.setState({
      community: { ...community },
    });
    this.props.history.replace(`/new/community?id=${community.id}`);
    return this.step('next');
  };

  hasInvitedPeople = () => {
    this.setState({
      hasInvitedPeople: true,
    });
  };

  render() {
    const { currentUser } = this.props;
    const { activeStep, community, existingId, hasInvitedPeople } = this.state;
    const title = this.title();
    const description = this.description();

    if (!currentUser) {
      return <Login redirectPath={`${window.location.href}`} />;
    } else {
      return (
        <AppViewWrapper>
          <Titlebar
            title={'Create a Community'}
            provideBack={true}
            backRoute={'/'}
            noComposer
          />

          <Column type="primary">
            <Container bg={activeStep === 3 ? 'onboarding' : null} repeat>
              <Stepper activeStep={activeStep} />
              <Title centered={activeStep === 3}>{title}</Title>
              <Description centered={activeStep === 3}>
                {description}
              </Description>

              {// gather community meta info
              activeStep === 1 &&
                !community && (
                  <CreateCommunityForm
                    communityCreated={this.communityCreated}
                  />
                )}

              {activeStep === 1 &&
                community && (
                  <EditCommunityForm
                    communityUpdated={this.communityCreated}
                    community={community}
                  />
                )}

              {activeStep === 2 &&
                community &&
                community.id && (
                  <ContentContainer>
                    <Divider />
                    <ImportSlackWithoutCard
                      community={community}
                      id={community.id || existingId}
                      isOnboarding
                      hasInvitedPeople={this.hasInvitedPeople}
                    />
                    <Divider />
                    <CommunityInvitationForm id={community.id} />
                  </ContentContainer>
                )}

              {// connect a slack team or invite via email
              activeStep === 2 && (
                <Actions>
                  <TextButton onClick={() => this.step('previous')}>
                    Back
                  </TextButton>
                  {hasInvitedPeople ? (
                    <Button onClick={() => this.step('next')}>Continue</Button>
                  ) : (
                    <TextButton
                      color={'brand.default'}
                      onClick={() => this.step('next')}
                    >
                      Skip this step
                    </TextButton>
                  )}
                </Actions>
              )}

              {// share the community
              activeStep === 3 && (
                <ContentContainer>
                  <Share community={community} onboarding={true} />
                </ContentContainer>
              )}
            </Container>
          </Column>
        </AppViewWrapper>
      );
    }
  }
}
const mapStateToProps = state => ({ currentUser: state.users.currentUser });
export default compose(
  withApollo,
  // $FlowIssue
  connect(mapStateToProps)
)(NewCommunity);
