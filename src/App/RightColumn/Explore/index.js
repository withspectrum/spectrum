import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FlexCol } from '../../../shared/Globals';
import Icon from '../../../shared/Icons';
import { getFrequency, getFeaturedFrequencies } from '../../../db/frequencies';
import {
  unsubscribeFrequency,
  subscribeFrequency,
} from '../../../actions/frequencies';
import { GoopyThree } from '../../../Homepage/style';
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

const CURATED_FREQUENCIES = [
  { slug: 'tech-tea', communitySlug: 'spectrum' },
  { slug: 'journal', communitySlug: 'spectrum' },
  { slug: 'ooohours', communitySlug: 'spectrum' },
  { slug: 'show-n-tell', communitySlug: 'spectrum' },
  { slug: 'tools', communitySlug: 'spectrum' },
];

const SUPPORT_FREQUENCIES = [
  { slug: 'hugs-n-bugs', communitySlug: 'spectrum' },
  { slug: 'support', communitySlug: 'spectrum' },
  { slug: 'spectrum', communitySlug: 'spectrum' },
];

const DEVELOPER_FREQUENCIES = [
  { slug: 'programming', communitySlug: 'spectrum' },
  { slug: 'react', communitySlug: 'spectrum' },
  { slug: 'android', communitySlug: 'spectrum' },
  { slug: 'styled-components', communitySlug: 'spectrum' },
  { slug: 'lboc', communitySlug: 'spectrum' },
  { slug: 'developer-tea', communitySlug: 'specfm' },
  { slug: 'does-not-compute', communitySlug: 'specfm' },
  { slug: 'swift-unwrapped', communitySlug: 'specfm' },
  { slug: 'front-end', communitySlug: 'spectrum' },
];

const DESIGNER_FREQUENCIES = [
  { slug: 'design', communitySlug: 'spectrum' },
  { slug: 'design-details', communitySlug: 'specfm' },
  { slug: 'layout', communitySlug: 'spectrum' },
  { slug: 'breadtime', communitySlug: 'specfm' },
  { slug: 'design-inspiration', communitySlug: 'spectrum' },
  { slug: 'design-resources', communitySlug: 'spectrum' },
  { slug: 'figma', communitySlug: 'spectrum' },
  { slug: 'framer', communitySlug: 'spectrum' },
  { slug: 'vr', communitySlug: 'spectrum' },
  { slug: 'design-systems', communitySlug: 'spectrum' },
  { slug: 'typography', communitySlug: 'spectrum' },
  { slug: 'inspect', communitySlug: 'spectrum' },
];

const AFTER_HOUR_FREQUENCIES = [
  { slug: 'gaming', communitySlug: 'spectrum' },
  { slug: 'music', communitySlug: 'spectrum' },
  { slug: 'coffee', communitySlug: 'spectrum' },
  { slug: 'bbq', communitySlug: 'spectrum' },
  { slug: 'pokemon', communitySlug: 'spectrum' },
  { slug: 'star-wars', communitySlug: 'spectrum' },
  { slug: 'travel', communitySlug: 'spectrum' },
];

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

  subscribeFrequency = (frequencyId, communityId) => {
    this.props.dispatch(
      subscribeFrequency(
        {
          frequencyId,
          communityId,
        },
        false,
      ),
    );
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

    Promise.all(CURATED_FREQUENCIES.map(getFrequency))
      .then(data => {
        this.setState({
          curatedFrequencies: data.filter(freq => freq),
        });
      })
      .catch(err => {
        console.log(err);
      });

    Promise.all(SUPPORT_FREQUENCIES.map(getFrequency))
      .then(data => {
        this.setState({
          supportFrequencies: data.filter(freq => freq),
        });
      })
      .catch(err => {
        console.log(err);
      });

    Promise.all(DEVELOPER_FREQUENCIES.map(getFrequency))
      .then(data => {
        this.setState({
          developerFrequencies: data.filter(freq => freq),
        });
      })
      .catch(err => {
        console.log(err);
      });

    Promise.all(DESIGNER_FREQUENCIES.map(getFrequency))
      .then(data => {
        this.setState({
          designerFrequencies: data.filter(freq => freq),
        });
      })
      .catch(err => {
        console.log(err);
      });

    Promise.all(AFTER_HOUR_FREQUENCIES.map(getFrequency))
      .then(data => {
        this.setState({
          afterHoursFrequencies: data.filter(freq => freq),
        });
      })
      .catch(err => {
        console.log(err);
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
            <Row>
              {this.state.allFrequencies &&
                this.state.allFrequencies.map((freq, i) => {
                  return (
                    <Item key={i} active={frequencies[freq.id]}>
                      <FlexCol>
                        <ItemTitle>
                          ~{freq.name}
                        </ItemTitle>
                        <ItemMeta>
                          {Object.keys(freq.users).length} followers
                        </ItemMeta>
                        <ItemCopy>{freq.description}</ItemCopy>
                      </FlexCol>
                      {frequencies[freq.id]
                        ? <ButtonContainer>
                            <Icon
                              icon="checked"
                              color="success.default"
                              static
                            />
                            <ItemButton active>
                              Subscribed!
                            </ItemButton>
                          </ButtonContainer>
                        : <ButtonContainer>
                            <ItemButton
                              id={freq.slug}
                              onClick={() =>
                                this.subscribeFrequency(
                                  freq.id,
                                  freq.communityId,
                                )}
                            >
                              Follow
                            </ItemButton>
                          </ButtonContainer>}
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
                  const { communitySlug } = CURATED_FREQUENCIES.find(
                    curated => curated.slug === freq.slug,
                  );
                  return (
                    <Item key={i} active={frequencies[freq.id]}>
                      <FlexCol>
                        <ItemTitle>
                          <Link to={`/${communitySlug}/~${freq.slug}`}>
                            ~{freq.name}
                          </Link>
                        </ItemTitle>
                        <ItemMeta>
                          {Object.keys(freq.users).length} followers
                        </ItemMeta>
                        <ItemCopy>{freq.description}</ItemCopy>
                      </FlexCol>
                      {frequencies[freq.id]
                        ? <ButtonContainer>
                            <Icon
                              icon="checked"
                              color="success.default"
                              static
                            />
                            <Link to={`/${communitySlug}/~${freq.slug}`}>
                              <ItemButton active>
                                Go to {`~${freq.slug}`}
                              </ItemButton>
                            </Link>
                          </ButtonContainer>
                        : <ButtonContainer>
                            <ItemButton
                              id={freq.slug}
                              onClick={() =>
                                this.subscribeFrequency(
                                  freq.id,
                                  freq.communityId,
                                )}
                            >
                              Follow
                            </ItemButton>
                          </ButtonContainer>}
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
                  const { communitySlug } = DEVELOPER_FREQUENCIES.find(
                    curated => curated.slug === freq.slug,
                  );
                  return (
                    <Item key={i} active={frequencies[freq.id]}>
                      <FlexCol>
                        <ItemTitle>
                          <Link to={`/${communitySlug}/~${freq.slug}`}>
                            ~{freq.name}
                          </Link>
                        </ItemTitle>
                        <ItemMeta>
                          {Object.keys(freq.users).length} followers
                        </ItemMeta>
                        <ItemCopy>{freq.description}</ItemCopy>
                      </FlexCol>
                      {frequencies[freq.id]
                        ? <ButtonContainer>
                            <Icon
                              icon="checked"
                              color="success.default"
                              static
                            />
                            <Link to={`/${communitySlug}/~${freq.slug}`}>
                              <ItemButton active>
                                Go to {`~${freq.slug}`}
                              </ItemButton>
                            </Link>
                          </ButtonContainer>
                        : <ButtonContainer>
                            <ItemButton
                              id={freq.slug}
                              onClick={() =>
                                this.subscribeFrequency(
                                  freq.id,
                                  freq.communityId,
                                )}
                            >
                              Follow
                            </ItemButton>
                          </ButtonContainer>}
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
                  const { communitySlug } = DESIGNER_FREQUENCIES.find(
                    curated => curated.slug === freq.slug,
                  );
                  return (
                    <Item key={i} active={frequencies[freq.id]}>
                      <FlexCol>
                        <ItemTitle>
                          <Link to={`/${communitySlug}/~${freq.slug}`}>
                            ~{freq.name}
                          </Link>
                        </ItemTitle>
                        <ItemMeta>
                          {Object.keys(freq.users).length} followers
                        </ItemMeta>
                        <ItemCopy>{freq.description}</ItemCopy>
                      </FlexCol>
                      {frequencies[freq.id]
                        ? <ButtonContainer>
                            <Icon
                              icon="checked"
                              color="success.default"
                              static
                            />
                            <Link to={`/${communitySlug}/~${freq.slug}`}>
                              <ItemButton active>
                                Go to {`~${freq.slug}`}
                              </ItemButton>
                            </Link>
                          </ButtonContainer>
                        : <ButtonContainer>
                            <ItemButton
                              id={freq.slug}
                              onClick={() =>
                                this.subscribeFrequency(
                                  freq.id,
                                  freq.communityId,
                                )}
                            >
                              Follow
                            </ItemButton>
                          </ButtonContainer>}
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
              {this.state.afterHoursFrequencies &&
                this.state.afterHoursFrequencies.map((freq, i) => {
                  const { communitySlug } = AFTER_HOUR_FREQUENCIES.find(
                    curated => curated.slug === freq.slug,
                  );
                  return (
                    <Item key={i} active={frequencies[freq.id]}>
                      <FlexCol>
                        <ItemTitle>
                          <Link to={`/${communitySlug}/~${freq.slug}`}>
                            ~{freq.name}
                          </Link>
                        </ItemTitle>
                        <ItemMeta>
                          {Object.keys(freq.users).length} followers
                        </ItemMeta>
                        <ItemCopy>{freq.description}</ItemCopy>
                      </FlexCol>
                      {frequencies[freq.id]
                        ? <ButtonContainer>
                            <Icon
                              icon="checked"
                              color="success.default"
                              static
                            />
                            <Link to={`/${communitySlug}/~${freq.slug}`}>
                              <ItemButton active>
                                Go to {`~${freq.slug}`}
                              </ItemButton>
                            </Link>
                          </ButtonContainer>
                        : <ButtonContainer>
                            <ItemButton
                              id={freq.slug}
                              onClick={() =>
                                this.subscribeFrequency(
                                  freq.id,
                                  freq.communityId,
                                )}
                            >
                              Follow
                            </ItemButton>
                          </ButtonContainer>}
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
                  const { communitySlug } = SUPPORT_FREQUENCIES.find(
                    curated => curated.slug === freq.slug,
                  );
                  return (
                    <Item key={i} active={frequencies[freq.id]}>
                      <FlexCol>
                        <ItemTitle>
                          <Link to={`/${communitySlug}/~${freq.slug}`}>
                            ~{freq.name}
                          </Link>
                        </ItemTitle>
                        <ItemMeta>
                          {Object.keys(freq.users).length} followers
                        </ItemMeta>
                        <ItemCopy>{freq.description}</ItemCopy>
                      </FlexCol>
                      {frequencies[freq.id]
                        ? <ButtonContainer>
                            <Icon
                              icon="checked"
                              color="success.default"
                              static
                            />
                            <Link to={`/${communitySlug}/~${freq.slug}`}>
                              <ItemButton active>
                                Go to {`~${freq.slug}`}
                              </ItemButton>
                            </Link>
                          </ButtonContainer>
                        : <ButtonContainer>
                            <ItemButton
                              id={freq.slug}
                              onClick={() =>
                                this.subscribeFrequency(
                                  freq.id,
                                  freq.communityId,
                                )}
                            >
                              Follow
                            </ItemButton>
                          </ButtonContainer>}
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
