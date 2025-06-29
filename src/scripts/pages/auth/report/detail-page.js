import DetailPresenter from './detail-presenter';
import { parseActivePathname } from '../../routes/url-parser';
import * as CityCareAPI from '../../data/api';
import Database from '../../data/database';

export default class DetailPage {
  #presenter = null;
  #map;

  async render() {
    return `
      <section>
        <div class="story-detail__container">
          <div id="story-detail" class="story-detail">
            <p id="story-id"></p>
            <p id="story-name"></p>
            <p id="story-description"></p>
            <img id="story-photo" src="" alt="Photo" />
            <p id="story-created-at"></p>
            <p id="story-lat"></p>
            <p id="story-lon"></p>
          </div>

          <div id="save-actions-container"></div>

          <div id="story-detail-loading-container" class="loading-container" style="display: none;">
            <div class="loader">Loading...</div>
          </div>
        </div>

        <div id="map" style="height: 400px; width: 100%;"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new DetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: CityCareAPI,
      dbModel: Database,
    });
    await this.#presenter.showStoryDetail();
  }

  StoryDetail(story) {
    document.getElementById('story-id').innerHTML = `ID: ${story.id}`;
    document.getElementById('story-name').innerHTML = `Nama: ${story.name}`;
    document.getElementById('story-description').innerHTML = `Deskripsi: ${story.description}`;
    document.getElementById('story-photo').src = story.photoUrl;
    document.getElementById('story-created-at').innerHTML = `Tanggal: ${new Date(story.createdAt).toLocaleString()}`;
    document.getElementById('story-lat').innerHTML = `Lat: ${story.lat}`;
    document.getElementById('story-lon').innerHTML = `Lon: ${story.lon}`;
  }

  async initialMap(lat, lon, locationName) {
    this.#map = L.map("map", {
      zoomControl: true,
      doubleClickZoom: false,
    });

    if (lat && lon) {
      this.#map.setView([lat, lon], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(this.#map);

      const marker = L.marker([lat, lon]).addTo(this.#map);

      marker.bindPopup(`
        <b>Latitude:</b> ${lat} <br>
        <b>Longitude:</b> ${lon}
      `).openPopup();
    } else {
      console.log("Lokasi tidak tersedia.");
    }
  }

  renderSaveButton() {
    const saveContainer = document.getElementById('save-actions-container');
    saveContainer.innerHTML = '';

    const button = document.createElement('button');
    button.id = 'report-detail-save';
    button.innerText = '📌 Simpan Bookmark';
    button.style.padding = '8px 16px';
    button.style.marginTop = '16px';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';

    saveContainer.appendChild(button);

    button.addEventListener('click', async () => {
      await this.#presenter.saveReport();
      await this.#presenter.showSaveButton();
    });
  }

  renderRemoveButton() {
    const saveContainer = document.getElementById('save-actions-container');
    saveContainer.innerHTML = '';

    const button = document.createElement('button');
    button.id = 'report-detail-remove';
    button.innerText = '❌ Hapus Bookmark';
    button.style.padding = '8px 16px';
    button.style.marginTop = '16px';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';

    saveContainer.appendChild(button);

    button.addEventListener('click', async () => {
      try {
        await this.#presenter.deleteReport();
        alert('Berhasil dihapus dari bookmark');
        await this.#presenter.showSaveButton();
      } catch (error) {
        alert(`Gagal menghapus: ${error.message}`);
      }
    });
  }

  saveToBookmarkSuccessfully(message) {
    alert(message);
  }

  saveToBookmarkFailed(message) {
    alert(`Gagal menyimpan: ${message}`);
  }
}
