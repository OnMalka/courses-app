import Axios from "axios";

export const loginToSite = async (email, password, isLecturer) => {
    try{
        const res = await Axios.post(`http://localhost:4000/${isLecturer?'lecturers':'students'}/login`, {
            email,
            password
        }, {            
            headers: {
                "Content-Type": "application/json"
            }
        });

        
        return {
            user: res.data.user,
            token: res.data.token            
        };
    }catch(err){
        if(err.response?.status === 400){
            throw new Error('Email or password invalid.');
        };
    };
};

export const logoutFromSite = async (user, token, isLecturer) => {
    try{
        await Axios.post(`http://localhost:4000/${isLecturer?'lecturers':'students'}/logout`, {
            user
        }, {            
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });
    }catch(err){
        console.log(err);
    };
};