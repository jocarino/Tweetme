import React from 'react'

import { apiTweetCreate } from './lookup'

export function TweetCreate(props){
  const textAreaRef = React.createRef()
  const {didTweet} = props

  const handleBackendUpdate = (response, status) => {
    //backend api response handler
    if (status === 201) {
      didTweet(response)
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
  return<div className={props.className}>
      <form onSubmit={handleSubmit}>
        <textarea ref={textAreaRef} required={true} className='form-control' name='tweet'>

        </textarea>
        <button type='submit' className='btn btn-primary my-3'>Tweet</button>
      </form>
    </div>
}