import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setFrequencies, addFrequency } from '../../../actions/frequencies'
import { Column, Avatar, UserHeader, UserMeta, Name, Username, TopicSearch } from './style';
import { AvatarMask } from './svg';
import Login from '../Login';

class NavBar extends Component{
  constructor() {
    super()

    this.state = {
      frequencyName: ''
    }
  }

  componentWillMount(){
    this.props.dispatch(setFrequencies())
  }

  updateFrequencyName = (e) => {
    this.setState({
      frequencyName: e.target.value
    })
  }

  addFrequency = (e) => {
    e.preventDefault()
    this.props.dispatch(addFrequency(this.state.frequencyName))
    this.setState({
      frequencyName: ''
    })
  }

  render() {

    /**
      Firebase returns frequencies as a bunch of nested objects. In order to have better control over
      iterative rendering (i.e. using .map()) we need to get these frequencies into an array.
    */
    let frequencies = this.props.frequencies.frequencies
    let frequenciesToRender = []
    for (let key in frequencies) {
      if (!frequencies.hasOwnProperty(key)) continue;

      let arr = frequencies[key];
      frequenciesToRender.push(arr)
    }

    return(
      <Column>
        <AvatarMask />
        <UserHeader>
          {/* <Avatar src="./img/avatar.jpg" title="Bryn Jackson"></Avatar>
          <UserMeta>
            <Name>Bryn Jackson</Name>
            <Username>@uberbryn</Username>
          </UserMeta> */}
          <div className="flex y10 justify-center items-center flex-column">
            { this.props.user.uid
              ? <p>Logged in Wuddup</p>
              : <Login />
            }
          </div>
        </UserHeader>
        <TopicSearch type='text' placeholder='Search'></TopicSearch>

        <form onSubmit={this.addFrequency}>
          <div>
            <input type="text" onChange={this.updateFrequencyName} value={this.state.frequencyName} placeholder="New Frequency Name..." />            
          </div>
          <button type="submit">Submit</button>
        </form>

        <ul>
          { frequenciesToRender.length > 0 &&
            frequenciesToRender.map((frequency, i) => {
              return <li key={i}>{ frequency.name }</li>
            }) 
          }
        </ul>
      </Column>
    )
  }
};

const mapStateToProps = (state) => ({
  user: state.user,
  frequencies: state.frequencies
})

export default connect(mapStateToProps)(NavBar)