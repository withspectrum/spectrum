// @flow
import * as React from 'react';
import Nav from './components/nav';
import Support from './support';
import Features from './features';
import Home from './home';
import Terms from './terms';
import Privacy from './privacy';
import Faq from './faq';
import Apps from './apps';
import { StyledViewGrid } from './style';

type Props = {
  match: Object,
};

class Pages extends React.Component<Props> {
  renderPage = () => {
    switch (this.props.match.path) {
      case '/support': {
        return <Support {...this.props} />;
      }
      case '/features': {
        return <Features {...this.props} />;
      }
      case '/terms':
      case '/terms.html': {
        return <Terms {...this.props} />;
      }
      case '/privacy':
      case '/privacy.html': {
        return <Privacy {...this.props} />;
      }
      case '/faq': {
        return <Faq {...this.props} />;
      }
      case '/apps': {
        return <Apps {...this.props} />;
      }
      case '/':
      case '/about':
      default: {
        return <Home {...this.props} />;
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
