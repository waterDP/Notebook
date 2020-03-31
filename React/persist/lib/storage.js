let storage = {
    setItem(key,val) {
        localStorage.setItem(key,val);
    },
    getItem(key) {
        return localStorage.getItem(key);
    }
}
export default storage;