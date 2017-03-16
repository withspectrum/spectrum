import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Wrapper } from '../Card/style';
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
import includes from 'lodash.includes';

class NuxJoinCard extends Component {
  unsubscribeFrequency = () => {
    this.props.dispatch(unsubscribeFrequency(this.props.activeFrequency));
  };

  subscribeFrequency = e => {
    this.props.dispatch(subscribeFrequency(e.target.id, false));
  };

  render() {
    const { user: { frequencies } } = this.props;
    const usersFrequencies = Object.keys(frequencies);

    return (
      <Wrapper static overflow={'visible'}>
        <Body>
          <Description emoji>👋</Description>
          <Title>Discover Frequencies</Title>
          <Description>
            Explore some of the communities on Spectrum and join the conversation.
          </Description>

          <Hscroll>
            {featured.map((freq, i) => {
              let freqIdString = `"${freq.id}"`;
              return (
                <FreqCard key={i}>
                  <div>
                    {/*}<img src={`${process.env.PUBLIC_URL}/${freq.image}`} />*/
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
