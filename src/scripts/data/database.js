import { openDB } from 'idb';

const DATABASE_NAME = 'storyapp';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'saved-reports';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade: (database) => {
    database.createObjectStore(OBJECT_STORE_NAME, {
      keyPath: 'id',
    });
  },
});

const Database = {
  async putReport(report) {
    if (!Object.hasOwn(report, 'id')) {
      throw new Error('`id` diperlukan untuk menyimpan.');
    }
    return (await dbPromise).put(OBJECT_STORE_NAME, report);
  },

  async getReportById(id) {
    if (!id) {
      throw new Error('`id` is required.');
    }
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async deleteReport(id) {
    if (!id) {
      throw new Error('`id` is required.');
    }
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },

  async getAllReports() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

};

export default Database;