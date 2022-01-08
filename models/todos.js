const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    todo: {
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: false
    },
    completed: {
        type: Boolean,
        rquired: true,
    },
    userId: {
        type: String,
        required: true
    },
    project: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Todo', TodoSchema)