class localStorage{
    constructor(){
        this._localStorage = window.localStorage;
    }
    store(key, value){
        this._localStorage.setItem(key, value);
    }
    remove(key){
        this._localStorage.removeItem(key);
    }

    get(key){
        return this._localStorage.getItem(key);
    }
}

const instance = new localStorage();
Object.freeze(instance);

export default instance;