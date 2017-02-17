/*------------------------------------------------------------\*
*             

showModal
Takes a name and shows that modal. The name gets parsed in ModalRoot.js in order to determine which component to render

*
\*------------------------------------------------------------*/
export const showModal = (name) => (dispatch, getState) => {
	dispatch({
		type: 'SHOW_MODAL',
		modalType: name,
	})
}

export const hideModal = () => (dispatch, getState) => {
	dispatch({
		type: 'HIDE_MODAL'
	})
}

export default {
	showModal,
	hideModal
}