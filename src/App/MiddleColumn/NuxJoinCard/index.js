import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router-dom';
import Card from '../../../shared/Card';
import { Button } from '../../../shared/Globals';
import { featured } from '../../../helpers/featuredFrequencies';
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
    featured: [],
    scrollPos: null,
  };

  unsubscribeFrequency = () => {
    this.props.dispatch(unsubscribeFrequency(this.props.activeFrequency));
  };

  subscribeFrequency = e => {
    e.preventDefault();
    this.props.dispatch(subscribeFrequency(e.target.id, false));
  };

  componentWillMount = () => {
    const { user: { frequencies } } = this.props;
    let featuredArr = this.state.featured.slice();

    // show the unjoined featured frequencies first
    featured.forEach((freq, i) => {
      if (frequencies[freq.id]) {
        featuredArr.push(freq);
      } else {
        featuredArr.unshift(freq);
      }
    });

    this.setState({
      featured: featuredArr,
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
    const { user: { frequencies } } = this.props;

    return (
      <Card still overflow="visible">
        <Body>
          <Description emoji>✨</Description>
          <Title>Discover Frequencies</Title>
          <Description>
            Explore some of our favorite communities on Spectrum. And then join them. For fun's sake.
          </Description>

          <Hscroll innerRef={comp => this.hscroll = comp}>
            {this.state.featured.length > 0 &&
              this.state.featured.map((freq, i) => {
                return (
                  <FreqCard key={i}>
                    <div>
                      {/*<img src={`${process.env.PUBLIC_URL}/${freq.image}`} />*/
                      }
                      <h3>{freq.title}</h3>
                      <h4>{freq.description}</h4>
                    </div>
                    <Actions>
                      {frequencies[freq.id]
                        ? <Link to={`/~${freq.slug}`}>
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
  };
};

export default connect(mapStateToProps)(NuxJoinCard);
