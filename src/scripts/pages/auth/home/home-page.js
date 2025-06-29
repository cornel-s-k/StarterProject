import HomePresenter from '../../../presenters/home-presenter';  // Import presenter
import * as CityCareAPI from '../../data/api';  // Import model untuk API

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section class="hero-home">
        <div class="hero-overlay">
          <div class="hero-content">
            <h1>Selamat Datang di Aplikasi Pelaporan</h1>
            <p>Laporkan kejadian dengan cepat dan mudah.</p>
            <button id="scroll-button">Lihat Laporan</button>
          </div>
        </div>
      </section>

      <section id="report-list" class="report-list">
        <h2>Daftar Cerita</h2>
        <div class="cards-container" id="reports-container">
          <div class="report-card">Data laporan belum tersedia</div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: CityCareAPI,
    });
  
    // Tambah scroll ke bawah saat tombol diklik
    const scrollButton = document.getElementById('scroll-button');
    scrollButton?.addEventListener('click', () => {
      const reportSection = document.getElementById('report-list');
      reportSection?.scrollIntoView({ behavior: 'smooth' });
    });
  
    await this.#presenter.initialStory();
  }

  populateReportsList(message, stories) {
    const reportsContainer = document.getElementById('reports-container');
    
    if (stories.length <= 0) {
      this.populateReportsListEmpty();
      return;
    }

    const html = stories.map(story => `
      <div class="report-card">
        <img src="${story.photoUrl}" alt="${story.name}" class="report-photo">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p><strong>Lokasi:</strong> Latitude: ${story.lat}, Longitude: ${story.lon}</p>
         <a href="#/stories/${story.id}" class="detail-button">Selengkapnya</a>
      </div>
    `).join('');

    reportsContainer.innerHTML = html;
  }

  populateReportsListEmpty() {
    const reportsContainer = document.getElementById('reports-container');
    reportsContainer.innerHTML = `
      <div class="report-card">Data laporan belum tersedia</div>
    `;
  }

  populateReportsListError(message) {
    const reportsContainer = document.getElementById('reports-container');
    reportsContainer.innerHTML = `
      <div class="report-card">Terjadi kesalahan: ${message}</div>
    `;
  }

  showLoading() {
    const reportsContainer = document.getElementById('reports-container');
    reportsContainer.innerHTML = `<div class="loading-spinner">Loading...</div>`;
  }

  hideLoading() {
    const reportsContainer = document.getElementById('reports-container');
    reportsContainer.innerHTML = '';
  }
}
