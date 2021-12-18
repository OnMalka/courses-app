import React, { useContext } from "react";
import { CoursesContext } from "../../context/CoursesContext";
import  moment  from 'moment';
import { useHistory } from "react-router";
import Loader from '../main/Loader';

const AllCoursesDiv = () => {
    const { courses } = useContext(CoursesContext);
    const history = useHistory();

    const goToCoursePage = (event) => {
        const courseIndex =
            event.target.getAttribute('courseindex') || 
            event.target.parentElement.getAttribute('courseindex');
        history.push(`/course-lec?courseIndex=${courseIndex}`);
    };

    return (
        courses?.length > 0 ?
        (<div className='lecturers-page__div'>
            {courses.map((course, index)=>(
                <div className='div-hover' key={ course._id } courseindex={ index } onClick={ goToCoursePage }>
                        <h2>Course name: { course.name }</h2>
                        <p>Subject: { course.subject }</p>
                        <p>Lecturer: { course.lecturer.name}</p>
                        <p>From: { moment(course.startDate).format("MMM Do YY") } To: { moment(course.endDate).format("MMM Do YY") }</p>
                </div>
            ))}            
        </div>) :
        <Loader />
    );
};

export default AllCoursesDiv;