const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let emailAccountSchema = new Schema({
  
  
});

// Export the model
module.exports = mongoose.model("email_accounts", emailAccountSchema);
