import { Injectable } from '@angular/core';
import * as localForage from 'localforage';

@Injectable()
export class LocalStorageService {

    getItem(key: string, callback: any): void {
        if (!localForage) {
            return;
        }

        localForage.getItem(key, callback);
    }


    setItem(key, value): void {
        if (!localForage) {
            return;
        }

        localForage.setItem(key, value);
    }

    removeItem(key): void {
        if (!localForage) {
            return;
        }

        localForage.removeItem(key);
    }
}
