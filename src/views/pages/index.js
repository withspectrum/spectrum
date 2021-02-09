// @flow
import * as React from 'react';
import Nav from './components/nav';
import Terms from './terms';
import Privacy from './privacy';
import { StyledViewGrid } from './style';

type Props = {
  match: Object,
};

class Pages extends React.Component<Props> {
  renderPage = () => {
    switch (this.props.match.path) {
      case '/terms':
      case '/terms.html': {
        return <Terms {...this.props} />;
      }
      case '/privacy':
      case '/privacy.html': {
        return <Privacy {...this.props} />;
      }
    }
  };

  render() {
    const {
      match: { path },
    } = this.props;
    const dark = path === '/' || path === '/about';

    return (
      <StyledViewGrid>
        <div style={{ position: 'relative' }}>
          <Nav
            dark={dark ? 'true' : undefined}
            location={this.props.match.path.substr(1)}
          />
          {this.renderPage()}
        </div>
      </StyledViewGrid>
    );
  }
}

export default Pages;
