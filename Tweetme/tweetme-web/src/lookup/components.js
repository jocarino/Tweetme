import React from 'react'

export function loadTweets(callback) {
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