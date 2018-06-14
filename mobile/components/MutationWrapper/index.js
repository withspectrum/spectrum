// @flow
/*

  This is a utility component that makes it easy to expose a loading state for mutations
  in one place, rather than having to write custom React class state for `isLoading` anywhere
  a mutation is used in the app. By using a render prop, we can simply expose the `isLoading` 
  value to the rendered components.

  Pass this utility component a mutation function, variables for the graphql mutation, and what
  should be rendered. Seen an example in src/views/ThreadDetail/index.js for usage.

*/

import * as React from 'react';

type Props = {
  mutation: Function,
  variables: any,
  render: Function,
  onComplete?: Function,
  onError?: Function,
};

type State = {
  isLoading: boolean,
};

class MutationWrapper extends React.Component<Props, State> {
  mounted: boolean;

  constructor() {
    super();

    this.state = {
      isLoading: false,
    };

    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setLoading = (isLoading: boolean) => {
    if (!this.mounted) return;
    return this.setState({ isLoading });
  };

  mutate = () => {
    const { onComplete, onError } = this.props;

    this.setLoading(true);

    this.props
      .mutation(this.props.variables)
      .then(data => {
        this.setLoading(false);

        return onComplete && onComplete(data);
      })
      .catch(err => {
        this.setLoading(false);

        return onError && onError(err);
      });
  };

  render() {
    const { isLoading } = this.state;
    return this.props.render({ isLoading, onPressHandler: this.mutate });
  }
}

export default MutationWrapper;
