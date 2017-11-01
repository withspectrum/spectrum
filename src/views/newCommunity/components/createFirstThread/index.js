// @flow
import React from 'react';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import Composer from '../../../../components/composer';
import { Loading } from '../../../../components/loading';
import { ComposerWrapper } from '../../style';

const CreateFirstThread = ({ community, history, onboarding }) => {
  if (!community) return <Loading />;

  return (
    <ComposerWrapper>
      <Composer isOnboarding isInbox={false} />
    </ComposerWrapper>
  );
};

export default compose(withRouter)(CreateFirstThread);
