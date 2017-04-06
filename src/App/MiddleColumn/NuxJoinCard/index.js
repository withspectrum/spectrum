import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '../../../shared/Card';
import { Button } from '../../../shared/Globals';
import { truncate } from '../../../helpers/utils';
import { getFeaturedFrequencies } from '../../../db/frequencies';
import {
  Body,
  Title,
  Description,
  Hscroll,
  FreqCard,
  RightPadding,
  Actions,
  JoinedButton,
} from './style';
import {
  unsubscribeFrequency,
  subscribeFrequency,
} from '../../../actions/frequencies';

class NuxJoinCard extends Component {
  state = {
    allFrequencies: null,
    scrollPos: null,
  };

  unsubscribeFrequency = () => {
    this.props.dispatch(unsubscribeFrequency(this.props.activeFrequency));
  };

  subscribeFrequency = e => {
    e.preventDefault();
    this.props.dispatch(subscribeFrequency(e.target.id, false));
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

  componentDidUpdate = () => {
    const node = this.hscroll;
    node.scrollLeft = this.state.scrollPos;

    let x, left, down;
    node.addEventListener('mousemove', e => {
      if (down) {
        let newX = e.pageX;
        node.scrollLeft = left - newX + x;
      }
    });

    node.addEventListener('mousedown', e => {
      e.preventDefault();

      if (e.target.id) {
        this.subscribeFrequency(e);
      }

      down = true;
      x = e.pageX;
      left = node.scrollLeft;
    });

    node.addEventListener('mouseup', e => {
      down = false;

      if (e.target.id) {
        this.setState({
          scrollPos: left - e.pageX + x,
        });
      }
    });

    node.addEventListener('mouseleave', e => {
      down = false;
    });
  };

  render() {
    const { user: { frequencies }, communities } = this.props;

    return (
      <Card still overflow="visible">
        <Body>
          <Description emoji>✨</Description>
          <Title>Discover Frequencies</Title>
          <Description>
            Explore some of our favorite communities on Spectrum. And then join them. For fun's sake.
          </Description>

          <Hscroll innerRef={comp => this.hscroll = comp}>
            {this.state.allFrequencies &&
              this.state.allFrequencies.map((freq, i) => {
                const community = communities.find(
                  community => community.id === freq.community,
                );

                return (
                  <FreqCard key={i}>
                    <div>
                      {/*<img src={`${process.env.PUBLIC_URL}/${freq.image}`} />*/
                      }
                      <Link to={`/~${freq.slug}`}>{freq.name}</Link>
                      <h4>{Object.keys(freq.users).length} subscribers</h4>
                      <h4>{truncate(freq.description, 80)}</h4>
                    </div>
                    <Actions>
                      {frequencies[freq.id]
                        ? <Link to={`/${community.slug}/~${freq.slug}`}>
                            <JoinedButton width={'100%'}>
                              Joined!
                            </JoinedButton>
                          </Link>
                        : <Button
                            id={freq.slug}
                            onClick={this.subscribeFrequency}
                            width={'100%'}
                          >
                            Join
                          </Button>}
                    </Actions>
                  </FreqCard>
                );
              })}
            <RightPadding />
          </Hscroll>
        </Body>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    communities: state.communities.communities,
  };
};

export default connect(mapStateToProps)(NuxJoinCard);
