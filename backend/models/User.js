  const mongoose = require('mongoose');

  const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },   
    age: { type: Number, required: true },        
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "moderator", "expert", "admin"], 
      default: "user" // 
    }
  });

  module.exports = mongoose.model('User', UserSchema);
