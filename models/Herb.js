const mongoose = require('mongoose');

// This is the blueprint for our Herb data
const herbSchema = new mongoose.Schema({
  herbName: {
    type: String,
    required: true // This field cannot be empty
  },
  botanicalName: {
    type: String,
    required: true
  },
  collectorName: {
    type: String,
    required: true
  },
  collectionTimestamp: {
    type: Date,
    default: Date.now // If no date is given, it defaults to now
  },
  gpsCoordinates: {
    lat: String,
    lng: String
  },
  batchPhotoURL: {
    type: String
  },
  qualityNotes: {
    type: String
  }
});

// This creates the 'Herb' model using the blueprint we defined
const Herb = mongoose.model('Herb', herbSchema);

// This makes our Herb model available to other files
module.exports = Herb;