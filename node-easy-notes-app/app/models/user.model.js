const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type:  Object},
  firstName: { type: String },
  lastName: { type: String },
  isVerify: { type: Boolean },
});

// Export the model
module.exports = mongoose.model("users", userSchema);
