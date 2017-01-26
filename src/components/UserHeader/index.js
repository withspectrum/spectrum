import React, { Component } from 'react';
import { Wrapper, Avatar40, UserMeta, Name, PostMeta } from './style';


export default class UserHeader extends Component {
	render() {
		return(
			<Wrapper>
			  <Avatar40 src="./img/avatar.jpg" title="Bryn Jackson" />
			  <UserMeta>
			    <Name>Bryn Jackson</Name>
			    <PostMeta>Just now • No messages yet</PostMeta>
			  </UserMeta>
			</Wrapper>
		)
	}

}