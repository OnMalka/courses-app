import React, { useContext } from "react";
import { useHistory } from "react-router";
import { StudentsContext } from "../../context/StudentsContext";
import Loader from '../main/Loader';

const AllStudentsDiv = () => {
    const { students } = useContext(StudentsContext);
    const history = useHistory();

    const onClickGoToStudentPage = (event) => {
        const studentIndex =
            event.target.getAttribute('studentindex') || 
            event.target.parentElement.getAttribute('studentindex');
        history.push(`/student/${studentIndex}`);
    };

    return (
        students?.length > 0 ?
        (<div className='lecturers-page__div'>
            {
                students.map((student, index)=>(
                    <div className='div-hover' onClick={ onClickGoToStudentPage } studentindex={ index } key={ student._id }>
                            <h2>Student name: { student.name }</h2>
                            <p>Email: { student.email }</p>
                            <p>Phone number: { student.phoneNumber }</p>
                            <p>address: { student.address }</p>
                    </div>
                )) 
            }
        </div>) :
        <Loader />
    );
};

export default AllStudentsDiv;