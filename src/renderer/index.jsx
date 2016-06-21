import React from 'react'
import {render} from 'react-dom'
import {remote} from 'electron'

import Root from './components/Root'

const videoPath = remote.process.argv[2]

function loadComments() {
  const packet = require(`${videoPath}.json`)
  
  // Sort comments by vpos
  config.comments = packet
    .comments
    .sort((a, b) => {
      if (a.vpos < b.vpos) return -1
      if (a.vpos > b.vpos) return 1
      return 0
    })

  // Create vpos, array_index inverted index
  config.vposIndex = config
    .comments
    .map((comment, index) => {
      return [comment.vpos, index]
    })

  console.log('comment loaded:', config.comments.length)
}

render(
  <Root videoPath={videoPath} />,
  document.getElementById('root')
)
