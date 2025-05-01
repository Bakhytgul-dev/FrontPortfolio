import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalService {
  constructor() {}

  public saveData(key: string, value: string) {
    if (typeof window === 'undefined') {
      console.log('The window object is not available in this environment.');
    } else {
      console.log(window.localStorage); // This will throw an error on the server side
    }
    localStorage.setItem(key, value);
  }

  public getData(key: string) {
    return localStorage.getItem(key);
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }
}
