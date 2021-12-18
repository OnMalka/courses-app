import React, { useContext } from "react";
import { useHistory } from "react-router";
import { LoginContext } from "../../context/LoginContext";

const EnrolledCourses = () => {
    const {userData} = useContext(LoginContext);
    const history = useHistory();
    const attendanceArray = userData.user.attendance;

    const onClickGoToCoursePage = (event) => {
        const courseName = event.target.getAttribute('coursename');
        history.push(`/course-stu?courseName=${courseName}`);
    };

    return (
        <div className='enrolled-courses'>
            { attendanceArray.map((item)=>{     
                return(
                    <div className='enrolled-courses__item' key={ item._id }>
                        <span>{ item.courseName }</span>
                        <button onClick={ onClickGoToCoursePage } coursename={ item.courseName }>Attendance</button>  
                    </div>                
                );
            }) }
        </div>
    );
};

export default EnrolledCourses;