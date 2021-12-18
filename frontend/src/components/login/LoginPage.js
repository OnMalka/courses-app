import React from "react";
import LoginForm from "./loginForm";

const LoginPage = (props)=>{
    const errorMessage = props.location.state?.needToLogin ? 'You must login!' : '';

    return(
        <div className='login-page'>
            <div className='login-page__form'>                
                <LoginForm errorMessage={ errorMessage } />                 
            </div>
        </div>
    )
};

export default LoginPage;