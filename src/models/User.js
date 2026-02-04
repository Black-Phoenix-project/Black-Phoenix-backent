const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,   
  },
  role: [
    {
      admin: {
        type: String,                                                                                                       
        required: true,                                                                                                                                                                                                                                 
      },
      moderator: {
        type: String,
        required: true,
      }
    }
  ],
  lastname: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: false,
  },
  avatar: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
  },
});

module.exports = mongoose.model('User', userSchema);
