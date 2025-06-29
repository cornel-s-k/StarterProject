import NewPresenter from "./addstory-presenter";
import { convertBase64ToBlob } from "../../utils/index";
import * as CityCareAPI from "../../data/api";
import Camera from "../../utils/cam";

export default class NewPage {
  #presenter;
  #form;
  #camera;
  #isCameraOpen = false;
  #takenDocumentations = [];
  #map = null;
  #marker = null;

  async render() {
    return `
        <section>
          <div class="new-report__header">
            <div class="container">
              <h1 class="new-report__header__title">Buat Cerita Baru</h1>
              <p class="new-report__header__description">
                Silakan lengkapi formulir di bawah untuk membuat cerita baru.<br>
              </p>
            </div>
          </div>
        </section>
    
        <section class="container">
          <div class="new-form__container">
            <form id="new-form" class="new-form">
              <div class="form-control">
                <label for="description-input" class="new-form__description__title">Keterangan</label>
    
                <div class="new-form__description__container">
                  <textarea
                    id="description-input"
                    name="description"
                    placeholder="Masukkan keterangan lengkap laporan. Anda dapat menjelaskan apa kejadiannya, dimana, kapan, dll."
                  ></textarea>
                </div>
              </div>
              <div class="form-control">
                <label for="documentations-input" class="new-form__documentations__title">Dokumentasi</label>
                <div id="documentations-more-info">Anda dapat menyertakan foto sebagai dokumentasi.</div>
    
                <div class="new-form__documentations__container">
                  <div class="new-form__documentations__buttons">
                    <button id="documentations-input-button" class="btn btn-outline" type="button">
                      Import Gambar
                    </button>
                    <input
                    id="documentations-input"
                        name="documentations"
                        type="file"
                        accept="image/*"
                        hidden="hidden"
                        aria-describedby="documentations-more-info"
                          />

                    <button id="open-documentations-camera-button" class="btn btn-outline" type="button">
                      Buka Kamera
                    </button>
                  </div>
                  <div id="camera-container" class="new-form__camera__container">
                    <video id="camera-video" class="new-form__camera__video">
                      Video stream not available.
                    </video>
                    <canvas style="display: none;" id="camera-canvas" class="new-form__camera__canvas"></canvas>
         
                    <div class="new-form__camera__tools">
                      <select id="camera-select"></select>
                      <div class="new-form__camera__tools_buttons">
                        <button id="camera-take-button" class="btn" type="button">
                          Ambil Gambar
                        </button>
                      </div>
                    </div>
                  </div>
                  <ul id="documentations-taken-list" class="new-form__documentations__outputs"></ul>
                </div>
              </div>
              <div class="form-control">
                <div class="new-form__location__title">Lokasi</div>
    
                <div class="new-form__location__container">
                  <div class="new-form__location__map__container">
                    <div id="map" ></div>
                    <div id="map-loading-container"></div>
                  </div>
                  <div class="new-form__location__lat-lng">
                    <input type="text" name="latitude" value="-6.175389">
                    <input type="text" name="longitude" value="106.827139">
                  </div>
                </div>
              </div>
              <div class="form-buttons">
                <span id="submit-button-container">
                  <button class="btn" type="submit">Buat Laporan</button>
                </span>
                <a class="btn btn-outline" href="#/">Batal</a>
              </div>
            </form>
          </div>
        </section>
      `;
  }

  async afterRender() {
    this.#presenter = new NewPresenter({
      view: this,
      model: CityCareAPI,
    });
    this.#takenDocumentations = [];

    await this.initialMap();
    // this.#presenter.showNewFormMap();
    this.#setupForm();
  }

  #setupForm() {
    this.#form = document.getElementById("new-form");
    this.#form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const description = this.#form.elements.namedItem("description").value;
      const photo = this.#takenDocumentations[0]?.blob; // ambil satu foto aja dulu
      const lat = parseFloat(this.#form.elements.namedItem("latitude").value);
      const lon = parseFloat(this.#form.elements.namedItem("longitude").value);

      if (!description || !photo) {
        alert("Keterangan dan foto wajib diisi.");
        return;
      }
      await this.#presenter.postNewReport({
        description,
        photo,
        lat,
        lon,
      });
    });

    document
      .getElementById("documentations-input")
      .addEventListener("change", async (event) => {
        this.#takenDocumentations = []; // reset agar cuma satu foto disimpan
        await this.#addTakenPicture(event.target.files[0]);
        await this.#populateTakenPictures();
      });

    document
      .getElementById("documentations-input-button")
      .addEventListener("click", () => {
        this.#form.elements.namedItem("documentations-input").click();
      });

    const cameraContainer = document.getElementById("camera-container");
    document
      .getElementById("open-documentations-camera-button")
      .addEventListener("click", async (event) => {
        cameraContainer.classList.toggle("open");
        this.#isCameraOpen = cameraContainer.classList.contains("open");

        if (this.#isCameraOpen) {
          event.currentTarget.textContent = "Tutup Kamera";
          this.#setupCamera();
          await this.#camera.launch();

          return;
        }

        event.currentTarget.textContent = "Buka Kamera";
        this.#camera.stop();
      });
  }

  async initialMap() {
  // Set peta dengan tampilan awal (akan diperbarui setelah mendapatkan lokasi)
  this.#map = L.map("map", {
    zoomControl: true,
    doubleClickZoom: false,
  });

  // Cek apakah geolocation tersedia di browser
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Set peta ke lokasi pengguna
        this.#map.setView([latitude, longitude], 13);

        // Tambahkan tile layer OpenStreetMap
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(this.#map);

        // Tambahkan marker di lokasi pengguna
        this.#marker = L.marker([latitude, longitude]).addTo(this.#map);

        // Setkan lat dan lng pada form
        // this.#form.elements.namedItem('latitude').value = latitude;
        // this.#form.elements.namedItem('longitude').value = longitude;
      },
      (error) => {
        console.error("Geolocation error: ", error);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }

  // Event listener untuk memilih lokasi baru pada peta
  this.#map.on("click", (event) => {
    const { lat, lng } = event.latlng;

    if (this.#marker) {
      // Update posisi marker tanpa pop-up
      this.#marker.setLatLng([lat, lng]);
    } else {
      // Menambahkan marker baru
      this.#marker = L.marker([lat, lng]).addTo(this.#map);
    }

    // Setkan lat dan lng pada form
    this.#form.elements.namedItem("latitude").value = lat.toFixed(6);
    this.#form.elements.namedItem("longitude").value = lng.toFixed(6);
  });

  // Event listener untuk klik pada marker untuk menampilkan pop-up dengan info lokasi
  this.#map.on("click", async (event) => {
    const { lat, lng } = event.latlng;

    if (this.#marker) {
      // Tampilkan pop-up dengan koordinat yang dipilih
      const locationName = await this.getLocationName(lat, lng);
      this.#marker
        .setLatLng([lat, lng]) // Set marker ke lokasi yang dipilih
        .bindPopup(`Dipilih di: ${lat.toFixed(6)}, ${lng.toFixed(6)}<br>Lokasi: ${locationName}`)
        .openPopup(); 
    }
  });

  // Menambahkan fungsi untuk reverse geocoding
  this.getLocationName = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`);
      const data = await response.json();
      
      if (data && data.address) {
        const { city, village, town, state, country } = data.address;
        return `${city || village || town || ''}, ${state || ''}, ${country || ''}`;
      }
      
      return "Lokasi tidak ditemukan";
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return "Terjadi kesalahan saat mengambil nama lokasi";
    }
  };
}


  #setupCamera() {
    if (!this.#camera) {
      this.#camera = new Camera({
        video: document.getElementById("camera-video"),
        cameraSelect: document.getElementById("camera-select"),
        canvas: document.getElementById("camera-canvas"),
      });
    }

    // Setup untuk tombol ambil gambar
    this.#camera.addCheeseButtonListener("#camera-take-button", async () => {
      const image = await this.#camera.takePicture();
      this.#takenDocumentations = [];
      await this.#addTakenPicture(image);
      await this.#populateTakenPictures();
    });
  }

  async #addTakenPicture(image) {
    let blob = image;

    if (image instanceof String) {
      blob = await convertBase64ToBlob(image, "image/png");
    }

    const newDocumentation = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      blob: blob,
    };
    this.#takenDocumentations = [
      ...this.#takenDocumentations,
      newDocumentation,
    ];
  }

  async #populateTakenPictures() {
    const html = this.#takenDocumentations.reduce(
      (accumulator, picture, currentIndex) => {
        const imageUrl = URL.createObjectURL(picture.blob);
        return accumulator.concat(`
            <li class="new-form__documentations__outputs-item">
              <button type="button" data-deletepictureid="${
                picture.id
              }" class="new-form__documentations__outputs-item__delete-btn">
                <img src="${imageUrl}" alt="Dokumentasi ke-${currentIndex + 1}">
              </button>
            </li>
          `);
      },
      ""
    );

    document.getElementById("documentations-taken-list").innerHTML = html;

    document
      .querySelectorAll("button[data-deletepictureid]")
      .forEach((button) =>
        button.addEventListener("click", (event) => {
          const pictureId = event.currentTarget.dataset.deletepictureid;

          const deleted = this.#removePicture(pictureId);
          if (!deleted) {
            console.log(`Picture with id ${pictureId} was not found`);
          }

          // Updating taken pictures
          this.#populateTakenPictures();
        })
      );
  }

  #removePicture(id) {
    const selectedPicture = this.#takenDocumentations.find((picture) => {
      return picture.id == id;
    });

    // Check if founded selectedPicture is available
    if (!selectedPicture) {
      return null;
    }

    // Deleting selected selectedPicture from takenPictures
    this.#takenDocumentations = this.#takenDocumentations.filter((picture) => {
      return picture.id != selectedPicture.id;
    });

    return selectedPicture;
  }

  storeSuccessfully(message) {
    console.log(message);
    this.clearForm();

    // Redirect page
    location.hash = "/";
  }

  storeFailed(message) {
    alert(message);
  }

  clearForm() {
    this.#form.reset();
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
          <button class="btn" type="submit" disabled>
            <i class="fas fa-spinner loader-button"></i> Buat Laporan
          </button>
        `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
          <button class="btn" type="submit">Buat Laporan</button>
        `;
  }

  #setupMap() {
    var map = L.map("map").setView([51.505, -0.09], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  }
}
