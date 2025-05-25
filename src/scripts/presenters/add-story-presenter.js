// scripts/presenters/add-story-presenter.js
import API from '../data/api.js';

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.stream = null;
    this.marker = null;
  }

  async setupCamera(videoEl) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoEl.srcObject = this.stream;
    } catch (err) {
      alert('Gagal mengakses kamera: ' + err.message);
    }
  }

  capturePhoto(videoEl, canvasEl) {
    const ctx = canvasEl.getContext('2d');
    canvasEl.width = videoEl.videoWidth;
    canvasEl.height = videoEl.videoHeight;
    ctx.drawImage(videoEl, 0, 0);
    canvasEl.style.display = 'block';
  }

  setMarker(map, lat, lng) {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(map);
    }
  }

  async submitForm({ title, description, lat, lng, canvas }) {
    canvas.toBlob(async (blob) => {
      try {
        await API.addStory({
          title,
          description,
          lat,
          lng,
          photoBlob: blob
        });

        alert('Cerita berhasil ditambahkan!');
        this.stopCamera();
        location.hash = '/';
      } catch (error) {
        alert('Gagal mengirim cerita: ' + error.message);
      }
    }, 'image/png');
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }
}
