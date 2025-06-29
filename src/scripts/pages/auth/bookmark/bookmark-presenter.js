export default class BookmarkPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async initialGalleryAndMap() {
    this.#view.showReportsListLoading();

    try {
      const listOfReports = await this.#model.getAllReports();

      // Ubah format data supaya ada placeName berdasarkan lat lon
      const reports = await Promise.all(listOfReports.map(reportMapper));

      const message = 'Berhasil mendapatkan daftar laporan tersimpan.';
      this.#view.populateBookmarkedReports(message, reports);
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateBookmarkedReportsError(error.message);
    } finally {
      this.#view.hideReportsListLoading();
    }
  }
}

// ✅ Fungsi pemetaan yang sesuai data hasil DetailPage
async function reportMapper(report) {
  const lat = report.lat;
  const lon = report.lon;

  let placeName = 'Lokasi tidak diketahui';

  // Pastikan lat dan lon ada sebelum akses
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

// ✅ Fungsi dummy untuk ambil nama lokasi (bisa ganti pakai API nantinya)
async function getPlaceNameByCoordinate(lat, lon) {
  return `Lokasi: ${lat.toFixed(3)}, ${lon.toFixed(3)}`;
}
