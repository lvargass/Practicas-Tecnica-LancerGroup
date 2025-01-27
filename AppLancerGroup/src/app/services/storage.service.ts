import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  /**
   * get storage
  */
  public get(key: string) {
    return this._storage?.get(key);
  }

  // Set storage
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  // Remove storage
  public remove(key: string) {
    this._storage?.remove(key);
  }
}
