const mongoose = require('mongoose')
const Schema = mongoose.Schema

const observationSchema = new Schema( {
  temperature: Number,
  time: Date,
  location: {type:mongoose.Schema.Types.ObjectId, ref:'Location'}
})

observationSchema.statics.format = function(observation) {
  return {
    temperature: observation.temperature,
    time: observation.time,
    location: observation.location,
    _id: observation._id
  }
}

const Observation = mongoose.model('Observation', observationSchema)

module.exports = Observation
