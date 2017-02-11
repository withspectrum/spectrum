import React from 'react'
import Modal from 'react-modal'
import ModalContainer from '../ModalContainer'
import StripeCheckout from 'react-stripe-checkout'
import axios from 'axios'
import actions from '../../../actions'
import { connect } from 'react-redux'
import { ButtonPrimary } from '../../buttons'
import { modalStyles, Section, SectionAlert, Badge, Heading, Subheading, Padding } from './style'


class ProModal extends React.Component {
	constructor(props) {
		super(props)

		this.state = { isOpen: props.isOpen }
	}

	hideModal = () => {
		this.setState({
			isOpen: !this.state.isOpen
		})
		// setTimeout(() => { this.props.dispatch(actions.hideModal()) }, 300)
		this.props.dispatch(actions.hideModal())
	}

  onToken = (token) => {
    axios.post('http://localhost:3001/customer/create', {token: JSON.stringify(token)})
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

	render() {
		return (
			<Modal
			  isOpen={this.state.isOpen}
			  contentLabel="Edit Item"
			  onRequestClose={this.hideModal}
			  shouldCloseOnOverlayClick={true}
			  style={modalStyles}
			  closeTimeoutMS={330}>

			  <ModalContainer title={"Upgrade"} hideModal={this.hideModal}>
					<SectionAlert centered={true}>
						<Badge>Limited Time</Badge> 
						<Padding padding={"0.5rem 1rem"}>
							During beta, Pro subscriptions are just $5 per month ($10/mo after beta).
						</Padding>
					</SectionAlert>

					<Section centered={true}>
						<Padding padding={"1rem"}>
							<Heading>Save Stories</Heading>
							<Subheading>Save any stories to a private collection, making it easier to find the things that matter most.</Subheading>
						</Padding>
					</Section>

					<Section centered={true}>
						<Padding padding={"1rem"}>
							<Heading>Follow People</Heading>
							<Subheading>Get updates whenever someone important to you posts a new public story.</Subheading>
						</Padding>
					</Section>

					<Section centered={true}>
						<Padding padding={"1rem"}>
							<Heading>Show it Off</Heading>
							<Subheading>A new <em>Pro</em> badge will find itself attached to your name, wherever you go on Spectrum.</Subheading>
						</Padding>
					</Section>

					<Section centered={true}>
						<Padding padding={"1rem 1rem 2rem 1rem"}>
							<StripeCheckout
			          token={this.onToken}
			          stripeKey="pk_test_A6pKi4xXOdgg9FrZJ84NW9mP"
			          name="🔐 &nbsp; Pay Securely"
			          description="Secured and Encrypted by Stripe"
			          panelLabel="Subscribe for "
			          amount={500}
			          currency="USD">

				          <ButtonPrimary large>Upgrade to Pro</ButtonPrimary>
			        </StripeCheckout>
			      </Padding>
	        </Section>
	      </ModalContainer>
		  </Modal>
		)
	}
}

const mapStateToProps = (state) => ({
	isOpen: state.modals.isOpen	
})

export default connect(mapStateToProps)(ProModal)
