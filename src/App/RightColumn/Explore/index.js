import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from '../../../shared/Icons';
import { IconButton, Button, FlexCol, FlexRow } from '../../../shared/Globals';
import { getFeaturedFrequencies } from '../../../db/frequencies';
import { truncate } from '../../../helpers/utils';
import {
  unsubscribeFrequency,
  subscribeFrequency,
} from '../../../actions/frequencies';
import {
  Wrapper,
  ViewTitle,
  ViewSubtitle,
  FeaturedSection,
  FeaturedRow,
  FeaturedItem,
  FeaturedItemImage,
  FeaturedItemMeta,
  FeaturedItemTitle,
  FeaturedItemCopy,
  SecondaryRow,
  SecondaryItem,
  SectionTitle,
  ChartSection,
  ChartRow,
  Chart,
  ScrollBody,
  ScrollBodyX,
  Rank,
} from './style';

class Explore extends Component {
  state = {
    allFrequencies: null,
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
  };

  render() {
    const { user: { frequencies } } = this.props;

    return (
      <Wrapper>
        <ScrollBody>
          <ViewTitle>Explore</ViewTitle>
          <ViewSubtitle>Let's find you some cool stuff!</ViewSubtitle>
          <FeaturedSection>
            <SectionTitle>
              Check out some of our favorite Frequencies...
            </SectionTitle>
            <FeaturedRow>
              <FeaturedItem>
                <FeaturedItemImage src="/img/react.png" />
                <FeaturedItemMeta>
                  <FlexRow spread>
                    <FeaturedItemTitle>~React</FeaturedItemTitle>
                    <IconButton>
                      <Icon
                        icon="subscribe"
                        tipText="Subscribe to ~React"
                        tipLocation="left"
                      />
                    </IconButton>
                  </FlexRow>
                  <FeaturedItemCopy>
                    Ever want to learn about the hot new JavaScript framework?
                  </FeaturedItemCopy>
                </FeaturedItemMeta>
              </FeaturedItem>
              <FeaturedItem>
                <FeaturedItemImage src="/img/spec.png" />
                <FeaturedItemMeta>
                  <FlexRow spread>
                    <FeaturedItemTitle>~SpecFM</FeaturedItemTitle>
                    <IconButton>
                      <Icon
                        icon="subscribe"
                        tipText="Subscribe to ~SpecFM"
                        tipLocation="left"
                      />
                    </IconButton>
                  </FlexRow>
                  <FeaturedItemCopy>
                    The podcast network that started all of this nonsense...
                  </FeaturedItemCopy>
                </FeaturedItemMeta>
              </FeaturedItem>
              <FeaturedItem>
                <FeaturedItemImage src="/img/music.png" />
                <FeaturedItemMeta>
                  <FlexRow spread>
                    <FeaturedItemTitle>~Music</FeaturedItemTitle>
                    <IconButton>
                      <Icon
                        icon="subscribe"
                        tipText="Subscribe to ~Music"
                        tipLocation="left"
                      />
                    </IconButton>
                  </FlexRow>
                  <FeaturedItemCopy>
                    A great place to discuss the music you're vibin' to...
                  </FeaturedItemCopy>
                </FeaturedItemMeta>
              </FeaturedItem>
              <FeaturedItem>
                <FeaturedItemImage src="/img/music.png" />
                <FeaturedItemMeta>
                  <FlexRow spread>
                    <FeaturedItemTitle>~Music</FeaturedItemTitle>
                    <IconButton>
                      <Icon
                        icon="subscribe"
                        tipText="Subscribe to ~Music"
                        tipLocation="left"
                      />
                    </IconButton>
                  </FlexRow>
                  <FeaturedItemCopy>
                    A great place to discuss the music you're vibin' to...
                  </FeaturedItemCopy>
                </FeaturedItemMeta>
              </FeaturedItem>
              <FeaturedItem>
                <FeaturedItemImage src="/img/music.png" />
                <FeaturedItemMeta>
                  <FlexRow spread>
                    <FeaturedItemTitle>~Music</FeaturedItemTitle>
                    <IconButton>
                      <Icon
                        icon="subscribe"
                        tipText="Subscribe to ~Music"
                        tipLocation="left"
                      />
                    </IconButton>
                  </FlexRow>
                  <FeaturedItemCopy>
                    A great place to discuss the music you're vibin' to...
                  </FeaturedItemCopy>
                </FeaturedItemMeta>
              </FeaturedItem>
              <FeaturedItem>
                <FeaturedItemImage src="/img/music.png" />
                <FeaturedItemMeta>
                  <FlexRow spread>
                    <FeaturedItemTitle>~Music</FeaturedItemTitle>
                    <IconButton>
                      <Icon
                        icon="subscribe"
                        tipText="Subscribe to ~Music"
                        tipLocation="left"
                      />
                    </IconButton>
                  </FlexRow>
                  <FeaturedItemCopy>
                    A great place to discuss the music you're vibin' to...
                  </FeaturedItemCopy>
                </FeaturedItemMeta>
              </FeaturedItem>
            </FeaturedRow>
          </FeaturedSection>
          <SecondaryRow>
            <ScrollBodyX
              onMouseDown={this.handleMouseDown}
              onMouseUp={this.handleMouseUp}
            >
              {this.state.allFrequencies &&
                this.state.allFrequencies.map((freq, i) => {
                  return (
                    <SecondaryItem key={i}>
                      <div>
                        <Link to={`/~${freq.slug}`}>{freq.name}</Link>
                        <h4>{Object.keys(freq.users).length} subscribers</h4>
                        <h4>{truncate(freq.description, 80)}</h4>
                      </div>
                      <div>
                        {frequencies[freq.id]
                          ? <Link to={`/~${freq.slug}`}>
                              <Button disabled width={'100%'}>
                                Joined!
                              </Button>
                            </Link>
                          : <Button
                              id={freq.slug}
                              onClick={this.subscribeFrequency}
                              width={'100%'}
                            >
                              Join
                            </Button>}
                      </div>
                    </SecondaryItem>
                  );
                })}
            </ScrollBodyX>
          </SecondaryRow>
          <ChartSection>
            <Chart>
              <SectionTitle>Latest</SectionTitle>
              <ScrollBody>
                <ChartRow>
                  <Rank>1</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>2</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>3</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>4</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>5</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>6</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>7</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>8</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>9</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>10</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>11</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>12</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>13</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>14</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>15</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>2 hours ago</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
              </ScrollBody>
            </Chart>
            <Chart>
              <SectionTitle>Most Popular</SectionTitle>
              <ScrollBody>
                <ChartRow>
                  <Rank>1</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>2</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>3</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>4</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>5</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>6</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>7</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>8</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>9</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>10</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>11</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>12</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>13</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>14</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
                <ChartRow>
                  <Rank>15</Rank>
                  <FlexCol>
                    <h1>~Spectrum</h1>
                    <h3>1,400 users</h3>
                  </FlexCol>
                  <Button>Join</Button>
                </ChartRow>
              </ScrollBody>
            </Chart>
          </ChartSection>
        </ScrollBody>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Explore);
