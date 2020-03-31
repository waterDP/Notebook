export default {
    set(key,value){
        localStorage.setItem(key,value);
    },
    get(key){
        return localStorage.getItem(key);
    }
}