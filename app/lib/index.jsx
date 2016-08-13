import path from 'path'
import React from 'react'
import {render} from 'react-dom'
import {remote} from 'electron' // eslint-disable-line import/no-extraneous-dependencies

import Root from './components/root'

const videoPath = path.resolve(remote.process.argv[2])

render(
	<Root videoPath={videoPath}/>,
	document.getElementById('root')
)
