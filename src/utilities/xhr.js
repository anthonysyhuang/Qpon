import axios from 'axios'

let instance = axios.create({
    baseURL: process.env.DB.BASE
  });
let token = null;
  instance.setToken = function(_token){
    // instance.defaults.headers.common['x-access-token'] = token;
    token = _token;
  }

  instance.interceptors.request.use(function (config) {

    if(token) config.headers['x-access-token'] = token;
    return config;
  });

  instance.resetToken = function(){
    token = null;
  }
export default instance;
