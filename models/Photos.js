const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "A photo must have a comment :)"]
  },
  ratingOfDay: {
    type: Number,
    min: [1, "A day must have a minimum rating of 1"],
    max: [5, "A day must have a maximum rating of 5"]
  },
  date: {
    type: Date,
    default: Date.now()
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});
const Photos = mongoose.model("Photos", photoSchema);

module.exports = Photos;
