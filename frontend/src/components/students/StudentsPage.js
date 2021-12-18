import React, { useContext } from "react";
import { useHistory } from "react-router";
import { LoginContext } from "../../context/LoginContext";
import EnrolledCourses from "./EnrolledCourses";

const StudentsPage = () => {
    const {userData} = useContext(LoginContext);
    const history = useHistory();

    const onClickOpenAsignPage = () => {
        history.push(`/asign-attendance`);
    };

    const onClickChangePassword = () => {
        history.push(`/change-password`);
    };

    return (
        <div className='student-page'>
            <h1>{ userData.user.name }</h1>
            <EnrolledCourses />
            <div className='student-page__div'>
                <button onClick={ onClickOpenAsignPage }>Assign attendancy</button>
                <button onClick={ onClickChangePassword }>Change password</button>
            </div>
        </div>
    );
};

export default StudentsPage;