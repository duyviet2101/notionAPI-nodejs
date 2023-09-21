const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const setQuestions = new Schema({
    _id: String,
    setType: String,
    setOrder: Number,
    setTitle: String,
    questionsAndKeys: [
        {
            questionOrder: Number,
            questionTitle: String,
            optionsAndKey: {
                options: String,
                key: String
            }
        }
    ]
})

const passage = new Schema({
    _id: String,
    passageTitle: String,
    passageContent: String,
    setsQuestions: [setQuestions]
})

const TestReading = new Schema({
    _id: String,
    testReadingTitle: String,
    passages: [passage]
}, {
    timestamps: true
})

module.exports = mongoose.model('TestReading', TestReading, 'ielts_reading_tests')