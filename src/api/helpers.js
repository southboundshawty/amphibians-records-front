import API from './index';
import Store from '../store';
import Router from '../router';
/* eslint-disable */
/* eslint-enable */

// export function parseJwt(token) {
//   const base64Url = token.split('.')[1];
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));
//   return JSON.parse(jsonPayload);
// }
export async function loginAndRedirect(data) {
  API.defaults.headers.Authorization = `Bearer ${data.token}`;
  localStorage.setItem('jwt', data.token);
  await Store.dispatch('setUser', data);
  if (data.roles.includes('Moder')) {
    Router.push('/moderation-list');
  } else {
    Router.push('/release-list');
  }
}

export default {
  loginAndRedirect,
  // parseJwt,
};
