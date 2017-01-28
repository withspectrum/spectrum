import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { BrowserRouter, Match } from 'react-router';


const Root = () => {
	return(
		<BrowserRouter>
			<Match exactly pattern="/" component={App}/>
		</BrowserRouter>
	)
}

render(<Root/>, document.querySelector('#root'));
