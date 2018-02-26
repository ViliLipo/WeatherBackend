const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const Location = require('./models/location')
const Observation = require('./models/observation')
const locationsRouter = require('./controllers/locations')
const observationsRouter = require('./controllers/observations')
const config = require('./utils/config')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

app.use('/api/locations', locationsRouter)
app.use('/api/observations', observationsRouter)

mongoose.connect(config.mongoUrl)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}
