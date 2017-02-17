/*------------------------------------------------------------\*
*

showModal
Takes a name and shows that modal. The name gets parsed in ModalRoot.js in order to determine which component to render

*
\*------------------------------------------------------------*/
export const showModal = (name) => ({
	type: 'SHOW_MODAL',
	modalType: name,
})

export const hideModal = () => ({
	type: 'HIDE_MODAL'
})

export default {
	showModal,
	hideModal
}
