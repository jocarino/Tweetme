import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { TweetsComponent, TweetDetailComponent } from './tweets';


const appEl = document.getElementById('root')
if (appEl) {
  ReactDOM.render(<App />, appEl);
}

const e = React.createElement

const tweetsEl = document.getElementById('tweetme')
if (tweetsEl) {
  /* data set comming from index.html */
  console.log(tweetsEl.dataset)
  // It can pass it the params and props in the TweetsComponent
  ReactDOM.render(e(TweetsComponent, tweetsEl.dataset), tweetsEl);
}

// gets all the elements with that class and replace in the same way of tweets element
const TweetDetailElements = document.querySelectorAll(".tweetme-detail")

TweetDetailElements.forEach(container =>{
  ReactDOM.render(
    e(TweetDetailComponent, container.dataset), container);
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
