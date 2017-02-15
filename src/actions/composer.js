/*------------------------------------------------------------\*
*             

toggleComposer
Right now there isn't much state to manage on the composer, but we do store
an open/closed boolean in redux so that as a user navigates around, or refreshes the page,
we'll be able to persist the UI

*
\*------------------------------------------------------------*/
export const toggleComposer = () => (dispatch, getState) => {
	let isOpen = getState().composer.isOpen
	
	dispatch({
		type: 'TOGGLE_COMPOSER_OPEN',
		isOpen: !isOpen
	})
}

export default {
	toggleComposer
}