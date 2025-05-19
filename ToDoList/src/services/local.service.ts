import { Injectable } from '@angular/core';
import { filter, fromEvent, map, Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class LocalService {
  private storageSubject = new BehaviorSubject<string | null>(localStorage.getItem('taskList'));
  storage$ = this.storageSubject.asObservable();
  private storageEventSubscription: Subscription;
  
  constructor() {
    this.storageEventSubscription = fromEvent<StorageEvent>(window, 'storage')
      .pipe(
        filter((event) => event && event.key === 'taskList'),
        map((event) => event.newValue)
      )
      .subscribe((newValue) => {
        this.storageSubject.next(newValue);
      });
  }

  public saveData(key: string, value: string) {
    // if (typeof window === 'undefined') {
    //   console.log('The window object is not available in this environment.');
    // } else {
    //   console.log(window.localStorage); // This will throw an error on the server side
    // }
    localStorage.setItem(key, value);
    this.storageSubject.next(value);
  }

  public getData(key: string) {
    return localStorage.getItem(key);
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
    this.storageSubject.next(null);
  }

  public clearData() {
    localStorage.clear();
  }

  ngOnDestroy(): void {
    this.storageEventSubscription.unsubscribe();
  }
}
