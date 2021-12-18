import React, { useContext } from "react";
import { Redirect, Route } from "react-router";
import { LoginContext } from "../context/LoginContext";

const StudentsRoute = ({ component: Component, ...rest }) => {
    const {userData} = useContext(LoginContext);

    return (
        <Route 
            { ...rest }
            component={(props)=>(
                userData.user?.userType === 'student' ?
                <Component { ...props }/> :
                <Redirect to={{ pathname: '/login', state:{ needToLogin: true } }}/>
            )}
        />
    );
};

export default StudentsRoute;