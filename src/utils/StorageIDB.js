import { get, set, del, update } from 'idb-keyval';

export default class StorageIDB {
    static async setItem(key, value) {
        const keyValue = await get(key).then((val) => { return val; });

        if (keyValue) {
            update(key, (val) => value);
        } else {
            set(key, value)
                .catch((err) => console.log('Error on Setting Values to IndexDB!', err));
        }
    }

    static async getItem(key) {
        const keyValue = await get(key).then((val) => { return val; });

        return keyValue || 'null';
    }

    static removeItem(key) {
        del(key);
    }
}
