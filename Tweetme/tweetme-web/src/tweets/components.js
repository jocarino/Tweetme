import React, { useEffect, useState } from 'react'

import {
  apiTweetCreate,
  apiTweetList, apiTweetAction
} from './lookup'

export function TweetsComponent(props) {
  const textAreaRef = React.createRef()
  const [newTweets, setNewTweets] = useState([])

  const handleBackendUpdate = (response, status) => {
    //backend api response handler
    let tempNewTweets = [...newTweets]
    if (status === 201) {
      tempNewTweets.unshift(response)
      setNewTweets(tempNewTweets)
    } else {
      alert("An error has occured please try again.")
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const newVal = textAreaRef.current.value
    //push the new tweets to the beggining
    //backend api response handler
    apiTweetCreate(newVal, handleBackendUpdate)
    textAreaRef.current.value = ''
  }
  return <div className={props.className}>
    <div className='col-12 mb-3'>
      <form onSubmit={handleSubmit}>
        <textarea ref={textAreaRef} required={true} className='form-control' name='tweet'>

        </textarea>
        <button type='submit' className='btn btn-primary my-3'>Tweet</button>
      </form>
    </div>
    <TweetsList newTweets={newTweets} />
  </div>
}

export function TweetsList(props) {
  const [tweetsInit, setTweetsInit] = useState([])
  const [tweets, setTweets] = useState([])
  const [tweetsDidSet, setTweetsDidSet] = useState(false)
  // listen to the new tweets coming in from the props and concat to the final tweet
  //render if the concatenation is bigger than the current render
  useEffect(() => {
    const final = [...props.newTweets].concat(tweetsInit)
    if (final.length !== tweets.length) {
      setTweets(final)
    }
  }, [props.newTweets, tweets, tweetsInit]) // needed dependencies

  useEffect(() => {
    if (tweetsDidSet === false) {
      const handleTweetListLookup = (response, status) => {
        if (status === 200) {
          setTweetsInit(response)
          setTweetsDidSet(true)
        } else {
          alert("There was an error")
        }
      }
      apiTweetList(handleTweetListLookup)
    }
  }, [tweetsInit, tweetsDidSet, setTweetsDidSet])
  return tweets.map((item, index) => {
    return <Tweet tweet={item} className='my-5 py-3 border bg-white text-dark text-center' key={`${index}-{item.id}`} />
  })
}


export function ActionBtn(props) {
  const { tweet, action } = props
  const [likes, setLikes] = useState(tweet.likes ? tweet.likes : 0)
  //const [userLike, setUserLike] = useState(tweet.userLike === true ? true : false)
  const className = props.className ? props.className : 'btn btn-primary btn-sm'
  const actionDisplay = action.display ? action.display : 'Action'

  const handleBackendAction = (response, status) => {
    console.log(response, status)
    if (status === 200){
      setLikes(response.likes)
      //setUserLike(true)
    }
  }

  const handleClick = (event) => {
    event.preventDefault()
    apiTweetAction(tweet.id, action.type, handleBackendAction)
  }
  const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
  return <button className={className} onClick={handleClick}>{display}</button>
}

export function Tweet(props) {
  const { tweet } = props
  const className = props.className ? props.className : 'col-10 mx-auto col-md-6'
  return <div className={className}>
    <p>{tweet.id} - {tweet.content}</p>
    <div className='btn btn-group'>
      <ActionBtn tweet={tweet} action={{ type: "like", display: "Likes" }} />
      <ActionBtn tweet={tweet} action={{ type: "unlike", display: "Unlike" }} />
      <ActionBtn tweet={tweet} action={{ type: "retweet", display: "Retweet" }} />
    </div>
  </div>
}
