import React from 'react'

import {
  apiTweetAction
} from './lookup'

export function ActionBtn(props) {
    const { tweet, action, didPerformAction } = props
    const likes = tweet.likes ? tweet.likes : 0
    //const [likes, setLikes] = useState()
    //const [userLike, setUserLike] = useState(tweet.userLike === true ? true : false)
    const className = props.className ? props.className : 'btn btn-primary btn-sm'
    const actionDisplay = action.display ? action.display : 'Action'
  
    const handleBackendAction = (response, status) => {
      console.log(response, status)
      if ((status === 200 || status === 201) && didPerformAction) {
        didPerformAction(response, status)
      }
    }
  
    const handleClick = (event) => {
      event.preventDefault()
      apiTweetAction(tweet.id, action.type, handleBackendAction)
    }
    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
    return <button className={className} onClick={handleClick}>{display}</button>
  }