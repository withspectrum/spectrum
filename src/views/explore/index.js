// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import generateMetaInfo from 'shared/generate-meta-info';
import Head from 'src/components/head';
import Search from './components/search';
import CommunitySearchWrapper from './components/communitySearchWrapper';
import { Charts } from './view';
import { ErrorBoundary } from 'src/components/error';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { ViewGrid } from 'src/components/layout';
import { setTitlebarProps } from 'src/actions/titlebar';

type Props = {
  currentUser?: Object,
  dispatch: Function,
};

class Explore extends React.Component<Props> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setTitlebarProps({ title: 'Explore' }));
  }

  render() {
    const { title, description } = generateMetaInfo({
      type: 'explore',
    });

    // previous features include: Vectors, Frontend Cafe, Abstract, Work in Progress, Mental Health
    // const featureSlug = 'crypto';
    // const featureNotes = `Crypto is a place to discuss crypto-currencies and tokens. As blockchain technology becomes more and more mainstream, communities like Crypto allow more people to get involved, learn, and share what they know. We're all for that, so if you're an existing investor, a newcomer to crypto-currencies, or just interested in learning about blockchain, check out Crypto!`;

    return (
      <React.Fragment>
        <Head title={title} description={description} />
        <ViewGrid data-cy="explore-page">
          <ErrorBoundary>
            <CommunitySearchWrapper
              currentUser={this.props.currentUser}
              redirectPath={window.location}
            >
              <Search />
            </CommunitySearchWrapper>
          </ErrorBoundary>

          <ErrorBoundary>
            <Charts />
          </ErrorBoundary>
        </ViewGrid>
      </React.Fragment>
    );
  }
}

export default compose(
  withCurrentUser,
  connect()
)(Explore);
