// @flow
import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import compose from 'recompose/compose';
import Composer from '../../../../components/composer';
import { Button, TextButton } from '../../../../components/buttons';
import { Loading } from '../../../../components/loading';
import { ComposerWrapper } from '../../style';

const CreateFirstThread = ({ community, history, onboarding, step }) => {
  if (!community) return <Loading />;
  if (window.innerWidth < 768) {
    return (
      <ComposerWrapper>
        <Link to={`/new/thread?slug=${community.slug}&isOnboarding=true`}>
          <Button large icon={'post'}>
            Start a conversation
          </Button>
        </Link>
        <TextButton
          style={{ marginTop: '16px' }}
          large
          onClick={() => step('next')}
        >
          Skip
        </TextButton>
      </ComposerWrapper>
    );
  }
  return (
    <ComposerWrapper>
      <Composer step={step} isOnboarding hideDropdowns />
    </ComposerWrapper>
  );
};

export default compose(withRouter)(CreateFirstThread);
