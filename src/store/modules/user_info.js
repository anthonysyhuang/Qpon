import * as types from '../mutation_types'
import xhr from '@/utilities/xhr'
import ErrorCode from '@/utilities/ErrorCode'
import localStorage from '@/utilities/localStorage';
import imageUploader from '@/utilities/imageUploader';


const _TOKEN = 'TOKEN';
xhr.setToken(localStorage.get(_TOKEN))

export default {
    state: {
        token: localStorage.get(_TOKEN),
        user: null
    },
    getters:{
        user: state => state.user,
        isLogin: state => {

            console.log("isLogined: token=" + state.token);   
            if(!state.token) return false;

            return true;
        }
    },
    mutations: {
        [types.USER_LOGINED](state, data){
            console.log("USER_LOGINED")
            console.log(data.user);
            if(data.token) {
                state.token = data.token;
                localStorage.store(_TOKEN, data.token);
                xhr.setToken(localStorage.get(_TOKEN))
            }
            state.user = data.user;
        },
        [types.USER_LOGOUT](state, data){
            console.log("USER_LOGOUT");
            state.user = null;
            state.token = null;
            xhr.resetToken();
            localStorage.remove(_TOKEN);
        },
        [types.UPDATE_USER](state, data){
            state.user.name = data.user.name;
            state.user.profile_image_url = data.user.profile_image_url;
        }
    },
    actions:{
        login: async ({ commit }, {email, password}) => {
            //async call to server
            console.log(email, password);
            console.log(process.env);    
            const res = await xhr.post('/auth/login', {
                email: email,
                password: password
            }).catch(err => {
                console.log(err.response);
                return Promise.reject(ErrorCode.USER_PASSWORD_NOT_FOUND);
            })

            if(res) commit(types.USER_LOGINED, res.data)
        },
        logout: async function({commit}){
            console.log('logout');
            commit(types.USER_LOGOUT);
        },
        getUser: async function({ commit }){

            const res = await xhr.get('/me').catch( err => {
                console.log(err.response);
                //token invalid
            })

            if(res) commit(types.USER_LOGINED, res.data)
        },
        register: async function({commit}, { email, password, isOwner, name}){
            const res = await xhr.post('/auth/register', {
                email,
                password,
                name,
                is_owner: isOwner
            }).catch(err => {
                console.log(err.response.data);
                if(err.response.data.code == 107) return Promise.reject(ErrorCode.EMAIL_EXISTED);

                return Promise.reject(ErrorCode.UNKNOW_ERROR);
            })

            if(res) commit(types.USER_LOGINED, res.data);
        },
        updateUser: async function ({commit}, {uid, name, imgFile}){

            let fileUrl;
            if(imgFile){
                const fileName = uid +'.' + imgFile.name.split('.').pop();
                console.log(fileName);
                const data = new FormData();
                data.append('fileToUpload', imgFile, fileName);

                //upload profile img to server
                const img = await imageUploader.post('profile/upload.php', data)
                .catch(err => {
                    console.log(err.response);
                })
                console.log(img.data);
                fileUrl = img.data.uri;
            }

            const res = await xhr.patch('/me', {
                name: name,
                profile_image_url: fileUrl
            }).catch(err => {
                console.log(err.response);
            })

            if(res) commit(types.UPDATE_USER, res.data);
        }
    }
}