export default class Storage {
    static init() {
        try {
            localStorage.setItem('oldst-test', 1);
            localStorage.removeItem('oldst-test');

            this.storageType = localStorage;
        } catch (err) {
            this.storageType = sessionStorage;
        }
    }

    static setItem(key, value) {
        this.storageType.setItem(key, value);
    }

    static getItem(key) {
        return this.storageType.getItem(key);
    }

    static removeItem(key) {
        this.storageType.removeItem(key);
    }
}

Storage.init();
