import React, { createContext, useEffect, useReducer } from "react";
import { initStudentsAction } from "../actions/studentsActions";
import studentsReducer, { studentsInitialState } from '../reducers/studentsReducer';
import { getAllStudentsFromDB } from "../server/db";

export const StudentsContext = createContext();

const StudentsContextProvider = (props) => {
    const [students, dispatchStudents] = useReducer(studentsReducer, studentsInitialState);
    
    useEffect(() => {
        async function fetchData() {
            const res = await getAllStudentsFromDB();
            const theStudents = res.data;
            dispatchStudents(initStudentsAction(theStudents));
        };
        fetchData();
      }, []);

    return (
        <StudentsContext.Provider value={ { students, dispatchStudents } }>
            { props.children }
        </StudentsContext.Provider>
    );
};

export default StudentsContextProvider;