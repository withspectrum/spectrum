// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withApollo, type Client } from 'react-apollo';
import { Manager, Reference, Popper } from 'react-popper';
import { createPortal } from 'react-dom';
import ChannelProfile from './channelProfile';
import LoadingHoverProfile from './loadingHoverProfile';
import { Span } from './style';
import {
  getChannelById,
  getChannelByIdQuery,
} from 'shared/graphql/queries/channel/getChannel';

const ChannelHoverProfile = getChannelById(props => {
  if (props.data.channel) {
    return (
      <ChannelProfile
        innerRef={props.innerRef}
        channel={props.data.channel}
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
  isMounted: boolean,
};

class ChannelHoverProfileWrapper extends React.Component<Props, State> {
  ref: ?any;
  ref = null;
  state = { visible: false, isMounted: false };

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  handleMouseEnter = () => {
    const { client, id } = this.props;

    client.query({
      query: getChannelByIdQuery,
      variables: { id },
    });

    const ref = setTimeout(() => {
      return this.state.isMounted && this.setState({ visible: true });
    }, 500);
    this.ref = ref;
  };

  handleMouseLeave = () => {
    if (this.ref) {
      clearTimeout(this.ref);
    }

    if (this.state.isMounted && this.state.visible) {
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
                  <ChannelHoverProfile id={id} innerRef={ref} style={style} />
                )}
              </Popper>,
              document.body
            )}
        </Manager>
      </Span>
    );
  }
}

export default compose(withApollo)(ChannelHoverProfileWrapper);
