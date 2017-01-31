import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStory } from '../../../actions/stories'
import { ComposerContainer, Input, Submit, Textarea, Media, MediaInput, MediaLabel, MediaWrapper, Alert } from './style'

class Composer extends Component {
  constructor() {
    super()
    this.state = {
      title: '',
      description: '',
      media: null,
      error: null,
      file: ''
    }
  }

  changeTitle = (e) => {
    this.setState({
      title: e.target.value,
      error: null
    });
  }

  changeDescription = (e) => {
    this.setState({
      description: e.target.value,
      error: null
    });
  }

	createStory = (e) => {
    e.preventDefault();
    let description = this.state.description
    let title = this.state.title
    let file = this.state.file
    if (title && description) {
	    this.props.dispatch(createStory(title, description, file))
	    this.setState({
	      title: '',
	      description: '',
	      media: '',
	      file: ''
	    })
	  } else {
	  	this.setState({
	  		error: "Be sure to add a title and description!"
	  	})
	  }
  }

  removeMedia = () => {
  	this.setState({
  		media: null
  	})
  }

  uploadMediaLocally = (e) => {
  	let input = e.target;
    let reader = new FileReader();
    let file = e.target.files[0]
    reader.onload = () => {
      let dataURL = reader.result;
      this.setState({
	  		media: dataURL,
	  		file: file
	  	})
    };

    reader.readAsDataURL(input.files[0]);
  }

	render() {
		return (
			<ComposerContainer isOpen={true}>
				{ this.props.frequencies.active && 
	        <form onSubmit={ this.createStory } encType="multipart/form-data">
	          <Input placeholder="Title..." value={this.state.title} onChange={this.changeTitle} />
	          <Textarea placeholder="Description..." value={this.state.description} onChange={this.changeDescription}></Textarea>
	          
	          { this.state.media && 
	          	<MediaWrapper>
		          	<Media src={this.state.media} onClick={this.removeMedia} /> 
		          </MediaWrapper>
	          }

	          { !this.state.media &&
	          	<div>
		          	<MediaInput ref="media" type="file" id="file" name="file" accept=".png, .jpg, .jpeg, .gif" onChange={this.uploadMediaLocally} />
								<MediaLabel htmlFor="file">Add Image</MediaLabel>
							</div>
						}

	          <Submit type="submit"/>

	          { this.state.error &&
	          	<Alert>{this.state.error}</Alert>
	          }
	        </form>     
	      }
	    </ComposerContainer>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    frequencies: state.frequencies
  }
}

export default connect(mapStateToProps)(Composer);