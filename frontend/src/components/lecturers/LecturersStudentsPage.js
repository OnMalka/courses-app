import React, { useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import AllStudentsDiv from "./AllStudentsDiv";

const LecturersStudentsPage = () => {
    const {userData} = useContext(LoginContext);

    return (
        <div className='lecturers-page'>
            <h1>{ userData.user.name }</h1>
            <AllStudentsDiv />           
        </div>
    );
};

export default LecturersStudentsPage;