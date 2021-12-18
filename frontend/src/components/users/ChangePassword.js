import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// import { LoginContext } from "../../context/LoginContext";
import { ChangeUsersPassword } from "../../server/db";

const CahngePassword = () =>{
    // const {userData} = useContext(LoginContext);
    const history = useHistory();

    const [errorMessages, setErrorMessages] = useState(['','','']);
    const [displayErrorMessages, setDisplayErrorMessages] = useState([false, false, false]);
    const [validInputs, setValidInputs] = useState([false, false, false]);
    const [infoMessage, setInfoMessage] = useState('');
    const [displayInfoMessage, setDisplayInfoMessage] = useState(false);
    const [infoMassgeClassName, setInfoMassgeClassName] = useState('');
    const submitButton = document.getElementById('change-password-submit-button');

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

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

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{7,}$/;

    const onBlurOldPasswordInput = (event) => {        
        const value = event.target.value.trim();
        const isPassword = passwordRegex.test(value);
        let message = '';
        if(!isPassword){
            message = value === '' ? 
            'Please enter your old password' : 
            'Password must contain capital regular and special characters, numbers and must have at least 7 characters';
        };
        setErrorMessageAndDisplay(message, 0, !isPassword);
        setValidInput(isPassword, 0);
        setOldPassword(value);
    };

    const onBlurNewPasswordInput = (event) => {
        const value = event.target.value.trim();
        const isPassword = passwordRegex.test(value);
        let message = '';
        if(!isPassword)
            message = value === '' ? 
            'Please enter your new password' : 
            'Password must contain capital regular and special characters, numbers and must have at least 7 characters'        
        setErrorMessageAndDisplay(message, 1, !isPassword);
        setValidInput(isPassword, 1);
        setNewPassword(value);
    };

    const onBlurRepeatPasswordInput = (event) => {
        const value = event.target.value.trim();
        const isMatching = newPassword === value ;
        let message = isMatching ? 
            (value === '' ? 'Please enter your new password' : '') 
            : 'You must enter a matching password';
        setErrorMessageAndDisplay(message, 2, !isMatching);
        setValidInput(isMatching, 2);
    };

    const onSubmitChangePassword = async (event) => {
        event.preventDefault();        
        submitButton.classList.add('button--loading');
        try{
            if(!validInputs.includes(false)){
                const result = await ChangeUsersPassword(oldPassword, newPassword);
                if(result?.status === 200){
                    history.push('/students');
                }else{
                    setInfoMessageAndDisplay(result?.response?.data?.message, true);
                };
            };
        }catch(err){
            setInfoMessageAndDisplay(err.response.data.message, true);
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
    <div className='change-password-div'>
        <form onSubmit={ onSubmitChangePassword }>
            <h1>Change password</h1>
            <span>
                <label htmlFor='old-password-input'>Old password: </label>
                { displayErrorMessages[0] && <span>{ errorMessages[0] }</span>}
                <input onBlur={ onBlurOldPasswordInput } id='old-password-input'></input>
            </span>
            <span>
                <label htmlFor='new-password-input'>New password: </label>
                { displayErrorMessages[1] && <span>{ errorMessages[1] }</span>}
                <input onBlur={ onBlurNewPasswordInput } id='new-password-input'></input>
            </span>
            <span>
                <label htmlFor='repeat-new-password-input'>Repeat new password: </label>
                { displayErrorMessages[2] && <span>{ errorMessages[2] }</span>}
                <input onBlur={ onBlurRepeatPasswordInput } id='repeat-new-password-input'></input>
            </span>            
            <button id={'change-password-submit-button'} disabled={ validInputs.includes(false) } type='submit'>Submit</button>
        </form>
        {displayInfoMessage && <h2 className={infoMassgeClassName} id={'info-message'}>{ infoMessage }</h2>}
    </div>
    );
};

export default CahngePassword;