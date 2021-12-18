import React, { useContext, useEffect, useState } from "react";
import { StudentsContext } from "../../context/StudentsContext";
import { getScheduledDatesForCourse } from "../../utils/utils";

const AttendanceDiv = (props) => {
    const [scheduledDates, setScheduledDates] = useState([]);
    const [attendancies, setAttendancies] = useState([]);
    const {students} = useContext(StudentsContext);
    // const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        const daysOfTheWeek = [];
        for(let item of props.currentCourse.schedule){
            daysOfTheWeek.push(item.dayOfTheWeek);
        };
        setScheduledDates(getScheduledDatesForCourse(
            props.currentCourse.startDate, props.currentCourse.endDate, daysOfTheWeek
        ));
    }, [props.currentCourse]);

    const onInputSetSelectedDate = (event) => {
        // setSelectedDate(event.target.value);
        setAttendancies([]);
        const theAttendancies = [];
        // console.log('date: ', event.target.value);
        for(let student of students){
            // console.log('student: ', student.name);
            const attendance = student.attendance.find((item)=>item.course === props.currentCourse._id);
            // console.log('attendance: ', attendance);
            // if(attendance)
            //     for(let item of attendance.attendancyList){
            //         console.log('cur date: ', event.target.value);
            //         console.log('al date: ', new Date(item.date).getDate() === new Date(event.target.value).getDate());
            //     }
            const attendancyListItem = attendance?.attendancyList.find((item)=>new Date(item.date).getDate() === new Date(event.target.value).getDate());
            // console.log('attendancyListItem: ', attendancyListItem);
            if(!!attendancyListItem)
                theAttendancies.push({studentName: student.name, attended: attendancyListItem.attended, absenceReason: attendancyListItem.absenceReason});
        };
        setAttendancies(theAttendancies);
        // console.log(theAttendancies);
    };
    
    return (
    <div className='lecturer-course-page__div'>
        <h2>Attendace</h2>
        <select defaultValue='' onInput={onInputSetSelectedDate}>
            <option value='' disabled>Select date</option>
            {scheduledDates.map((date)=>(
                <option value={date} key={date}>{date.toDateString()}</option>
            ))}            
        </select>
        {attendancies.map((item, index)=>(
                <p className={index%2 === 0 ? 'even-item' : 'odd-item'} key={item.studentName}>{item.studentName}: {item.attended ? 'attended' : 'was absent'} {item.absenceReason}</p>
            ))}
    </div>
    );
};

export default AttendanceDiv;