const express = require('express');
const Lecturer = require('../models/lecturerModel.js');
const { auth, lecturertAuth } = require('../middleware/auth');

const router = new express.Router();

router.post('/lecturers/login', async (req, res) => {
    try{
        const user = await Lecturer.findLecturerByEmailAndPassword(req.body['email'], req.body['password']);
        const token = await user.generateAuthToken();
        res.send({user, token});
    }catch(err){
        res.status(400).send({
            status: 400,
            message: err.message
        });
    };
});

router.post('/lecturers/logout', auth, lecturertAuth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((tokenDoc)=>tokenDoc.token !== req.token);
        await req.user.save();
        res.send();
    }catch(err){
        res.status(500).send(err);
    };
});

router.get('/lecturers/regen-token', auth, lecturertAuth, async(req, res) => {    
    try{    
        const lecturer = req.user;    
        lecturer.tokens = lecturer.tokens.filter((tokenDoc)=>tokenDoc.token !== req.token);
        const token = await lecturer.generateAuthToken();
        res.send(token);
    }catch(err){
        res.status(400).send({
            status: 400,
            message: err.message
        });
    };
});

router.patch('/lecturers/change-password', auth, lecturertAuth, async (req, res) => {
    try{
        const user = req.user;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const isMatching = await user.isPasswordMatching(oldPassword);

        if(oldPassword === newPassword)
            res.status(400).send({
                status: 400,
                message: 'New password can not match old password.'
            });
        if(isMatching)
            user.password = newPassword;
        else
            res.status(400).send({
                status: 400,
                message: 'Wrong password!'
            });

        await user.save();

        user.tokens = user.tokens.filter((tokenDoc)=>tokenDoc.token !== req.token);
        const token = await user.generateAuthToken();

        res.send({user, token});
    }catch(err){
        res.status(500).send({
            status: 500,
            message: err.message
        });
    };
});

module.exports = router;