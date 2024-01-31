/**
 * quiz.js defines the Quiz model schema including questions, options, and answers.
 * It supports the core functionality of creating and managing quizzes in the application.
 */
const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: { type: String },
  imageURL: { type: String },
  count: { type: Number, default: 0 }, // Added to track the count of each option selected
});

const questionSchema = new mongoose.Schema({
  pollQuestion: { type: Object, required: true },
  ansOption: { type: Object, required: true },
  options: [[optionSchema]],
  timerType: { type: Object,},
});

const quizSchema = new mongoose.Schema({
  email: { type: String, required: true },
  date: { type: Date, default: Date.now },
  impressions: { type: Number, default: 0 },
  quizName: { type: String, required: true },
  quizType: { type: String, required: true },
  correctAnswers: { type: Object, default: {} },
  questions: [questionSchema],
});

module.exports = mongoose.model("Quiz", quizSchema);
