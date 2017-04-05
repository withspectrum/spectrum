import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FlexCol } from '../../../shared/Globals';
import { getFrequency, getFeaturedFrequencies } from '../../../db/frequencies';
import {
  unsubscribeFrequency,
  subscribeFrequency,
} from '../../../actions/frequencies';
import {
  GoopyOne,
  GoopyTwo,
  GoopyThree,
  GoopyFour,
} from '../../../Homepage/style';
import {
  ViewContainer,
  ViewTitle,
  ViewSubtitle,
  Section,
  SectionTitle,
  SectionSubtitle,
  Row,
  Item,
  ItemTitle,
  ItemCopy,
  ItemMeta,
  ItemButton,
  ButtonContainer,
  ScrollBody,
  ViewHeader,
  Constellations,
} from './style';

class Explore extends Component {
  state = {
    allFrequencies: null,
    curatedFrequencies: null,
    supportFrequencies: null,
    developerFrequencies: null,
    designerFrequencies: null,
    afterHoursFrequencies: null,
  };

  unsubscribeFrequency = () => {
    this.props.dispatch(unsubscribeFrequency(this.props.activeFrequency));
  };

  subscribeFrequency = e => {
    e.preventDefault();
    this.props.dispatch(subscribeFrequency(e.target.id, false));
  };

  handleMouseDown = e => {
    if (e.target.id) {
      this.subscribeFrequency(e.target.id);
    }
  };

  handleMouseUp = e => {
    // if (e.target.id) { this.setState({scrollPos: left - e.pageX + x,}); }
  };

  componentDidMount = () => {
    const { user: { frequencies } } = this.props;

    getFeaturedFrequencies().then(data => {
      let sorted = Object.keys(data).map(id => data[id]);

      const allFreqs = sorted.sort((a, b) => {
        let isMemberA = frequencies[a.id] ? true : false;
        let isMemberB = frequencies[b.id] ? true : false;
        return isMemberA > isMemberB ? 1 : -1;
      });

      this.setState({
        allFrequencies: allFreqs,
      });
    });

    const curatedFrequencyKeys = [
      'tech-tea',
      'journal',
      'ooohours',
      'show-n-tell',
      'tools',
    ];

    const getCuratedFrequencies = () => Promise.all(
      curatedFrequencyKeys.map(freq => {
        return getFrequency({ slug: freq }).then(freq => {
          return freq;
        });
      }),
    );

    getCuratedFrequencies().then(data => {
      this.setState({
        curatedFrequencies: data,
      });
    });

    const supportFreqList = ['hugs-n-bugs', 'support', 'spectrum'];

    const getSupportFrequencies = () => Promise.all(
      supportFreqList.map(freq => {
        return getFrequency({ slug: freq }).then(freq => {
          return freq;
        });
      }),
    );

    getSupportFrequencies().then(data => {
      this.setState({
        supportFrequencies: data,
      });
    });

    const developerFreqList = [
      'programming',
      'react',
      'android',
      'styled-components',
      'lboc',
      'developer-tea',
      'does-not-compute',
      'swift-unwrapped',
      'front-end',
    ];

    const getDeveloperFrequencies = () => Promise.all(
      developerFreqList.map(freq => {
        return getFrequency({ slug: freq }).then(freq => {
          return freq;
        });
      }),
    );

    getDeveloperFrequencies().then(data => {
      this.setState({
        developerFrequencies: data,
      });
    });

    const designerFreqList = [
      'design',
      'design-details',
      'layout',
      'breadtime',
      'design-inspiration',
      'design-resources',
      'figma',
      'framer',
      'vr',
      'design-systems',
      'typography',
      'inspect',
    ];

    const getDesignerFrequencies = () => Promise.all(
      designerFreqList.map(freq => {
        return getFrequency({ slug: freq }).then(freq => {
          return freq;
        });
      }),
    );

    getDesignerFrequencies().then(data => {
      this.setState({
        designerFrequencies: data,
      });
    });

    const afterHoursFreqList = [
      'gaming',
      'music',
      'coffee',
      'bbq',
      'pokemon',
      'star-wars',
      'travel',
    ];

    const getAfterHoursFrequencies = () => Promise.all(
      afterHoursFreqList.map(freq => {
        return getFrequency({ slug: freq }).then(freq => {
          return freq;
        });
      }),
    );

    getAfterHoursFrequencies().then(data => {
      this.setState({
        afterHoursFrequencies: data,
      });
    });
  };

  render() {
    const { user: { frequencies } } = this.props;

    return (
      <ViewContainer>
        <ScrollBody>
          <ViewHeader>
            <ViewTitle>Explore</ViewTitle>
            <ViewSubtitle>
              Discover more of what Spectrum has to offer!
            </ViewSubtitle>
            <Constellations />
            <GoopyThree />
          </ViewHeader>
          <Section>
            <SectionTitle>
              Best of beta
            </SectionTitle>
            <SectionSubtitle>
              The 30 most-popular pre-launch frequencies
            </SectionSubtitle>
            <Row
              onMouseDown={this.handleMouseDown}
              onMouseUp={this.handleMouseUp}
            >
              {this.state.allFrequencies &&
                this.state.allFrequencies.map((freq, i) => {
                  return (
                    <Item key={i} active={frequencies[freq.id]}>
                      <FlexCol>
                        <ItemTitle>
                          <Link to={`/~${freq.slug}`}>~{freq.name}</Link>
                        </ItemTitle>
                        <ItemMeta>
                          {Object.keys(freq.users).length} followers
                        </ItemMeta>
                        <ItemCopy>{freq.description}</ItemCopy>
                      </FlexCol>
                      <ButtonContainer>
                        {frequencies[freq.id]
                          ? <Link to={`/~${freq.slug}`}>
                              <ItemButton active>
                                Go to {`~${freq.slug}`}
                              </ItemButton>
                            </Link>
                          : <ItemButton
                              id={freq.slug}
                              onClick={this.subscribeFrequency}
                            >
                              Follow
                            </ItemButton>}
                      </ButtonContainer>
                    </Item>
                  );
                })}
            </Row>
          </Section>
          <Section>
            <SectionTitle>
              5 cool ways to use frequencies
            </SectionTitle>
            <SectionSubtitle>
              News, journaling, communities, show and tell, and recommendations...
            </SectionSubtitle>
            <Row>
              {this.state.curatedFrequencies &&
                this.state.curatedFrequencies.map((freq, i) => {
                  return (
                    <Item key={i} active={frequencies[freq.id]}>
                      <FlexCol>
                        <ItemTitle>
                          <Link to={`/~${freq.slug}`}>~{freq.name}</Link>
                        </ItemTitle>
                        <ItemMeta>
                          {Object.keys(freq.users).length} followers
                        </ItemMeta>
                        <ItemCopy>{freq.description}</ItemCopy>
                      </FlexCol>
                      <ButtonContainer>
                        {frequencies[freq.id]
                          ? <Link to={`/~${freq.slug}`}>
                              <ItemButton active>
                                Go to {`~${freq.slug}`}
                              </ItemButton>
                            </Link>
                          : <ItemButton
                              id={freq.slug}
                              onClick={this.subscribeFrequency}
                            >
                              Follow
                            </ItemButton>}
                      </ButtonContainer>
                    </Item>
                  );
                })}
            </Row>
          </Section>
          <Section>
            <SectionTitle>
              For developers
            </SectionTitle>
            <SectionSubtitle>
              Programming languages, hot frameworks, podcasts, blogs, and more...
            </SectionSubtitle>
            <Row>
              {this.state.developerFrequencies &&
                this.state.developerFrequencies.map((freq, i) => {
                  return (
                    <Item key={i} active={frequencies[freq.id]}>
                      <FlexCol>
                        <ItemTitle>
                          <Link to={`/~${freq.slug}`}>~{freq.name}</Link>
                        </ItemTitle>
                        <ItemMeta>
                          {Object.keys(freq.users).length} followers
                        </ItemMeta>
                        <ItemCopy>{freq.description}</ItemCopy>
                      </FlexCol>
                      <ButtonContainer>
                        {frequencies[freq.id]
                          ? <Link to={`/~${freq.slug}`}>
                              <ItemButton active>
                                Go to {`~${freq.slug}`}
                              </ItemButton>
                            </Link>
                          : <ItemButton
                              id={freq.slug}
                              onClick={this.subscribeFrequency}
                            >
                              Follow
                            </ItemButton>}
                      </ButtonContainer>
                    </Item>
                  );
                })}
            </Row>
          </Section>
          <Section>
            <SectionTitle>
              For designers
            </SectionTitle>
            <SectionSubtitle>
              Resources, inspiration, critique, podcasts, and more...
            </SectionSubtitle>
            <Row>
              {this.state.designerFrequencies &&
                this.state.designerFrequencies.map((freq, i) => {
                  return (
                    <Item key={i} active={frequencies[freq.id]}>
                      <FlexCol>
                        <ItemTitle>
                          <Link to={`/~${freq.slug}`}>~{freq.name}</Link>
                        </ItemTitle>
                        <ItemMeta>
                          {Object.keys(freq.users).length} followers
                        </ItemMeta>
                        <ItemCopy>{freq.description}</ItemCopy>
                      </FlexCol>
                      <ButtonContainer>
                        {frequencies[freq.id]
                          ? <Link to={`/~${freq.slug}`}>
                              <ItemButton active>
                                Go to {`~${freq.slug}`}
                              </ItemButton>
                            </Link>
                          : <ItemButton
                              id={freq.slug}
                              onClick={this.subscribeFrequency}
                            >
                              Follow
                            </ItemButton>}
                      </ButtonContainer>
                    </Item>
                  );
                })}
            </Row>
          </Section>
          <Section>
            <SectionTitle>
              Just for funsies
            </SectionTitle>
            <SectionSubtitle>
              Bond with the community over our favorite things to do after hours!
            </SectionSubtitle>
            <Row>
              {this.state.designerFrequencies &&
                this.state.designerFrequencies.map((freq, i) => {
                  return (
                    <Item key={i} active={frequencies[freq.id]}>
                      <FlexCol>
                        <ItemTitle>
                          <Link to={`/~${freq.slug}`}>~{freq.name}</Link>
                        </ItemTitle>
                        <ItemMeta>
                          {Object.keys(freq.users).length} followers
                        </ItemMeta>
                        <ItemCopy>{freq.description}</ItemCopy>
                      </FlexCol>
                      <ButtonContainer>
                        {frequencies[freq.id]
                          ? <Link to={`/~${freq.slug}`}>
                              <ItemButton active>
                                Go to {`~${freq.slug}`}
                              </ItemButton>
                            </Link>
                          : <ItemButton
                              id={freq.slug}
                              onClick={this.subscribeFrequency}
                            >
                              Follow
                            </ItemButton>}
                      </ButtonContainer>
                    </Item>
                  );
                })}
            </Row>
          </Section>
          <Section>
            <SectionTitle>
              Need help?
            </SectionTitle>
            <SectionSubtitle>
              We've got your back in our support frequencies...
            </SectionSubtitle>
            <Row>
              {this.state.supportFrequencies &&
                this.state.supportFrequencies.map((freq, i) => {
                  return (
                    <Item key={i} active={frequencies[freq.id]}>
                      <FlexCol>
                        <ItemTitle>
                          <Link to={`/~${freq.slug}`}>~{freq.name}</Link>
                        </ItemTitle>
                        <ItemMeta>
                          {Object.keys(freq.users).length} followers
                        </ItemMeta>
                        <ItemCopy>{freq.description}</ItemCopy>
                      </FlexCol>
                      <ButtonContainer>
                        {frequencies[freq.id]
                          ? <Link to={`/~${freq.slug}`}>
                              <ItemButton active>
                                Go to {`~${freq.slug}`}
                              </ItemButton>
                            </Link>
                          : <ItemButton
                              id={freq.slug}
                              onClick={this.subscribeFrequency}
                            >
                              Follow
                            </ItemButton>}
                      </ButtonContainer>
                    </Item>
                  );
                })}
            </Row>
          </Section>
        </ScrollBody>
      </ViewContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Explore);
