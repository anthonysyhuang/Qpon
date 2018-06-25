import axios from 'axios'

let instance = axios.create({
    baseURL: 'http://anthonysyhuang.com/AAU/image_upload/',
    headers: {
        'Content-Type': 'multipart/form-data'
    }
  });
export default instance;
