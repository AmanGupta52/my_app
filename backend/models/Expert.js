const mongoose = require("mongoose");

const ExpertSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  expertId: { type: String, unique: true, required: true }, // add this
  title: String,
  availability: String,
  time: String,
  experience: String,
  specialities: [String],
  languages: [String],
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["expert", "moderator"], default: "expert" },
  img: {
    data: Buffer,
    contentType: String
  }
});

module.exports = mongoose.model("Expert", ExpertSchema);
