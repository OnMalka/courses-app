// export const loginAction = () => ({
//     type: 'LOGIN',
//     user: {
//         userName: 'ReactIsTheBest',
//         id: '11'
//     }
// });

export const loginAction = ({ user, token }) => ({
    type: 'LOGIN',
    user,
    token
});

export const logoutAction = () => ({
    type: 'LOGOUT'
});

export const updateUserAction = (user) => ({
    type: 'UPDATE_USER',
    user
});