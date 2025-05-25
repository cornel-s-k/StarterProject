// src/pages/add-story-page.js
import AddStoryPresenter from '../../presenters/add-story-presenter';
import createMap from '../../utils/map';

export default class AddStoryPage {
  constructor() {
    this.presenter = new AddStoryPresenter(this);
  }

  async render() {
    return `
      <section id="main-content" class="container" tabindex="0">
        <h1>Tambah Cerita Baru</h1>
        <form id="story-form">
          <label for="title">Judul:</label>
          <input type="text" id="title" name="title" required />

          <label for="description">Deskripsi:</label>
          <textarea id="description" name="description" required></textarea>

          <label for="camera">Ambil Gambar:</label>
          <video id="camera" autoplay></video>
          <button type="button" id="capture">Ambil Foto</button>
          <canvas id="snapshot" style="display: none;"></canvas>

          <label for="map">Klik lokasi:</label>
          <div id="map" style="height: 300px;"></div>

          <input type="hidden" id="lat" name="lat" />
          <input type="hidden" id="lng" name="lng" />

          <button type="submit">Kirim</button>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.initCamera();
    this.initMap();
    this.initForm();
  }

  initCamera() {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('snapshot');
    const captureBtn = document.getElementById('capture');

    this.presenter.setupCamera(video, canvas);

    captureBtn.addEventListener('click', () => {
      this.presenter.capturePhoto(video, canvas);
    });
  }

  initMap() {
    const map = createMap('map');
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      document.getElementById('lat').value = lat;
      document.getElementById('lng').value = lng;
      this.presenter.setMarker(map, lat, lng);
    });
  }

  initForm() {
    const form = document.getElementById('story-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        lat: document.getElementById('lat').value,
        lng: document.getElementById('lng').value,
        canvas: document.getElementById('snapshot'),
      };
      this.presenter.submitForm(data);
    });
  }

  destroy() {
    this.presenter.stopCamera();
  }
}