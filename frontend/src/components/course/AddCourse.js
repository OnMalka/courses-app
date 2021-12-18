import React, { useContext, useState } from "react";
import { LoginContext } from "../../context/LoginContext";
import { getAllCoursesFromDB, postNewCourse } from "../../server/db";
import { getDayStringFromInt } from "../../utils/utils";
import { CoursesContext } from "../../context/CoursesContext";
import { initCoursesAction } from "../../actions/coursesActions";

const AddCourse = () => {
    const {userData} = useContext(LoginContext);
    const {dispatchCourses} = useContext(CoursesContext);
    const scheduleRegex = /(0?[0]|1[0-9]|2[0-5]):[0-9]+\s[A, P]M/i;
    const [infoMessage, setInfoMessage] = useState('');
    const [displayInfoMessage, setDisplayInfoMessage] = useState(false);
    const [infoMassgeClassName, setInfoMassgeClassName] = useState('');
    const submitButton = document.getElementById('new-course-submit-button');

    const [errorMessages, setErrorMessages] = useState(['','','']);
    const [displayErrorMessages, setDisplayErrorMessages] = useState([false, false, false, false, false, false, false]);
    const [validInputs, setValidInputs] = useState([false, false, false, false, false, false, false]);

    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [schedule, setSchedule] = useState([{},{},{},{},{},{},{}]);
    const [day, setDay] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

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

    const onBlurSetName = (event) => {
        const value = event.target.value.trim();
        if(value === ''){
            setErrorMessageAndDisplay('Please enter course name', 0, true);
            setValidInput(false, 0);
        }else{
            setErrorMessageAndDisplay('', 0, false);
            setValidInput(true, 0);
        }
        setName(value);
    };

    const onBlurSetSubject = (event) => {
        const value = event.target.value.trim();
        if(value === ''){
            setErrorMessageAndDisplay('Please enter subject', 1, true);
            setValidInput(false, 1);
        }else{
            setErrorMessageAndDisplay('', 1, false);
            setValidInput(true, 1);
        }
        setSubject(value);
    };

    const onBlurSetStartDate = (event) => {
        const value = event.target.valueAsDate
        if(!value){
            setErrorMessageAndDisplay('Please enter start date', 2, true);
            setValidInput(false, 2);
        }else{
            setErrorMessageAndDisplay('', 2, false);
            setValidInput(true, 2);
        }
        setStartDate(value);
    };

    const onBlurSetEndDate = (event) => {
        const value = event.target.valueAsDate
        if(!value){
            setErrorMessageAndDisplay('Please enter end date', 3, true);
            setValidInput(false, 3);
        }else{
            setErrorMessageAndDisplay('', 3, false);
            setValidInput(true, 3);
        }
        setEndDate(value);
    };

    const onBlurSetDay = (event) => {
        const value = event.target.value
        if(!value){
            setErrorMessageAndDisplay('Please enter day', 4, true);
            setValidInput(false, 4);
        }else{
            setErrorMessageAndDisplay('', 4, false);
            setValidInput(true, 4);
        }
        setDay(value);
    };

    const onBlurSetFrom = (event) => {
        const value = event.target.value
        if(!value){
            setErrorMessageAndDisplay('Please enter from', 5, true);
            setValidInput(false, 5);
        }else if(!scheduleRegex.test(value)){
            setErrorMessageAndDisplay('Please use the following format: HH:MM AM/PM', 5, true);
            setValidInput(false, 5);
        }else{
            setErrorMessageAndDisplay('', 5, false);
            setValidInput(true, 5);
        }
        setFrom(value);
    };

    const onBlurSetTo = (event) => {
        const value = event.target.value
        if(!value){
            setErrorMessageAndDisplay('Please enter to', 6, true);
            setValidInput(false, 6);
        }else if(!scheduleRegex.test(value)){
            setErrorMessageAndDisplay('Please use the following format: HH:MM AM/PM', 6, true);
            setValidInput(false, 6);
        }else{
            setErrorMessageAndDisplay('', 6, false);
            setValidInput(true, 6);
        }
        setTo(value);
    };

    const onClickAddSchedule = (event) => {
        event.preventDefault();
        if(validInputs[4]&&validInputs[5]&&validInputs[6]){
            const newScheduleItem = {dayOfTheWeek:parseInt(day), startingAt:from, endingAt:to};            
            let theSchedule = [...schedule];
            theSchedule[newScheduleItem.dayOfTheWeek] = newScheduleItem;
            setSchedule(theSchedule);
            document.getElementById('daySelect').value = '';
            document.getElementById('startingAtInput').value = '';
            document.getElementById('endingAtInput').value = '';
        };
    };

    const isSubmitButtonDisabled = () => {
        if([validInputs[0], validInputs[1], validInputs[2], validInputs[3]].includes(false)){            
            return true;
        };
        for(let item of schedule){
            if(JSON.stringify(item) !== '{}')
                return false;
        };
            return true;
    };

    const onSubmitPostNewCourse = async (event) => {
        event.preventDefault();        
        submitButton.classList.add('button--loading');

        try {
            const newCourse = {
                name,
                subject,
                lecturer: userData.user._id,
                startDate,
                endDate,
                schedule: schedule.filter((item)=>JSON.stringify(item) !== '{}')
            };
            const result = await postNewCourse(newCourse);
            console.log('result ', result);
            console.log('response ', result.response);
            console.log('data ',result.data);
            if(result?.status === 200){
                setInfoMessageAndDisplay('Course added!');
                const res = await getAllCoursesFromDB(true);
                const theCourses = res.data;
                dispatchCourses(initCoursesAction(theCourses));                
            }else{
                setInfoMessageAndDisplay(result?.response?.data?.message, true);
            };                
        } catch (err) {
            console.log(err);
        };
    };

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

    return (
        <div className='add-course-page'>
            <form onSubmit={ onSubmitPostNewCourse }>
                <span>
                    <label htmlFor='nameInput'>Name: </label>
                    { displayErrorMessages[0] && <span>{ errorMessages[0] }</span>}
                    <input onBlur={ onBlurSetName } id='subjectInput' type='text'/>
                </span>
                <span>
                    <label htmlFor='subjectInput'>Subject: </label>
                    { displayErrorMessages[1] && <span>{ errorMessages[1] }</span>}
                    <input onBlur={ onBlurSetSubject } id='nameInput' type='text'/>
                </span>                  
                <span>
                    <label htmlFor='startDateInput'>Start date: </label>
                    { displayErrorMessages[2] && <span>{ errorMessages[2] }</span>}
                    <input onBlur={ onBlurSetStartDate } id='startDateInput' type='date'/>
                </span>                             
                <span>
                    <label htmlFor='endDateInput'>End date: </label>
                    { displayErrorMessages[3] && <span>{ errorMessages[3] }</span>}
                    <input onBlur={ onBlurSetEndDate } id='endDateInput' type='date'/>
                </span>
                <span>Schedule:</span>
                {schedule.length > 0 && schedule.map((item, index)=>{
                    const dayAsString = getDayStringFromInt(parseInt(item.dayOfTheWeek));
                    return (
                        JSON.stringify(item) === '{}' ?
                        null :
                        <span key={item.dayOfTheWeek+item.startingAt+ item.endingAt}>{ dayAsString } from: { item.startingAt } to: { item.endingAt }</span>
                    )
                })}
                <span>
                    <select onBlur={ onBlurSetDay } id='daySelect' defaultValue=''>
                        <option value='' disabled>Select day</option>
                        <option value='0'>Sunday</option>
                        <option value='1'>Monday</option>
                        <option value='2'>Tuseday</option>
                        <option value='3'>wednesday</option>
                        <option value='4'>Thursday</option>
                        <option value='5'>Friday</option>
                        <option value='6'>Saturday</option>
                    </select>
                    { displayErrorMessages[4] && <span>{ errorMessages[4] }</span>}                                        
                    <button onClick={ onClickAddSchedule }>Add to schedual</button>
                </span>
                <span>
                    <label htmlFor='startingAtInput'>From: </label>
                    { displayErrorMessages[5] && <span>{ errorMessages[5] }</span>}
                    <input onBlur={ onBlurSetFrom } id='startingAtInput' type='text'/>
                </span>
                <span>
                    <label htmlFor='endingAtInput'>To: </label>
                    { displayErrorMessages[6] && <span>{ errorMessages[6] }</span>}
                    <input onBlur={ onBlurSetTo } id='endingAtInput' type='text'/>                    
                </span>
                <button id={'new-course-submit-button'} disabled={ isSubmitButtonDisabled() }>Submit</button>
            </form>
            {displayInfoMessage && <h2 className={infoMassgeClassName}>{ infoMessage }</h2>}
        </div>
    );
}

export default AddCourse;