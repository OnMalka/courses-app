import React, { useContext} from "react";
import { Redirect, Route } from "react-router";
import { LoginContext } from "../context/LoginContext";

const LecturersRoute = ({ component: Component, ...rest }) => {
    const {userData} = useContext(LoginContext);

    return (
        <Route 
            { ...rest }
            component={(props)=>(
                userData.user?.userType === 'lecturer' ?
                <Component { ...props }/> :
                <Redirect to={{ pathname: '/login', state:{ needToLogin: true } }}/>
            )}
        />
    );
};

export default LecturersRoute;