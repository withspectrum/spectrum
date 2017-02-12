export const showGallery = (media) => (dispatch, getState) => {
	dispatch({
		type: 'SHOW_GALLERY',
		isOpen: true,
		media: media // => should be array
	})
}

export const hideGallery = () => (dispatch, getState) => {
	dispatch({
		type: 'HIDE_GALLERY'
	})
}

export default {
	showGallery,
	hideGallery
}