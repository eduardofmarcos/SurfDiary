const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  comment: {
    type: String,
    required: [true, 'A photo must have a comment :)']
  },
  ratingOfDay: {
    type: Number,
    min: [1, 'A day must have a minimum rating of 1'],
    max: [5, 'A day must have a maximum rating of 5'],
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  },
  location: {
    // GeoJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number]
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});
const Feed = mongoose.model('Feed', feedSchema);

module.exports = Feed;
