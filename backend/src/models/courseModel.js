const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    subject: {
        type: String,
        required:true,
        trim: true,
        unique: true
    },
    lecturer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lecturer',
            require: true
        },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    schedule: [{
        dayOfTheWeek: {
            type: Number,
            min: 0,
            max: 6,
            required: true,
        },
        startingAt: {
            type: String,
            required: true
        },
        endingAt: {
            type: String,
            required: true
        }
    }],
    participants: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    }]
}, {
    timestamps: true
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;