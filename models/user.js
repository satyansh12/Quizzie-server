const mongoose = require("mongoose");

/**
 * user.js defines the User model schema with fields for name, email, and password.
 * This model is essential for user registration, login, and management within the application.
 */
const userSchema = new mongoose.Schema({
  name: { type: "string", required: true },
  email: { type: "string", required: true, unique: true },
  password: { type: "string", required: true },
});

module.exports = mongoose.model("User", userSchema);