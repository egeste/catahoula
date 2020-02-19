import axios from 'axios'
import Firestore from '@google-cloud/firestore'

const firestore = new Firestore({
  projectId: process.env.BUMPCHAT_PROJECT_ID,
  keyFilename: process.env.BUMPCHAT_APPLICATION_CREDENTIALS
})

export default app => {

  app.get('/api/users', (req, res) => {
    return firestore.collection('users').get().then(snapshot => {
      const documentCollector = []
      snapshot.forEach(doc => documentCollector.push(doc.data()))
      res.json(documentCollector)
    }).catch(err => {
      res.sendStatus(500)
    })
  })

  app.get('/api/oembed', (req, res) => {
    if (!req.query.url) return res.sendStatus(400)
    return axios.get(`https://noembed.com/embed?url=${req.query.url}`)
      .then(({ data }) => res.json(data))
      .catch(err => res.sendStatus(err.response.status))
  })

}
