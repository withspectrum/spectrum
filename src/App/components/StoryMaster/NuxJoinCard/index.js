import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Wrapper } from '../../Card/style';
import { Button } from '../../../../shared/Globals';
import { featured } from '../../../../helpers/featuredFrequencies';
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
} from '../../../../actions/frequencies';
import includes from 'lodash.includes';

class NuxJoinCard extends Component {
  state = {
    featured: [],
  };

  unsubscribeFrequency = () => {
    this.props.dispatch(unsubscribeFrequency(this.props.activeFrequency));
  };

  subscribeFrequency = e => {
    this.props.dispatch(subscribeFrequency(e.target.id, false));
  };

  componentWillMount = () => {
    const { user: { frequencies } } = this.props;
    const usersFrequencies = Object.keys(frequencies);

    // show the unjoined featured frequencies first
    featured.map((freq, i) => {
      if (includes(usersFrequencies, freq.id)) {
        this.state.featured.push(freq);
      } else {
        this.state.featured.unshift(freq);
      }
    });
  };

  render() {
    const { user: { frequencies } } = this.props;
    const usersFrequencies = Object.keys(frequencies);

    return (
      <Wrapper static overflow={'visible'}>
        <Body>
          <Description emoji>✨</Description>
          <Title>Discover Frequencies</Title>
          <Description>
            Explore some of our favorite communities on Spectrum. And then join them. For fun's sake.
          </Description>

          <Hscroll>
            {this.state.featured.map((freq, i) => {
              let freqIdString = `"${freq.id}"`;
              return (
                <FreqCard key={i}>
                  <div>
                    {/*<img src={`${process.env.PUBLIC_URL}/${freq.image}`} />*/
                    }
                    <h3>{freq.title}</h3>
                    <h4>{freq.description}</h4>
                  </div>
                  <Actions>
                    {includes(usersFrequencies, freq.id)
                      ? <Link to={`/~${freq.slug}`}>
                          <JoinedButton id={freq.slug} width={'100%'}>
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
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(NuxJoinCard);
