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
        <button id="clear-indexeddb" class="btn btn-danger-outline" style="margin-top: 20px;">Bersihkan Semua Data Offline</button>
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
      // Fetch from network first
      const networkStories = await HomePresenter.getStories(() => {
        alert('Sesi Anda telah berakhir. Silakan login kembali.');
        localStorage.removeItem('token');
        location.hash = '#/login';
      });

      if (networkStories && networkStories.length > 0) {
        this.renderStories(storyList, networkStories, true); // Pass true to indicate network stories and show "Save" button
      } else {
        // If no stories from network, try to load from IndexedDB
        let stories = await IndexedDB.getAllStories();
        if (stories.length > 0) {
          console.log('Stories loaded from IndexedDB (offline):', stories);
          this.renderStories(storyList, stories);
        } else {
          storyList.innerHTML = '<p>Tidak ada cerita yang tersedia.</p>';
        }
      }
    } catch (error) {
      console.error('Failed to load stories from network:', error);
      // If network fails, try to load from IndexedDB
      let stories = await IndexedDB.getAllStories();
      if (stories.length > 0) {
        console.log('Stories loaded from IndexedDB (offline fallback):', stories);
        this.renderStories(storyList, stories);
      } else {
        storyList.innerHTML = '<p>Gagal memuat cerita. Coba lagi nanti atau cek koneksi internet Anda.</p>';
      }
    }
  }

  renderStories(storyListElement, stories, showSaveButton = false) {
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
        ${showSaveButton ? `<button class="btn save-story-btn" data-id="${story.id}">Simpan ke Offline</button>` : ''}
        <button class="btn btn-danger-outline delete-story-btn" data-id="${story.id}">Hapus Cerita Ini</button>
      `;

      storyListElement.appendChild(article);

      if (story.lat && story.lon) {
        const map = createMap(`map-${index}`, [story.lat, story.lon], 13);
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
      }
    });

    // Add event listeners for save buttons
    document.querySelectorAll('.save-story-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const storyId = e.target.dataset.id;
            const storyToSave = stories.find(story => story.id === storyId);
            if (storyToSave) {
                try {
                    await IndexedDB.putStory(storyToSave);
                    alert('Cerita berhasil disimpan ke penyimpanan offline!');
                } catch (error) {
                    alert('Gagal menyimpan cerita ke penyimpanan offline: ' + error.message);
                }
            }
        });
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-story-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const storyId = e.target.dataset.id;
        if (confirm(`Apakah Anda yakin ingin menghapus cerita ini (ID: ${storyId})? Data akan dihapus dari IndexedDB saja. Untuk menghapus dari server, API belum menyediakan fitur ini.`)) {
          try {
            await IndexedDB.deleteStory(storyId);
            alert('Cerita berhasil dihapus dari penyimpanan offline!');
            // Re-render stories after deletion by fetching from IndexedDB
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