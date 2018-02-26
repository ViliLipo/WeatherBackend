const supertest = require('supertest')
const {app, server} = require('../index')
const api = supertest(app)
const Observation = require('../models/observation')
const Location = require('../models/location')
const helper = require('./.test_helper')


const getLoc = async () => {
  let value = await Location.findOne({city:helper.regularLocation.city})
  value = Location.format(value)
  return value
}

beforeAll(async() => {
  await Location.remove({})
  await Observation.remove({})
  const loc = new Location(helper.regularLocation)
  await loc.save()
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

})

describe('Get', async() => {
  test('Observations are returned correctly', async() => {
    let observationsInDb = await Observation
                                            .find({})
                                            .populate(
                                              'location',{city:1,coordinates:1})
    ///console.log(observations)
    const r = await api
                      .get('/api/observations')
                      .expect(200)
                      .expect('Content-Type', /application\/json/)
    expect(r.body.length).toBe(observationsInDb.length)
    const sample = r.body[0]
    const reference =Observation.format(observationsInDb[0])
    console.log(reference)
    expect(sample.temperature).toBe(reference.temperature)
    expect(JSON.stringify(sample.location)).toEqual(JSON.stringify(reference.location))
    const sampleDate = new Date(sample.time)
    const referenceDate = new Date(reference.time)
    expect(sampleDate.toString()).toEqual(referenceDate.toString())
  })
})

describe('Post', async() => {
  test('a post that should succeed', async () => {
    let loc1 = await getLoc()
    loc1 = Location.format(loc1)
    let obsToSend = {
      location:loc1,
      temperature : helper.regularObservation.temperature,
      time : helper.regularObservation.time
    }
    //console.log(obsToSend)
    const r = await api
                      .post('/api/observations')
                      .send(obsToSend)
                      .expect(201)
                      .expect('Content-Type', /application\/json/)
    expect(r.body.location.city).toEqual(loc1.city)
    expect(r.body.temperature).toBe(obsToSend.temperature)
    const date = new Date(obsToSend.time)
    const responseDate = new Date(r.body.time)
    expect(responseDate.toString()).toEqual(date.toString())
  })
  test('post with no location should fail', async() => {
    let obsToSend = {
      temperature : 30,
      time : 512512515124
    }
    const r = await api
                      .post('/api/observations')
                      .send(obsToSend)
                      .expect(400)
    expect(r.body.error).toBe('Bad request')
  })
  test('post with no time should fail', async () => {
    let loc = await getLoc()
    let obsToSend ={
      location : loc,
      temperature : 30,
    }
    const r = await api
                      .post('/api/observations')
                      .send(obsToSend)
                      .expect(400)
    expect(r.body.error).toBe('Bad request')

  })
  test('post with too high temperature should fail', async() => {
    let loc1 = await getLoc()
    let obsToSend = {
      location:loc1,
      temperature:80,
      time: 877777733333
    }
    const r = await api
                      .post('/api/observations')
                      .send(obsToSend)
                      .expect(400)
    expect(r.body.error).toBe('Bad request')
  })
})
afterAll(() => {
  server.close()
})
