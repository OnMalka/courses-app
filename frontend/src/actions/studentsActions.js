export const initStudentsAction = (students) => ({
    type: 'INIT',
    students
});

export const updateUserAction = (studentIndex, student) => ({
    type: 'UPDATE_STUDENT',
    studentIndex,
    student
});