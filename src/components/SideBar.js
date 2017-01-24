import React, { Component } from 'react';
import Login from './Login';
import * as firebase from 'firebase';
import TagButton from './TagButton';

class SideBar extends Component{
  constructor(props){
    super(props);
    this.state = {
      tags: []
    }
  }
  componentDidMount(){
    let postRef = firebase.database().ref('tags');
    let that = this;
    postRef.on('value', function(snapshot){
      that.setState({ tags: snapshot.val() });
    })
  }
  setCurrentUser(user){
    this.props.setCurrentUser(user);
  }
  selectTag(tag){
    console.log(tag);
    this.props.selectTag(tag);
  }
  renderTags(){
    let that = this;
    return this.state.tags.map(function(tag){
      return (<TagButton key={tag} name={tag} clickHandler={that.selectTag.bind(that, tag)} />);
    });
  }
	render() {
    let that = this;
		return (
	    	<div className="col-4 min-x8 bg-primary">
	    		<div className="flex y10 justify-center items-center">
		    		<img src="/img/logo-mark.png" className="x3 y3" role="presentation"/>
	    		</div>
	    		<div className="flex y10 justify-center items-center flex-column">
            { that.props.currentUser ? this.renderTags() : <Login setUser={that.setCurrentUser.bind(that)} currentUser={that.props.currentUser} /> }
          </div>
	    	</div>
	  );
	}
}

export default SideBar;
