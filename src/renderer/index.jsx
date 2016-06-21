import React from 'react'
import {render} from 'react-dom'
import {remote} from 'electron'

import Root from './components/Root'

const videoPath = remote.process.argv[2]

render(
  <Root videoPath={videoPath}/>, document.getElementById('root'))
