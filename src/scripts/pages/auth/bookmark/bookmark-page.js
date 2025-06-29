import BookmarkPresenter from './bookmark-presenter';
import Database from '../../data/database';

function showFormattedDate(date, locale) {
  return new Date(date).toLocaleDateString(locale, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

export default class BookmarkPage {
  #presenter = null;

  async render() {
    return `
      <section>
        <div id="bookmark-loading">${generateLoaderAbsoluteTemplate()}</div>
        <div id="reports-list" class="reports-list"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });
    this.#presenter.initialGalleryAndMap();
  }

  showReportsListLoading() {
    document.getElementById('bookmark-loading').style.display = 'block';
  }

  hideReportsListLoading() {
    document.getElementById('bookmark-loading').style.display = 'none';
  }

  populateBookmarkedReports(message, reports) {
    const container = document.getElementById('reports-list');
    container.innerHTML = '';

    if (reports.length === 0) {
      container.innerHTML = generateReportsListEmptyTemplate();
      return;
    }

    reports.forEach((report) => {
      container.innerHTML += generateReportItemTemplate(report);
    });

    console.log(message);
  }

  populateBookmarkedReportsError(message) {
    const container = document.getElementById('reports-list');
    container.innerHTML = generateReportsListErrorTemplate(message);
  }
}

// Template functions
function generateLoaderAbsoluteTemplate() {
  return `<div class="loader loader-absolute"></div>`;
}

function generateReportItemTemplate(story) {
  const {
    id,
    name = 'Tanpa Nama',
    description = '-',
    photoUrl,
    createdAt,
    lat,
    lon,
  } = story;

  const date = createdAt ? showFormattedDate(createdAt, 'id-ID') : 'Tanggal tidak diketahui';
  const place = (lat && lon) ? `Lat: ${lat}, Lon: ${lon}` : 'Lokasi tidak diketahui';

  return `
    <div tabindex="0" class="report-item" data-reportid="${id}">
      <img class="report-item__image" src="${photoUrl}" alt="${name}">
      <div class="report-item__body">
        <div class="report-item__main">
          <h2 class="report-item__title">${name}</h2>
          <div class="report-item__more-info">
            <div class="report-item__createdat">
              <i class="fas fa-calendar-alt"></i> ${date}
            </div>
            <div class="report-item__location">
              <i class="fas fa-map"></i> ${place}
            </div>
          </div>
        </div>
        <div class="report-item__description">${description}</div>
        <a href="#/stories/${story.id}" class="detail-button">Selengkapnya</a>
      </div>
    </div>
  `;
}




function generateReportsListEmptyTemplate() {
  return `
    <div id="reports-list-empty" class="reports-list__empty">
      <h2>Tidak ada laporan yang tersedia</h2>
      <p>Saat ini, tidak ada laporan kerusakan fasilitas umum yang dapat ditampilkan.</p>
    </div>
  `;
}

function generateReportsListErrorTemplate(message) {
  return `
    <div id="reports-list-error" class="reports-list__error">
      <h2>Terjadi kesalahan pengambilan daftar laporan</h2>
      <p>${message || 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}
