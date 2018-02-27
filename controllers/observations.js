
const observationsRouter = require('express').Router()
const Observation = require('../models/observation')
const Location = require('../models/location')



observationsRouter.get('/', (request, response) => {
  Observation
            .find({})
            .populate('location', {city:1, coordinates:1})
            .then (observations => {
              response.json(observations.map(Observation.format))
            }).catch(error => {
              response.status(404).json({error: 'observations not found'})
            })
})

observationsRouter.get('/:id', (request, response) => {
  Observation
            .findById(request.params.id)
            .populate('location', {city:1, coordinates:1})
            .then(obs => {
              response.json(Observation.format(obs))
            }).catch(error => {
              console.log(error)
              response.status(404).json({error:'Observation not found'})
            })
})

observationsRouter.post('/', async (request, response) => {
  console.log("POST")
  try {
    if ((request.body.temperature === undefined) || !request.body.time || !request.body.location
    || request.body.temperature < -80 || request.body.temperature > 70 || request.body.time > new Date()) {
      console.log("Bad request")
      console.log(request.body)
      response.status(400).json({error:'Bad request'})
      return
    }
    const body = request.body
    //console.log(request.body)
    const location = await Location.findById(body.location._id)
    const obs = new Observation({
      temperature: body.temperature,
      time: body.time,
      location: body.location
    })
    var savedObs = await obs.save()
    var resObs = await Observation
                        .findById(savedObs._id)
                        .populate('location', {city:1, coordinates:1})
    location.observations = location.observations.concat(savedObs._id)
    await location.save()
    response.status(201).json(Observation.format(resObs))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({error:'Something went wrong...'})
  }
})

module.exports = observationsRouter
