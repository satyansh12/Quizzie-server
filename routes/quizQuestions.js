/**
 * quizQuestions.js provides routes for accessing and submitting answers to quiz questions.
 * It's used for the quiz-taking functionality, allowing users to interact with quiz questions.
 */
const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz");

// Route to display a quiz based on a parameter
router.get("/:quizId", async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.log("quiz not found /:quizId " + error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

//for impressions ++
router.post("/:quizId/impression", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    quiz.impressions = quiz.impressions + 1;
    await quiz.save();
    res.json({ message: "Impression recorded" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//answerOption update api
router.post("/:quizId/submit", async (req, res) => {
  const { quizId } = req.params;
  const { userAnswers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    if (quiz.quizType !== "Poll Type") {
      Object.keys(userAnswers).forEach((questionIndex) => {
        if (userAnswers[questionIndex] === 1) {
          if (quiz.correctAnswers[questionIndex]) {
            quiz.correctAnswers[questionIndex]++;
          } else {
            quiz.correctAnswers[questionIndex] = 1;
          }
        }
      });
    }else {
      // Iterate through userAnswers where each key is assumed to be a question index
      Object.keys(userAnswers).forEach(questionIndex => {
        const qIndex = parseInt(questionIndex, 10); // Convert questionIndex to a number
        const selectedOptionIndex = userAnswers[questionIndex]; // This is the index of the selected option

        if (!isNaN(qIndex) && quiz.questions[qIndex] && quiz.questions[qIndex].options[0][selectedOptionIndex] !== undefined) {
          // Increment the count for the selected option
          quiz.questions[qIndex].options[0][selectedOptionIndex].count += 1;
          // Mark the modified path to ensure the changes are saved
          quiz.markModified(`questions.${qIndex}.options.0.${selectedOptionIndex}`);
        }
      });
    }

    quiz.impressions++;
    await quiz.save();
    res.json({ message: "Quiz answers submitted successfully" });
  } catch (error) {
    console.error("Error submitting quiz answers:", error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting quiz answers" });
  }
});

module.exports = router;
