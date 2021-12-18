import React, { useContext, useEffect, useState } from "react";
import { updateUserAction } from "../../actions/loginActions";
import { LoginContext } from "../../context/LoginContext";
import { saveUserOnLocalStorage } from "../../localStorage/localStorage";
import { getCourseFromDB, postNewAttendancyListItem } from '../../server/db';
import { getScheduledDatesForCourse } from "../../utils/utils";

const AsignAttendance = () => {
    const { userData, dispatchUserData } = useContext(LoginContext);
    const attendanceArray = userData.user.attendance;
    const [errorMessages, setErrorMessages] = useState(['','','']);
    const [displayErrorMessages, setDisplayErrorMessages] = useState([false, false, false]);
    const [validInputs, setValidInputs] = useState([false, false, true]);
    const [course, setCourse] = useState(null);
    const [date, setDate] = useState(null);
    const [attended, setAttended] = useState(true);
    const [absenceReason, setAbsenceReason] = useState('');
    const [scheduledDates, setScheduledDates] = useState([]);
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

    useEffect(() => {
        const daysOfTheWeek = [];
        if(!!course?.schedule){
            for(let item of course.schedule){
                daysOfTheWeek.push(item.dayOfTheWeek);
            };   
            setScheduledDates(getScheduledDatesForCourse(
                course.startDate, course.endDate, daysOfTheWeek
            ));
        };
        return () => {
            setScheduledDates([]);
          };     
    }, [course])

    const setErrorMessageAndDisplay = (message, messageIndex, display) => {
        const theErrorMessages = [...errorMessages];
        const theDisplayErrorMessages = [...displayErrorMessages];
        theErrorMessages[messageIndex] = message;
        theDisplayErrorMessages[messageIndex] = display;
        setErrorMessages(theErrorMessages);
        setDisplayErrorMessages(theDisplayErrorMessages);
    };

    const setValidInput = (value, inputIndex) => {
        const theValidInputs = [...validInputs];
        theValidInputs[inputIndex] = value;
        setValidInputs(theValidInputs);
    };

    const onClickSetAttended = (event) => {
        const value = event.target.checked
        setAttended(value);
        setValidInput(value, 2);
    };

    const onInputCourseInput = async (event) => {
        document.getElementById('date-select').value = '';
        const courseId = event.target.value;
        try{
            const theCourse = await getCourseFromDB(courseId);
            if(!theCourse){
                setErrorMessageAndDisplay('Please select a course', 0, true);
                setValidInput(false, 0);
                setCourse(null);
                setScheduledDates([]);
            }else{
                setErrorMessageAndDisplay('', 0, false);
                setValidInput(true, 0);
                setCourse(theCourse.data);  
                const daysOfTheWeek = [];
                if(course?.schedule.length > 0){
                    for(let item of course.schedule){
                        daysOfTheWeek.push(item.dayOfTheWeek);
                    };
                    setScheduledDates(getScheduledDatesForCourse(
                        course.startDate, course.endDate, daysOfTheWeek
                    ));
                };              
            };                
        }catch(err){
            console.log(err);
        };        
    };

    const onInputDateSelect = (event) => {
        const theDate = new Date(event.target.value);
        // const theDate = event.target.value;
        try{
            if(!validInputs[0]){
                setErrorMessageAndDisplay('Please select a course', 0, true);
                setValidInput(false, 0);
            }else if(!theDate){
                setErrorMessageAndDisplay('Please select a Date', 1, true);
                setValidInput(false, 1);
            }else{
                let isDateInCoursesSchedule = false;
                for(let item of course.schedule){
                    if(item.dayOfTheWeek === theDate.getDay())
                        isDateInCoursesSchedule = true;                
                };
                if(isDateInCoursesSchedule){
                    setErrorMessageAndDisplay('', 1, false);
                    setValidInput(true, 1);
                    setDate(theDate);
                }else{
                    setErrorMessageAndDisplay('Selected date is not in schedual', 1, true);
                    setValidInput(false, 1);
                    setDate(null);
                };
            };            
        }catch(err){
            console.log(err);
        };
    };

    const onInputAbsenceReasonInput = (event) => {
        const theAbsenceReason = event.target.value.trim();
        if(theAbsenceReason === ''){
            setErrorMessageAndDisplay('Reason is required', 2, true);
            setValidInput(false, 2);
            setAbsenceReason('');
        }else{
            setErrorMessageAndDisplay('', 2, false);
            setValidInput(true, 2);
            setAbsenceReason(theAbsenceReason);
        };
    };

    const onSubmitPostAttendancy = async (event) => {
        event.preventDefault();
        submitButton.classList.add('button--loading');
        try{
            if(!validInputs.includes(false)){
                const result = await postNewAttendancyListItem({date, attended, absenceReason}, course._id, course.name);
                if(result.status === 200){
                    // console.log('result::::::::   ', result.data);
                    setTimeout(() => {
                        dispatchUserData(updateUserAction(result.data));            
                      }, 3000); 
                    
                    saveUserOnLocalStorage({ ...userData, user: result.data });
                    setInfoMessageAndDisplay('Course attendancy submited');
                    // alert('Course attendancy submited');
                }else{
                    setInfoMessageAndDisplay(result?.response?.data?.message, true);
                };
            };
        }catch(err){
            console.log(err);
        };
    };

    return (
        <div className='asign-attendance-page'>            
            <form onSubmit={ onSubmitPostAttendancy }>
                <h1>{ userData.user.name }</h1>
                <span>
                    <label htmlFor='course-input'>Course: </label>
                    { displayErrorMessages[0] && <span>{ errorMessages[0] }</span>}
                    <select defaultValue='Select Course' id='course-input' onInput={ onInputCourseInput }>
                        <option value="Select Course" disabled>Select Course</option>
                        {attendanceArray.map((item)=>(
                            <option key={ item._id } value={ item.course }>{ item.courseName }</option>
                        ))}
                    </select>                    
                </span>
                <span>
                    <label htmlFor='date-select'>Date: </label>
                    { displayErrorMessages[1] && <span>{ errorMessages[1] }</span>}
                    {/* <input onInput={ onInputDateInput } type='date' id='date-input'></input> */}
                    <select defaultValue='' onInput={ onInputDateSelect } id='date-select'>
                        <option value='' disabled>Select date</option>
                        {
                            scheduledDates.map((date)=>(
                                <option value={date} key={date}>{date.toDateString()}</option>
                            ))
                        }
                    </select>
                </span>
                <span>
                    <label htmlFor='attended-input'>Attended: </label>
                    <input className='large' type='checkbox' id='attended-input' defaultChecked='true' onClick={ onClickSetAttended }/>
                </span>
                {
                    !attended &&
                    <span>
                        <label htmlFor='absence-reason-input'>Absence reason: </label>
                        { displayErrorMessages[2] && <span>{ errorMessages[2] }</span>}
                        <input onInput={ onInputAbsenceReasonInput } type='text' id='absence-reason-input'></input>
                    </span>
                }
                <button id='submit-button' disabled={validInputs.includes(false)} type='submit'>Submit</button>
                {displayInfoMessage && <h2 className={infoMassgeClassName} id={'info-message'}>{ infoMessage }</h2>}
            </form>
        </div>
    );
};

export default AsignAttendance;