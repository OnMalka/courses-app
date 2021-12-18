export const saveUserOnLocalStorage = (loginData) => {
    const jsonUserData = JSON.stringify(loginData.user);
    localStorage.setItem('user-data', jsonUserData);
    localStorage.setItem('token', loginData.token);
};

export const DeleteUserFromLocalStorage = () => {
    localStorage.removeItem('user-data');
    localStorage.removeItem('token');
};

export const getUserFromLocalStorage = () => {
    const jsonUserData = localStorage.getItem('user-data');
    if(jsonUserData === undefined) 
        return null;

    return JSON.parse(jsonUserData);
};

export const getTokenFromLocalStorage = () => {
    const token = localStorage.getItem('token');
    if(token === undefined) 
        return null;

    return token;
};