import React from 'react'
import styled, { withTheme } from 'styled-components'

const Svg = styled.svg`
	fill: ${props => props.stayActive ? `url(#${props.color}Gradient)` : props.theme.inactive };
	transition: all 0.2s ease-out;

	&:hover {
		fill: url(#${ props => props.color ? props.color : `brand` }Gradient);
		transform: scale(1.1);
		transition: all 0.2s ease-in;
		cursor: pointer;
	}
`;

const Defs = withTheme((props) => {
	return(
		<defs>
			<radialGradient id='warnGradient' fx="0%" fy="0%" r="100%" spreadMethod="pad">
				<stop offset="0%" stopColor={ props.theme.warn.alt } stopOpacity="1" />
				<stop offset="100%" stopColor={ props.theme.warn.default } stopOpacity="1" />
			</radialGradient>
			<radialGradient id='successGradient' fx="0%" fy="0%" r="100%" spreadMethod="pad">
				<stop offset="0%" stopColor={ props.theme.success.alt } stopOpacity="1" />
				<stop offset="100%" stopColor={ props.theme.success.default } stopOpacity="1" />
			</radialGradient>
			<radialGradient id='brandGradient' fx="0%" fy="0%" r="100%" spreadMethod="pad">
				<stop offset="0%" stopColor={ props.theme.brand.alt } stopOpacity="1" />
				<stop offset="100%" stopColor={ props.theme.brand.default } stopOpacity="1" />
			</radialGradient>
		</defs>
	)
})

export const Delete = (props) => {
	return(
		<Svg color={props.color} stayActive={ props.stayActive } viewBox="0 0 32 32" width="32" height="32" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" id="delete" aria-labelledby="title" xmlns="http://www.w3.org/2000/svg">
			<title id='title'>Delete</title>
			<Defs />
			<path d="M8.391 12.32c-.636-.131-1.248.368-1.213 1.016.808 14.714 1.271 14.711 7.681 14.669C15.22 28.003 15.6 28 16 28s.78.003 1.141.005c6.41.042 6.873.045 7.681-14.669.035-.648-.577-1.147-1.212-1.016a.975.975 0 0 0-.784.896c-.17 3.094-.323 5.51-.519 7.407-.266 2.584-.588 3.883-.95 4.566-.225.426-.422.586-1.067.701-.716.128-1.615.123-3.019.115h-.002a161.358 161.358 0 0 0-2.538 0h-.001c-1.405.008-2.304.013-3.02-.115-.645-.115-.842-.275-1.067-.701-.362-.683-.684-1.982-.95-4.566-.196-1.897-.349-4.313-.519-7.407a.975.975 0 0 0-.783-.896z"/>
			<path d="M6 10a1 1 0 0 1 1-1h18a1 1 0 0 1 0 2H7a1 1 0 0 1-1-1z" fillRule="nonzero"/>
			<path d="M12.25 7.973C12.112 8.185 12 8.5 12 9h-2c0-.81.186-1.525.576-2.121.366-.536.963-1.006 1.525-1.271C13.24 5.087 14.687 5 16 5c1.313 0 2.76.087 3.899.608.562.265 1.158.735 1.525 1.271C21.814 7.475 22 8.19 22 9h-2c0-.5-.112-.815-.25-1.027-.161-.272-.324-.388-.684-.546C18.36 7.103 17.306 7 16 7c-1.306 0-2.36.103-3.066.427-.36.158-.523.274-.684.546z"/>
			<path d="M12.044 14.086a1 1 0 1 1 1.998-.087l.349 7.992a1 1 0 0 1-1.998.087l-.349-7.992zM17.956 13.999a1 1 0 0 1 1.998.087l-.348 7.993a1 1 0 0 1-1.999-.088l.349-7.992z" fillRule="nonzero"/>
		</Svg>
	)
}

export const Flag = (props) => {
	return(
		<Svg color={props.color} stayActive={ props.stayActive } viewBox="0 0 32 32" width="32" height="32" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" id="flag" xmlns="http://www.w3.org/2000/svg" aria-labelledby="title">
			<title id='title'>Flag</title>
			<Defs />
			<path d="M10.953 5.034a1 1 0 0 0-1.225.707L4.034 26.992a1 1 0 1 0 1.932.517l5.694-21.25a1 1 0 0 0-.707-1.225zm2.107 9.005c.425-1.703.798-3.036 1.225-4.079.429-1.058.766-1.43.912-1.532a.216.216 0 0 0 .022-.023l.017.003c.131-.022.133-.021.353.073l.065.028c.584.23 1.492.826 2.826 2.076 1.584 1.462 3.173 2.338 4.36 2.738a9.906 9.906 0 0 0 2.045.4c-.312 1.161-.627 2.297-1.028 3.334-.405 1.061-.756 1.774-1.284 2.307-.385.41-.719.542-1.131.527-.519-.018-1.447-.289-2.901-1.37-1.746-1.291-3.25-2.073-4.327-2.514a17.61 17.61 0 0 0-1.498-.524c.08-.375.193-.838.344-1.444zm12.104-1.615a.522.522 0 0 1 0 0zm-13.21 2.816l.017.008a.08.08 0 0 1-.017-.008zm-.834-1.685c1.727-6.93 3.174-9.634 8.727-4.43 2.833 2.655 4.933 2.646 6.14 2.641 1.16-.005 1.494-.007.86 2.359-1.294 4.83-3.053 10.796-9.5 6-2.638-1.962-4.392-2.486-5.449-2.801-1.526-.456-1.599-.478-.778-3.769z"/>
		</Svg>
	)
}

export const Like = (props) => {
	return(
		<Svg color={props.color} stayActive={ props.stayActive } viewBox="0 0 32 32" width="32" height="32" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" id="like" xmlns="http://www.w3.org/2000/svg" aria-labelledby="title">
			<title id='title'>Like</title>
			<Defs />
			<path d="M15.982 13.578l-1.414-1.414C12.876 10.473 11.364 10 10.232 10c-1.17 0-2.175.503-2.836 1.164-1.592 1.592-1.887 3.022-1.676 4.288.235 1.407 1.152 2.928 2.579 4.412 1.432 1.501 3.108 2.703 4.719 3.616.789.451 1.453.769 2.062 1.001.344.134.65.199.809.233l.093.02.092-.02c.159-.034.466-.099.81-.233.608-.232 1.273-.55 2.062-1.001 1.611-.913 3.287-2.115 4.719-3.616 1.427-1.484 2.344-3.005 2.578-4.412.211-1.266-.083-2.696-1.675-4.288A4.035 4.035 0 0 0 21.732 10c-1.132 0-2.644.473-4.336 2.164l-1.414 1.414zm0-2.828c4-4 8-3 10-1 8 8-7 17-10 17s-18-9-10-17c2-2 6-3 10 1z"/>
		</Svg>
	)
}

export const Liked = (props) => {
	return(
		<svg color={props.color} stayActive={ props.stayActive } viewBox="0 0 32 32" width="32" height="32" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" id="liked" xmlns="http://www.w3.org/2000/svg" aria-labelledby="title">
			<title id='title'>Liked</title>
			<Defs />
			<path d="M25.982 9.75c-2-2-6-3-10 1-4-4-8-3-10-1-8 8 7 17 10 17s18-9 10-17z" fillRule="nonzero"/>
		</svg>
	)
}

export const Lock = (props) => {
	return(
		<Svg color={props.color} stayActive={ props.stayActive } viewBox="0 0 32 32" width="32" height="32" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" id="lock" xmlns="http://www.w3.org/2000/svg" aria-labelledby="title">
			<title id='title'>Lock</title>
			<Defs />
			<path d="M19.196 6.238C18.44 6.041 17.479 5.999 16 6c-1.479-.001-2.44.041-3.195.238-.606.15-.826.343-.976.551-.208.291-.451.872-.613 2.111-.119.895-.178 1.972-.202 3.315C12.316 12.052 13.951 12 16 12s3.684.052 4.986.215c-.024-1.343-.083-2.42-.201-3.315-.162-1.239-.406-1.82-.614-2.111-.15-.208-.37-.401-.976-.551zm3.797 6.403C22.894 4.897 21.803 4 16.001 4s-6.893.897-6.992 8.641c-2.604.885-3.008 2.911-3.008 7.359 0 7 1 8 10 8s10-1 10-8c0-4.448-.404-6.474-3.008-7.359zm-5.992 8.092a2 2 0 1 0-2 0V22a1 1 0 0 0 2 0v-1.267z"/>
		</Svg>
	)
}

export const Unlock = (props) => {
	return(
		<Svg color={props.color} stayActive={ props.stayActive } viewBox="0 0 32 32" width="32" height="32" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" id="unlock" xmlns="http://www.w3.org/2000/svg" aria-labelledby="title">
			<title id='title'>Lock</title>
			<Defs />
			<path d="M16 5c1.479-.001 2.44.041 3.195.238.606.15.826.343.976.551.208.291.452.872.614 2.111.146 1.108.202 2.492.213 4.316C19.693 12.052 18.055 12 16 12c-9 0-10 1-10 8s1 8 10 8 10-1 10-8c0-4.444-.403-6.47-3-7.357C22.976 3.973 22.043 3 16 3c-5.168 0-6.599.712-6.919 6.342-.036.626.582 1.092 1.199.982a.957.957 0 0 0 .796-.88c.033-.571.078-1.082.14-1.544.162-1.239.405-1.82.613-2.111.15-.208.37-.401.976-.551C13.56 5.041 14.521 4.999 16 5zM8.251 16.222C8.046 17.134 7.999 18.295 8 20c-.001 1.705.046 2.866.251 3.778.173.795.41 1.111.64 1.299.283.231.836.499 2.045.679 1.248.19 2.85.244 5.064.244s3.816-.054 5.064-.244c1.209-.18 1.762-.448 2.044-.679.231-.188.468-.504.641-1.299.205-.912.251-2.073.251-3.778s-.046-2.866-.251-3.778c-.173-.795-.41-1.11-.641-1.299-.282-.231-.835-.499-2.044-.679C19.816 14.054 18.214 14 16 14s-3.816.054-5.064.244c-1.209.18-1.762.448-2.045.679-.23.189-.467.504-.64 1.299zM17 20.733a2 2 0 1 0-2 0V22a1 1 0 0 0 2 0v-1.267z"/>
		</Svg>
	)
}

export const NewPost = (props) => {
	return(
		<Svg color={props.color} stayActive={ props.stayActive } viewBox="0 0 32 32" width="32" height="32" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" id="newPost" xmlns="http://www.w3.org/2000/svg" aria-labelledby="title">
			<title id='title'>New Post</title>
			<Defs />
			<path d="M16 6c5.1 0 7.247.575 8.336 1.664C25.425 8.753 26 10.9 26 16s-.575 7.247-1.664 8.336C23.247 25.425 21.1 26 16 26s-7.247-.575-8.336-1.664C6.575 23.247 6 21.1 6 16s.575-7.247 1.664-8.336C8.753 6.575 10.9 6 16 6zm0-2c10 0 12 2 12 12s-2 12-12 12S4 26 4 16 6 4 16 4zm-1 8a1 1 0 0 1 2 0v3h3a1 1 0 0 1 0 2h-3v3a1 1 0 0 1-2 0v-3h-3a1 1 0 0 1 0-2h3v-3z"/>
		</Svg>
	)
}

export const ClosePost = (props) => {
	return(
		<Svg color={props.color} stayActive={ props.stayActive } viewBox="0 0 32 32" width="32" height="32" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" id="closePost" xmlns="http://www.w3.org/2000/svg" aria-labelledby="title">
			<title id='title'>Close Post</title>
			<Defs />
			<path id="closePost" d="M16,5.986c5.1,0 7.247,0.575 8.336,1.664c1.089,1.089 1.664,3.236 1.664,8.336c0,5.1 -0.575,7.247 -1.664,8.336c-1.089,1.088 -3.236,1.664 -8.336,1.664c-5.1,0 -7.247,-0.575 -8.336,-1.664c-1.089,-1.089 -1.664,-3.236 -1.664,-8.336c0,-5.1 0.575,-7.247 1.664,-8.336c1.089,-1.089 3.236,-1.664 8.336,-1.664Zm0,-2c10,0 12,2 12,12c0,10 -2,12 -12,12c-10,0 -12,-2 -12,-12c0,-10 2,-12 12,-12Zm-4,11l8,0c0.552,0 1,0.448 1,1c0,0.552 -0.448,1 -1,1l-8,0c-0.552,0 -1,-0.448 -1,-1c0,-0.552 0.448,-1 1,-1Z"/>
		</Svg>
	)
}

export const Share = (props) => {
	return(
		<Svg color={props.color} stayActive={ props.stayActive } viewBox="0 0 32 32" width="32" height="32" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" id="share" xmlns="http://www.w3.org/2000/svg" aria-labelledby="title">
			<title id='title'>Share</title>
			<Defs />
			<g fillRule="nonzero">
				<path d="M15 19a1 1 0 0 0 2 0h-2zm1-16l.707-.707a.999.999 0 0 0-1.414 0L16 3zm-4.707 3.293a.999.999 0 1 0 1.414 1.414l-1.414-1.414zm8 1.414a.999.999 0 1 0 1.414-1.414l-1.414 1.414zM17 19V3h-2v16h2zM15.293 2.293l-4 4 1.414 1.414 4-4-1.414-1.414zm0 1.414l4 4 1.414-1.414-4-4-1.414 1.414z"/>
				<path d="M12 11.196a.973.973 0 0 0-1.073-.977C5.282 10.857 4 13.095 4 19.5c0 8 2 9.5 12 9.5s12-1.5 12-9.5c0-6.405-1.282-8.643-6.927-9.281a.973.973 0 0 0-1.073.977v.002c0 .522.402.953.92 1.014.295.035.576.075.845.121 1.427.237 2.244.593 2.749.99.918.721 1.486 2.133 1.486 6.177 0 4.045-.568 5.457-1.486 6.178-.505.397-1.322.752-2.749.99-1.477.25-3.312.333-5.765.332-2.453.001-4.288-.082-5.765-.332-1.427-.238-2.244-.593-2.749-.99C6.568 24.957 6 23.545 6 19.5c0-4.044.568-5.456 1.486-6.177.505-.397 1.322-.753 2.749-.99.269-.046.55-.086.845-.121.518-.061.92-.492.92-1.014v-.002z"/>
			</g>
		</Svg>
	)
}
