import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { loginAction } from "../../actions/loginActions";
import { LoginContext } from "../../context/LoginContext";
import { saveUserOnLocalStorage } from "../../localStorage/localStorage";
import { loginToSite } from "../../server/auth";

const LoginForm = (props)=>{
    const {dispatchUserData} = useContext(LoginContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailInputValid, setIsEmailInputValid] = useState(true);
    const [isPasswordInputValid, setIsPasswordInputValid] = useState(true);    
    const [errorMessage, setErrorMessage] = useState('');
    const [isLecturer, setIsLecturer] = useState(false);

    useEffect(()=>{
        if(props.errorMessage !== ''){
            setErrorMessage(props.errorMessage);
        };
    }, [props.errorMessage]);

    const history = useHistory();

    const isFormValid =() => {
        return email === '' || password === '';
    };

    const onBlurEmailInput = (event)=>{
        const theEmail = event.target.value.trim();
        if(theEmail === ''){
            setEmail('');
            setIsEmailInputValid(false);
        }else{
            setEmail(theEmail);
            setIsEmailInputValid(true);
        }
    };

    const onBlurPasswordInput = (event)=>{
        const thePassword = event.target.value.trim();
        setPassword(thePassword === '' ? '' : thePassword);
        setIsPasswordInputValid(thePassword !== '');
    };

    const onSubmitForm = async (event)=>{
        event.preventDefault();        
        try{
            const loginResult = await loginToSite(email, password, isLecturer);
            dispatchUserData(loginAction(loginResult));
            saveUserOnLocalStorage(loginResult);
            history.push(`/${ isLecturer ? 'lecturers/courses' : 'students'}`);

        }catch(err){
            if(err.message === 'Email or password invalid.'){
                setErrorMessage(err.message);
            }
        }
    };

    const onInputSetIsLecturer = (event) => {
        setIsLecturer(event.target.checked);
    };  

    return(
        <div className='login-form'>
            <h3>Login</h3>
            {errorMessage !== '' && <div className='error-message'>{ errorMessage }</div>}
            <form onSubmit={onSubmitForm}>
                <input placeholder='Email' onBlur={onBlurEmailInput}></input>
                {!isEmailInputValid && <div className='invalid-message'>You must enter your email.</div>}
                <input type='password' placeholder='Password' onBlur={onBlurPasswordInput}></input>
                {!isPasswordInputValid && <div className='invalid-message'>You must enter your password.</div>}
                <span>
                    <label htmlFor='isLecturer'>I am a lecturer</label>
                    <input className='inline' onInput={ onInputSetIsLecturer } id='isLecturer' type='checkbox'></input>
                </span>                
                <div className='login-form__nav'>
                    <button type='submit' disabled={isFormValid()}>Submit</button>
                </div>
            </form>
        </div>
    )
};

export default LoginForm;