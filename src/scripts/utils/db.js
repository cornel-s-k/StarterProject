// src/utils/db.js
class DB {
  constructor(name, version, stores) {
    this.name = name;
    this.version = version;
    this.stores = stores;
    this.db = null;
  }

  open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.name, this.version);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        this.stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, { keyPath: store.keyPath });
            store.indexes.forEach(index => {
              objectStore.createIndex(index.name, index.keyPath, { unique: index.unique });
            });
          }
        });
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  add(storeName, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  getAll(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }

  delete(storeName, id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    });
  }
}

export const initDB = async () => {
  const db = new DB('RestaurantDB', 1, [
    {
      name: 'restaurants',
      keyPath: 'id',
      indexes: [
        { name: 'name', keyPath: 'name', unique: false },
        { name: 'city', keyPath: 'city', unique: false }
      ]
    },
    {
      name: 'reviews',
      keyPath: 'id',
      indexes: [
        { name: 'restaurantId', keyPath: 'restaurantId', unique: false }
      ]
    }
  ]);

  await db.open();
  return db;
};