const mongoose = require('mongoose');
const validator = require('validator');
const ValidatePassword = require('validate-password');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const lecturerSchema = new mongoose.Schema({
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
    userType: {
        type: String,
        immutable: true,
        default: 'lecturer',
        enum: ['lecturer']
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

lecturerSchema.pre('save', async function (next) {
    const lecturer = this;

    if(lecturer.isModified('password'))
        lecturer.password = await bcrypt.hash(lecturer.password , 8);

    next();
});

lecturerSchema.statics.findLecturerByEmailAndPassword = async (email, password) => {
    const lecturer = await Lecturer.findOne({email});

    if(!lecturer)
        throw new Error('Unable to log in');

    const isPassMatch = await bcrypt.compare(password, lecturer.password);

    if(!isPassMatch)
        throw new Error('Unable to log in');

    return lecturer;
};

lecturerSchema.methods.isPasswordMatching = async function (password){   
    const isPassMatch = await bcrypt.compare(password, this.password);
    if(!isPassMatch)
        throw new Error('Incorrect password');

    return isPassMatch;
};

lecturerSchema.methods.generateAuthToken = async function (){
    const lecturer = this;
    const token = jwt.sign({
        _id: lecturer._id
    },
    process.env.TOKEN_SECRET,
    {
        expiresIn: "6h"
    });
    
    lecturer.tokens = lecturer.tokens.concat({token});
    await lecturer.save();

    return token;
};

lecturerSchema.methods.toJSON = function (){
    const lecturer = this
    const lecturerObj = lecturer.toObject();

    delete lecturerObj.password;
    delete lecturerObj.tokens;

    return lecturerObj;
};

const Lecturer = mongoose.model('Lecturer', lecturerSchema);

module.exports = Lecturer;