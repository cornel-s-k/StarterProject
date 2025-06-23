import HomePresenter from '../../presenters/home-presenter.js';
import createMap from '../../utils/map.js';
import IndexedDB from '../../utils/indexeddb.js'; // Import IndexedDB utility
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
        <button id="clear-indexeddb" class="btn btn-danger-outline" style="margin-top: 20px;">Bersihkan Data Offline</button>
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
          // mainContent.focus(); // <--- PASTIKAN BARIS INI DIHAPUS ATAU DIKOMENTARI
        }
      });
    }

    const token = localStorage.getItem('token');
    const storyList = document.querySelector('#story-list');
    const clearIndexedDBBtn = document.getElementById('clear-indexeddb');

    clearIndexedDBBtn.addEventListener('click', async () => {
      try {
        await IndexedDB.clearStories();
        alert('Data offline berhasil dibersihkan!');
        this.renderStories(storyList, []); // Clear displayed stories
      } catch (error) {
        alert('Gagal membersihkan data offline: ' + error.message);
      }
    });

    if (!token) {
      storyList.innerHTML = '<p>Silakan login untuk melihat cerita.</p>';
      return;
    }

    try {
      // Try to get stories from IndexedDB first
      let stories = await IndexedDB.getAllStories();
      if (stories.length > 0) {
        console.log('Stories loaded from IndexedDB:', stories);
        this.renderStories(storyList, stories);
      } else {
        storyList.innerHTML = '<p>Memuat cerita dari jaringan...</p>';
      }

      // Then fetch from network to get the latest data
      const networkStories = await HomePresenter.getStories(() => {
        alert('Sesi Anda telah berakhir. Silakan login kembali.');
        localStorage.removeItem('token');
        location.hash = '#/login';
      });

      if (networkStories && networkStories.length > 0) {
        // Clear existing stories in IndexedDB and save new ones
        await IndexedDB.clearStories();
        for (const story of networkStories) {
          await IndexedDB.putStory(story);
        }
        this.renderStories(storyList, networkStories);
      } else if (stories.length === 0) {
        // If no stories from network and no stories in IndexedDB
        storyList.innerHTML = '<p>Tidak ada cerita yang tersedia.</p>';
      }
    } catch (error) {
      console.error('Failed to load stories:', error);
      // If network fails, and no stories in IndexedDB, display an error
      if ((await IndexedDB.getAllStories()).length === 0) {
        storyList.innerHTML = '<p>Gagal memuat cerita. Coba lagi nanti atau cek koneksi internet Anda.</p>';
      }
    }
  }

  renderStories(storyListElement, stories) {
    storyListElement.innerHTML = '';
    if (!stories || stories.length === 0) {
      storyListElement.innerHTML = '<p>Tidak ada cerita yang tersedia.</p>';
      return;
    }

    stories.forEach((story, index) => {
      const article = document.createElement('article');
      article.classList.add('story-card');
      article.setAttribute('data-story-id', story.id); // Add story ID for deletion

      article.innerHTML = `
        <img src="${story.photoUrl || '/images/placeholder.jpg'}" alt="${story.name}" />
        <h2>${story.name}</h2>
        <p>${story.description}</p>
        <p>Lokasi: ${
          story.lat && story.lon ? `${story.lat}, ${story.lon}` : '-'
        }</p>
        <div id="map-${index}" class="story-map"></div>
        <button class="btn btn-danger-outline delete-story-btn" data-id="${story.id}">Hapus Cerita Ini</button>
      `;

      storyListElement.appendChild(article);

      if (story.lat && story.lon) {
        const map = createMap(`map-${index}`, [story.lat, story.lon], 13);
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
      }
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-story-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const storyId = e.target.dataset.id;
        if (confirm(`Apakah Anda yakin ingin menghapus cerita ini (ID: ${storyId})? Data akan dihapus dari IndexedDB saja. Untuk menghapus dari server, API belum menyediakan fitur ini.`)) {
          try {
            await IndexedDB.deleteStory(storyId);
            alert('Cerita berhasil dihapus dari penyimpanan offline!');
            // Re-render stories after deletion
            const updatedStories = await IndexedDB.getAllStories();
            this.renderStories(storyListElement, updatedStories);
          } catch (error) {
            alert('Gagal menghapus cerita dari penyimpanan offline: ' + error.message);
          }
        }
      });
    });
  }
}