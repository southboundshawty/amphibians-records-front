import axios from 'axios';
import Router from '../router';
import store from '../store';

const { CancelToken } = axios;
const axiosInstance = axios.create({
  baseURL: 'https://api.amphibiansrecords.com/api',
});

axiosInstance.interceptors.request.use(
  (request) => {
    const jwt = localStorage.getItem('jwt');

    if (jwt && Router.name !== 'Auth' && Router.name !== 'Login') {
      request.headers.Authorization = `Bearer ${jwt}`;
    }
    return request;
  },
);
axiosInstance.interceptors.response.use(
  async (response) => response,
  async (error) => {
    console.log(error);
    if (error.response?.status === 401) {
      Router.push('/auth');
      store.dispatch('signOut');
      return error;
    }

    return Promise.reject(error);
  },
);
function getCancel() {
  return CancelToken.source();
}
export { getCancel };

export default axiosInstance;
