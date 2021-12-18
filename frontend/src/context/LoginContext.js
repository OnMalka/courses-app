import React, { createContext, useReducer } from "react";
import { getTokenFromLocalStorage, getUserFromLocalStorage } from "../localStorage/localStorage";
import loginReduser, { userDataInitialState} from '../reducers/loginReducer';

export const LoginContext = createContext();

const LoginContextProvider = (props) => {
    const localStorageUserData = getUserFromLocalStorage();
    const localStorageToken = getTokenFromLocalStorage();
    const [userData, dispatchUserData] = useReducer(loginReduser, {user: localStorageUserData, token: localStorageToken} || userDataInitialState);

    return (
        <LoginContext.Provider value={ { userData, dispatchUserData } }>
            { props.children }
        </LoginContext.Provider>
    );
};

export default LoginContextProvider;