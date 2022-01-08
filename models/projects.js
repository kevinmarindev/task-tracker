const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    project: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('projects', projectSchema)