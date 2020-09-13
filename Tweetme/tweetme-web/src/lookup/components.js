import React from 'react'

function lookup(method, endpoint, callback, data) {
  let jsonData;
  if (data) {
    jsonData = JSON.stringify(data)
  }
  const xhr = new XMLHttpRequest()
  const url = `http://localhost:8000/api/${endpoint}` //api url
  xhr.responseType = "json"
  xhr.open(method, url)
  xhr.onload = function () {
    callback(xhr.response, xhr.status)

  }
  xhr.onerror = function (e) {
    console.log(e)
    callback({ "message": "Error request" }, 400)
  }
  xhr.send(jsonData) //triggers the request
}

export function loadTweets(callback) {
  lookup('GET', 'tweets/', callback)
}