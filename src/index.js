import './scss/index.scss'

import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import App from './components'

import socketio from 'socket.io-client'
import RoomSocketsContext from './components/Contexts/RoomSockets'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/analytics'
import 'firebase/firestore'

import { createStore, combineReducers, compose } from 'redux'

import {
  ReactReduxFirebaseProvider,
  firebaseReducer,
  firestoreReducer,
  createFirestoreInstance
} from 'react-redux-firebase'

const app = firebase.initializeApp({
  appId: "1:247792351073:web:a07b9ff7e483eeb5a67720",
  apiKey: "AIzaSyCu742oEJUWRtAWyk2SPBinaDuBJuF7cmU",
  projectId: "bumpchat-268800",
  authDomain: "bumpchat-268800.firebaseapp.com",
  databaseURL: "https://bumpchat-268800.firebaseio.com",
  measurementId: "G-F37XJ2MHKQ",
  storageBucket: "bumpchat-268800.appspot.com",
  messagingSenderId: "247792351073"
})

firebase.auth()
firebase.analytics()
firebase.firestore()

const store = createStore(combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer
}), {})

const chatSocket = socketio('http://localhost:9000/chat')
const queueSocket = socketio('http://localhost:9000/queue')

ReactDOM.render((
  <Provider store={ store }>
    <ReactReduxFirebaseProvider firebase={ firebase }
      dispatch={ store.dispatch }
      config={{}}
      createFirestoreInstance={createFirestoreInstance}
     >
      <RoomSocketsContext.Provider value={{ chatSocket, queueSocket }}>
        <App />
      </RoomSocketsContext.Provider>
    </ReactReduxFirebaseProvider>
  </Provider>
), document.getElementById('root'))
