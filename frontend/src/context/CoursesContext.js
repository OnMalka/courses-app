import React, { createContext, useEffect, useReducer } from "react";
import { initCoursesAction } from "../actions/coursesActions";
import coursesReduser, { coursesInitialState} from '../reducers/coursesReducer';
import { getAllCoursesFromDB } from "../server/db";

export const CoursesContext = createContext();

const CoursesContextProvider = (props) => {
    const [courses, dispatchCourses] = useReducer(coursesReduser, coursesInitialState);
    
    useEffect(() => {
        async function fetchData() {
            const res = await getAllCoursesFromDB(true);
            const theCourses = res.data;
            dispatchCourses(initCoursesAction(theCourses));
        };
        fetchData();
      }, []);

    return (
        <CoursesContext.Provider value={ { courses, dispatchCourses } }>
            { props.children }
        </CoursesContext.Provider>
    );
};

export default CoursesContextProvider;