const jwt = require('jsonwebtoken');
const Student = require('../models/studentModel');
const Lecturer = require('../models/lecturerModel');

const auth = async (req, res, next) => {
    try{
        console.log('main auth:::   ')
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, process.env.TOKEN_SECRET);

        const user = await Student.findOne({
                _id: data._id,
                'tokens.token': token
            }) || 
            await Lecturer.findOne({
                _id: data._id,
                'tokens.token': token
            });

        if(!user)
            throw new Error();
        
        req.user = user;
        req.token = token;
        console.log()
        next();
    }catch(err){
        res.status(400).send({
            status: 400,
            message: 'Not authenticated'
        })
    }
};

const studentAuth = async (req, res, next) => {
    try{
        console.log('stu auth:::   ', req.user.userType)
        if(req.user.userType !== 'student')
            throw new Error()
        next();
    }catch(err){
        res.status(400).send({
            status: 400,
            message: 'Not authenticated'
        })
    }
};

const lecturertAuth = async (req, res, next) => {
    try{
        console.log('lec auth:::   ', req.user.userType)
        if(req.user.userType !== 'lecturer')
            throw new Error()
        next();
    }catch(err){
        res.status(400).send({
            status: 400,
            message: 'Not authenticated'
        })
    }
};

module.exports = {
    auth,
    studentAuth,
    lecturertAuth
};