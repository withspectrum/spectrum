//@flow

import React, { Component } from 'react';
import { gql, graphql } from 'react-apollo';
import { Column, UserProfile, FrequencyProfile, ChatInput } from '../ui';

class Story extends Component {
  render() {
    return (
      <StoryContainer>
        <Column>
          <UserProfile />
          <FrequencyProfile />
        </Column>
        <Column main>
          <StoryBody />
          <StoryActions />
          <Chat />
          <ChatInput />
        </Column>
      </StoryContainer>
    );
  }
}

export const storyQuery = gql`
  query StoryQuery {
    ...get some stuff here
  }
`;

export default graphql(storyQuery, {})(Story);
