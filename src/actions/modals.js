export const showProModal = () => (dispatch, getState) => {
	dispatch({
		type: 'SHOW_MODAL',
		modalType: 'PRO_MODAL',
	})
}

export const hideModal = () => (dispatch, getState) => {
	dispatch({
		type: 'HIDE_MODAL'
	})
}

export default {
	showProModal,
	hideModal
}