const mongoose = require('mongoose')
const Schema = mongoose.Schema

var locationSchema = new Schema( {
  city: String,
  coordinates: String,
  observations: [{type: mongoose.Schema.Types.ObjectId, ref:'Observation'}]
})

locationSchema.statics.format = function(location) {
  return {
    city: location.city,
    coordinates: location.coordinates,
    observations: location.observations,
    _id:location._id
  }
}

const Location = mongoose.model('Location', locationSchema)

module.exports = Location
