import React, { useEffect, useState } from 'react'

import {Tweet} from './detail'
import { apiTweetList } from './lookup'

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
        apiTweetList(props.username, handleTweetListLookup)
      }
    }, [tweetsInit, tweetsDidSet, setTweetsDidSet, props.username])
  
    const handledidRetweet = (newTweets) => {
      const updateTweetsInit = [...tweetsInit]
      //append to the beginning
      updateTweetsInit.unshift(newTweets)
      setTweetsInit(updateTweetsInit)
      const updateFinalTweets = [...tweets]
      //append to the beginning
      updateFinalTweets.unshift(tweets)
      setTweetsInit(updateFinalTweets)
    }
    return tweets.map((item, index) => {
      return <Tweet
        tweet={item}
        didRetweet={handledidRetweet}
        className='my-5 py-3 border bg-white text-dark'
        key={`${index}-{item.id}`} />
    })
  }