const mongoose = require("mongoose");
// Plugin qui permet d'avoir un utilisateur unique via email
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Ajout du plugin au userSchema
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);