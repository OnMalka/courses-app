const mongoose = require('mongoose');
const validator = require('validator');
const ValidatePassword = require('validate-password');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: 'plony',
        validate(value){
            if(value.trim().toLowerCase()==='moshe')
                throw new Error('name could not be moshe');
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('invalid email');
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            const passwordData = new ValidatePassword().checkPassword(value);
            if(!passwordData.isValid)
                throw new Error(passwordData.validationMessage);
        }
    },
    attendance: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            require: true
        },
        courseName: {
            type: String,
            trim: true,
            required: true
        },
        attendancyList: [{
            date: {
                type: Date,
                required: true
            },
            attended: {
                type: Boolean,
                required: true
            },
            absenceReason: {
                type: String,
                trim: true,
                default: null
            }
        }]
    }],
    userType: {
        type: String,
        immutable: true,
        default: 'student',
        enum: ['student']
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
},{
    timestamps: true
});

studentSchema.pre('save', async function (next) {
    const student = this;

    if(student.isModified('password'))
        student.password = await bcrypt.hash(student.password , 8);

    next();
});

studentSchema.statics.findStudentByEmailAndPassword = async (email, password) => {
    const student = await Student.findOne({email});
    if(!student)
        throw new Error('Unable to log in');

    const isPassMatch = await bcrypt.compare(password, student.password);
    if(!isPassMatch)
        throw new Error('Unable to log in');

    return student;
};

studentSchema.methods.isPasswordMatching = async function (password){   
    const isPassMatch = await bcrypt.compare(password, this.password);
    if(!isPassMatch)
        throw new Error('Incorrect password');

    return isPassMatch;
};

studentSchema.methods.generateAuthToken = async function (){
    const student = this;
    const token = jwt.sign({
        _id: student._id
    },
    process.env.TOKEN_SECRET,
    {
        expiresIn: "6h"
    });
    
    student.tokens = student.tokens.concat({token});
    await student.save();

    return token;
};

studentSchema.methods.toJSON = function (){
    const student = this
    const studentObj = student.toObject();

    delete studentObj.password;
    delete studentObj.tokens;

    return studentObj;
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;