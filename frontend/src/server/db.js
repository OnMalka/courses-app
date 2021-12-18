import Axios from 'axios';
import { getTokenFromLocalStorage } from '../localStorage/localStorage';

const DB_URL = process.env.REACT_APP_DB;

export const getCourseFromDB = async (courseId, withPopulate = false) => {
    try{
        const course = await Axios.get(DB_URL + `courses/get?courseId=${courseId}${withPopulate?',withPopulate=true':''}`);

        return course;
    }catch(err){
        console.log(err);
    };
};

export const getAllCoursesFromDB = async (withPopulate=false) => {
    try{
        const courses = await Axios.get(DB_URL + `courses/all${withPopulate?'?withPopulate=true':''}`);

        return courses;
    }catch(err){
        console.log(err);
    };
};

export const getAllStudentsFromDB = async () => {
    try{
        const students = await Axios.get(DB_URL + 'students/all');

        return students;
    }catch(err){
        console.log(err);
    };
};

export const postNewAttendancyListItem = async (newAttendancyListItem, courseId, courseName) => {
    try{
        const result = await Axios.post(DB_URL + 'students/submit-attendancy', {
            newAttendancyListItem,
            courseId,
            courseName
        }, {            
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getTokenFromLocalStorage()
            }
        });
        return result;
    }catch(err){        
        return err;
    };
};

export const ChangeUsersPassword = async (oldPassword, newPassword) => {
    try{
        const res = await Axios.patch(DB_URL + 'lecturers/change-password', {
            oldPassword,
            newPassword
        }, {            
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getTokenFromLocalStorage()
            }
        });
        return res;
    }catch(err){
        return err;
    };
};

export const postNewCourse = async (newCourse) => {
    try{
        const response = await Axios.post(DB_URL + 'courses/new', {
            newCourse
        }, {            
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getTokenFromLocalStorage()
            }
        });
        return response;
    }catch(err){
        return err;
    };
};

export const assignStudentToCourse = async (courseId, studentId) => {
    try{
        const result = await Axios.post(DB_URL + 'courses/participants/add', {
            courseId,
            studentId
        }, {            
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getTokenFromLocalStorage()
            }
        });
        return result;
    }catch(err){
        // console.log(err.response.data);
        return err;
    };
};

export const removeStudentFromCourse = async (courseId, studentId) => {
    try{
        const result = await Axios.post(DB_URL + 'courses/participants/remove', {
            courseId,
            studentId
        }, {            
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getTokenFromLocalStorage()
            }
        });
        return result;
    }catch(err){
        return err;
    };
};