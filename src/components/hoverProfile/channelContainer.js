// @flow
import * as React from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import { createPortal } from 'react-dom';
import ChannelProfile from './channelProfile';
import { Span } from './style';
import { getChannelById } from 'shared/graphql/queries/channel/getChannel';

const ChannelHoverProfile = getChannelById(
  props =>
    !props.data.channel ? null : (
      <ChannelProfile
        innerRef={props.innerRef}
        channel={props.data.channel}
        style={props.style}
      />
    )
);

type Props = {
  children: any,
  id: string,
  style?: Object,
};

type State = {
  visible: boolean,
};

class ChannelHoverProfileWrapper extends React.Component<Props, State> {
  ref: ?any;
  ref = null;
  state = { visible: false };

  handleMouseEnter = () => {
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

export default ChannelHoverProfileWrapper;
