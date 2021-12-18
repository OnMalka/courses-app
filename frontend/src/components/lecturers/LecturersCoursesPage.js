import React, { useContext } from "react";
import { LoginContext } from "../../context/LoginContext";
import AllCoursesDiv from "./AllCoursesDiv";

const LecturersCoursesPage = () => {
    const {userData} = useContext(LoginContext);

    return (
        <div className='lecturers-page'>
            <h1>{ userData.user.name }</h1>
            <AllCoursesDiv />           
        </div>
    );
};

export default LecturersCoursesPage;