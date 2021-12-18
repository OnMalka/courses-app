import React, { useContext } from "react";
import queryString from 'query-string';
import { LoginContext } from "../../context/LoginContext";

const StudentCoursePage = (props) => {

    const params = queryString.parse(props.location.search);
    const { userData } = useContext(LoginContext);
    const attendanceArray = userData.user.attendance;
    const courseAttendancyList = attendanceArray.filter((item)=>item.courseName === params.courseName)[0];

    return (
        <div className='course-page'>
            <div className='attendancy-list'>
                <h1>{ courseAttendancyList.courseName }</h1>
                {courseAttendancyList.attendancyList.map((item, index)=>(
                    <div className={`attendancy-list__item ${index%2 === 0 ? 'even-item' : 'odd-item'}`} key={item._id}>
                        <p>Date: { item.date.slice(0, item.date.indexOf('T')) }</p>
                        <p>Attendance: { item.attended ? 'Attended' : 'Did not attend'}</p>
                        {!item.attended && <p>Absence reason: { item.absenceReason }</p>}                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentCoursePage;