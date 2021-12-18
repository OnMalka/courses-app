import React, { useContext, useState } from 'react';
import { StudentsContext } from '../../context/StudentsContext';
import Loader from '../main/Loader';
import ManageAssignedCourses from './ManageAssignedCourses';

const StudentPage = (props) => {
    const { students } = useContext(StudentsContext);
    const studentIndex = props.match.params.studentIndex;
    const currentStudent = students[studentIndex];
    const [showManageAssignedCourses, setShowManageAssignedCourses] = useState(false);

    const onClickSetShowManageAssignedCourses = () => {
        setShowManageAssignedCourses(true);
    };

    return (
        students?.length > 0 ?
        (<div className='lecturers-student-page'>                                   
            <div className='lecturers-student-page__div'>
                <h2>Name: { currentStudent.name }</h2>
                <p>Email: { currentStudent.email }</p>
                <p>Phone number: { currentStudent.phoneNumber }</p>
                <p>address: { currentStudent.address }</p>
            </div>
            <div className='lecturers-student-page__div'>
                <h2>Attendance</h2>
                {
                    currentStudent.attendance.map((courseAttendance)=>(
                        <div key={ courseAttendance._id }>
                            <h2>Course name: { courseAttendance.courseName }</h2>
                            { courseAttendance.attendancyList.map((item, index)=>(
                                <div className={ `attendancy-list-item ${index%2 === 0 ? 'even-item' : 'odd-item'}` } key={ item._id }>
                                    <p>Date: { item.date.slice(0, item.date.indexOf('T')) }</p>
                                    <p>Attendance: { item.attended ? 'Attended' : 'Did not attend'}</p>
                                    {!item.attended && <p>Absence reason: { item.absenceReason }</p>}
                                </div>
                            )) }
                        </div>
                    ))
                }
            </div>
            <div className='lecturers-student-page__div'>
                <h2>Utilities</h2>
                {
                    showManageAssignedCourses ?
                    <ManageAssignedCourses studentIndex={ studentIndex } studentId={ currentStudent._id } setShowManageAssignedCourses={setShowManageAssignedCourses} /> :
                    <button onClick={ onClickSetShowManageAssignedCourses }>Manage courses</button>
                }                
            </div>
        </div>) :
        <Loader />
    );
};

export default StudentPage;