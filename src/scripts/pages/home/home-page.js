import HomePresenter from '../home/home-presenter';
import * as CityCareAPI from '../../data/api';

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section class="hero-home">
        <div class="hero-overlay">
          <div class="hero-content">
            <h1>Bagikan Ceritamu. Inspirasi Ditemukan.</h1>
            <p>Ruang bebas untuk setiap momenmu. Unggah apa saja, temukan kisah menarik dari berbagai sudut pandang, dan terhubung dengan dunia.</p>
            <button id="explore-feeds-button">Lihat Linimasa</button>
          </div>
        </div>
      </section>

      <section id="feeds-section" class="story-list">
        <h2>Linimasa Kisah Terbaru</h2>
        <div class="cards-container" id="stories-container">
          <div class="story-card placeholder">Menjelajahi unggahan terbaru dari komunitas kreatif...</div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: CityCareAPI,
    });

    const exploreButton = document.getElementById('explore-feeds-button');
    exploreButton?.addEventListener('click', () => {
      const feedSection = document.getElementById('feeds-section');
      feedSection?.scrollIntoView({ behavior: 'smooth' });
    });

    await this.#presenter.initialStory();
  }

  populateReportsList(message, stories) {
    const storiesContainer = document.getElementById('stories-container');

    if (!stories || stories.length === 0) {
      this.displayEmptyReportsMessage();
      return;
    }

    const html = stories.map(story => `
      <div class="story-card story-item">
        <img src="${story.photoUrl}" alt="Foto unggahan oleh ${story.name}" class="story-photo story-item__image">
        <div class="story-item__body">
          <h3 class="story-item__title">${story.name}</h3>
          <p class="story-item__description">${story.description.substring(0, 100)}${story.description.length > 100 ? '...' : ''}</p>
          <p class="story-item__more-info">
            <strong>Lokasi:</strong> Lat: ${story.lat}, Lon: ${story.lon}
          </p>
          <a href="#/stories/${story.id}" class="button-primary story-item__read-more">Lihat Unggahan</a>
        </div>
      </div>
    `).join('');

    storiesContainer.innerHTML = html;
  }

  displayEmptyReportsMessage() {
    const storiesContainer = document.getElementById('stories-container');
    storiesContainer.innerHTML = `
      <div class="info-card">
        <p>Belum ada unggahan terbaru di linimasa. Jadilah yang pertama berbagi!</p>
        <a href="#/new-story" class="button-primary">Buat Unggahan Baru</a>
      </div>
    `;
  }

  displayReportsLoadError(errorMessage) {
    const storiesContainer = document.getElementById('stories-container');
    storiesContainer.innerHTML = `
      <div class="error-card">
        <p>Oops! Gagal memuat linimasa: ${errorMessage}. Coba lagi nanti.</p>
        <button class="button-secondary refresh-button" onclick="location.reload()">Muat Ulang Linimasa</button>
      </div>
    `;
  }

  showLoading() {
    const storiesContainer = document.getElementById('stories-container');
    storiesContainer.innerHTML = `
      <div class="loading-container">
        <div class="loader"></div>
        <p class="loading-text">Menjelajahi unggahan terbaru...</p>
      </div>
    `;
  }

  hideLoading() {
    const storiesContainer = document.getElementById('stories-container');
    if (storiesContainer.querySelector('.loading-container')) {
      storiesContainer.innerHTML = '';
    }
  }
}