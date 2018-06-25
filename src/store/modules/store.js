import * as types from '../mutation_types'
import xhr from '@/utilities/xhr'
import ErrorCode from '@/utilities/ErrorCode'
import imageUploader from '@/utilities/imageUploader'
export default {
    state: {
        myStores: [],
        nearbyStores: [],
        stores: []
    },
    getters:{
        // myStores: state => state.myStores,
        // nearbyStores: state => state.nearbyStores,
        stores: state => state.stores,
    },
    mutations: {
        [types.GET_MY_STORES](state, data){
            console.log("GET_MY_STORES")
            state.stores = data.stores;
        },
        [types.UPDATE_STORE](state, data){
            console.log(data);
            const i = state.stores.findIndex(store => {
                return store._id == data.store._id;
            })
            console.log(i);
            if(i == -1) state.stores.push(data.store);
            else state.stores[i] = data.store;
        },
        [types.UPDATE_COUPON](state, {data, sid}){

            const store = state.stores.find(store => {
                return store._id == sid;
            })
            const i = store.coupons.findIndex(coupon => {
                return coupon._id == data.coupon._id;
            })
            if(i == -1) store.coupons.push(data.coupon);
            else {
                for(let prop in data.coupon){
                    store.coupons[i][prop] = data.coupon[prop];
                }
            }
        },
        [types.ADD_COUPON](state, {data, sid}){

            const store = state.stores.find(store => {
                return store._id == sid;
            })
            store.coupons = data.store.coupons;
        },
        [types.ADD_STORE_LOCATION](state, {data, sid}){

            const store = state.stores.find(store => {
                return store._id == sid;
            })
            store.locations = data.store.locations;
        },
        [types.DELETE_COUPON](state, {data, sid}){

            const store = state.stores.find(store => {
                return store._id == sid;
            })
            store.coupons = data.store.coupons;
        },
        [types.LOAD_NEARBY_STORES](state, {data}){

            state.stores = data.stores;
        }
    },
    actions:{
        
        getMyStores: async function({ commit }){

            const res = await xhr.get('/me/stores').catch( err => {
                console.log(err.response);
                //token invalid
            })

            if(res) commit(types.GET_MY_STORES, res.data)
        },
        addStore: async function({commit}, {name, description, imgFile, location}){
            
            //add store to db
            let res = await xhr.post('/me/stores', {
                name: name,
                description: description,
                location: location
            }).catch(err => {
                console.log(err.response);
                if(err.response.data.code == 111) return Promise.reject(ErrorCode.STORE_EXISTED);
                return Promise.reject(ErrorCode.UNKNOW_ERROR);
            })

            if(imgFile){
                const fileName = res.data.store._id +'.'+imgFile.name.split('.').pop();
                console.log(fileName);
                const data = new FormData();
                data.append('fileToUpload', imgFile, fileName);

                //upload profile img to server
                const img = await imageUploader.post('store/upload.php', data)
                .catch(err => {
                    console.log(err.response);
                })
                console.log(img.data);

                //update image name to db
                res = await xhr.patch('/me/stores/'+res.data.store._id, {
                    store_image_url: img.data.uri
                }).catch(err => {
                    console.log(err.response);
                    if(err.response.data.code == 111) return Promise.reject(ErrorCode.STORE_EXISTED);
                    return Promise.reject(ErrorCode.UNKNOW_ERROR);
                })
                console.log(ret.data);
            }

            commit(types.UPDATE_STORE, res.data);
        },
        addCoupon: async function({commit}, {sid, title, description, expired_date}){

            const res = await xhr.post(`/me/stores/${sid}/coupons`, {
                title: title,
                description: description,
                expired_date: expired_date
            }).catch(err => {
                console.log(err.response);

                return Promise.reject();
            })

            if(res) commit(types.ADD_COUPON, {
                data: res.data,
                sid: sid
            })
        },
        addLocations: async function({commit}, {sid, locations}){
            
            console.log(locations);
            const res = await xhr.patch(`/me/stores/${sid}`,{
                locations: locations
            }).catch(err => {
                console.log(err.response);
            })

            if(res) commit(types.ADD_STORE_LOCATION, {
                sid: sid,
                data: res.data
            })
        },
        deleteCoupon: async function({commit}, {sid, cid}){

            const res = await xhr.delete(`/me/stores/${sid}/coupons/${cid}`).catch(err => {
                console.log(err.response);
            })

            if(res) commit(types.DELETE_COUPON, {
                sid: sid,
                data: res.data
            })
        },
        updateCoupon: async function({commit}, {sid, cid, coupon}){
            console.log('updateCoupon')
            console.log(sid, cid, coupon)
            console.log(`/me/stores/${sid}/coupons/${cid}`);
            const res = await xhr.patch(`/me/stores/${sid}/coupons/${cid}`, coupon)
            .catch(err => {
                console.log(err.response);
            })

            if(res) commit(types.UPDATE_COUPON, {
                data: res.data,
                sid: sid
            });
        },
        getNearbyStores: async function({commit}){
            console.log('getNearbyStores');
            const res = await xhr.get('/me/nearby/stores')
            .catch(err => {
                console.log(err.response);
            })
            console.log(res);

            if(res) commit(types.LOAD_NEARBY_STORES, {
                data: res.data
            })
        },
    }
}