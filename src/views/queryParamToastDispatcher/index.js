// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withRouter, type Location, type History } from 'react-router';
import querystring from 'querystring';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { addToastWithTimeout } from 'src/actions/toasts';

type Props = {
  location: Location,
  history: History,
  dispatch: Dispatch<Object>,
};

class QueryParamToastDispatcher extends React.Component<Props> {
  getParams = (props: Props) => {
    return querystring.parse(props.location.search.replace('?', ''));
  };

  componentDidMount() {
    const params = this.filterToastParams(this.getParams(this.props));
    if (this.hasValidToastParams(params)) {
      this.props.dispatch(
        addToastWithTimeout(params.toastType, params.toastMessage)
      );
      return this.cleanLocation();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const currProps = this.props;
    const prevParams = this.filterToastParams(this.getParams(prevProps));
    const currParams = this.filterToastParams(this.getParams(currProps));

    const currValid = this.hasValidToastParams(currParams);
    if (!currValid) return;

    if (prevParams.toastMessage !== currParams.toastMessage) {
      currProps.dispatch(
        addToastWithTimeout(currParams.toastType, currParams.toastMessage)
      );
      return this.cleanLocation();
    }
  }

  hasValidToastParams = (params: Object) => {
    const validToastTypes = ['success', 'error', 'neutral'];
    return (
      params.toastType &&
      validToastTypes.indexOf(params.toastType) >= 0 &&
      params.toastMessage
    );
  };

  /*
    There could be many parameters besides toastMessage and toastType.
    This component only cares about changes to these two specific params though,
    so we can filter down to an object with only what we need and use that to
    determine whether we need to dispatch a new toast or not
  */
  filterToastParams = (params: Object) => ({
    toastMessage: params['toastMessage'],
    toastType: params['toastType'],
  });

  cleanLocation = () => {
    const params = this.getParams(this.props);
    const clean = {};
    Object.keys(params).map(key => {
      if (!key || key === 'toastMessage' || key === 'toastType') return null;
      clean[key] = params[key];
      return null;
    });
    const cleanParams = querystring.stringify(clean);
    /*
      We decode the cleanParams in order to preserver special characters in the url
      For example, the url /spectrum/general/another-thread~thread-2?m=MTQ4MzIyNTIwMDAwMg== 
      has two equals signs at the end. If we don't decode the cleanParams it will become
      spectrum/general/another-thread~thread-2?m=MTQ4MzIyNTIwMDAwMg%3D%3D
    */
    return this.props.history.push({ search: decodeURIComponent(cleanParams) });
  };

  render() {
    return null;
  }
}

export default compose(
  withRouter,
  connect()
)(QueryParamToastDispatcher);
