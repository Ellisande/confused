import {browserHistory, Router, Route, IndexRoute} from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import injectTap from 'react-tap-event-plugin';
import App from './components/app';
import Product from './components/product';
import {Provider} from 'react-redux';
import store from '../../shared/store/store';
injectTap();
function render() {
  let content = document.createElement('div');
  content.setAttribute('id', 'content');
  document.body.appendChild(content);
  content = document.getElementById('content');

  ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path='/' component={App}/>
            <Route path='/product/:productName' component={Product}/>
        </Router>
    </Provider>, content);
}

function main() {
  render();
}

main();
