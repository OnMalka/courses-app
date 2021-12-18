import React, { useContext, useState } from 'react';
import { updateCourseAction } from '../../actions/coursesActions';
import { updateUserAction } from '../../actions/studentsActions';
import { CoursesContext } from '../../context/CoursesContext';
import { StudentsContext } from '../../context/StudentsContext';
import { assignStudentToCourse, removeStudentFromCourse } from '../../server/db';
import Loader from '../main/Loader';

const ManageAssignedCourses = (props) => {
    const { courses, dispatchCourses } = useContext(CoursesContext);
    const { students, dispatchStudents } = useContext(StudentsContext);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedCourseIndex, setSelectedCourseIndex] = useState(-1);
    const currentStudent = students[props.studentIndex];
    const [infoMessage, setInfoMessage] = useState('');
    const [displayInfoMessage, setDisplayInfoMessage] = useState(false);
    const [infoMassgeClassName, setInfoMassgeClassName] = useState('');
    const submitButton = document.getElementById('submit-button');

    const setInfoMessageAndDisplay = (message, isRedText = false) => {
        setInfoMassgeClassName(isRedText ? 'red-text' : '');
        submitButton.classList.remove('button--loading');
        setInfoMessage(message);
        setDisplayInfoMessage(true);
        setTimeout(() => {
            setInfoMessage('');
            setDisplayInfoMessage(false);            
          }, 3000);        
    };

    const onSubmitPostNewStudentAssignment = async (event) => {
        event.preventDefault();
        submitButton.classList.add('button--loading');
        const result = await assignStudentToCourse(selectedCourseId, props.studentId);
        // console.log(result);
        if(result.status === 200){
            setInfoMessageAndDisplay('Assignment successful!');
        //     alert('Assignment successful!');
            // setShowToFalse();
            dispatchCourses(updateCourseAction(selectedCourseIndex, result.data.course));
            dispatchStudents(updateUserAction(props.studentIndex, result.data.student));
        }else{
            setInfoMessageAndDisplay(result?.response?.data?.message, true);
        };                    
    };

    const onClickRemoveStudentAssignment = async (event) => {
        event.target.classList.add('button--loading');
        const courseId = event.target.getAttribute('courseid')
        const result = await removeStudentFromCourse(courseId, props.studentId)
        if(result.status === 200){
            setInfoMessageAndDisplay('Student removed from course!');
            // alert('Student removed!');
            dispatchStudents(updateUserAction(props.studentIndex, result.data.student));
            let courseIndex = -1;
            for(let i=0; i<courses.length; i++)
                if(courses[i]._id.toString() === courseId.toString()){
                    courseIndex = i;
                    break;
                };
            if(courseIndex !== -1)
                dispatchCourses(updateCourseAction(courseIndex, result.data.course));
        }else{
            setInfoMessageAndDisplay(result?.response?.data?.message, true);
        };
    };

    const setShowToFalse = () => {
        props.setShowManageAssignedCourses(false);
    };

    const onInputSetSelectedCourseId = (event) => {
        const valueObject = JSON.parse(event.target.value);
        setSelectedCourseId(valueObject.courseId);
        setSelectedCourseIndex(valueObject.courseIndex);
    };

    return (
        courses?.length > 0 ?
        (<div className='manage-courses-div'>
            <form onSubmit={ onSubmitPostNewStudentAssignment }>
                <select onInput={ onInputSetSelectedCourseId } defaultValue=''>
                    <option value='' disabled>Select Course</option>
                    {
                        courses.map((course, index) => (
                            <option key={ course._id } value={ JSON.stringify({courseId: course._id, courseIndex: index}) }>
                                { course.name }
                            </option>
                        ))
                    }
                </select>
                <button id='submit-button' disabled={ selectedCourseId === '' } type='submit'>Assign to class</button>
                <button onClick={ setShowToFalse }>Cancel</button>
                {displayInfoMessage && <p className={infoMassgeClassName} id={'info-message'}>{ infoMessage }</p>}
            </form>
            <h2>Enrolled to: </h2>
            {
                currentStudent.attendance.map((item)=>(<span key={ item._id }>
                    { item.courseName } <button onClick={ onClickRemoveStudentAssignment } courseid={item.course}>x</button>
                </span>))
            }
        </div>) :
        <Loader />
    );
};

export default ManageAssignedCourses;