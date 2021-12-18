const express = require('express');
const Student = require('../models/studentModel.js');
const { auth, studentAuth } = require('../middleware/auth');

const router = new express.Router();

router.post('/students/login', async (req, res) => {
    try{
        const user = await Student.findStudentByEmailAndPassword(req.body['email'], req.body['password']);
        const token = await user.generateAuthToken();
        res.send({user, token});
    }catch(err){
        res.status(400).send({
            status: 400,
            message: err.message
        });
    };
});

router.post('/students/logout', auth, studentAuth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((tokenDoc)=>tokenDoc.token !== req.token);
        await req.user.save();
        res.send();
    }catch(err){
        res.status(500).send(err);
    };
});

router.get('/students/regen-token', auth, studentAuth, async(req, res) => {    
    try{    
        const student = req.user;    
        student.tokens = student.tokens.filter((tokenDoc)=>tokenDoc.token !== req.token);
        const token = await student.generateAuthToken();
        res.send(token);
    }catch(err){
        res.status(400).send({
            status: 400,
            message: err.message
        });
    };
});

router.patch('/students/change-password', auth, studentAuth, async (req, res) => {
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

router.post('/students/submit-attendancy', auth, studentAuth, async (req, res) => {
    
    const user = req.user;
    const {
        newAttendancyListItem,
        courseId,
        courseName
    } = req.body;

    try{        
        let done = false;
        for(let item of user.attendance){
            if(item.course.toString() === courseId){
                for(let listItem of item.attendancyList){
                    if(Date.parse(listItem.date) === Date.parse(newAttendancyListItem.date))
                        res.status(401).send({
                            status: 401,
                            message: 'Date unavailable, Please contact your lecturer to change submitted value.'
                        });
                };
                item.attendancyList.push(newAttendancyListItem);
                done = true;
                break;
            };
        };
        if(!done){
            user.attendance.push({
                course: courseId,
                courseName,
                attendancyList: {...newAttendancyListItem}
            });
        };
        await user.save();
        res.send(user);
    }catch(err){
        res.status(500).send(err);
    };
});

router.get('/students/all', async (req, res) => {
    try{
        const students = await Student.find({});       

        if(!students)
            return res.status(404).send({
                status: 404,
                message: "No students found"
            });
        
        res.send(students);
    }catch(err){
        res.status(500).send(err);
    };
});

module.exports = router;



// router.patch('/Students/edit', auth, studentAuth, async (req, res) => {
//     const allowdUpdate = ['password'];
//     const _id = req.user._id;

//     try{
//         if(Object.getOwnPropertyNames(req.body).length > allowdUpdates.length)
//             return res.status(400).send({
//                 status: 400,
//                 message: "Too many properties",
//                 allowdUpdates
//             });
            
//             for(let update in req.body){
//                 if(!allowdUpdate.includes(update)){
//                     return res.status(400).send({
//                         status: 400,
//                         message: "Update property invalid",
//                         property: update
//                     });
//                 }
//             };

//             const user = req.user;

//             for(let update in req.body)
//                 user[update] = req.body[update];

//             await user.save();

//             res.send(user);
//     }catch(err){
//         res.status(400).send({
//             status: 400,
//             message: err.message
//         });
//     };
// });

// try{        
    //     // let courseIndex = -1; 

    //     const student = req.user;  
        
    //     for(let item of student.attendance){
    //         item.populate('course').exec((err)=>{
    //             if (err) throw err;
    //         });
    //         // if(item.course.courseName === student.attendance[i].courseName){
    //         //     courseIndex = i;
    //         //     break;
    //         // };
    //     };

    //     console.log(student);
    //     // if(courseIndex === -1)
    //     //     throw new Error();

    //     // const newAttendancyListItem = {
    //     //     date: req.body.date,
    //     //     attended: req.body.attended,
    //     //     absenceReason: req.body.absenceReason
    //     // };
    //     // const studentsAttendancyList = student.attendance.attendancyList;
        
        
    //     // for(let item of studentsAttendancyList){
    //     //     if(item.date === newAttendancyListItem.date){
    //     //         item.attended = newAttendancyListItem;
    //     //         item.absenceReason = newAttendancyListItem.absenceReason;
    //     //         await req.user.save();
    //     //         res.send(req.user);
    //     //     };
    //     // };

    //     // studentsAttendancyList.push({
    //     //     date: newAttendancyListItem.date,
    //     //     attended: newAttendancyListItem.attended,
    //     //     absenceReason: newAttendancyListItem.absenceReason
    //     // });  
        
    //     // await req.user.save();
    //     // res.send(req.user);       
    // }