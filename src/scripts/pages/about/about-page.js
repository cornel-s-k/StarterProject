export default class AboutPage {
  async render() {
    return `
      <section id="main-content" class="container about-page" tabindex="0">
        <h1 tabindex="0">Tentang Aplikasi</h1>
        <article>
          <p>
            Aplikasi ini adalah platform untuk berbagi cerita dari berbagai pengguna. Dibuat menggunakan arsitektur
            <strong>Single-Page Application (SPA)</strong>, aplikasi ini memanfaatkan API eksternal sebagai sumber data utama.
          </p>
          <p>
            Fitur utama meliputi:
            <ul>
              <li>Tampilan daftar cerita dengan gambar dan informasi lokasi</li>
              <li>Pemetaan lokasi cerita dengan <strong>Leaflet.js</strong></li>
              <li>Form tambah cerita yang mendukung kamera dan peta interaktif</li>
              <li>Transisi halus antar halaman dengan View Transition API</li>
              <li>Desain responsif dan aksesibilitas standar WCAG</li>
            </ul>
          </p>
          <p>
            Aplikasi ini dikembangkan sebagai bagian dari proyek pembelajaran pemrograman web modern.
          </p>
        </article>

        <figure class="about-illustration">
          <img src="https://cdn-icons-png.flaticon.com/512/6615/6615543.png" alt="Ilustrasi berbagi cerita" width="200" height="200" loading="lazy">
          <figcaption>Berbagi cerita dan lokasi dalam satu platform</figcaption>
        </figure>
      </section>
    `;
  }

  async afterRender() {
    // Tambahkan transisi jika menggunakan View Transition API
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        // Kosong karena konten sudah dirender, bisa tambahkan efek jika perlu
      });
    }
  }
}