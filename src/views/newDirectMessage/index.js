// @flow
import React, { useState } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Search, Write, ViewContainer } from './containers';

type Props = {
  initialUsers: Array<?string>,
};

const NewDirectMessage = (props: Props) => {
  const { initialUsers } = props;
  const [usersForMessage, setUsersForMessage] = useState(initialUsers);
  const [activeStep, setActiveStep] = useState(
    initialUsers.filter(Boolean).length > 0 ? 'write' : 'search'
  );

  if (activeStep === 'search') {
    return (
      <ViewContainer {...props}>
        <Search
          usersForMessage={usersForMessage.filter(Boolean)}
          setUsersForMessage={setUsersForMessage}
          setActiveStep={setActiveStep}
        />
      </ViewContainer>
    );
  }

  if (activeStep === 'write') {
    return (
      <ViewContainer {...props}>
        <Write
          /*
            If the modal loaded with an initial user, it means the user is composing
            a dm from somewhere in the app like a user profile. In this case,
            there is no "search" step to go back to, so we let the Write
            container know to not allow a back action to return to the Search
            step
          */
          hadInitialUser={initialUsers.length === 1}
          usersForMessage={usersForMessage.filter(Boolean)}
          setActiveStep={setActiveStep}
        />
      </ViewContainer>
    );
  }
};

const map = (state): * => ({
  initialUsers: state.directMessageThreads.initNewThreadWithUser,
});

export default compose(connect(map))(NewDirectMessage);
