import BookmarkPresenter from './bookmark-presenter';
import Database from '../../data/database';

function showFormattedDate(date, locale = 'id-ID') {
  return new Date(date).toLocaleDateString(locale, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default class BookmarkPage {
  #presenter = null;

  async render() {
    return `
      <section id="bookmarked-stories-section" class="story-list">
        <h2>Kisah Tersimpan Anda</h2>
        <div id="bookmark-loading" class="loading-overlay">
          ${generateLoaderAbsoluteTemplate()}
        </div>
        <div class="cards-container" id="bookmarked-stories-container">
          <div class="story-card placeholder">Mencari kisah yang Anda tandai...</div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });
    this.#presenter.initialGalleryAndMap(); // Asumsi presenter menangani pemuatan data
  }

  showStoriesListLoading() {
    const loadingElement = document.getElementById('bookmark-loading');
    if (loadingElement) {
      loadingElement.style.display = 'flex'; // Menggunakan flex untuk centering loader
    }
  }

  hideStoriesListLoading() {
    const loadingElement = document.getElementById('bookmark-loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }

  populateBookmarkedStories(message, stories) {
    const container = document.getElementById('bookmarked-stories-container');
    container.innerHTML = ''; // Bersihkan container sebelum mengisi

    if (!stories || stories.length === 0) {
      container.innerHTML = generateNoBookmarksTemplate();
      return;
    }

    stories.forEach((story) => {
      container.innerHTML += generateBookmarkedStoryCardTemplate(story);
    });

    console.log(message); // Log pesan dari presenter, jika ada
  }

  populateBookmarkedStoriesError(errorMessage) {
    const container = document.getElementById('bookmarked-stories-container');
    container.innerHTML = generateBookmarkErrorTemplate(errorMessage);
  }
}

// --- Template Functions ---

function generateLoaderAbsoluteTemplate() {
  return `<div class="loader loader-absolute"></div><p class="loading-text">Memuat kisah-kisah favorit Anda...</p>`;
}

function generateBookmarkedStoryCardTemplate(story) {
  const {
    id,
    name = 'Anonim', // Lebih personal daripada 'Tanpa Nama'
    description = 'Tidak ada deskripsi tersedia.',
    photoUrl,
    createdAt,
    lat,
    lon,
  } = story;

  const date = createdAt ? showFormattedDate(createdAt) : 'Tanggal tidak diketahui';
  const locationInfo = (lat && lon) ? `Latitude: ${lat}, Longitude: ${lon}` : 'Lokasi tidak tersedia';

  return `
    <div tabindex="0" class="story-card bookmarked-item" data-storyid="${id}">
      <img class="story-card__image" src="${photoUrl}" alt="Foto dari kisah ${name}">
      <div class="story-card__body">
        <h3 class="story-card__title">${name}</h3>
        <p class="story-card__description">${description.substring(0, 150)}${description.length > 150 ? '...' : ''}</p>
        <div class="story-card__meta">
          <span class="story-card__date"><i class="fas fa-calendar-alt"></i> ${date}</span>
          <span class="story-card__location"><i class="fas fa-map-marker-alt"></i> ${locationInfo}</span>
        </div>
        <a href="#/stories/${story.id}" class="button-primary story-card__read-more">Lihat Detail</a>
      </div>
    </div>
  `;
}

function generateNoBookmarksTemplate() {
  return `
    <div id="no-bookmarks-found" class="info-card">
      <p>Anda belum menyimpan kisah apapun. <br> Mulai jelajahi dan tandai cerita yang menarik perhatian Anda!</p>
      <a href="#/" class="button-secondary">Jelajahi Sekarang</a>
    </div>
  `;
}

function generateBookmarkErrorTemplate(message) {
  return `
    <div id="bookmark-error" class="error-card">
      <h3>Gagal memuat kisah tersimpan</h3>
      <p>Terjadi masalah saat mengambil daftar kisah Anda: ${message || 'Mohon coba lagi nanti.'}</p>
      <button class="button-secondary refresh-button" onclick="location.reload()">Muat Ulang Halaman</button>
    </div>
  `;
}