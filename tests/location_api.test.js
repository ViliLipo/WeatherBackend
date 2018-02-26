const supertest = require('supertest')
const {app, server} = require('../index')
const api = supertest(app)
const Observation = require('../models/observation')
const Location = require('../models/location')
const helper = require('./.test_helper')


beforeAll(async() => {
  await Location.remove({})
  await Observation.remove({})
})

describe('GET', async() => {
  test('Locations are returned correctly', async() => {
    let loc = new Location(helper.regularLocation)
    loc = await loc.save()
    console.log(loc)
    const addLocation = (a) => {
      a = {
        location: loc,
        time: a.time,
        temperature: a.temperature
      }
      return a
    }
    const promiseArray =  helper.initialObservations
                              .map(obs => addLocation(obs))
                              .map(obs => new Observation(obs))
                              .map(obs => obs.save())
    await Promise.all(promiseArray)
    let observations = await Observation.find({}).populate('location')
    observations = observations.map(Observation.format)
    console.log(observations)
    let testLoc = await Location.findOne({city:helper.regularLocation.city})
    testLoc.observations = testLoc.observations.concat(observations)
    await testLoc.save()
    testLoc = await Location.findById(testLoc._id).populate('observations')
    testLoc = Location.format(testLoc)
    console.log(testLoc)
    const res = await api
                  .get('/api/locations')
                  .expect(200)
                  .expect('Content-Type', /application\/json/)
    console.log(res.body)
    expect(res.body[0].city).toEqual(loc.city)
    expect(res.body[0].observations.length).toEqual(helper.initialObservations.length)
  })
})

afterAll(() => {
  server.close()
})
