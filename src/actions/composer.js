export const toggleComposer = () => (dispatch, getState) => {
	const isOpen = getState().composer.isOpen
	dispatch({
		type: 'TOGGLE_COMPOSER_OPEN',
		isOpen: !isOpen
	})
}