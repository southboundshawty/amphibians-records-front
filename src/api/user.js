import API from './index';

export function getProfileInfo() {
  return API.get('/User/WhoIm');
}
