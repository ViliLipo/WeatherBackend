
const regularLocation = {
  city:'Tokio',
  coordinates:"55N,77E"
}

const initialObservations = [
  {
    location: regularLocation,
    temperature:16,
    time:95232132331
  },
  {
    location: regularLocation,
    temperature:14,
    time:95232132499
  },
]


const regularObservation = {
  location:regularLocation,
  temperature:15,
  time:95232132331
}

const observationWithNoTemp = {
  location:regularLocation,
  time:951512561331
}

const observationWithTooHighTemp = {
  location: regularLocation,
  temperature:100,
  time:951512561331
}

module.exports = {
  regularLocation, initialObservations, regularObservation,
  observationWithNoTemp, observationWithTooHighTemp
}
