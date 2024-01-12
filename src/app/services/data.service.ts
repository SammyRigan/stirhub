/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IEvent, Research, UserProfile } from '../models/models';
import { AngularFireAuth } from '@angular/fire/compat/auth';

const BACKEND_URL = `${environment.apiUrl}`;

interface QFilter {
  key: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private userId: string;

  //LOGGED-IN USER
  private loggedInUser: UserProfile;
  private userUpdated = new Subject<UserProfile>();

  // RESEARCH
  private researches: Research[] = [];
  private researchCount: number;
  private researchesUpdated = new Subject<{researches: Research[]; count: number}>();

  // EVENTS
  private iEvents: IEvent[] = [];
  private eventCount: number;
  private iEventsUpdated = new Subject<{iEvents: IEvent[]; count: number}>();

  // PEOPLE
  private people: UserProfile[] = [];
  private peopleCount: number;
  private peopleUpdated = new Subject<{people: UserProfile[]; count: number}>();

  // INSTITUTIONS
  private institutions: UserProfile[] = [];
  private instCount: number;
  private instutionsUpdated = new Subject<{institutions: UserProfile[]; count: number}>();

  constructor(
    private http: HttpClient,
    private auth: AngularFireAuth
  ) { }

  async getUserId() {
    if (!this.userId) {
      this.auth.onAuthStateChanged(user => {
        if (user) {
          this.userId = user.uid;
          return user.uid;
        }
      });
    } else {
      return this.userId;
    }
  }

  async getLoggedInProfile() {
    if (!this.loggedInUser) {
      let uid: string;
      if (this.userId) {
        this.loggedInProfileRetriever(this.userId);
      } else {
        this.auth.onAuthStateChanged(user => {
          if (user) {
            this.userId = this.transformStr(user.uid);
            this.loggedInProfileRetriever(this.userId);
          }
        });
      }

    }
    return this.loggedInUser;
  }

  loggedInProfileRetriever(uid: string) {
    return this.http.get<{message: string; data: any; count: number}>(`${BACKEND_URL}/profiles?pax=${uid}`)
    .subscribe(res => {
      this.loggedInUser = res.data[0];
      this.userUpdated.next({...this.loggedInUser});
    });
  }

  updateUserId(value: string | null) {
    if (value) {
      this.userId = this.transformStr(value);
    } else {
      this.userId = null;
    }
  }

  transformStr(value: string) {
    const r1 = (Math.random() + 1).toString(36).substring(2, 7);
    const r2 = (Math.random() + 1).toString(36).substring(2, 7);
    const r3 = (Math.random() + 1).toString(36).substring(2, 7);
    const newValue = r1 + value.slice(0, 5) + r2 + value.slice(5, value.length) + r3;
    return newValue;
  }

  logOut() {
    this.userId = null;
    this.loggedInUser = null;
    this.userUpdated.next(null);
  }

  getUserUpdateListener() {
    return this.userUpdated.asObservable();
  }


  addItem(item: any, collection: string) {
    return this.http.post<{message: string; dataId: string}>(`${BACKEND_URL}/${collection}`, item)
      .pipe(map(resData => {
        item._id = resData.dataId;
        if (collection === 'researches') {
          this.researches.unshift(item);
          this.researchCount = this.researchCount + 1;
          this.researchesUpdated.next({researches: [...this.researches], count: this.researchCount});
        } else if (collection === 'events') {
          this.iEvents.unshift(item);
          this.eventCount = this.eventCount + 1;
          this.iEventsUpdated.next({iEvents: [...this.iEvents], count: this.eventCount});
        }
        return resData;
      })).toPromise();
  }

  async getItems(collection: string, pageSize: number, page: number, filters: QFilter[]) {
    let url = `${BACKEND_URL}/${collection}`;
    if ((pageSize || pageSize === 0) && (page || page === 0)) {
      url = `${url}?pageSize=${pageSize}&page=${page}`;
    }
    if ((pageSize || pageSize === 0) && (page || page === 0)) {
      for await (const filter of filters) {
        url = `${url}&${filter.key}=${filter.value}`;
      }
    } else {
      for await (const filter of filters) {
        url = `${url}?${filter.key}=${filter.value}`;
      }
    }
    // console.log(url);
    return this.http.get<{message: string; data: any; count: number}>(url)
      .subscribe(resData => {
        if (collection === 'researches') {
          if (page && page === 1) {
            this.researches = [];
          }
          this.researches = this.researches.concat(resData.data);
          this.researchCount = resData.count;
          this.researchesUpdated.next({researches: [...this.researches], count: resData.count});
        } else if (collection === 'events') {
          if (page && page === 1) {
            this.iEvents = [];
          }
          this.iEvents = this.iEvents.concat(resData.data);
          this.eventCount = resData.count;
          this.iEventsUpdated.next({iEvents: [...this.iEvents], count: resData.count});
        }
      });
  }

  // getSuggestions() {
  //   return this.http.get(ur)
  // }

  async returnItemsRaw(collection: string, pageSize: number, page: number, filters: QFilter[]) {
    let url = `${BACKEND_URL}/${collection}`;
    if ((pageSize || pageSize === 0) && (page || page === 0)) {
      url = `${url}?pageSize=${pageSize}&page=${page}`;
    }
    // if (page) {
    //   url = `${url}?page=${page}`;
    // }
    if ((pageSize || pageSize === 0) && (page || page === 0)) {
      for await (const filter of filters) {
        url = `${url}&${filter.key}=${filter.value}`;
      }
    } else {
      for await (const filter of filters) {
        url = `${url}?${filter.key}=${filter.value}`;
      }
    }
    // console.log(url);
    const res = await this.http.get<{message: string; data: any; count: number}>(url).toPromise();
    return res;
  }

  async getSingleItem(collection: string, id: string) {
    const url = `${BACKEND_URL}/${collection}/${id}`;
    const res = await this.http.get<{message: string; data: any}>(url).toPromise();
    return res;
  }

  updateItem(collection: string, item: any) {
    return this.http.put(`${BACKEND_URL}/${collection}/${item._id}`, item)
      .subscribe(() => {
        // if (collection === 'assets') {
        //   const updated = [...this.iAssets];
        //   const oldIndex = updated.findIndex(e => e._id === item._id);
        //   updated[oldIndex] = item;
        //   this.iAssets = updated;
        //   this.assetsUpdated.next({assets: [...this.iAssets], count: this.assetCount});
        // }
      });
  }

  deleteItem(collection: string, itemId: string) {
    return this.http.delete(`${BACKEND_URL}/${collection}/${itemId}`)
      .subscribe(() => {
        // if (collection === 'assets') {
        //   this.iAssets = this.iAssets.filter(i => i._id !== itemId);
        //   this.assetCount = this.assetCount - 1;
        //   this.assetsUpdated.next({assets: [...this.iAssets], count: this.assetCount});
        // }
      });
  }

  getColUpdateListener(collection: string) {
    if (collection === 'researches') {
      return this.researchesUpdated.asObservable() as any;
    } else if (collection === 'events') {
      return this.iEventsUpdated.asObservable() as any;
    }
    // if (collection === 'projects') {
    //   return this.projectsUpdated.asObservable() as any;
    // }
    // else if (collection === 'tasks') {
    //   return this.tasksUpdated.asObservable() as any;
    // }
    // else if (collection === 'assets') {
    //   return this.assetsUpdated.asObservable() as any;
    // }
  }

  searchCollection(collection: string, query: string) {
    return this.http.get(`${BACKEND_URL}/search/${collection}?term=${query}`).toPromise();
  }
}
