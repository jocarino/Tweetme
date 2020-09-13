import React, {useEffect, useState} from 'react'

import {loadTweets} from '../lookup'

  export function TweetsList(props) {
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
    return tweets.map((item, index)=>{
      return <Tweet tweet={item} className='my-5 py-5 border bg-white text-dark' key={`${index}-{item.id}`}/>
    })
  }

export function ActionBtn(props) {
    const {tweet, action} = props
    const className = props.className ? props.className : 'btn btn-primary btn-sm'
    const actionDisplay = action.display ? action.display : 'Action'
    const handleClick = (event) => {
        event.preventDefault()
        if (action.type == 'like')
        console.log(tweet.likes+1)
    }
    const display = action.type == 'like' ? `${tweet.likes} ${actionDisplay} ` : action.display
    return <button className={className} onClick={handleClick}>{display}</button>
  }
  
  
export function Tweet(props) {
    const {tweet} = props
    // if the props.className exists set it to that, otherwise use the default on the right
    const className = props.className ? props.className : "col-10 mx-auto col-md-6"
    return <div className={className}>
      <p>{tweet.id} - {tweet.content}</p>
      <div className='btn btn-goup'>
        <ActionBtn tweet={tweet} action={{type:"like", display:"Likes"}} />
        <ActionBtn tweet={tweet} action={{type:"unlike", display:"Unlike"}} />
        <ActionBtn tweet={tweet} action={{type:"retweet", display:"Retweet"}} />
      </div>
    </div>
  }