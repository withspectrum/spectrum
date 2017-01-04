import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import { BrowserRouter, Match } from 'react-router';

import './css/spector.css';


const Root = () => {
	return(
		<BrowserRouter>
			<div>
				<Match exactly pattern="/" component={App}/>
			</div>
		</BrowserRouter>
	)
}

render(<Root/>, document.querySelector('#root'));
