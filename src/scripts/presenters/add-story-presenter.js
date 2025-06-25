// scripts/presenters/add-story-presenter.js
import API from '../data/api.js';
<<<<<<< HEAD
import IndexedDB from '../utils/indexeddb.js'; // Import IndexedDB utility
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
=======
>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9

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
<<<<<<< HEAD
        const storyData = {
          id: uuidv4(), // Generate a unique ID for IndexedDB
          name: title,
          description: description,
          lat: lat,
          lon: lng,
          photoUrl: URL.createObjectURL(blob), // Create a temporary URL for display
          createdAt: new Date().toISOString(),
        };

        // Attempt to send to API
=======
>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9
        await API.addStory({
          title,
          description,
          lat,
          lng,
          photoBlob: blob
        });

<<<<<<< HEAD
        // If API call is successful, also save to IndexedDB for offline access and consistent display
        await IndexedDB.putStory(storyData);

        alert('Cerita berhasil ditambahkan!');
        this.stopCamera();
        location.hash = '/home'; // Redirect to home to see the new story
      } catch (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          // If network error, save to IndexedDB and notify user about offline saving
          try {
            const storyData = {
              id: uuidv4(), // Generate a unique ID for IndexedDB
              name: title,
              description: description,
              lat: lat,
              lon: lng,
              photoUrl: URL.createObjectURL(blob), // Create a temporary URL for display
              createdAt: new Date().toISOString(),
              // Mark as unsynced if you want to implement sync later
              unsynced: true,
            };
            await IndexedDB.putStory(storyData);
            alert('Cerita berhasil disimpan secara offline! Akan dikirim saat online.');
            this.stopCamera();
            location.hash = '/home';
          } catch (indexedDBError) {
            alert('Gagal menyimpan cerita secara offline: ' + indexedDBError.message);
          }
        } else {
          alert('Gagal mengirim cerita: ' + error.message);
        }
=======
        alert('Cerita berhasil ditambahkan!');
        this.stopCamera();
        location.hash = '/';
      } catch (error) {
        alert('Gagal mengirim cerita: ' + error.message);
>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9
      }
    }, 'image/png');
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 668ba7c5796b75f172d68a25a0c8b7daf5dbb4d9
