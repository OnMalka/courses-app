const express = require('express');
const Course = require('../models/courseModel.js');
const Student = require('../models/studentModel');
const { auth, lecturertAuth } = require('../middleware/auth');

const router = new express.Router();

router.post('/courses/new', auth, lecturertAuth, async(req, res) => {           
    try{
        const course = new Course({
            ...req.body.newCourse,
            participants: []
        });
        await course.save();
        res.send(course);
    }catch(err){
        res.status(400).send({
            status: 400,
            message: err.message
        });
    };
});

router.delete('/courses/delete', auth, lecturertAuth, async (req, res) => {    
    try{
        const course = await Course.findByIdAndDelete(req.body.id);

        if(!course)
            return res.status(404).send({
                status: 404,
                message: "Course not found"
                        });
        
        res.send();

    }catch(err){
        res.status(500).send(err);
    };
});

router.get('/courses/get', async (req, res) => {
    try{
        // console.log('courses/get:::::courseId: ', req.query  );
        const course = await Course.findById(req.query.courseId);

        if(!course)
            return res.status(404).send({
                status: 404,
                message: "Course not found"
            });
        
        res.send(course);
    }catch(err){
        res.status(500).send(err);
    };
});

router.get('/courses/all', async (req, res) => {
    try{
        const courses = await Course.find({});     

        if(!courses)
            return res.status(404).send({
                status: 404,
                message: "No courses found"
            });

        if(req.query.withPopulate)
            for(let course of courses){
                await course.populate('lecturer').execPopulate();
                await course.populate('Student').execPopulate();
            };
        
        res.send(courses);
    }catch(err){
        res.status(500).send(err);
    };
});

router.post('/courses/participants/add', auth, lecturertAuth, async (req, res) => {
    try{
        
        const studentId = req.body.studentId;
        const courseId = req.body.courseId;

        const course = await Course.findById(courseId);            
        for(let item of course.participants){
            if(item.studentId.toString() === studentId.toString()){
                return res.status(400).send({
                    status: 400,
                    message: 'Student already enrolled!'
                });
            };
        };
        course.participants.push({ studentId });
        await course.save();

        const student = await Student.findById(studentId);
        student.attendance.push({
            course: courseId,
            courseName: course.name,
            attendancyList: []
        });
                
        await student.save();       

        res.send({course, student});
    }catch(err){
        res.status(400).send({
            status: 400,
            message: err.message
        });
    };
});

router.post('/courses/participants/remove', auth, lecturertAuth, async (req, res) => {    
    try{        
        const studentId = req.body.studentId;
        const courseId = req.body.courseId;
        let studentIndexInCourseParticipants = -1;
        // console.log('course remove stu - ids', studentId, courseId);
        const course = await Course.findById(courseId);
        // console.log('course: ', course);

        for(let i=0; i<course.participants.length; i++){
            if(course.participants[i].studentId.toString() === studentId.toString()){
                studentIndexInCourseParticipants = i;
            };
        };

        if(studentIndexInCourseParticipants === -1)
            return res.status(400).send({
                status: 400,
                message: 'Student not enrolled!'
            });

        course.participants = course.participants.filter((stu)=>stu.studentId.toString() !== studentId.toString());
        
        await course.save();
        const student = await Student.findById(studentId);
        console.log('student: ', student);
        student.attendance = student.attendance.filter((item)=>item.course.toString() !== courseId);
        await student.save();        
        
        res.send({course, student});
    }catch(err){
        res.status(400).send({
            status: 400,
            message: err.message
        });
    };
});

module.exports = router;