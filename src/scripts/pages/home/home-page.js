import HomePresenter from '../../presenters/home-presenter.js';
import createMap from '../../utils/map.js';
import L from 'leaflet';

export default class HomePage {
  async render() {
    return `
      <a href="#main-content" class="skip-link">Skip to content</a>
      <div class="header-actions">
        ${
          localStorage.getItem('token')
            ? '<a href="#/add" class="btn">+ Tambah Cerita</a>'
            : '<a href="#/login" class="btn">Login untuk tambah cerita</a>'
        }
      </div>

      <section id="main-content" tabindex="-1">
        <h1>Daftar Cerita</h1>
        <div id="story-list" class="story-grid"></div>
      </section>
    `;
  }

  async afterRender() {
    // Intercept skip link agar tidak trigger router hash change
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault(); // Cegah perubahan URL hash
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.setAttribute('tabindex', '-1');
          mainContent.focus(); // Fokus ke main content
        }
      });
    }

    const token = localStorage.getItem('token');
    const storyList = document.querySelector('#story-list');

    if (!token) {
      storyList.innerHTML = '<p>Silakan login untuk melihat cerita.</p>';
      return;
    }

    try {
      const stories = await HomePresenter.getStories();

      if (!Array.isArray(stories)) {
        storyList.innerHTML = '<p>Gagal memuat cerita.</p>';
        return;
      }

      storyList.innerHTML = '';

      stories.forEach((story, index) => {
        const article = document.createElement('article');
        article.classList.add('story-card');

        article.innerHTML = `
          <img src="${story.photoUrl || '/images/placeholder.jpg'}" alt="${story.name}" />
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <p>Lokasi: ${
            story.lat && story.lon ? `${story.lat}, ${story.lon}` : '-'
          }</p>
          <div id="map-${index}" class="story-map"></div>
        `;

        storyList.appendChild(article);

        if (story.lat && story.lon) {
          const map = createMap(`map-${index}`, [story.lat, story.lon], 13);
          const marker = L.marker([story.lat, story.lon]).addTo(map);
          marker.bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
        }
      });
    } catch (error) {
      console.error('Failed to load stories:', error);
      storyList.innerHTML = '<p>Gagal memuat cerita. Coba lagi nanti.</p>';
    }
  }
}
