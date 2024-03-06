import axios from 'axios';

// export const API_URL = 'https://taskify-ipmy.onrender.com';
export const API_URL = 'http://127.0.0.1:3000'

export const SignOutHandler = async () => {
  try {
    const response = await axios.delete(`${API_URL}/signout`, {
      headers: {
        'authorization': sessionStorage.getItem('token')
      }
    })
    // console.log(sessionStorage.getItem('token'));
    // console.log(response);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    console.log(response.data.status);
    // location.reload();
    return response.data.status;
  } catch (error) {
    // console.log(error.response.data.status, error.message, error.response.data.message);
    return error.response.data.message;
  }
}

export const GetUserInfo = () => {
  return JSON.parse(sessionStorage.getItem('user'));
}

export const GetToken = () => {
  return JSON.parse(sessionStorage.getItem('token'));
}