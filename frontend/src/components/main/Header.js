import React, { useContext } from "react";
import {NavLink} from 'react-router-dom';
import { logoutAction } from "../../actions/loginActions";
import { LoginContext } from "../../context/LoginContext";
import { useHistory } from "react-router";
import { DeleteUserFromLocalStorage } from "../../localStorage/localStorage";
import { getUserFromLocalStorage } from "../../localStorage/localStorage";
import { getTokenFromLocalStorage } from "../../localStorage/localStorage";
import { logoutFromSite } from "../../server/auth";

const Header = ()=>{
    const {userData, dispatchUserData} = useContext(LoginContext);
    const history = useHistory();

    const onClickLogOut = async () => {
        try{
            const user = getUserFromLocalStorage();            
            const token = getTokenFromLocalStorage();
            await logoutFromSite(user, token, user.userType === 'lecturer');
            dispatchUserData(logoutAction());
            DeleteUserFromLocalStorage();
            history.push('/home');
        }catch(err){
            console.log(err);
        };        
    };

    return(
        <div className='header'>
            <div className='header__nav'>
                <div>
                <NavLink className='home-nav' to='/home' activeClassName='header__active-link'>
                    Home
                </NavLink>
                {!!userData.user && <NavLink to='/change-password' activeClassName='header__active-link'>Change Password</NavLink>}
                </div>                
                <div>
                    {userData.user?.userType === 'student' && <NavLink to='/students' activeClassName='header__active-link'>Students</NavLink>}
                    {userData.user?.userType === 'lecturer' && <NavLink to='/lecturers/courses' activeClassName='header__active-link'>Courses</NavLink>}
                    {userData.user?.userType === 'lecturer' && <NavLink to='/lecturers/students' activeClassName='header__active-link'>Students</NavLink>}
                    {userData.user?.userType === 'lecturer' && <NavLink to='/lecturers/course/add' activeClassName='header__active-link'>Add Course</NavLink>}                    
                    {
                        !!userData.user ?
                        <div className='header__logout-nav' onClick={onClickLogOut}>Logout</div> :
                        <NavLink to='/login' activeClassName='header__active-link'>Login</NavLink>
                    }
                </div>
            </div>
        </div>
    )
};

export default Header;