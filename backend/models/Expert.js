const mongoose = require('mongoose');

const ExpertSchema = new mongoose.Schema({
  expertId: { type: String, unique: true },
  name: { type: String, required: true },
  title: String,
  availability: String,
  specialities: [String],
  languages: [String],
  time: String,
  img: String,
  experience: String
});

module.exports = mongoose.model('Expert', ExpertSchema);
