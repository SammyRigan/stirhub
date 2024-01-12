/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Storage } from '@capacitor/storage';
import { Subject } from 'rxjs';
import { TimePost, UserProfile } from '../models/models';
import algoliasearch from 'algoliasearch';
import { environment } from 'src/environments/environment.prod';

interface QFilter {
  key: string;
  value: any;
}

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  searchClient = algoliasearch(environment.algolia.appId, environment.algolia.apiKey);

  profile: UserProfile;
  profileUpdated = new Subject<UserProfile>();

  deletedPost = new Subject<TimePost>();

  constructor(private afs: AngularFirestore) { }

  addItem(collectionUrl: string, item: any) {
    delete item.id;
    return this.afs.collection(collectionUrl).add(item);
  }

  getItems(collectionUrl: string, lastDoc: any, limit: number) {
    let collectionRef = this.afs.collection(collectionUrl).ref.orderBy('date', 'desc');
      if (lastDoc) {
        collectionRef = collectionRef.startAfter(lastDoc);
      }
    return collectionRef.limit(limit).get();
  }

  getPeople(collectionUrl: string, lastDoc: any, type: string[], limit: number) {
    let collectionRef = this.afs.collection(collectionUrl).ref.orderBy('date', 'desc');
      if (type && type.length > 0) {
        collectionRef = collectionRef.where('type', 'in', type);
      }
      if (lastDoc) {
        collectionRef = collectionRef.startAfter(lastDoc);
      }
    return collectionRef.limit(limit).get();
  }

  getPosts(collectionUrl: string, lastDoc: any, profileId: string, repliedTo: string, limit: number) {
    let collectionRef = this.afs.collection(collectionUrl).ref.orderBy('date', 'desc');
    if (profileId) {
      collectionRef = collectionRef.where('profileId', '==', profileId);
    }
    if (repliedTo) {
      collectionRef = collectionRef.where('repliedTo', '==', repliedTo);
    } else {
      collectionRef = collectionRef.where('repliedTo', '==', null);
    }
    if (lastDoc) {
      collectionRef = collectionRef.startAfter(lastDoc);
    }
    return collectionRef.limit(limit).get();
  }

  getMyReplies(collectionUrl: string, lastDoc: any, profileId: string, limit: number) {
    let collectionRef = this.afs.collection(collectionUrl).ref
      .orderBy('repliedTo')
      .orderBy('date', 'desc')
      .where('repliedTo', '!=', null);
      if (profileId) {
        collectionRef = collectionRef.where('profileId', '==', profileId);
      }
      if (lastDoc) {
        collectionRef = collectionRef.startAfter(lastDoc);
      }
      return collectionRef.limit(limit).get();
  }

  getSingleItem(documentUrl: string) {
    return this.afs.doc(documentUrl).get().toPromise();
  }

  getItemWithFilter(collectionUrl: string, lastDoc: any, filters: QFilter[], limit: number) {
    let collectionRef = this.afs.collection(collectionUrl).ref.orderBy('date', 'desc');
    if (filters.length > 0) {
      for (const filter of filters) {
        collectionRef = collectionRef.where(filter.key, '==', filter.value);
      }
    }
    if (lastDoc) {
      collectionRef = collectionRef.startAfter(lastDoc);
    }
    return collectionRef.limit(limit).get();
  }

  getInvitationByEmail(email: string) {
    return this.afs.collection('invitations', ref =>
      ref.where('email', '==', email)).get().toPromise();
  }

  getMyThreads(profileId: string) {
    return this.afs.collection('threads', ref => ref
    .orderBy('lastMsgDate', 'desc')
    .where('participantIds', 'array-contains', profileId)).snapshotChanges();
  }

  getMessages(collectionUrl: string) {
    return this.afs.collection(collectionUrl, ref => ref
      .orderBy('date', 'asc')
      ).snapshotChanges();
  }

  updateItem(docUrl: string, item: any) {
    delete item.id;
    return this.afs.doc(docUrl).update(item);
  }

  updateField(docUrl: string, obj: any) {
    return this.afs.doc(docUrl).update(obj);
  }

  deleteItem(docUrl: string) {
    return this.afs.doc(docUrl).delete();
  }

  // GET CURRENT USER PROFILE
  async getMyProfile() {
    if (!this.profile) {
      const idRef = await Storage.get({key: 'profile'});
      const profile = JSON.parse(idRef.value);
      const profileRef = await this.afs.doc(`${profile.type}s/${profile.id}`).get().toPromise();
      this.profile = {
        id: profileRef.id,
        ...profileRef.data() as any
      };
      this.profileUpdated.next({...this.profile});
    }
    return this.profile;
  }

  getUserByUid(userId: string) {
    return this.afs.collection('user-profiles', ref =>
        ref.where('userId', '==', userId)).get().toPromise();
  }

  getProfileUpdateListener() {
    return this.profileUpdated.asObservable();
  }

  udpateProfile(profile: UserProfile) {
    const id = profile._id;
    delete profile._id;
    this.afs.doc(`user-profiles/${id}`).update(profile);
    this.profile._id = id;
    this.profile = profile;
    this.profileUpdated.next(profile);
  }

  docSetter(collectionUrl: string, doc: any) {
    const docId = doc.id;
    delete doc.id;
    return this.afs.collection(collectionUrl).doc(docId).set(doc);
  }

  getPapers(collection: string, lastDoc, limit: number, profileId: string, instId: string) {
    let collectionRef = this.afs.collection(collection).ref
    .orderBy('date', 'desc');
    if (profileId) {
      collectionRef = collectionRef.where('teamIds', 'array-contains', profileId);
    }
    if (instId) {
      collectionRef = collectionRef.where('sponsorIds', 'array-contains', instId);
    }
    if (lastDoc) {
      collectionRef = collectionRef.startAfter(lastDoc);
    }
    return collectionRef.limit(limit).get();
  }

  getSuggestions(collection: string, lastDoc, limit: number, individual: boolean) {
    let collectionRef = this.afs.collection(collection).ref
    .orderBy('date', 'desc');
    if (individual) {
      collectionRef = collectionRef.where('type', 'in', ['practitioner', 'student']);
    }
    if (lastDoc) {
      collectionRef = collectionRef.startAfter(lastDoc);
    }
    return collectionRef.limit(limit).get();
  }

  async search(collection: string, query: string) {
    const index = this.searchClient.initIndex(collection);
    const results = (await index.search(query)).hits;
    return results;
  }

}
