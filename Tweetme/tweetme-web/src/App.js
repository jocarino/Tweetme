import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

function loadTweets(callback) {
  const xhr = new XMLHttpRequest()
  const method = 'GET' // "POST"
  const url = "http://localhost:8000/api/tweets/" //api url
  const responseType = "json"
  xhr.responseType = responseType
  xhr.open(method, url)
  xhr.onload = function() {
    callback(xhr.response, xhr.status)

  }  
  xhr.onerror = function (e) {
    console.log(e)
    callback({"message": "Error request"}, 400)
  }  
  xhr.send() //triggers the request
}

function ActionBtn(props) {
  const {tweet, action} = props
  const className = props.className ? props.className : 'btn btn-primary btn-sm'
  return action.type === 'like' ? <button className={className}>{tweet.likes} Likes </button> : null
}


function Tweet(props) {
  const {tweet} = props
  // if the props.className exists set it to that, otherwise use the default on the right
  const className = props.className ? props.className : "col-10 mx-auto col-md-6"
  return <div className={className}>
    <p>{tweet.id} - {tweet.content}</p>
    <div className='btn btn-goup'>
      <ActionBtn tweet={tweet} action={{type:"like"}} />
      <ActionBtn tweet={tweet} action={{type:"unlike"}} />
    </div>
  </div>
}

function App() {
  const [tweets, setTweets] = useState([{content: 123}])

  useEffect(()=> {
    const myCallBack = (response, status) => {
      if (status === 200) {
        setTweets(response)
      } else {
        alert("There was an error")
      }
      
    }
    loadTweets(myCallBack)
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          {tweets.map((item, index)=>{
            return <Tweet tweet={item} className='my-5 py-5 border bg-white text-dark' key={`${index}-{item.id}`}/>
          })}
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
