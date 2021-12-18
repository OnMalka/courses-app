import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "../components/home/Home";
import LoginPage from "../components/login/LoginPage";
import Footer from "../components/main/Footer";
import Header from "../components/main/Header";
import PageNotFound from "../components/main/PageNotFound";
import LoginContextProvider from "../context/LoginContext";
import LoginRoute from "./LoginRoute";
import StudentsPage from "../components/students/StudentsPage";
import StudentsRoute from "./StudentsRoute";
import StudentCoursePage from "../components/course/StudentCoursePage";
import AsignAttendance from "../components/students/AsignAttendance";
import PrivateRoute from "./PrivateRoute";
import CahngePassword from "../components/users/ChangePassword";
import LecturersRoute from "./LecturersRoute";
import LecturersCoursesPage from "../components/lecturers/LecturersCoursesPage";
import LecturerCoursePage from "../components/course/LecturerCoursePage";
import CoursesContextProvider from "../context/CoursesContext";
import AddCourse from "../components/course/AddCourse";
import StudentsContextProvider from "../context/StudentsContext";
import StudentPage from "../components/lecturers/StudentPage";
import LecturersStudentsPage from "../components/lecturers/LecturersStudentsPage";

const AppRouter = () => {

    return(
        <BrowserRouter>
            <LoginContextProvider>
                <Header/>
                <Switch>
                    <Route path='/' exact>
                        <Redirect to='/home' />
                    </Route>                    
                    <Route path='/home' component={Home} />
                    <LoginRoute path='/login' component={LoginPage} />
                    <PrivateRoute path='/change-password' component={CahngePassword} />
                    <CoursesContextProvider>
                        <StudentsRoute path='/students' component={StudentsPage} />
                        <StudentsRoute path='/course-stu' component={StudentCoursePage} />
                        <StudentsRoute path='/attendance' component={StudentCoursePage} />
                        <StudentsRoute path='/asign-attendance' component={AsignAttendance} />
                        <StudentsContextProvider>
                            <LecturersRoute path='/lecturers/courses' component={LecturersCoursesPage} />
                            <LecturersRoute path='/lecturers/Students' component={LecturersStudentsPage} />
                            <LecturersRoute path='/course-lec' component={LecturerCoursePage} />
                            <LecturersRoute path='/lecturers/course/add' component={AddCourse} />
                            <LecturersRoute path='/student/:studentIndex' component={StudentPage} />
                        </StudentsContextProvider>                        
                    </CoursesContextProvider>                    
                    <Route path='*' component={PageNotFound} />
                </Switch>    
                <Footer/>
            </LoginContextProvider>                    
        </BrowserRouter>
    );
};

export default AppRouter;