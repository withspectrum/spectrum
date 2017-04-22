import React from 'react';
import { Route, Redirect } from 'react-router';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import styled from 'styled-components';

const Loading = () => <div>Loading</div>;

const Container = styled.div``;

// Define an HoC that displays the Loading component instead of the
// wrapped component when props.data.loading is true
const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
);

const StoryDetailContainerPure = ({ data: { loading, story } }) => {
  if (loading) {
    return <div>Loading</div>;
  } else {
    return (
      <div>
        <h3>
          {story.content.title} by {story.author.displayName}
        </h3>
        <p>
          {story.content.description}
        </p>
      </div>
    );
  }
};

const data = graphql(
  gql`
  query story($id: ID!) {
    story(id: $id) {
      id
      content {
        title
        description
      }
      author {
        displayName
      }
    }
  }
`,
  {
    options: props => ({
      variables: { id: props.match.params.storyId },
    }),
  }
);

const StoryDetailContainer = compose(data, displayLoadingState, pure)(
  StoryDetailContainerPure
);

const StoryPure = ({ match }) => (
  <Container>
    {/* story meta details here */}
    <div>Story meta details</div>

    {/* story content */}
    <Route path={`${match.url}/:storyId`} component={StoryDetailContainer} />

    {/* if no storyId is provided, redirect to homepage */}
    <Route exact path={match.url} render={() => <Redirect to="/" />} />
  </Container>
);

const Story = compose(pure)(StoryPure);

export default Story;
