export const coursesInitialState = [];

const coursesReducer = (courses, action) => {
    switch (action.type){
        case 'INIT':
            return [...action.courses];
        case 'UPDATE_COURSE':
            const theCourses = [...courses];
            theCourses[action.courseIndex] = action.course;
            return [...theCourses];
        default: 
            return [...courses];
    };
};

export default coursesReducer;