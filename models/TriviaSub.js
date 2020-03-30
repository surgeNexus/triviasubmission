var mongoose = require("mongoose");

var triviaSubmissionSchema = mongoose.Schema({
    name: String,
    submission: String,
    upvote: Number,
});

module.exports = mongoose.model("TriviaSubmission", triviaSubmissionSchema);