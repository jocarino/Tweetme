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
    return action.type === 'like' ? <button className={className}>{tweet.likes} Likes </button> : null
  }
  
  
export function Tweet(props) {
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