export default class BookmarkPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async initialGalleryAndMap() {
    this.#view.showStoriesListLoading();

    try {
      const listOfReports = await this.#model.getAllReports();

      const reports = await Promise.all(listOfReports.map(reportMapper));

      const message = 'Berhasil mendapatkan daftar laporan tersimpan.';
      this.#view.populateBookmarkedStories(message, reports);
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateBookmarkedStoriesError(error.message);
    } finally {
      this.#view.hideStoriesListLoading();
    }
  }
}

async function reportMapper(report) {
  const lat = report.lat;
  const lon = report.lon;

  let placeName = 'Lokasi tidak diketahui';

  if (lat !== undefined && lon !== undefined) {
    placeName = await getPlaceNameByCoordinate(lat, lon);
  }

  return {
    ...report,
    location: {
      latitude: lat,
      longitude: lon,
      placeName,
    },
  };
}

async function getPlaceNameByCoordinate(lat, lon) {
  return `Lokasi: ${lat.toFixed(3)}, ${lon.toFixed(3)}`;
}