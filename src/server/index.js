import _ from 'lodash'
import fs from 'fs'
import http from 'http'
import path from 'path'
import morgan from 'morgan'
import express from 'express'
import socketio from 'socket.io'

import * as pkg from '../../package.json'
import setupProxy from '../setupProxy'

// Create our app
const app = express()
const server = http.Server(app)

if (process.env.NODE_ENV !== 'development') {
  app.use(morgan('combined'))
}

// Add static assets
const buildDir = path.resolve(__dirname, '..', '..', 'build')
app.use(express.static(buildDir))

setupProxy(app)

app.use('*', (request, response) => {
  try {
    const indexFile = path.join(buildDir, 'index.html')
    const indexStream = fs.createReadStream(indexFile)
    indexStream.pipe(response)
  } catch (e) {
    response.sendStatus(500)
  }
})

const socket = socketio(server)

const chatNamespace = socket.of('/chat')
chatNamespace.on('connection', socket => {

  const throttledMessageHandler = _.throttle((message, done) => {
    socket.emit('messages', message)
    done()
  }, 1000)

  socket.on('message', throttledMessageHandler)
})

// const queueNamespace = socket.of('/queue')
// const democracyNamespace = socket.of('/democracy')

server.listen(process.env.PORT || 9000)
