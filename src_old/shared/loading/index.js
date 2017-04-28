import React from 'react';
import { connect } from 'react-redux';
import MediumSpinner from 'react-medium-spinner';

const LoadingIndicator = props => (
  <MediumSpinner
    speed={10}
    color="rgba(255,255,255,0.5)"
    active={props.active}
  />
);

const mapStateToProps = state => ({
  active: state.loading.active,
});

export default connect(mapStateToProps)(LoadingIndicator);
