export const initCoursesAction = (courses) => ({
    type: 'INIT',
    courses
});

export const updateCourseAction = (courseIndex, course) => ({
    type: 'UPDATE_COURSE',
    courseIndex,
    course
});