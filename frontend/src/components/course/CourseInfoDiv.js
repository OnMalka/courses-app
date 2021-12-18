import React from "react";
import moment from 'moment';
import { getDayStringFromInt } from "../../utils/utils";

const CourseInfoDiv = (props) => (
    <div className='lecturer-course-page__div'>
        <h2>Name: {props.currentCourse.name}</h2>
        <p>Subject: {props.currentCourse.subject}</p>
        <p>Lecturer: {props.currentCourse.lecturer.name}</p>
        <p>Lecturer's email: {props.currentCourse.lecturer.email}</p>
        <p>Lecturer's phone: {props.currentCourse.lecturer.phoneNumber}</p>
        <p>From: { moment(props.currentCourse.startDate).format("MMM Do YY") } To: { moment(props.currentCourse.endDate).format("MMM Do YY") }</p>
        {props.currentCourse.schedule.map((item)=>(
            <p key={item._id}>{ getDayStringFromInt(item.dayOfTheWeek) }: { item.startingAt } - { item.endingAt }</p>
        )) }
    </div>
);

export default CourseInfoDiv;