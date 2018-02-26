const locationsRouter = require('express').Router()
const Location = require('../models/location')
const Observation = require('../models/observation')


locationsRouter.get('/', (request, response) => {
  console.log('GET locations')
  Location
          .find({})
          .populate('observations')
          .then(locations => {
            console.log(locations)
            response.json(locations.map(Location.format))
          }).catch( error => {
            console.log(error)
            response.status(404).json({error: 'locations not found'})
          })
})

locationsRouter.post('/', async(request, response) => {
  try {
    if (!request.body.city || !request.body.coordinates) {
      return response.status(400).json({error : 'bad request'})
    }
    const location = new Location({
      city: request.body.city,
      coordinates: request.body.coordinates
    })
    const savedLocation = await location.save()
    response.status(201).json(Location.format(savedLocation))
  }catch (exception) {
    console.log(exception)
    response.status(500).json({error:"Something went wrong.."})
  }

})

module.exports = locationsRouter
