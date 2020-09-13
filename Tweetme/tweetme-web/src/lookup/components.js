import React from 'react'

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function lookup(method, endpoint, callback, data) {
  let jsonData;
  if (data) {
    jsonData = JSON.stringify(data)
  }
  const xhr = new XMLHttpRequest()
  const url = `http://localhost:8000/api/${endpoint}` //api url
  xhr.responseType = "json"
  xhr.open(method, url)
  const csrftoken = getCookie('csrftoken');

  //https://docs.djangoproject.com/en/2.2/ref/csrf/
  // here there is no csrf token from the form, needs to be set on the request
  if (csrftoken) {
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
    xhr.setRequestHeader("X-CSRFToken", csrftoken)
  }
  xhr.onload = function () {
    callback(xhr.response, xhr.status)

  }
  xhr.onerror = function (e) {
    console.log(e)
    callback({ "message": "Error request" }, 400)
  }
  xhr.send(jsonData) //triggers the request
}

export function createTweets(newTweet, callback) {
  lookup('POST', 'tweets/create/', callback, { content: newTweet })
}

export function loadTweets(callback) {
  lookup('GET', 'tweets/', callback)
}