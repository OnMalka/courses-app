export const studentsInitialState = [];

const studentsReducer = (students, action) => {
    switch (action.type){
        case 'INIT':
            return [...action.students];
        case 'UPDATE_STUDENT':
            const theStudents = [...students];
            theStudents[action.studentIndex] = action.student;
            return [...theStudents];
        default: 
            return [...students];
    };
};

export default studentsReducer;