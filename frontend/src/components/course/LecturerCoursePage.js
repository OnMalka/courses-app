import React, { useContext, useState } from "react";
import queryString from 'query-string';
import { CoursesContext } from "../../context/CoursesContext";
import Loader from '../main/Loader';
import { StudentsContext } from "../../context/StudentsContext";
import { useHistory } from "react-router";
import { updateCourseAction } from "../../actions/coursesActions";
import { updateUserAction } from "../../actions/studentsActions";
import { assignStudentToCourse, removeStudentFromCourse } from "../../server/db";
import CourseInfoDiv from "./CourseInfoDiv";
import AttendanceDiv from "./AttendancyDiv";

const LecturerCoursePage = (props) => {
    const {courses, dispatchCourses} = useContext(CoursesContext);
    const {students, dispatchStudents} = useContext(StudentsContext);
    const [addStudentInput, setAddStudentInput] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [displayInfoMessage, setDisplayInfoMessage] = useState(false);
    const [infoMassgeClassName, setInfoMassgeClassName] = useState('');
    const [showManageAssignedStudents, setShowManageAssignedStudents] = useState(false);
    const addStudentButton = document.getElementById('add-student-button');
    const history = useHistory();
    const courseIndex = queryString.parse(props.location.search).courseIndex;
    const currentCourse = courses[courseIndex];

    const onClickGoToStudentPage = (event) => {
        const studentIndex =
            event.target.getAttribute('studentindex') || 
            event.target.parentElement.getAttribute('studentindex');
        history.push(`/student/${studentIndex}`);
    };

    const onInputSetAddStudentInput = (event) => {
        setAddStudentInput(event.target.value);
    };

    const onClickAddStudent = async (event) => {
        addStudentButton.classList.add('button--loading');
        try{
            const result = await assignStudentToCourse(currentCourse._id, students[addStudentInput]._id);
            console.log(result.response);
            if(result.status === 200){
                setInfoMessageAndDisplay('Assignment successful!', event.target);
                dispatchCourses(updateCourseAction(courseIndex, result.data.course));
                dispatchStudents(updateUserAction(addStudentInput, result.data.student));
            }else{
                setInfoMessageAndDisplay(result.response.data.message, event.target, true);
            };
        }catch(err){
            console.log(err);
        };
    };

    const onClickRemoveStudent = async (event) => {
        const studentIndex = event.target.getAttribute('studentindex');
        event.target.classList.add('button--loading');
        try{
            const result = await removeStudentFromCourse(currentCourse._id, students[studentIndex]._id)
            if(result.status === 200){
                setInfoMessageAndDisplay('Student removed!', event.target);
                dispatchStudents(updateUserAction(studentIndex, result.data.student));
                dispatchCourses(updateCourseAction(courseIndex, result.data.course));
            }else{
                setInfoMessageAndDisplay(result.response.data.message, event.target, true);
            };
        }catch(err){
            console.log(err);
        };        
    };

    const setInfoMessageAndDisplay = (message, button, isRedText = false) => {
        setInfoMassgeClassName(isRedText ? 'red-text' : '');
        button.classList.remove('button--loading');
        setInfoMessage(message);
        setDisplayInfoMessage(true);
        setTimeout(() => {
            setInfoMessage('');
            setDisplayInfoMessage(false);            
          }, 3000);        
    };

    const onClickShowDiv = () => {
        setShowManageAssignedStudents(true);
    };

    const onClickSRemoveDiv = () => {
        setShowManageAssignedStudents(false);
        setAddStudentInput('');
    };

    return (
        courses?.length > 0 ?
        (<div className='lecturer-course-page'>
            <CourseInfoDiv currentCourse={currentCourse}/>
            <AttendanceDiv currentCourse={currentCourse}/>
            <div className='lecturer-course-page__div'>
                <h2>Participants: </h2>
                {
                    currentCourse.participants.length > 0 ?
                    currentCourse.participants.map((item, index)=>{
                        const currentStudentIndex = students.findIndex((stu) => stu._id === item.studentId);
                        const currentStudent = students[currentStudentIndex];
                        
                        return (
                            <span key={item._id}>
                                <h3 studentindex={ currentStudentIndex } onClick={ onClickGoToStudentPage } className={ `div-hover` }>
                                    { currentStudent.name }                                
                                </h3>
                                {showManageAssignedStudents && <button studentindex={ currentStudentIndex } onClick={onClickRemoveStudent}>X</button>}
                            </span>
                        );
                    }) :
                    <h2>None</h2>
                }
                {!showManageAssignedStudents && <button onClick={onClickShowDiv}>Manage Participants</button>}
                {showManageAssignedStudents && <select onInput={onInputSetAddStudentInput} defaultValue=''>
                        <option value='' disabled>Select student</option>
                        {
                            students.map((student, index)=>(
                                <option value={index} key={ student._id }>{student.name}</option>                                        
                            )) 
                        }
                </select>}
                {showManageAssignedStudents && <button id={'add-student-button'} onClick={onClickAddStudent} disabled={addStudentInput === ''}>Add participant</button>}
                {showManageAssignedStudents && <button onClick={onClickSRemoveDiv}>Cancel</button>}
                {displayInfoMessage && <h2 className={infoMassgeClassName}>{ infoMessage }</h2>}
            </div>                        
        </div>) :
        <Loader />
    );
};

export default LecturerCoursePage;