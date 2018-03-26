// @flow
import * as React from 'react';
import Nav from './components/nav';
import Support from './support';
import Pricing from './pricing';
import Home from './home';
import Terms from './terms';
import Privacy from './privacy';

type Props = {
  match: Object,
};

class Pages extends React.Component<Props> {
  renderPage = () => {
    switch (this.props.match.path) {
      case '/': {
        return <Home {...this.props} />;
      }
      case '/about': {
        return <Home {...this.props} />;
      }
      case '/support': {
        return <Support {...this.props} />;
      }
      case '/pricing': {
        return <Pricing {...this.props} />;
      }
      case '/terms': {
        return <Terms {...this.props} />;
      }
      case '/privacy': {
        return <Privacy {...this.props} />;
      }
      case '/privacy.html': {
        return <Privacy {...this.props} />;
      }
      case '/terms.html': {
        return <Terms {...this.props} />;
      }
      default: {
        return <div>404</div>;
      }
    }
  };

  render() {
    const { match: { path } } = this.props;
    const dark = path === '/' || path === '/about';

    return (
      <div style={{ backgroundColor: '#fff' }}>
        <Nav dark={dark} location={this.props.match.path.substr(1)} />
        {this.renderPage()}
      </div>
    );
  }
}

export default Pages;
