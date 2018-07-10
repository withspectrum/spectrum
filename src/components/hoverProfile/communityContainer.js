// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withApollo, type Client } from 'react-apollo';
import { Manager, Reference, Popper } from 'react-popper';
import { createPortal } from 'react-dom';
import CommunityProfile from './communityProfile';
import { Span } from './style';
import {
  getCommunityById,
  getCommunityByIdQuery,
} from 'shared/graphql/queries/community/getCommunity';
import LoadingHoverProfile from './loadingHoverProfile';

const CommunityHoverProfile = getCommunityById(props => {
  if (props.data.community) {
    return (
      <CommunityProfile
        innerRef={props.innerRef}
        community={props.data.community}
        style={props.style}
      />
    );
  }

  if (props.data.loading) {
    return (
      <LoadingHoverProfile style={props.style} innerRef={props.innerRef} />
    );
  }

  return null;
});

type Props = {
  children: any,
  id: string,
  style?: Object,
  client: Client,
};

type State = {
  visible: boolean,
};

class CommunityHoverProfileWrapper extends React.Component<Props, State> {
  ref: ?any;
  ref = null;
  state = { visible: false };

  handleMouseEnter = () => {
    const { client, id } = this.props;

    client.query({
      query: getCommunityByIdQuery,
      variables: { id },
    });

    const ref = setTimeout(() => {
      this.setState({ visible: true });
    }, 500);
    this.ref = ref;
  };

  handleMouseLeave = () => {
    if (this.ref) {
      clearTimeout(this.ref);
    }

    if (this.state.visible) {
      this.setState({ visible: false });
    }
  };

  render() {
    const { children, id, style = {} } = this.props;
    return (
      <Span
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={style}
      >
        <Manager>
          <Reference>
            {({ ref }) => (
              <Span innerRef={ref} style={style}>
                {children}
              </Span>
            )}
          </Reference>
          {this.state.visible &&
            document.body &&
            createPortal(
              <Popper
                placement="top-start"
                modifiers={{
                  preventOverflow: { enabled: false },
                  hide: { enabled: false },
                }}
              >
                {({ style, ref }) => (
                  <CommunityHoverProfile id={id} innerRef={ref} style={style} />
                )}
              </Popper>,
              document.body
            )}
        </Manager>
      </Span>
    );
  }
}

export default compose(withApollo)(CommunityHoverProfileWrapper);
